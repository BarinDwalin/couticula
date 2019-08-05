import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { ItemType } from '@enums';
import { Hero, Item, ShopEquipmentHitpoints } from '@models';
import { HeroService, PlayerService, ShopService } from '@services';

@Component({
  selector: 'equipment',
  templateUrl: 'equipment.component.html',
  animations: [
    trigger('flyInOutLeft', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [style({ transform: 'translateX(-100%)' }), animate(600)]),
    ]),
    trigger('flyInOutRight', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [style({ transform: 'translateX(100%)' }), animate(600)]),
    ]),
  ],
})
export class EquipmentComponent implements OnInit, OnDestroy {
  shopEquipment: ShopEquipmentHitpoints;
  itemValues = [1, 2, 3, 4, 5, 6].map(value => ({ value, color: Item.getItemColor(value) }));

  private subscriptions: Subscription[] = [];

  get choosenHero(): Hero {
    return this.shopService.choosenHero;
  }
  get equipment() {
    return this.shopEquipment.equipment;
  }
  get playerGold() {
    return this.playerService.gold;
  }

  constructor(
    public navCtrl: NavController,
    private heroService: HeroService,
    private playerService: PlayerService,
    private shopService: ShopService
  ) {
    // Id is 1, nav refers to Tab1
    console.log(this.navCtrl.id);
  }

  ngOnInit() {
    const that = this;
    this.subscriptions.push(
      this.shopService.getShopEquipment().subscribe(shopEquipment => {
        this.shopEquipment = shopEquipment;
        this.shopEquipment.equipment.forEach(listItems => {
          listItems.items.forEach(item => {
            (item as any).countExists = (): number => {
              const countInInventory = that.playerService.inventory.filter(
                i => i.type === listItems.itemType && i.value === item.value
              ).length;
              const countInEquipment = that.heroService.heroes.reduce((sum, hero) => {
                return (
                  sum +
                  hero.equipment.items.filter(
                    i => i.type === listItems.itemType && i.value === item.value
                  ).length
                );
              }, 0);
              return countInInventory + countInEquipment;
            };
          });
        });
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  isSelectedItem(itemType: ItemType, value: number) {
    return (
      this.shopService.choosenItem &&
      this.shopService.choosenItem.itemType === itemType &&
      this.shopService.choosenItem.item.value === value
    );
  }
  isSelectedHitpoints(value: number) {
    return this.shopService.choosenHitpoints && this.shopService.choosenHitpoints.value === value;
  }
  selectItem(itemType: ItemType, item: { value: number; cost: number }) {
    this.shopService.selectItem(itemType, item);
  }
  selectHitpoints(item: { value: number; cost: number }) {
    this.shopService.selectHitpoints(item);
  }
}
