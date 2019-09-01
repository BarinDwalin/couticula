import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Item } from '@models';

import { SettingsService } from './settings.service';

@Injectable()
export class PlayerService {
  gold$: Observable<number>;

  private playerGold: number;
  private playerGoldSource: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private heroesInventory: Item[] = [];

  get gold() {
    return this.playerGold;
  }
  get inventory() {
    return this.heroesInventory;
  }

  constructor(private settingsService: SettingsService) {
    this.gold$ = this.playerGoldSource.asObservable();
    this.playerGold = this.settingsService.startGold;
    this.playerGoldSource.next(this.settingsService.startGold);
  }
  increaseGold(value: number): Promise<boolean> {
    return new Promise(resolve => {
      this.playerGold += value;
      this.playerGoldSource.next(this.playerGold);
      resolve(true);
    });
  }
  decreaseGold(value: number): Promise<boolean> {
    return new Promise(resolve => {
      if (value > this.playerGold) {
        resolve(false);
      } else {
        this.playerGold -= value;
        this.playerGoldSource.next(this.playerGold);
        resolve(true);
      }
    });
  }
  addonInventory(item: Item) {
    this.inventory.push(item);
  }

  lossGold(value: number) {
    const lostGold = value < this.playerGold ? this.playerGold : value;

    this.playerGold -= lostGold;
    this.playerGoldSource.next(this.playerGold);
    return lostGold;
  }
}
