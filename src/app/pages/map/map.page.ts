import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'page-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
})
export class MapPage {
  constructor(private router: Router) {}

  openShop() {
    this.router.navigateByUrl('/shop');
  }
  openInventory() {
    this.router.navigateByUrl('/inventory');
  }
  openStatistic() {
    this.router.navigateByUrl('/statistic');
  }
  openSettings() {
    this.router.navigateByUrl('/settings');
  }
}
