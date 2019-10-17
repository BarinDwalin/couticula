import { Injectable } from '@angular/core';
import { Observable, Subject, interval, zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AbilityType, BattleState, CreatureState } from '@enums';
import {
  AbilityResult,
  BattleEvent,
  BattleStateEvent,
  Cell,
  CharacterBattleEffect,
  CharactersStateDelta,
  CreatureView,
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
  characterEffectEvents$: Observable<CharacterBattleEffect>;
  characterUpdateEvents$: Observable<CreatureView>;
  currentRound = 1;
  selectedCharacterId: number;
  selectedHeroAbilityType: AbilityType;
  currentCharacterId: number;
  targetHero: CreatureView;
  targetMonster: CreatureView;
  liveCharacters: CreatureView[] = [];

  private eventsSource: Subject<BattleStateEvent> = new Subject<BattleStateEvent>();
  private endEventSource: Subject<Cell> = new Subject<Cell>();
  private characterEffectEventsSource: Subject<CharacterBattleEffect> = new Subject<
    CharacterBattleEffect
  >();
  private characterUpdateEventsSource: Subject<CreatureView> = new Subject<CreatureView>();
  private stackBattleEvents: BattleEvent[] = [];

  constructor(private battleService: BattleService, private settingsService: SettingsService) {
    this.events$ = this.eventsSource.asObservable();
    this.endEvent$ = this.endEventSource.asObservable();
    this.characterEffectEvents$ = this.characterEffectEventsSource.asObservable();
    this.characterUpdateEvents$ = this.characterUpdateEventsSource.asObservable();
  }

  startBattle(cell: Cell) {
    this.subcribeOnBattleEvents();

    this.battleService.createBattle(cell);
    this.liveCharacters = this.battleService.getAllCharacters();
    this.targetHero = this.liveCharacters[0];
    this.targetMonster = this.liveCharacters[0];
    this.currentCharacterId = this.liveCharacters[0].id;
    this.selectedCharacterId = this.currentCharacterId;
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
    this.selectedCharacterId = creatureId;
    this.targetMonster = this.liveCharacters.find(
      creature => creature.id === this.selectedCharacterId
    );
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
    const effectsAnimationTime = this.settingsService.battleEventsDelay;

    if (event) {
      const abilityResult = event.abilityResult as AbilityResult;
      const battleEvent: BattleStateEvent = {
        state: event.state,
        abilityResult,
      };

      switch (event.state) {
        case BattleState.Lose:
        case BattleState.Win:
          this.eventsSource.next(battleEvent);
          // остановка обработчика событий
          return;
        case BattleState.NewRound:
          this.currentRound = event.round;
          // this.characters = this.battleService.getAllCharacters();
          break;
        case BattleState.NewTurn:
          this.setCurrentCharacter(event);
          this.updateCreatureWithDelay(event.effectsResult, effectsAnimationTime, eventDelay);
          break;
        case BattleState.MonsterTurn:
          this.prepareMonsterTurn(event);
          break;
        case BattleState.ContinuationPlayerTurn:
        case BattleState.PlayerTurn:
          this.prepareHeroTurn(event);
          this.eventsSource.next(battleEvent);
          // остановка обработчика событий до выбора способности героя
          return;
        case BattleState.PlayerAbility:
        case BattleState.MonsterAbility:
          this.setSelectedCharacter(abilityResult);
          const abilityResultAnimationTime = abilityResult.diceValue ? diceDelay : 0;
          // анимация броска
          battleEvent.delay = abilityResultAnimationTime;
          // отображение результата способности после броска
          this.updateCreatureWithDelay(
            abilityResult,
            effectsAnimationTime,
            eventDelay + abilityResultAnimationTime
          );
          eventDelay += abilityResultAnimationTime + effectsAnimationTime;
          break;
      }
      this.eventsSource.next(battleEvent);
    } else {
      eventDelay = 300;
    }

    setTimeout(this.eventHandler.bind(this), eventDelay);
  }

  private updateCreatureWithDelay(
    creatureStates: CharactersStateDelta,
    effectsAnimationTime: number,
    eventDelay: number
  ) {
    setTimeout(() => {
      this.updateCharacter(creatureStates.characterAfter);

      // анимация эффектов
      this.characterEffectEventsSource.next(
        this.getCharacterChanges(
          creatureStates.characterBefore,
          creatureStates.characterAfter,
          effectsAnimationTime
        )
      );
    }, eventDelay);
  }

  private setCurrentCharacter(event: BattleEvent) {
    this.currentCharacterId = event.currentCreatureId;
  }

  private setSelectedCharacter(abilityResult: AbilityResult) {
    this.selectedCharacterId = abilityResult.characterAfter.id;
  }

  private prepareHeroTurn(event: BattleEvent) {
    const lastTarget = this.liveCharacters.find(
      character => character.id === this.currentCharacterId
    ).lastTargetInBattle;
    this.selectedCharacterId =
      !!lastTarget || lastTarget === 0 ? lastTarget : this.selectedCharacterId;
    this.targetHero = this.liveCharacters.find(
      character => character.id === this.currentCharacterId
    );
    this.selectedHeroAbilityType = this.targetHero.availableAbilities[0].type;
    this.targetMonster = this.liveCharacters.find(
      character => character.id === this.selectedCharacterId
    );
  }
  private prepareMonsterTurn(event: BattleEvent) {
    this.selectedCharacterId = event.currentTargetForMonsters;
    this.targetMonster = this.liveCharacters.find(
      character => character.id === this.currentCharacterId
    );
    this.targetHero = this.liveCharacters.find(
      character => character.id === this.selectedCharacterId
    );
  }

  private updateCharacter(updatedCharacter: CreatureView) {
    const index = this.liveCharacters.findIndex(
      oldCharacter => oldCharacter.id === updatedCharacter.id
    );

    if (updatedCharacter.state !== CreatureState.Alive) {
      this.liveCharacters.splice(index, 1);
    } else {
      // this.liveCharacters[index] = updatedCharacter;
      const creature = this.liveCharacters[index];
      for (const key in creature) {
        if (creature.hasOwnProperty(key) && updatedCharacter.hasOwnProperty(key)) {
          creature[key] = updatedCharacter[key];
        }
      }
    }
    this.characterUpdateEventsSource.next(updatedCharacter);
  }

  private getCharacterChanges(
    characterBefore: CreatureView,
    characterAfter: CreatureView,
    animationTime: number = 0
  ) {
    const diff: CharacterBattleEffect = {
      animationTime,
      characterId: characterAfter.id,
      diffHitpoints: characterAfter.hitPoint - characterBefore.hitPoint,
      addonEffects: characterAfter.currentEffects.filter(
        effectAfter =>
          !characterBefore.currentEffects.some(
            effectBefore => effectBefore.effectType === effectAfter.effectType
          )
      ),
      removedEffects: characterBefore.currentEffects.filter(
        effectBefore =>
          !characterAfter.currentEffects.some(
            effectAfter => effectAfter.effectType === effectBefore.effectType
          )
      ),
    };
    return diff;
  }
}
