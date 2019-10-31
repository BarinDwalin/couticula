import { ItemType } from '@enums';
import { Item } from './item';

export class Shield extends Item {
  readonly type = ItemType.Shield;
  hitPoint: number;
  currentHitPoint: number;

  private static getDescription(armor: number, hitPoint: number) {
    let text = 'удар';
    if (hitPoint > 4) {
      text = 'ударов';
    } else if (hitPoint > 1) {
      text = 'удара';
    }
    return `Броня ${armor}, на ${hitPoint} ${text}`;
  }

  constructor(armor: number, hitPoint: number, name: string, image: string, description = '') {
    super(ItemType.Shield, armor, name, image, Shield.getDescription(armor, hitPoint));

    this.hitPoint = hitPoint;
    this.currentHitPoint = hitPoint;
  }

  copy(): Shield {
    return new Shield(this.value, this.hitPoint, this.name, this.img, this.description);
  }
}
