import { CreatureType } from '@enums';
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
}
