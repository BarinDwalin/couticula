import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { interval } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { RandomService } from '@services';

export const animateInterval = 200;

const animateFunc = `${animateInterval}ms ease-in`;
const dotsTransitions = [
  transition('* => 1', animate(animateFunc)),
  transition('* => 2', animate(animateFunc)),
  transition('* => 3', animate(animateFunc)),
  transition('* => 4', animate(animateFunc)),
  transition('* => 5', animate(animateFunc)),
  transition('* => 6', animate(animateFunc)),
];

@Component({
  selector: 'dice',
  templateUrl: 'dice.component.html',
  styleUrls: ['dice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dot1State', [
      state('1', style({ transform: 'translate(25px, 25px)' })),
      state('2', style({ transform: 'translate(0, 50px)' })),
      state('3', style({ transform: 'translate(25px, 25px)' })),
      state('4', style({ transform: 'translate(0, 0)' })),
      state('5', style({ transform: 'translate(0, 0)' })),
      state('6', style({ transform: 'translate(0, 0)' })),
      ...dotsTransitions,
    ]),
    trigger('dot2State', [
      state('1', style({ transform: 'translate(25px, 0)' })),
      state('2', style({ transform: 'translate(0, 25px)' })),
      state('3', style({ transform: 'translate(25px, 0)' })),
      state('4', style({ transform: 'translate(0, 25px)' })),
      state('5', style({ transform: 'translate(25px, 0)' })),
      state('6', style({ transform: 'translate(0, 0)' })),
      ...dotsTransitions,
    ]),
    trigger('dot3State', [
      state('1', style({ transform: 'translate(25px, -25px)' })),
      state('2', style({ transform: 'translate(0, 0)' })),
      state('3', style({ transform: 'translate(0, 0)' })),
      state('4', style({ transform: 'translate(0, 0)' })),
      state('5', style({ transform: 'translate(0, 0)' })),
      state('6', style({ transform: 'translate(0, 0)' })),
      ...dotsTransitions,
    ]),
    trigger('dot4State', [
      state('1', style({ transform: 'translate(-25px, 25px)' })),
      state('2', style({ transform: 'translate(0, 0)' })),
      state('3', style({ transform: 'translate(0, 0)' })),
      state('4', style({ transform: 'translate(0, 0)' })),
      state('5', style({ transform: 'translate(0, 0)' })),
      state('6', style({ transform: 'translate(0, 0)' })),
      ...dotsTransitions,
    ]),
    trigger('dot5State', [
      state('1', style({ transform: 'translate(-25px, 0)' })),
      state('2', style({ transform: 'translate(0, -25px)' })),
      state('3', style({ transform: 'translate(-25px, 0)' })),
      state('4', style({ transform: 'translate(0, -25px)' })),
      state('5', style({ transform: 'translate(-25px, 0)' })),
      state('6', style({ transform: 'translate(0, 0)' })),
      ...dotsTransitions,
    ]),
    trigger('dot6State', [
      state('1', style({ transform: 'translate(-25px, -25px)' })),
      state('2', style({ transform: 'translate(0, -50px)' })),
      state('3', style({ transform: 'translate(-25px, -25px)' })),
      state('4', style({ transform: 'translate(0, 0)' })),
      state('5', style({ transform: 'translate(0, 0)' })),
      state('6', style({ transform: 'translate(0, 0)' })),
      ...dotsTransitions,
    ]),
  ],
})
export class DiceComponent implements OnInit {
  @Input()
  dice: number;
  @Input()
  backgroundColor = 'white';

  constructor(private cd: ChangeDetectorRef, private randomService: RandomService) {}

  ngOnInit() {}

  animate(value: number, delay: number) {
    interval(animateInterval)
      .pipe(
        finalize(() => {
          this.dice = value;
          this.cd.markForCheck();
        }),
        take(delay / animateInterval)
      )
      .subscribe(() => {
        this.dice = this.throwNewDiceD6(this.dice);
        this.cd.markForCheck();
      });
  }

  throwNewDiceD6(except: number): number {
    let dice: number;
    do {
      dice = this.randomService.rollDiceD6();
    } while (dice === except);

    return dice;
  }
}
