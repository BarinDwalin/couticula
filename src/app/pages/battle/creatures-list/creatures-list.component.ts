import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { CreatureView } from '@models';

@Component({
  selector: 'creatures-list',
  templateUrl: 'creatures-list.component.html',
  styleUrls: ['creatures-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('scaleCurrentCharacter', [
      state('currentCharacter', style({ transform: 'scale(1.3)' })),
      transition('currentCharacter => *', [animate('400ms ease-out')]),
      transition('* => currentCharacter', [animate('200ms ease-in')]),
    ]),
  ],
})
export class CreaturesListComponent implements OnInit {
  @Input()
  creatures: CreatureView[];
  @Input()
  currentCreatureId: number;
  @Input()
  selectedCreatureId: number;
  @Input()
  lastCreatureInRound: number;
  @Input()
  currentRound: number;
  @Output()
  selectCreature = new EventEmitter<number>();

  get creaturesCount() {
    return this.creatures.length;
  }

  constructor() {}

  ngOnInit() {}

  select(creatureId: number) {
    this.selectCreature.emit(creatureId);
  }
}
