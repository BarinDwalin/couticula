import { ItemType } from '@enums';
import { Item } from './item';

export class Shield extends Item {
  hitPoint: number;
  currentHitPoint: number;
  constructor(armor: number, hitPoint: number, name: string, image: string, description = '') {
    let text = 'удар';
    if (hitPoint > 4) {
      text = 'ударов';
    } else if (hitPoint > 1) {
      text = 'удара';
    }
    description = `Броня ${armor}, на ${hitPoint} ${text}`;

    super(ItemType.Shield, armor, name, image, description);

    this.hitPoint = hitPoint;
    this.currentHitPoint = hitPoint;
  }
  copy(): Shield {
    return new Shield(this.value, this.hitPoint, this.name, this.img, this.description);
  }
}
