import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { GameMode, RollType } from '@enums';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  autoWin = false;
  apiUrl = '/api';
  gameMode: GameMode = GameMode.Hard;
  countCellVisibleX = 9;
  countCellVisibleY = 5;
  priceSecondHero = 800;
  priceThirdHero = 1000;
  eventsDelay = 600;
  battleEventsDelay = 500;
  battleDiceDelay = 1000;
  rollType: RollType = RollType.random;

  private platformWidth: number;
  private platformHeight: number;
  private headerCoefficient = 0.1; // доля карты, выделенная под меню

  get startGold() {
    return this.gameMode === GameMode.Easy ? 1500 : 4000;
  }

  constructor(platform: Platform) {
    platform.ready().then(readySource => {
      this.platformWidth = platform.width();
      this.platformHeight = platform.height();
      this.calcFieldSize();
    });
  }

  private calcFieldSize() {
    const fieldSizeWithoutMenu = this.platformHeight * (1 - this.headerCoefficient);
    const proportion = this.platformWidth / fieldSizeWithoutMenu;
    this.countCellVisibleX = Math.floor(this.countCellVisibleY * proportion);
  }
}
