import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AbilityType, BattleState } from '@enums';
import { AbilityResult, BattleStateEvent, Cell } from '@models';
import { BattleStateService } from '@services';
import { DiceComponent, DiceTargetComponent } from '@shared/components';

@Component({
  selector: 'page-battle',
  templateUrl: 'battle.page.html',
  styleUrls: ['battle.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [],
})
export class BattlePage implements OnDestroy {
  @ViewChild(DiceTargetComponent, { static: true })
  diceTarget: DiceTargetComponent;
  @ViewChild(DiceComponent, { static: true })
  diceValue: DiceComponent;
  cell: Cell;
  waiting = true;

  private unsubscribe$: Subject<void> = new Subject();

  get currentRound() {
    return this.battleStateService.currentRound;
  }
  get currentCreatureId() {
    return this.battleStateService.currentCharacterId;
  }
  get selectedCreatureId() {
    return this.battleStateService.selectedCharacterId;
  }
  get selectedHeroAbilityType() {
    return this.battleStateService.selectedHeroAbilityType;
  }
  get selectedHeroAbility() {
    return this.battleStateService.targetHero.availableAbilities.find(
      ability => ability.type === this.battleStateService.selectedHeroAbilityType
    );
  }
  get targetHero() {
    return this.battleStateService.targetHero;
  }
  get targetMonster() {
    return this.battleStateService.targetMonster;
  }

  get liveCreatures() {
    return this.battleStateService.liveCharacters;
  }

  constructor(
    private cd: ChangeDetectorRef,
    public navCtrl: NavController,
    private battleStateService: BattleStateService
  ) {
    this.cell = history.state.cell; // this.params.get('cell');

    this.battleStateService.events$.pipe(takeUntil(this.unsubscribe$)).subscribe(event => {
      switch (event.state) {
        case BattleState.Lose:
        case BattleState.Win:
          this.navCtrl.pop();
          this.battleStateService.finishBattle(this.cell);
          break;
        default:
          this.eventHandler(event);
          break;
      }
    });

    this.battleStateService.startBattle(this.cell);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private eventHandler(event: BattleStateEvent) {
    if (event) {
      const abilityResult: AbilityResult = event.abilityResult;
      switch (event.state) {
        case BattleState.NewRound:
          // tslint:disable-next-line:no-console
          console.info(`ROUND ${this.battleStateService.currentRound}`);
          break;
        case BattleState.NewTurn:
          break;
        case BattleState.ContinuationPlayerTurn:
        case BattleState.PlayerTurn:
          this.waiting = false;
          break;
        case BattleState.PlayerAbility:
          this.waiting = true;
          this.showDicesAnimation(abilityResult, event.delay);
          break;
        case BattleState.MonsterTurn:
          break;
        case BattleState.MonsterAbility:
          this.showDicesAnimation(abilityResult, event.delay);
          break;
      }
    }
    this.cd.markForCheck();
  }

  private showDicesAnimation(abilityResult: AbilityResult, animationTime: number) {
    if (abilityResult.diceTarget && animationTime) {
      this.diceTarget.animate(abilityResult.diceTarget, animationTime);
    }
    if (abilityResult.diceValue && animationTime) {
      this.diceValue.animate(abilityResult.diceValue, animationTime);
    }
  }

  useAbility() {
    this.battleStateService.heroAction(this.selectedHeroAbilityType, this.targetMonster.id);
  }

  clickTarget() {
    // TODO убрать после реализации боя
    this.navCtrl.pop();
  }

  onSelectAbilityType(selectedAbilityType: AbilityType) {
    this.battleStateService.selectHeroAbilityType(selectedAbilityType);
  }

  onSelectCreature(creatureId: number) {
    this.battleStateService.selectCreature(creatureId);
  }
}
