import { Injectable } from '@angular/core';
import { Observable, Subject, interval, zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AbilityType, BattleState, CreatureState } from '@enums';
import {
  AbilityResult,
  BattleEvent,
  BattleStateEvent,
  Cell,
  CreatureBattleEffect,
  CreatureView,
  Effect,
} from '@models';
import { BattleService } from './battle.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
/** сервис отслеживания состояний боя */
export class BattleStateService {
  events$: Observable<BattleStateEvent>;
  endEvent$: Observable<Cell>;
  creatureEffectEvents$: Observable<CreatureBattleEffect>;
  currentRound = 1;
  selectedCreatureId: number;
  selectedHeroAbilityType: AbilityType;
  currentCreature: { id: number; index: number };
  lastCreatureInRound: number;
  targetHero: CreatureView;
  targetMonster: CreatureView;
  liveCreatures: CreatureView[] = [];

  private creatures: CreatureView[] = [];
  private eventsSource: Subject<BattleStateEvent> = new Subject<BattleStateEvent>();
  private endEventSource: Subject<Cell> = new Subject<Cell>();
  private creatureEffectEventsSource: Subject<CreatureBattleEffect> = new Subject<
    CreatureBattleEffect
  >();
  private stackBattleEvents: BattleEvent[] = [];

  constructor(private battleService: BattleService, private settingsService: SettingsService) {
    this.events$ = this.eventsSource.asObservable();
    this.endEvent$ = this.endEventSource.asObservable();
    this.creatureEffectEvents$ = this.creatureEffectEventsSource.asObservable();
  }

  startBattle(cell: Cell) {
    this.subcribeOnBattleEvents();

    this.battleService.createBattle(cell);
    this.creatures = this.battleService.getCreatures();
    this.liveCreatures = this.creatures;
    this.targetHero = this.creatures[0];
    this.targetMonster = this.creatures[0];
    this.currentCreature = { id: this.creatures[0].id, index: 0 };
    this.selectedCreatureId = this.currentCreature.id;
    this.updateLastCreatureInRound();
    this.battleService.startBattle();
  }

  finishBattle(cell: Cell) {
    this.endEventSource.next(cell);
  }

  private subcribeOnBattleEvents() {
    zip(this.battleService.events$, interval(100))
      .pipe(
        map(value => value[0] as BattleEvent),
        takeUntil(this.endEvent$)
      )
      .subscribe(event => {
        console.log(BattleState[event.state], event);

        switch (event.state) {
          case BattleState.Begin:
            this.eventHandler();
            break;
          case BattleState.Lose:
          case BattleState.Win:
            this.stackBattleEvents.push(event);
            break;
          default:
            this.stackBattleEvents.push(event);
            break;
        }
      });
  }

  selectHeroAbilityType(selectedAbilityType: AbilityType) {
    this.selectedHeroAbilityType = selectedAbilityType;
  }

  selectCreature(creatureId: number) {
    this.selectedCreatureId = creatureId;
    this.targetMonster = this.creatures.find(creature => creature.id === this.selectedCreatureId);
  }

  heroAction(selectedHeroAbilityType: AbilityType, targetMonterId: number) {
    this.battleService.heroAction(selectedHeroAbilityType, targetMonterId);
    // возобновление обработчика событий
    this.eventHandler();
  }

  private eventHandler() {
    const event = this.stackBattleEvents.shift();
    let eventDelay = this.settingsService.battleEventsDelay;
    const diceDelay = this.settingsService.battleDiceDelay;

    if (event) {
      const abilityResult = event.abilityResult as AbilityResult;
      const battleEvent = {
        state: event.state,
        abilityResult,
      } as BattleStateEvent;

      switch (event.state) {
        case BattleState.Lose:
        case BattleState.Win:
          this.eventsSource.next(battleEvent);
          // остановка обработчика событий
          return;
        case BattleState.NewRound:
          this.currentRound = event.round;
          break;
        case BattleState.NewTurn:
          this.updateCreaturesList();
          break;
        case BattleState.MonsterTurn:
          this.startTurn(event);
          this.prepareMonsterTurn(event);
          break;
        case BattleState.ContinuationPlayerTurn:
        case BattleState.PlayerTurn:
          this.startTurn(event);
          this.prepareHeroTurn(event);
          this.eventsSource.next(battleEvent);
          // остановка обработчика событий до выбора способности героя
          return;
        case BattleState.PlayerAbility:
        case BattleState.MonsterAbility:
          const abilityResultDelay = abilityResult.diceValue ? diceDelay : 0;
          this.selectedCreatureId = abilityResult.targetCreatureAfter.id;
          this.updateCreature(abilityResult.targetCreatureAfter);
          // анимация броска
          battleEvent.delay = abilityResultDelay;
          // отображение результата способности после броска
          setTimeout(() => {
            this.creatureEffectEventsSource.next(this.getCreatureChanges(event, eventDelay));
          }, battleEvent.delay + eventDelay);
          eventDelay += battleEvent.delay + eventDelay + eventDelay; // бросок + задержка + результат
          break;
      }
      this.eventsSource.next(battleEvent);
    } else {
      eventDelay = 300;
    }

    console.log('setTimeout', eventDelay, diceDelay);
    setTimeout(this.eventHandler.bind(this), eventDelay);
  }

  private startTurn(event: BattleEvent) {
    const currentCreatureIndex = this.creatures.findIndex(
      creature => creature.id === event.currentCreatureId
    );
    this.currentCreature = { id: event.currentCreatureId, index: currentCreatureIndex };
    this.updateCreaturesList();
    this.updateCreature(event.currentCreature);
  }

  private updateCreaturesList() {
    this.liveCreatures = [...this.creatures].filter(
      creature => creature.state === CreatureState.Alive
    );
  }

  private prepareHeroTurn(event: BattleEvent) {
    const lastTarget = this.creatures[this.currentCreature.index].lastTargetInBattle;
    this.selectedCreatureId =
      !!lastTarget || lastTarget === 0 ? lastTarget : this.selectedCreatureId;
    this.targetHero = this.creatures.find(creature => creature.id === this.currentCreature.id);
    this.selectedHeroAbilityType = this.targetHero.availableAbilities[0].type;
    this.targetMonster = this.creatures.find(creature => creature.id === this.selectedCreatureId);
  }
  private prepareMonsterTurn(event: BattleEvent) {
    this.selectedCreatureId = event.currentTargetForMonsters;
    this.targetMonster = this.creatures.find(creature => creature.id === this.currentCreature.id);
    this.targetHero = this.creatures.find(creature => creature.id === this.selectedCreatureId);
  }

  private updateCreature(updatedCreature: CreatureView) {
    const creature = this.creatures.find(oldCreature => oldCreature.id === updatedCreature.id);
    for (const key in creature) {
      if (creature.hasOwnProperty(key) && updatedCreature.hasOwnProperty(key)) {
        creature[key] = updatedCreature[key];
      }
    }

    if (
      updatedCreature.state !== CreatureState.Alive &&
      updatedCreature.id === this.lastCreatureInRound
    ) {
      this.updateLastCreatureInRound();
    }
  }

  private getCreatureChanges(event: BattleEvent, animationTime: number) {
    const creatureBefore = (event.abilityResult as AbilityResult).targetCreatureBefore;
    const creatureAfter = (event.abilityResult as AbilityResult).targetCreatureAfter;
    const diff = {
      animationTime,
      creatureId: creatureAfter.id,
      diffHitpoints: creatureAfter.hitPoint - creatureBefore.hitPoint,
      addonEffects: creatureAfter.currentEffects.filter(
        effectAfter =>
          !creatureBefore.currentEffects.some(
            effectBefore => effectBefore.effectType === effectAfter.effectType
          )
      ),
      removedEffects: creatureBefore.currentEffects.filter(
        effectBefore =>
          !creatureAfter.currentEffects.some(
            effectAfter => effectAfter.effectType === effectBefore.effectType
          )
      ),
    };
    return diff as CreatureBattleEffect;
  }
  private updateLastCreatureInRound() {
    this.lastCreatureInRound = this.creatures
      .filter(creature => creature.state === CreatureState.Alive)
      .pop().id;
  }
}
