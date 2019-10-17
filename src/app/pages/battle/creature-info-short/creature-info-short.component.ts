import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, of } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { CreatureView } from '@models';
import { BattleStateService } from '@services';

const animationTime = 1000;

@Component({
  selector: 'creature-info-short',
  templateUrl: 'creature-info-short.component.html',
  styleUrls: ['creature-info-short.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flyInOutTop', [
      state('in', style({ transform: 'translate(-50%, 50%)' })),
      state('out', style({ transform: 'translate(-50%, -50%)' })),
      transition('void => in', [
        style({ transform: 'translate(-50%, -50%)' }),
        animate(animationTime),
      ]),
      transition('void => out', [
        style({ transform: 'translate(-50%, 50%)' }),
        animate(animationTime),
      ]),
    ]),
  ],
})
export class CreatureInfoShortComponent implements OnInit, OnDestroy {
  @Input()
  creature: CreatureView;
  hitPointDiff: number = null;

  private unsubscribe$: Subject<void> = new Subject();

  get isPositive() {
    return this.hitPointDiff > 0;
  }

  get hitPointsPercent() {
    return Math.floor((100 * this.creature.hitPoint) / this.creature.maxHitPoint);
  }

  get changeHitPoint() {
    if (this.hitPointDiff !== null) {
      return Math.abs(this.hitPointDiff).toString();
    }
  }

  constructor(private battleStateService: BattleStateService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.battleStateService.characterEffectEvents$
      .pipe(
        filter(event => event.characterId === this.creature.id),
        filter(event => event.diffHitpoints !== 0),
        tap(event => {
          this.hitPointDiff = event.diffHitpoints;
          this.cd.markForCheck();
        }),
        switchMap(event => of(event).pipe(delay(event.animationTime))),
        tap(() => {
          this.hitPointDiff = null;
          this.cd.markForCheck();
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
