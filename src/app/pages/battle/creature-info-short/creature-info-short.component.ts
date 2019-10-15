import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil, tap } from 'rxjs/operators';

import { CreatureView } from '@models';
import { BattleStateService } from '@services';

@Component({
  selector: 'creature-info-short',
  templateUrl: 'creature-info-short.component.html',
  styleUrls: ['creature-info-short.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('flyInOutTop', [
      state('in', style({ transform: 'translate(-50%, 50%)' })),
      state('out', style({ transform: 'translate(-50%, -50%)' })),
      transition('void => in', [style({ transform: 'translate(-50%, -50%)' }), animate(1000)]),
      transition('void => out', [style({ transform: 'translate(-50%, 50%)' }), animate(1000)]),
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
    this.battleStateService.creatureEffectEvents$
      .pipe(
        filter(event => event.creatureId === this.creature.id),
        tap(event => {
          this.hitPointDiff = event.diffHitpoints;
          this.cd.markForCheck();
        }),
        delay(1000),
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
