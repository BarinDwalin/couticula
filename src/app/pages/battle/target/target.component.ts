import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CreatureView } from '@models';
import { AbilityType } from '@shared/enums';

@Component({
  selector: 'target',
  templateUrl: 'target.component.html',
  styleUrls: ['target.component.scss'],
})
export class TargetComponent implements OnInit {
  @Input()
  isHero = false;
  @Input()
  isShownAbilities = false;
  @Input()
  creature: CreatureView;
  @Input()
  selectedAbilityType: AbilityType;
  @Output()
  selectAbilityType = new EventEmitter<AbilityType>();

  constructor() {}

  ngOnInit() {
    this.selectAbilityType.next(this.selectedAbilityType);
  }

  showCreatureDescription() {
    console.log(this.creature.description);
  }

  selectAbility(abilityType: AbilityType) {
    this.selectedAbilityType = abilityType;
    this.selectAbilityType.next(abilityType);
  }
}
