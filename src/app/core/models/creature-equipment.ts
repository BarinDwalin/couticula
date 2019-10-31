import { Item, Shield } from './items';

export class CreatureEquipment {
  Head: Item;
  Hands: Item;
  Legs: Item;
  Body: Item;
  Weapon: Item;
  Shield: Shield;
  get items(): Item[] {
    return [this.Head, this.Hands, this.Legs, this.Body, this.Weapon, this.Shield];
  }
}
