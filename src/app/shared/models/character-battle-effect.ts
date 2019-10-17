import { Effect } from './effect';

export interface CharacterBattleEffect {
  animationTime: number;
  characterId: number;
  diffHitpoints: number;
  addonEffects: Effect[];
  removedEffects: Effect[];
}
