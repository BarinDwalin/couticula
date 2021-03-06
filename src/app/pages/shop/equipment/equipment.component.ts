import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ItemType } from '@enums';
import { Hero, Item, ShopEquipmentHitpoints } from '@models';
import { HeroService, PlayerService, ShopService } from '@services';

@Component({
  selector: 'equipment',
  templateUrl: 'equipment.component.html',
  styleUrls: ['equipment.component.scss'],
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
  playerGold: number;

  get choosenHero(): Hero {
    return this.shopService.choosenHero;
  }
  get equipment() {
    return this.shopEquipment.equipment;
  }

  private unsubscribe$ = new Subject();

  constructor(
    public navCtrl: NavController,
    private heroService: HeroService,
    private playerService: PlayerService,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.playerService.gold$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(gold => (this.playerGold = gold));

    this.shopService
      .getShopEquipment()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(shopEquipment => {
        this.shopEquipment = shopEquipment;
        this.calcInventoryItems();
      });
    this.shopService.isEquimentChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.calcInventoryItems());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private calcInventoryItems() {
    this.shopEquipment.equipment.forEach(listItems => {
      listItems.items.forEach(item => {
        item.availableCount = this.getAvailableItemsCount(listItems.itemType, item.value);
      });
    });
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

  private getAvailableItemsCount(itemType: ItemType, itemValue: number) {
    return this.heroService.heroes.reduce((sum, hero) => {
      const inventoryItemsCount = hero.inventory.filter(
        item => item.type === itemType && item.value === itemValue
      ).length;
      const equipmentItemsCount = hero.equipment.items.filter(
        item => item.type === itemType && item.value === itemValue
      ).length;
      return sum + inventoryItemsCount + equipmentItemsCount;
    }, 0);
  }
}
