import { AbilityType, ItemType } from '@enums';
import { Item } from './item';

type BottleType = ItemType.BottleOfHeal | ItemType.BottleOfPoison | ItemType.BottleOfStan;

export class Bottle extends Item {
  readonly type: BottleType;
  abilityType: AbilityType;

  static getBottleTypes(): BottleType[] {
    return [ItemType.BottleOfHeal, ItemType.BottleOfPoison, ItemType.BottleOfStan];
  }

  private static getAbilityTypeOfBottle(itemType: BottleType) {
    switch (itemType) {
      case ItemType.BottleOfHeal:
        return AbilityType.HeroUseBottleOfHeal;
      case ItemType.BottleOfPoison:
        return AbilityType.HeroUseBottleOfPoison;
      case ItemType.BottleOfStan:
        return AbilityType.HeroUseBottleOfStan;
    }
  }

  constructor(type: BottleType, value: number, name: string, image: string, description = '') {
    super(type, value, name, image, description);
    this.abilityType = Bottle.getAbilityTypeOfBottle(type);
  }
}
