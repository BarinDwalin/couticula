import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HeroClass, ItemType } from '@enums';
import { Hero, HeroSettings, Item, Shield } from '@models';
import { HeroTypes } from '@shared/db';
import { HeroFabric } from '@shared/fabrics';

import { HttpService } from './http.service';
import { PlayerService } from './player.service';
//import { ShopService } from './shop.service';

@Injectable()
export class HeroService {
  heroes: Hero[];

  constructor(
    //private httpService: HttpService,
    private playerService: PlayerService
  ){
    this.heroes = [];
    //this.getHeroes().then(heroes => this.heroes = heroes.map(hero => new Hero(hero)));
    // обновлен список героев
    /*this.shopService.newHero.subscribe(() => {
      this.httpService.get('playerHeroes')
      .then(heroes => {
        this.heroes = heroes.map(hero => Hero.createHero(hero));
      });
    });*/
  }
  addNewHero(heroClass: HeroClass): Promise<any> {
    return new Promise(resolve => {
      const newHero: Hero = HeroFabric.createHero(heroClass);
      //newHero.uniqueAbilities = heroInfo.uniqueAbilities;
      this.heroes.push(newHero);
      resolve();
    });
  }
  getAllHeroClassesDescription(): Observable<HeroSettings[]> {
    return of(HeroTypes as HeroSettings[]);
  }
  equipItem(heroID: number, item: Item): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      let hero = this.heroes.find(p => p.id === heroID);
      if (hero.maxItemValue < item.value)
        resolve(false); // предмет не подходит
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
            //this.dropEffect(EffectType.Shield);
          }
          hero.equipment.Shield = item as Shield;
          //this.effects.push(new Effect("Щит", "Постоянное действие. Щит, броня " + item.value + ", прочность " + (item as Shield).hitpoint, ImageType.ShieldMedium, EffectType.Shield));
          break;
      }
      if (oldItem.value !== 0) {
        this.playerService.addonInventory(oldItem);
      }
      resolve(true);
    });
  }
}
