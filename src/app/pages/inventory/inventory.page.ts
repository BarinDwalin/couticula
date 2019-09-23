import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Hero, Item } from '@models';
import { HeroService } from '@services';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPage {
  selectedHero: Hero;

  get heroEquipment() {
    return this.selectedHero.equipment.items;
  }
  get heroInventory() {
    return this.selectedHero.inventory;
  }
  get heroes() {
    return this.heroService.heroes;
  }
  get heroClassName() {
    return Hero.getHeroClassName(this.selectedHero.heroClass);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private heroService: HeroService,
    public navCtrl: NavController
  ) {
    this.selectedHero = this.heroes[0];
  }

  choseHero(hero: Hero) {
    this.selectedHero = hero;
    this.cd.markForCheck();
  }

  close() {
    this.navCtrl.pop();
  }

  getItemTypeImage(item: Item) {
    return Item.getItemTypeImage(item.type);
  }

  equipItem(item: Item) {
    this.heroService.equipItem(this.selectedHero.id, item);
  }
}
