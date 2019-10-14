import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  AbilityType,
  BattleState,
  CreatureState,
  CreatureType,
  EffectType,
  ItemType,
} from '@enums';
import {
  Ability,
  AbilityResult,
  AbilitySettings,
  BattleEvent,
  Bottle,
  Cell,
  Creature,
  Effect,
  Hero,
  Monster,
} from '@models';
import { AbilityFabric, CreatureFabric, EffectFabric } from '@shared/fabrics';
import { HeroService } from './hero.service';
import { RandomService } from './random.service';
import { SettingsService } from './settings.service';

type Character = Hero | Monster;

@Injectable({
  providedIn: 'root',
})
/** локальный сервис расчета боя */
export class BattleService {
  battleState$: Observable<BattleState>;
  events$: Observable<BattleEvent>;

  private cell: Cell;
  private battleStateSource: BehaviorSubject<BattleState> = new BehaviorSubject<BattleState>(
    BattleState.Begin
  );
  private eventsSource: Subject<BattleEvent> = new Subject<BattleEvent>();
  private monsters: Monster[];
  private currentCreature: { id: number; index: number };
  private currentRound: number;
  private currentTargetForMonsters: number;
  private creatures: Character[];

  constructor(
    private heroService: HeroService,
    private settingsService: SettingsService,
    private randomService: RandomService
  ) {
    this.events$ = this.eventsSource.asObservable();

    this.events$.pipe(delay(100)).subscribe(event => {
      if (event.state === BattleState.PlayerAbility || event.state === BattleState.MonsterAbility) {
        if (
          'notCorrectTarget' in event.abilityResult ||
          (event.abilityResult as AbilityResult).isAddonAction
        ) {
          if (event.state === BattleState.MonsterAbility) {
            const currentCreature = this.creatures[this.currentCreature.index];
            if (currentCreature.type === CreatureType.Monster) {
              this.monsterAttack(currentCreature);
            }
          } else {
            this.eventsSource.next({
              state: BattleState.ContinuationPlayerTurn,
            });
          }
        } else {
          this.endTurn();
          this.setNextCreature();
          if (this.currentCreature === null) {
            this.newRound();
          } else {
            this.startTurn();
          }
        }
      }
    });
  }

  createBattle(cell: Cell) {
    this.cell = cell;
    this.currentRound = 0;

    this.prepareHeroBeforeBattle();
    this.generateMonsters();
    this.setCreaturesOrder();
    this.setInitialEffects();
    this.setInitialAbilities();
    this.setNewTargetForMonster();
  }

  getCreatures() {
    return this.creatures.map(creature => creature.convertToCreatureView());
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

  heroAction(abilityType: AbilityType, target: number) {
    console.log('heroAction');

    const currentCreature = this.creatures.find(
      creature => creature.id === this.currentCreature.id
    );
    const availableAbilities = currentCreature.getAvailableAbilities(); // способность применяется N раз за бой
    // проверка цели и способности
    const currentAbility = availableAbilities.find(ability => ability.type === abilityType);
    const targetCreature = this.creatures.find(
      creature => creature.id === target && creature.state === CreatureState.Alive
    );
    if (!targetCreature || !currentAbility) {
      // TODO: ошибка и повторное действие
      this.eventsSource.next({
        state: BattleState.ContinuationPlayerTurn,
        currentCreatureId: this.currentCreature.id,
        currentCreature: currentCreature.convertToCreatureView(),
      });
      return;
    }
    const abilityResult = this.useAbility(currentCreature, targetCreature, currentAbility);

    this.eventsSource.next({
      state: BattleState.PlayerAbility,
      currentCreatureId: this.currentCreature.id,
      ability: currentAbility.type,
      abilityResult,
      target,
    });
    this.battleStateSource.next(BattleState.PlayerAbility);
  }

  private winBattle() {
    this.prepareHeroAfterWin();
    this.eventsSource.next({ state: BattleState.Win });
    this.battleStateSource.next(BattleState.Win);
  }
  private loseBattle() {
    this.eventsSource.next({ state: BattleState.Lose });
    this.battleStateSource.next(BattleState.Lose);
  }
  private generateMonsters() {
    this.monsters = [];
    for (let index = 0; index < this.cell.mosterLevel1Count; index++) {
      this.monsters.push(CreatureFabric.createRandomMonsterLevel1());
    }
    for (let index = 0; index < this.cell.mosterLevel2Count; index++) {
      this.monsters.push(CreatureFabric.createRandomMonsterLevel2());
    }
    if (this.cell.doesBossExists) {
      this.monsters.push(CreatureFabric.createRandomMonsterBoss());
    }
  }
  private setCreaturesOrder() {
    this.creatures = [];
    this.creatures.push(...this.monsters);
    this.creatures.push(...this.heroService.heroes);

    this.creatures.sort(() => Math.random() - 0.5);
  }

  private setInitialEffects() {
    this.creatures.forEach(creature => {
      creature.currentEffects = creature.effects.filter(effect =>
        Effect.checkEffectTypeOnСombat(effect.effectType)
      );
      this.setShieldEffect(creature);
    });
  }

  private setShieldEffect(creature: Character) {
    const shield = creature.equipment.Shield;
    if (shield && shield.hitPoint > 0) {
      const shieldEffect = EffectFabric.createEffect(EffectType.Shield);
      shieldEffect.description = `Щит, броня ${shield.value} , прочность ${shield.hitPoint}.`;
      creature.currentEffects.push(shieldEffect);
    }
  }

  private setInitialAbilities() {
    this.creatures.forEach(creature => {
      creature.currentAbilities = creature.abilities.map(abilityType =>
        AbilityFabric.createAbility(abilityType)
      );
      this.setBottleAbilities(creature);
    });
  }

  private setBottleAbilities(creature: Character) {
    Bottle.getBottleTypes().forEach(itemType => {
      const bottles = creature.inventory.filter(item => item.type === itemType) as Bottle[];
      if (bottles.length > 0) {
        const ability = AbilityFabric.createAbilityByBottle(bottles[0], bottles.length);
        creature.currentAbilities.push(ability);
      }
    });
  }

  private setNewTargetForMonster(exceptHero: number = null) {
    const heroes: number[] = [];
    this.creatures.forEach(creature => {
      if (
        creature.state === CreatureState.Alive &&
        creature.type === CreatureType.Hero &&
        creature.id !== exceptHero &&
        !creature.isExistsEffect(EffectType.HideCreature)
      ) {
        heroes.push(creature.id);
      }
    });
    this.currentTargetForMonsters =
      heroes.length === 0 ? exceptHero : heroes.sort(() => Math.random() - 0.5).pop();
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
    const cntMonsters = this.creatures.filter(
      creature => creature.type === CreatureType.Monster && creature.state === CreatureState.Alive
    ).length;
    const cntHeroes = this.creatures.filter(
      creature => creature.type === CreatureType.Hero && creature.state === CreatureState.Alive
    ).length;

    if (cntHeroes === 0) {
      this.loseBattle();
    } else if (cntMonsters === 0) {
      this.winBattle();
    }
  }

  private newRound() {
    this.currentRound += 1;
    this.battleStateSource.next(BattleState.NewRound);
    this.eventsSource.next({ state: BattleState.NewRound, round: this.currentRound });
    this.creatures.forEach(creature => {
      creature.usedInThisRoundAbilities = [];
      // снятие эффектов в конце раунда
      creature.dropCurrentEffects([
        EffectType.BlockHeal,
        EffectType.MagicProtection,
        EffectType.Suppression,
      ]);
    });

    this.checkBattleEnd();

    if (this.battleStateSource.value === BattleState.NewRound) {
      this.setFirstCreature();
      this.startTurn();
    }
  }

  private setFirstCreature() {
    const firstCreatureIndex = this.creatures.findIndex(
      creature => creature.state === CreatureState.Alive
    );
    this.currentCreature = {
      index: firstCreatureIndex,
      id: this.creatures[firstCreatureIndex].id,
    };
  }
  private setNextCreature() {
    const nextCreatureIndex = this.creatures.findIndex(
      (creature, index) =>
        creature.state === CreatureState.Alive && index > this.currentCreature.index
    );

    if (nextCreatureIndex === -1) {
      this.currentCreature = null;
    } else {
      this.currentCreature = {
        index: nextCreatureIndex,
        id: this.creatures[nextCreatureIndex].id,
      };
    }
  }

  private startTurn() {
    const creature: Character = this.creatures[this.currentCreature.index];
    console.log('startTurn', creature);

    if (creature.state !== CreatureState.Alive) {
      return;
    }

    this.eventsSource.next({
      state: BattleState.NewTurn,
      currentCreatureId: this.currentCreature.id,
    });
    this.battleStateSource.next(BattleState.NewTurn);

    // применение всех эффектов
    creature.currentEffects
      .filter(effect => effect.isNewRoundActivation)
      .forEach(effect => effect.action(creature));
    // снятие временных эффектов в начале хода существа
    creature.dropCurrentEffects([EffectType.BlockDamage]);

    const isStunned = this.checkForStunning(creature);
    if (isStunned) {
      this.endTurn();
      this.setNextCreature();
      if (this.currentCreature === null) {
        this.newRound();
      } else {
        this.startTurn();
      }
      return;
    }

    if (creature.type === CreatureType.Hero) {
      this.heroTurn(creature);
    } else {
      this.monsterTurn(creature);
    }
  }
  private endTurn() {
    const currentCreature: Character = this.creatures[this.currentCreature.index];
    console.log('endTurn', currentCreature);
    // снятие эффектов в конце хода существа
    currentCreature.dropCurrentEffects([
      EffectType.Course,
      EffectType.Imbecility,
      EffectType.Slackness,
    ]);

    // TODO: делать проверку только после гибели
    // если погиб последний герой воин-страж, снимаем со всех защиту
    if (
      !this.creatures.some(
        creature =>
          creature.state === CreatureState.Alive &&
          creature.abilities.indexOf(AbilityType.HeroHideCreature) !== -1
      )
    ) {
      this.creatures.forEach(creature => {
        if (creature.type === CreatureType.Hero) {
          creature.dropCurrentEffect(EffectType.HideCreature);
        }
      });
    }
  }
  private heroTurn(creature: Hero) {
    console.log('heroTurn');
    this.eventsSource.next({
      state: BattleState.PlayerTurn,
      currentCreatureId: this.currentCreature.id,
      currentCreature: creature.convertToCreatureView(),
      currentTargetForMonsters: this.currentTargetForMonsters,
    });
    this.battleStateSource.next(BattleState.PlayerTurn);
  }
  private monsterTurn(creature: Monster) {
    console.log('monsterTurn');
    this.eventsSource.next({
      state: BattleState.MonsterTurn,
      currentCreatureId: this.currentCreature.id,
      currentCreature: creature.convertToCreatureView(),
      currentTargetForMonsters: this.currentTargetForMonsters,
    });
    this.battleStateSource.next(BattleState.MonsterTurn);

    this.monsterAttack(creature);
  }
  private monsterAttack(creature: Monster) {
    console.log('monsterAttack', creature);
    // проверка цели
    if (
      !this.creatures.find(
        target =>
          target.id === this.currentTargetForMonsters && target.state !== CreatureState.Alive
      )
    ) {
      this.setNewTargetForMonster();
    }
    // берем случайную способность
    const availableAbilities = creature.getAvailableAbilities(); // способность применяется N раз за бой
    const currentAbility =
      availableAbilities[this.randomService.getInt(0, availableAbilities.length - 1)];
    const targetCreature = this.creatures.find(
      target => target.id === this.currentTargetForMonsters
    );

    const abilityResult = this.useAbility(creature, targetCreature, currentAbility);

    this.eventsSource.next({
      state: BattleState.MonsterAbility,
      currentCreatureId: this.currentCreature.id,
      ability: currentAbility.type,
      abilityResult,
    });
    this.battleStateSource.next(BattleState.MonsterAbility);
  }
  private useAbility(creature: Character, targetCreature: Character, ability: Ability) {
    const abilityResult = ability.ability(creature, targetCreature);
    if ('notCorrectTarget' in abilityResult) {
      return abilityResult;
    } else {
      creature.lastTargetInBattle = targetCreature.id;
      creature.usedInThisRoundAbilities.push(ability.type);
      const countOfUses = creature.usedInThisBattleAbilities.has(ability.type)
        ? creature.usedInThisBattleAbilities.get(ability.type)
        : 0;
      creature.usedInThisBattleAbilities.set(ability.type, countOfUses + 1);

      if (ability.maxUseCount && ability.maxUseCount === countOfUses + 1) {
        creature.dropCurrentAbility(ability.type);
      }

      (abilityResult as AbilityResult).isAddonAction = ability.isAddonAction;
      return abilityResult;
    }
  }

  private checkForStunning(creature: Character) {
    if (creature.isExistsEffect(EffectType.Stan2)) {
      creature.dropCurrentEffect(EffectType.Stan2);
      creature.currentEffects.push(EffectFabric.createEffect(EffectType.Stan));
      return true;
    } else if (creature.isExistsEffect(EffectType.Stan)) {
      creature.dropCurrentEffect(EffectType.Stan);
      return true;
    } else {
      return false;
    }
  }
}
