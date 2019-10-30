import { Injectable } from '@angular/core';

import { CreatureState } from '@enums';
import { Creature, Statistic } from '@models';

import { StorageService } from './storage.service';

import { CreaturesBoss, CreaturesLevel1, CreaturesLevel2 } from '@shared/db';

@Injectable()
export class StatisticService {
  public allStatistics: Statistic[] = [];

  constructor(private storageService: StorageService) {
    this.initStatistics();
  }

  private async initStatistics() {
    let allStatisticsStore: Statistic[] = await this.storageService.getStatistic('All Statistics');
    if (allStatisticsStore === null) {
      allStatisticsStore = [];
    }
    CreaturesBoss.concat(CreaturesLevel1, CreaturesLevel2)
      .map(creature => creature.name)
      .forEach(currentCreature => {
        const stat = allStatisticsStore.find(
          currentStatistic => currentStatistic.creatureName === currentCreature
        );

        if (!stat) {
          this.allStatistics.push(new Statistic(currentCreature, 0));
        } else {
          this.allStatistics.push(stat);
        }
      });
  }

  updateStatistic(monsters: Creature[]) {
    const numOfCreatures = new Map<string, number>();
    monsters.forEach(creature => {
      if (
        creature.state === CreatureState.Dead ||
        creature.state === CreatureState.DeadInThisTurn
      ) {
        if (!numOfCreatures.has(creature.name)) {
          numOfCreatures.set(creature.name, 1);
        } else {
          numOfCreatures.set(creature.name, numOfCreatures.get(creature.name) + 1);
        }
      }
    });

    numOfCreatures.forEach((killsOfCreature, creatureName) => {
      this.increaseKilledCounter(creatureName, killsOfCreature);
    });

    this.storageService.storeValue('All Statistics', this.allStatistics);
  }

  increaseKilledCounter(currentCreature: string, currentKills: number) {
    const index = this.allStatistics.findIndex(
      curCreat => curCreat.creatureName === currentCreature
    );
    if (index !== -1) {
      this.allStatistics[index].kills = this.allStatistics[index].kills + currentKills;
    }
  }
}
