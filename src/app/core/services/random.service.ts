import { Injectable } from '@angular/core';
import { RollType } from '@enums';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class RandomService {
  predictedRolls: {
    tag: string;
    upcomingRolls: number[];
  }[] = [];

  constructor(private settingsService: SettingsService) {}

  rollDiceD6(eventTag?: string): number {
    if (this.settingsService.rollType === RollType.random) {
      return this.throwDiceD6();
    } else {
      return this.rollNormalizeDices(eventTag);
    }
  }

  rollNormalizeDices(tag: string): number {
    let index: number;
    index = this.predictedRolls.findIndex(a => a.tag === tag);
    if (index === -1) {
      this.predictedRolls.push({ tag: tag, upcomingRolls: [] });
      index = this.predictedRolls.length - 1;
    }
    if (this.predictedRolls[index].upcomingRolls.length === 0) {
      this.generateRandomRolls(index);
    }
    return this.predictedRolls[index].upcomingRolls.pop();
  }

  generateRandomRolls(index: number): void {
    const d6: number[] = [1, 2, 3, 4, 5, 6];

    this.predictedRolls[index].upcomingRolls = d6.sort(function() {
      return 0.5 - Math.random();
    });
  }

  getFloat(min, max): number {
    return Math.random() * (max - min) + min;
  }

  getInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  throwDiceD3(): number {
    return this.getInt(1, 3);
  }

  private throwDiceD6(): number {
    return this.getInt(1, 6);
  }
}
