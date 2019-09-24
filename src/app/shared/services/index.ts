import { BattleStateService } from './battle-state.service';
import { BattleService } from './battle.service';
import { EventSearchService } from './event-search.service';
import { GameService } from './game.service';
import { HeroService } from './hero.service';
import { MapService } from './map.service';
import { PlayerService } from './player.service';
import { RandomService } from './random.service';
import { SettingsService } from './settings.service';
import { ShopService } from './shop.service';
import { TreasureService } from './treasure.service';

const SHARED_SERVICES: any[] = [
  BattleService,
  BattleStateService,
  EventSearchService,
  GameService,
  MapService,
  PlayerService,
  RandomService,
  SettingsService,
  ShopService,
  TreasureService,
];

export {
  SHARED_SERVICES,
  BattleService,
  BattleStateService,
  EventSearchService,
  GameService,
  HeroService,
  MapService,
  PlayerService,
  RandomService,
  SettingsService,
  ShopService,
  TreasureService,
};
