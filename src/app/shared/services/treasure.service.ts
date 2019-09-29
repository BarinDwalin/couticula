import { Injectable } from '@angular/core';

import { Cell, Item } from '@models';
import { ItemFabric } from '@shared/fabrics';
import { PlayerService } from './player.service';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class TreasureService {
  constructor(private playerService: PlayerService, private randomService: RandomService) {}

  generateTreasure(treasuresCount: number): Item[] {
    const newItems: Item[] = [];
    let item;

    // Число сокровищ не превышает 10!
    for (let i = 0; i < Math.min(10, treasuresCount) + 0 /*побольше для тестов*/; i++) {
      const dice = this.randomService.rollDiceD6();
      switch (dice) {
        case 1:
        case 2:
          item = ItemFabric.createRandomBottle();
          break;
        case 3:
        case 4:
          item = ItemFabric.createRandomEquipment();
          break;
        case 5:
        case 6:
          item = ItemFabric.createRandomGoldBag();
          break;
      }
      newItems.push(item);
    }
    return newItems;
  }

  calcTreasuresCountAfterBattle(cell: Cell) {
    const mostersCount =
      cell.mosterLevel1Count + cell.mosterLevel2Count + (cell.doesBossExists ? 1 : 0);
    const maxTreasuresCount =
      1 * cell.mosterLevel1Count + 2 * cell.mosterLevel2Count + 3 * (cell.doesBossExists ? 1 : 0);

    const treasuresCount = this.randomService.getInt(mostersCount, maxTreasuresCount);
    return treasuresCount;
  }
}
