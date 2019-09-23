import { AbilityType, HeroClass } from '@enums';
import { Creature } from './creature';
import { CreatureEquipment } from './creature-equipment';

export class Hero extends Creature {
  heroClass: HeroClass;
  addonHitPoint: number;
  maxAddonHitPoint: number;
  maxItemValue: number;
  uniqueAbilities: AbilityType[]; // уникальные способности героя
  shopHideAbilities: AbilityType[];

  static getHeroClassName(heroClass: HeroClass) {
    switch (heroClass) {
      case HeroClass.Prist:
        return 'Клирик';
      case HeroClass.Scout:
        return 'Следопыт';
      case HeroClass.Warrior:
        return 'Воин';
    }
  }

  constructor(
    id: number,
    name: string,
    image: string,
    hitpoint: number,
    equipment: CreatureEquipment
  ) {
    super(id, name, image, hitpoint, equipment);
    this.addonHitPoint = 0;
  }

  setAddonHitPoints(value: number) {
    this.hitPoint += value - this.addonHitPoint;
    this.maxHitPoint += value - this.addonHitPoint;
    this.addonHitPoint = value;
  }
}
