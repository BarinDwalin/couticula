import { DiceTarget } from '@enums';
import { CharactersStateDelta } from '../character-state-delta';

export interface AbilityResult extends CharactersStateDelta {
  diceTarget: DiceTarget;
  diceValue: number;
  value: number;
  isAddonAction?: boolean;
}
