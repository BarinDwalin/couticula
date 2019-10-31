import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HeroTypes } from '@db';
import { HeroClass, ItemType } from '@enums';
import { Hero, HeroSettings, Item, Shield } from '@models';
import { CreatureFabric } from '@fabrics';

import { PlayerService } from './player.service';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  heroes: Hero[];

  constructor(private playerService: PlayerService, private randomService: RandomService) {
    this.heroes = [];
  }

  addNewHero(heroClass: HeroClass): Promise<any> {
    return new Promise(resolve => {
      const newHero: Hero = CreatureFabric.createHero(heroClass);
      this.heroes.push(newHero);
      resolve();
    });
  }

  getAllHeroClassesDescription(): Observable<HeroSettings[]> {
    return of(HeroTypes);
  }

  equipItem(heroID: number, item: Item): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const hero = this.heroes.find(p => p.id === heroID);
      if (item.type === ItemType.Gold) {
        this.playerService.increaseGold(item.value);
        this.removeItemFormInventory(hero, item);
        resolve(true);
      } else if (Item.checkItemTypeOnEquipment(item.type)) {
        const isEquipped = this.tryEquipItem(hero, item);
        resolve(isEquipped);
      } else if (item.type === ItemType.BottleOfHeal) {
        const isUsed = this.tryUseHealBottle(hero, item);
        resolve(isUsed);
      } else {
        resolve(false);
      }
    });
  }

  private tryEquipItem(hero: Hero, item: Item) {
    if (hero.maxItemValue < item.value) {
      // предмет не подходит
      return false;
    }
    let oldItem: Item;
    switch (item.type) {
      case ItemType.Weapon:
        oldItem = hero.equipment.Weapon;
        hero.equipment.Weapon = item;
        break;
      case ItemType.Head:
        oldItem = hero.equipment.Head;
        hero.equipment.Head = item;
        break;
      case ItemType.Hands:
        oldItem = hero.equipment.Hands;
        hero.equipment.Hands = item;
        break;
      case ItemType.Legs:
        oldItem = hero.equipment.Legs;
        hero.equipment.Legs = item;
        break;
      case ItemType.Body:
        oldItem = hero.equipment.Body;
        hero.equipment.Body = item;
        break;
      case ItemType.Shield:
        if (hero.equipment.Shield.value !== 0) {
          oldItem = hero.equipment.Shield;
          // this.dropEffect(EffectType.Shield);
        }
        hero.equipment.Shield = item as Shield;
        // this.effects.push(new Effect("Щит", "Постоянное действие. Щит, броня " + item.value + ", прочность " +
        // (item as Shield).hitpoint, ImageType.ShieldMedium, EffectType.Shield));
        break;
    }
    this.removeItemFormInventory(hero, item);
    if (oldItem && oldItem.value !== 0) {
      this.addItemToInventory(hero, oldItem);
    }
    return true;
  }

  private tryUseHealBottle(hero: Hero, item: Item) {
    const dice = this.randomService.rollDiceD6();
    const maxHealHitPoint = dice * 5;
    const healHitPoint = this.healHero(hero.id, maxHealHitPoint);

    if (healHitPoint > 0) {
      this.removeItemFormInventory(hero, item);
      return true;
    } else {
      return false;
    }
  }

  addItemToInventory(hero: Hero, item: Item) {
    hero.inventory.push(item);
  }
  removeItemFormInventory(hero: Hero, item: Item) {
    const index = hero.inventory.findIndex(value => value === item);
    if (index !== -1) {
      hero.inventory.splice(index, 1);
    }
  }

  healHero(heroId: number, healHitPoint: number) {
    const hero = this.heroes.find(p => p.id === heroId);
    if (hero.hitPoint + healHitPoint > hero.maxHitPoint) {
      healHitPoint = hero.maxHitPoint - hero.hitPoint;
    }
    hero.hitPoint += healHitPoint;
    return healHitPoint;
  }

  damageHero(heroId: number, damage: number) {
    const hero = this.heroes.find(p => p.id === heroId);
    if (hero.hitPoint < damage) {
      damage = hero.hitPoint - 1;
    }
    hero.hitPoint -= damage;
    return damage;
  }

  loseHeroThing(heroId: number) {
    const hero = this.heroes.find(p => p.id === heroId);
    if (hero.inventory.length > 0) {
      const index = this.randomService.getInt(0, hero.inventory.length - 1);
      const item = hero.inventory[index];
      this.removeItemFormInventory(hero, item);
      return item;
    } else {
      return null;
    }
  }
}
