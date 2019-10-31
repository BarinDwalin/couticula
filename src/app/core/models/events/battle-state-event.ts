import { BattleState } from '@enums';
import { AbilityResult } from '../ability';

export interface BattleStateEvent {
  state: BattleState;
  delay?: number;
  abilityResult?: AbilityResult;
}
