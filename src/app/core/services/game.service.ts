import { Injectable } from '@angular/core';

import {
  AbilityFabric,
  CreatureFabric,
  EffectFabric,
  EnemyGroupFabric,
  ItemFabric,
} from '@fabrics';
import { MapService } from './map.service';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private mapService: MapService, private randomService: RandomService) {}

  startGame() {
    this.initializeFabrics();
    return this.mapService.createMap();
  }

  private initializeFabrics() {
    AbilityFabric.initialize(this.randomService);
    CreatureFabric.initialize(this.randomService);
    EffectFabric.initialize(this.randomService);
    EnemyGroupFabric.initialize(this.randomService);
    ItemFabric.initialize(this.randomService);
  }
}
