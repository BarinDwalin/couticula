import { AbilityType, CreatureType, HeroClass } from '@enums';
import { Creature } from './creature';
import { CreatureEquipment } from './creature-equipment';

export class Hero extends Creature {
  readonly type = CreatureType.Hero;
  heroClass: HeroClass;
  addonHitPoint: number;
  maxAddonHitPoint: number;
  maxItemValue: number;

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

  copy() {
    let hero = new Hero(this.id, this.name, this.image, this.hitPoint, this.equipment);
    hero = Object.assign(hero, this);
    hero = Object.assign(hero, super.copy());
    return hero;
  }

  setAddonHitPoints(value: number) {
    this.hitPoint += value - this.addonHitPoint;
    this.maxHitPoint += value - this.addonHitPoint;
    this.addonHitPoint = value;
  }
}
