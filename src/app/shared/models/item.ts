import { IHero, IItem,
  AbilityType, HeroClass, ItemType
} from '@interfaces';
import { Items } from '@shared/db';
import { Shield } from './shield';

export class Item /*implements IItem*/ {
  public name: string;
  public description: string;
  public type: ItemType;
  public img: string;
  private _value: number;
  get value(): number {
    return this._value;
  }
  set value(val: number) {
    if (val >= 0 && val <= 6 || this.type === ItemType.Gold) {
        this._value = val;
    }
  }
  constructor(type: ItemType, value: number, name: string, img: string, description: string = "") {
    this.name = name;
    this.type = type;
    this.value = value;
    this.img = img;
    this.description = description;
  }
  static createItem(type: ItemType, value: number, hitPoints: number = 0): Item {
    let itemInfo = Items.find(p => p.type === type);
    if (type === ItemType.Shield)
      return new Shield(value, hitPoints, itemInfo.name, itemInfo.img);
    else {
      return new Item(type, value, itemInfo.name, itemInfo.img);
    }
  }
  public copy() {
    return new Item(this.type, this.value, this.name, this.img, this.description);
  }

    /*public static createRandomEquipment(): Item {
        var type: ItemType;
        var name: string;
        var value: number = Helpers.throwDice(6);
        var image: ImageType;
        var randomNum = Helpers.throwDice(6);
        switch (randomNum) {
            case 1: type = ItemType.Head; name = "Шлем"; image = ImageType.DiceHead;// TODO: вернуть иконки image = ImageType.BlackIcon;
                break;
            case 2: type = ItemType.Hands; name = "Наручи"; image = ImageType.DiceHands;//  image = ImageType.BlackIcon;
                break;
            case 3: type = ItemType.Legs; name = "Поножи"; image = ImageType.DiceLegs;//  image = ImageType.BlackIcon;
                break;
            case 4: type = ItemType.Body; name = "Доспех"; image = ImageType.DiceBody;//  image = ImageType.BlackIcon;
                break;
            case 5: type = ItemType.Weapon; name = "Оружие"; image = ImageType.DubinaOldJew;
                break;
            case 6:
                var shieldType = Helpers.throwDice(3);
                return new Shield(value, 2 * shieldType, "Щит", (shieldType === 1 ? ImageType.ShieldWeak : (shieldType === 1 ? ImageType.ShieldMedium : ImageType.ShieldStrong)));
        }
        return new Item(name, type, value, image);
    }

    public static createRandomBottle(): Item {
        var type: ItemType;
        var name: string;
        var description: string;
        var image: ImageType;
        var randomNum = Helpers.throwDice(6);
        switch (randomNum) {
            case 1:
            case 2:
            case 3: type = ItemType.BottleOfHeal; name = listAbilities[AbilityType.HeroUseBottleOfHeal].name; description = listAbilities[AbilityType.HeroUseBottleOfHeal].description; image = ImageType.BottleOfHeal;
                break;
            case 4:
            case 5: type = ItemType.BottleOfStan; name = listAbilities[AbilityType.HeroUseBottleOfStan].name; description = listAbilities[AbilityType.HeroUseBottleOfStan].description; image = ImageType.BottleOfStan;
                break;
            case 6: type = ItemType.BottleOfPoison; name = listAbilities[AbilityType.HeroUseBottleOfPoison].name; description = listAbilities[AbilityType.HeroUseBottleOfPoison].description; image = ImageType.BottleOfPoison;
                break;
        }
        return new Item(name, type, null, image, description);
    }
    public static createRandomGoldBag(): Item {
        var gold: number;
        var name: string;
        var description: string;
        var sizeBag = Helpers.throwDice(6);
        switch (sizeBag) {
            case 1:
            case 2:
            case 3: gold = 100 * Helpers.throwDice(6); name = "Гроши";
                break;
            case 4:
            case 5: gold = 200 * Helpers.throwDice(6); name = "Мошна";
                break;
            case 6: gold = 300 * Helpers.throwDice(6); name = "Кошель";
                break;
        }
        return new Item(name, ItemType.Gold, gold, ImageType.Gold, description);
    }*/
}
