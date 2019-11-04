import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AbilityType, BattleState, CreatureState, CreatureType, EffectType } from '@enums';
import { AbilityFabric, CreatureFabric, EffectFabric } from '@fabrics';
import {
  Ability,
  AbilityResult,
  AbilitySettings,
  BattleEvent,
  Bottle,
  Cell,
  CharactersStateDelta,
  Effect,
  Hero,
  Monster,
} from '@models';
import { BattleStoreService } from './battle-store.service';
import { HeroService } from './hero.service';
import { RandomService } from './random.service';
import { SettingsService } from './settings.service';
import { StatisticService } from './statistic.service';

type Character = Hero | Monster;

@Injectable({
  providedIn: 'root',
})
/** локальный сервис расчета боя */
export class BattleService {
  events$: Observable<BattleEvent>;

  private battleStateSource: BehaviorSubject<BattleState> = new BehaviorSubject<BattleState>(
    BattleState.Begin
  );
  private eventsSource: Subject<BattleEvent> = new Subject<BattleEvent>();

  constructor(
    private battleStoreService: BattleStoreService,
    private heroService: HeroService,
    private settingsService: SettingsService,
    private randomService: RandomService,
    private statisticService: StatisticService
  ) {
    this.events$ = this.eventsSource.asObservable();

    this.events$.pipe(delay(100)).subscribe(event => {
      if (event.state === BattleState.PlayerAbility || event.state === BattleState.MonsterAbility) {
        this.checkBattleEnd();
        if (
          this.battleStateSource.value === BattleState.Win ||
          this.battleStateSource.value === BattleState.Lose
        ) {
          return;
        }

        if (
          'notCorrectTarget' in event.abilityResult ||
          (event.abilityResult as AbilityResult).isAddonAction
        ) {
          if (event.state === BattleState.MonsterAbility) {
            const currentCharacter = this.battleStoreService.getCurrentCharacter();
            if (currentCharacter.type === CreatureType.Monster) {
              this.monsterAttack(currentCharacter);
            }
          } else {
            this.eventsSource.next({
              state: BattleState.ContinuationPlayerTurn,
            });
          }
        } else {
          this.endTurn();
          this.setNextCharacter();
          if (!this.battleStoreService.getCurrentCharacter()) {
            this.newRound();
          } else {
            this.startTurn();
          }
        }
      }
    });
  }

  createBattle(cell: Cell) {
    this.battleStoreService.setCell(cell);
    this.battleStoreService.setCurrentRound(0);

    this.prepareHeroBeforeBattle();
    this.generateMonsters();
    this.setCharacters();
    this.setCharactersOrder();
    this.prepareCharacters();
    this.setNewTargetForMonster();
  }

  getAllCharacters() {
    return this.battleStoreService
      .getCharacters()
      .map(creature => creature.convertToCreatureView());
  }

  startBattle() {
    this.battleStateSource.next(BattleState.Begin);
    this.eventsSource.next({ state: BattleState.Begin });

    if (this.settingsService.autoWin) {
      this.winBattle();
    } else {
      this.newRound();
    }
  }

  heroAction(abilityType: AbilityType, targetId: number) {
    console.log('heroAction');
    this.battleStoreService.setCurrentHeroTarget(targetId);

    const currentCreature = this.battleStoreService.getCurrentCharacter();
    const availableAbilities = currentCreature.getAvailableAbilities(); // способность применяется N раз за бой
    // проверка цели и способности
    const currentAbility = availableAbilities.find(ability => ability.type === abilityType);
    const targetCharacter = this.battleStoreService.getCurrentHeroTarget();
    if (!targetCharacter || targetCharacter.state !== CreatureState.Alive || !currentAbility) {
      // TODO: ошибка и повторное действие
      this.eventsSource.next({
        state: BattleState.ContinuationPlayerTurn,
        currentCreatureId: currentCreature.id,
        currentCreature: currentCreature.convertToCreatureView(),
      });
      return;
    }
    const abilityResult = this.useAbility(currentCreature, targetCharacter, currentAbility);

    this.eventsSource.next({
      state: BattleState.PlayerAbility,
      currentCreatureId: currentCreature.id,
      ability: currentAbility.type,
      abilityResult,
      target: targetId,
    });
    this.battleStateSource.next(BattleState.PlayerAbility);
  }

  private winBattle() {
    this.prepareHeroAfterWin();
    this.updateStatisctics();
    this.eventsSource.next({ state: BattleState.Win });
    this.battleStateSource.next(BattleState.Win);
  }
  private loseBattle() {
    this.updateStatisctics();
    this.eventsSource.next({ state: BattleState.Lose });
    this.battleStateSource.next(BattleState.Lose);
  }

  private updateStatisctics() {
    const monsters = this.battleStoreService
      .getCharacters()
      .filter(character => character.type === CreatureType.Monster);
    this.statisticService.updateStatistic(monsters);
  }

  private setCharacters() {
    const characters = [].concat(this.generateMonsters(), this.heroService.heroes);
    this.battleStoreService.setCharacters(characters);
  }

  private setCharactersOrder() {
    const characters = [...this.battleStoreService.getCharacters()];
    characters.sort(() => Math.random() - 0.5);
    this.battleStoreService.setCharacters(characters);
  }

  private generateMonsters() {
    const monsters: Monster[] = [];
    const cell = this.battleStoreService.getCell();
    for (let index = 0; index < cell.mosterLevel1Count; index++) {
      monsters.push(CreatureFabric.createRandomMonsterLevel1());
    }
    for (let index = 0; index < cell.mosterLevel2Count; index++) {
      monsters.push(CreatureFabric.createRandomMonsterLevel2());
    }
    if (cell.doesBossExists) {
      monsters.push(CreatureFabric.createRandomMonsterBoss());
    }
    return monsters;
  }

  private prepareCharacters() {
    this.battleStoreService.getCharacters().forEach(character => {
      const newCharacter = character.copy();
      newCharacter.currentEffects = this.getInitialEffects(newCharacter);
      newCharacter.currentAbilities = this.getInitialAbilities(newCharacter);
      this.battleStoreService.updateCharacter(newCharacter);
    });
  }

  private getInitialEffects(character: Character) {
    const currentEffects = character.effects.filter(effect =>
      Effect.checkEffectTypeOnСombat(effect.effectType)
    );

    const shieldEfect = this.getShieldEffect(character);
    if (shieldEfect) {
      currentEffects.push(shieldEfect);
    }
    return currentEffects;
  }

  private getShieldEffect(character: Character) {
    const shield = character.equipment.Shield;
    if (shield && shield.hitPoint > 0) {
      const shieldEffect = EffectFabric.createEffect(EffectType.Shield);
      shieldEffect.description = `Щит, броня ${shield.value} , прочность ${shield.hitPoint}.`;
      return shieldEffect;
    }
  }

  private getInitialAbilities(character: Character) {
    const currentAbilities = character.abilities.map(abilityType =>
      AbilityFabric.createAbility(abilityType)
    );

    const bottleAbilities = this.getBottleAbilities(character);
    currentAbilities.push(...bottleAbilities);

    return currentAbilities;
  }

  private getBottleAbilities(character: Character) {
    return Bottle.getBottleTypes()
      .map(itemType => character.inventory.filter(item => item.type === itemType) as Bottle[])
      .filter(bottles => bottles.length > 0)
      .map(bottles => AbilityFabric.createAbilityByBottle(bottles[0], bottles.length));
  }

  private setNewTargetForMonster(exceptHero: number = null) {
    const heroes: number[] = this.battleStoreService
      .getCharacters()
      .filter(
        character =>
          character.state === CreatureState.Alive &&
          character.type === CreatureType.Hero &&
          character.id !== exceptHero &&
          !character.isExistsEffect(EffectType.HideCreature)
      )
      .map(character => character.id);

    const currentTargetForMonstersId =
      heroes.length === 0 ? exceptHero : heroes.sort(() => Math.random() - 0.5).pop();

    this.battleStoreService.setCurrentMonstersTarget(currentTargetForMonstersId);
  }

  private prepareHeroBeforeBattle() {
    this.heroService.heroes.forEach(hero => {});
  }
  private prepareHeroAfterWin() {
    this.heroService.heroes.forEach(hero => {
      const heal = Math.floor(hero.maxHitPoint / 10);
      this.heroService.healHero(hero.id, heal);

      if (hero.equipment.Shield !== null) {
        hero.equipment.Shield.currentHitPoint = hero.equipment.Shield.hitPoint;
      }

      hero.lastDiceTarget = null;
      hero.lastDiceValue = null;
      hero.lastTargetInBattle = null;
      hero.usedInThisRoundAbilities = [];
      hero.usedInThisBattleAbilities = new Map<AbilityType, number>();
    });
  }

  private checkBattleEnd() {
    const aliveCharacters = this.battleStoreService
      .getCharacters()
      .filter(character => character.state === CreatureState.Alive);
    const cntMonsters = aliveCharacters.filter(character => character.type === CreatureType.Monster)
      .length;
    const cntHeroes = aliveCharacters.filter(character => character.type === CreatureType.Hero)
      .length;

    if (cntHeroes === 0) {
      this.loseBattle();
    } else if (cntMonsters === 0) {
      this.winBattle();
    }
  }

  private newRound() {
    const currentRound = 1 + this.battleStoreService.getCurrentRound();
    this.battleStoreService.setCurrentRound(currentRound);
    this.battleStateSource.next(BattleState.NewRound);

    const updatedCharacters: CharactersStateDelta[] = [];
    this.battleStoreService.getCharacters().forEach(character => {
      const newCharacter = character.copy();
      newCharacter.usedInThisRoundAbilities = [];
      // снятие эффектов в конце раунда
      newCharacter.dropCurrentEffects([
        EffectType.BlockHeal,
        EffectType.MagicProtection,
        EffectType.Suppression,
      ]);
      updatedCharacters.push({
        characterBefore: character.convertToCreatureView(),
        characterAfter: newCharacter.convertToCreatureView(),
      });
      this.battleStoreService.updateCharacter(newCharacter);
    });

    this.eventsSource.next({
      state: BattleState.NewRound,
      round: currentRound,
      updatedCharacters,
    });
    this.setFirstCharacter();
    this.startTurn();
  }

  private setFirstCharacter() {
    const index = this.battleStoreService
      .getCharacters()
      .findIndex(character => character.state === CreatureState.Alive);
    this.battleStoreService.setCurrentCharacter(index);
  }
  private setNextCharacter() {
    const currentIndex = this.battleStoreService.getCurrentCharacterIndex();
    const nextIndex = this.battleStoreService
      .getCharacters()
      .findIndex(
        (creature, index) => creature.state === CreatureState.Alive && index > currentIndex
      );

    if (nextIndex === -1) {
      this.battleStoreService.setCurrentCharacter(null);
    } else {
      this.battleStoreService.setCurrentCharacter(nextIndex);
    }
  }

  private startTurn() {
    const character: Character = this.battleStoreService.getCurrentCharacter();
    const newCharacter = character.copy();
    console.log('startTurn', newCharacter);

    if (newCharacter.state !== CreatureState.Alive) {
      return;
    }

    // применение всех эффектов
    newCharacter.currentEffects
      .filter(effect => effect.isNewRoundActivation)
      .forEach(effect => effect.action(newCharacter));
    // снятие временных эффектов в начале хода существа
    newCharacter.dropCurrentEffects([EffectType.BlockDamage]);
    const isStunned = this.checkForStunning(newCharacter);
    this.battleStoreService.updateCharacter(newCharacter);

    this.eventsSource.next({
      state: BattleState.NewTurn,
      currentCreatureId: newCharacter.id,
      effectsResult: {
        characterBefore: character.convertToCreatureView(),
        characterAfter: newCharacter.convertToCreatureView(),
      },
    });
    this.battleStateSource.next(BattleState.NewTurn);

    this.checkBattleEnd();
    if (
      this.battleStateSource.value === BattleState.Win ||
      this.battleStateSource.value === BattleState.Lose
    ) {
      return;
    }

    if (isStunned) {
      this.endTurn();
      this.setNextCharacter();
      if (!this.battleStoreService.getCurrentCharacter()) {
        this.newRound();
      } else {
        this.startTurn();
      }
      return;
    }

    if (newCharacter.type === CreatureType.Hero) {
      this.heroTurn(newCharacter);
    } else {
      this.monsterTurn(newCharacter);
    }
  }
  private endTurn() {
    const currentCharacter: Character = this.battleStoreService.getCurrentCharacter();
    console.log('endTurn', currentCharacter);
    // снятие эффектов в конце хода существа
    currentCharacter.dropCurrentEffects([
      EffectType.Course,
      EffectType.Imbecility,
      EffectType.Slackness,
    ]);

    // TODO: делать проверку только после гибели
    // если погиб последний герой воин-страж, снимаем со всех защиту
    const allCharacters = this.battleStoreService.getCharacters();
    if (
      !allCharacters.some(
        creature =>
          creature.state === CreatureState.Alive &&
          creature.abilities.indexOf(AbilityType.HeroHideCreature) !== -1
      )
    ) {
      allCharacters.forEach(creature => {
        if (creature.type === CreatureType.Hero) {
          creature.dropCurrentEffect(EffectType.HideCreature);
          this.battleStoreService.updateCharacter(creature);
        }
      });
    }
  }

  private heroTurn(hero: Hero) {
    console.log('heroTurn');
    this.eventsSource.next({
      state: BattleState.PlayerTurn,
      currentCreatureId: hero.id,
      currentCreature: hero.convertToCreatureView(),
      currentTargetForMonsters: this.battleStoreService.getCurrentMonstersTarget().id,
    });
    this.battleStateSource.next(BattleState.PlayerTurn);
  }
  private monsterTurn(monster: Monster) {
    console.log('monsterTurn');
    this.eventsSource.next({
      state: BattleState.MonsterTurn,
      currentCreatureId: monster.id,
      currentCreature: monster.convertToCreatureView(),
      currentTargetForMonsters: this.battleStoreService.getCurrentMonstersTarget().id,
    });
    this.battleStateSource.next(BattleState.MonsterTurn);

    this.monsterAttack(monster);
  }

  private monsterAttack(monster: Monster) {
    console.log('monsterAttack', monster);
    let targetCreature = this.battleStoreService.getCurrentMonstersTarget();
    // проверка цели
    if (!targetCreature || targetCreature.state !== CreatureState.Alive) {
      this.setNewTargetForMonster();
      targetCreature = this.battleStoreService.getCurrentMonstersTarget();
    }
    // берем случайную способность
    const availableAbilities = monster.getAvailableAbilities(); // способность применяется N раз за бой
    const currentAbility =
      availableAbilities[this.randomService.getInt(0, availableAbilities.length - 1)];
    const abilityResult = this.useAbility(monster, targetCreature, currentAbility);

    this.eventsSource.next({
      state: BattleState.MonsterAbility,
      currentCreatureId: monster.id,
      ability: currentAbility.type,
      abilityResult,
    });
    this.battleStateSource.next(BattleState.MonsterAbility);
  }

  private useAbility(source: Character, target: Character, ability: Ability) {
    const newSource = source.copy();
    const newTarget = source.id === target.id ? newSource : target.copy();

    const abilityResult = ability.ability(newSource, newTarget);
    if ('notCorrectTarget' in abilityResult) {
      return abilityResult;
    } else {
      newSource.lastTargetInBattle = newTarget.id;
      newSource.usedInThisRoundAbilities.push(ability.type);
      const countOfUses = newSource.usedInThisBattleAbilities.has(ability.type)
        ? newSource.usedInThisBattleAbilities.get(ability.type)
        : 0;
      newSource.usedInThisBattleAbilities.set(ability.type, countOfUses + 1);

      if (ability.maxUseCount && ability.maxUseCount === countOfUses + 1) {
        newSource.dropCurrentAbility(ability.type);
      }

      (abilityResult as AbilityResult).isAddonAction = ability.isAddonAction;
      this.battleStoreService.updateCharacter(newSource);
      this.battleStoreService.updateCharacter(newTarget);
      return abilityResult;
    }
  }

  private checkForStunning(character: Character) {
    if (character.isExistsEffect(EffectType.Stan2)) {
      character.dropCurrentEffect(EffectType.Stan2);
      character.currentEffects.push(EffectFabric.createEffect(EffectType.Stan));
      return true;
    } else if (character.isExistsEffect(EffectType.Stan)) {
      character.dropCurrentEffect(EffectType.Stan);
      return true;
    } else {
      return false;
    }
  }
}
