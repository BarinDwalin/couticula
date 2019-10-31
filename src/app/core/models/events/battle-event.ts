import { AbilityType, BattleState } from '@enums';
import { AbilityResult, AbilityResultError } from '../ability';
import { CharactersStateDelta } from '../character-state-delta';
import { CreatureView } from '../creature-view';
import { EffectResult } from '../effect';

export interface BattleEvent {
  state: BattleState;
  round?: number;
  updatedCharacters?: CharactersStateDelta[];
  currentCreatureId?: number;
  currentCreature?: CreatureView;
  currentTargetForMonsters?: number;
  ability?: AbilityType;
  abilityResult?: AbilityResult | AbilityResultError;
  effectsResult?: EffectResult;
  target?: number;
}
