import { ItemType } from '@enums';

export class Item {
  readonly type: ItemType;
  name: string;
  description: string;
  img: string;

  private _value: number;
  get value(): number {
    return this._value;
  }
  set value(val: number) {
    if ((val >= 0 && val <= 6) || this.type === ItemType.Gold) {
      this._value = val;
    }
  }

  static checkItemTypeOnEquipment(type: ItemType) {
    return (
      [
        ItemType.Weapon,
        ItemType.Head,
        ItemType.Hands,
        ItemType.Legs,
        ItemType.Body,
        ItemType.Shield,
      ].indexOf(type) !== -1
    );
  }

  static getItemColor(value: number) {
    switch (value) {
      case 6:
        return 'orangered';
      case 5:
        return 'orange';
      case 4:
      case 3:
        return 'lightskyblue';
      default:
        return 'white';
    }
  }

  static getItemTypeImage(itemType: ItemType) {
    const imageName = Item.getItemTypeImageName(itemType);
    return `assets/img/items/${imageName}.jpg`;
  }
  private static getItemTypeImageName(itemType: ItemType) {
    switch (itemType) {
      case ItemType.Body:
        return 'body';
      case ItemType.Hands:
        return 'hands';
      case ItemType.Head:
        return 'head';
      case ItemType.Legs:
        return 'legs';
      case ItemType.Weapon:
        return 'weapon';
      case ItemType.Shield:
        return 'shield';
      default:
        return 'black';
    }
  }

  constructor(type: ItemType, value: number, name: string, img: string, description = '') {
    this.name = name;
    this.type = type;
    this.value = value;
    this.img = img;
    this.description = description;
  }

  copy() {
    return new Item(this.type, this.value, this.name, this.img, this.description);
  }
}
