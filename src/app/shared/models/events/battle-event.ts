import { AbilityType, BattleState } from '@enums';
import { AbilityResult, AbilityResultError } from '../ability';
import { CreatureView } from '../creature-view';

export interface BattleEvent {
  state: BattleState;
  round?: number;
  currentCreatureId?: number;
  currentCreature?: CreatureView;
  currentTargetForMonsters?: number;
  ability?: AbilityType;
  abilityResult?: AbilityResult | AbilityResultError;
  target?: number;
}
