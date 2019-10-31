import { AbilityType, CreatureType } from '@enums';
import { Creature } from './creature';
import { CreatureEquipment } from './creature-equipment';

export class Monster extends Creature {
  readonly type = CreatureType.Monster;

  constructor(
    id: number,
    name: string,
    image: string,
    hitpoint: number,
    equipment: CreatureEquipment
  ) {
    super(id, name, image, hitpoint, equipment);
  }

  copy() {
    let monster = new Monster(this.id, this.name, this.image, this.hitPoint, this.equipment);
    monster = Object.assign(monster, super.copy());
    return monster;
  }
}
