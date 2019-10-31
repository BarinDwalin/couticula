import { Items } from '@db';
import { ItemType } from '@enums';
import { Bottle, Item, Shield } from '@models';
import { RandomService } from '@services';

export class ItemFabric {
  private static randomService: RandomService;

  static initialize(randomService: RandomService) {
    ItemFabric.randomService = randomService;
  }

  static createItem(
    type: ItemType,
    value: number,
    options?: {
      name?: string;
      image?: string;
      hitPoints?: number;
    }
  ): Item {
    return this.createEquipment(type, value, options);
  }

  static createEquipment(
    type: ItemType,
    value: number,
    options: {
      name?: string;
      image?: string;
      hitPoints?: number;
    } = {}
  ): Item {
    const itemInfo = Items.find(p => p.type === type);
    if (type === ItemType.Shield) {
      return new Shield(
        value,
        options.hitPoints,
        options.name || itemInfo.name,
        options.image || itemInfo.img
      );
    } else {
      return new Item(type, value, options.name || itemInfo.name, options.image || itemInfo.img);
    }
  }

  static createBottle(type: ItemType): Bottle {
    const itemInfo = Items.find(p => p.type === type);
    switch (type) {
      case ItemType.BottleOfHeal:
        return new Bottle(type, name, itemInfo.name, itemInfo.img, 'TODO:');
      case ItemType.BottleOfStan:
        return new Bottle(type, name, itemInfo.name, itemInfo.img, 'TODO:');
      case ItemType.BottleOfPoison:
        return new Bottle(type, name, itemInfo.name, itemInfo.img, 'TODO:');
    }
  }

  static createRandomBottle(): Bottle {
    const randomNum = ItemFabric.randomService.rollDiceD6();
    switch (randomNum) {
      case 1:
      case 2:
      case 3:
        return ItemFabric.createBottle(ItemType.BottleOfHeal);
      case 4:
      case 5:
        return ItemFabric.createBottle(ItemType.BottleOfStan);
      case 6:
        return ItemFabric.createBottle(ItemType.BottleOfPoison);
    }
  }

  static createRandomEquipment(): Item {
    let item: Item;
    const value: number = ItemFabric.randomService.rollDiceD6();
    const randomNum = ItemFabric.randomService.rollDiceD6();
    switch (randomNum) {
      case 1:
        item = ItemFabric.createEquipment(ItemType.Head, value);
        item.name = 'Шлем';
        break;
      case 2:
        item = ItemFabric.createEquipment(ItemType.Hands, value);
        item.name = 'Наручи';
        break;
      case 3:
        item = ItemFabric.createEquipment(ItemType.Legs, value);
        item.name = 'Поножи';
        break;
      case 4:
        item = ItemFabric.createEquipment(ItemType.Body, value);
        item.name = 'Доспех';
        break;
      case 5:
        item = ItemFabric.createEquipment(ItemType.Weapon, value);
        item.name = 'Оружие';
        break;
      case 6:
        item = ItemFabric.createRandomShield(value);
        break;
    }
    return item;
  }

  static createRandomGoldBag(): Item {
    const sizeBag = ItemFabric.randomService.rollDiceD6();
    const value = ItemFabric.randomService.rollDiceD6();
    const itemInfo = Items.find(p => p.type === ItemType.Gold);
    let gold: number;
    let name: string;
    switch (sizeBag) {
      case 1:
      case 2:
      case 3:
        gold = 100 * value;
        name = 'Гроши';
        break;
      case 4:
      case 5:
        gold = 200 * value;
        name = 'Мошна';
        break;
      case 6:
        gold = 300 * value;
        name = 'Кошель';
        break;
    }
    return new Item(ItemType.Gold, gold, name, itemInfo.img);
  }

  private static createRandomShield(value: number) {
    const shieldHitPoints = ItemFabric.randomService.rollDiceD6();
    const item = ItemFabric.createShield(value, shieldHitPoints);
    return item;
  }

  static createShield(value: number, hitPoints: number): Shield {
    let name = '';
    let image = '';
    switch (hitPoints) {
      case 1:
      case 2:
        name = 'Разбитый щит';
        image = 'assets/img/items/shield-weak.jpg';
        break;
      case 3:
      case 4:
        name = 'Стойкий щит';
        image = 'assets/img/items/shield-medium.jpg';
        break;
      case 5:
      case 6:
        name = 'Прочный щит';
        image = 'assets/img/items/shield-strong.jpg';
        break;
    }

    const item = ItemFabric.createEquipment(ItemType.Shield, value, {
      hitPoints,
      name,
      image,
    }) as Shield;
    return item;
  }
}
