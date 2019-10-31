import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AbilityType } from '@enums';
import { CreatureView } from '@models';

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

  constructor(private router: Router) {}

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

  openInventory() {
    this.router.navigateByUrl('/inventory');
  }
}
