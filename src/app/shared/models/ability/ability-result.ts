import { DiceTarget } from '@enums';
import { CreatureView } from '../creature-view';

export interface AbilityResult {
  targetCreatureBefore: CreatureView;
  targetCreatureAfter: CreatureView;
  diceTarget: DiceTarget;
  diceValue: number;
  value: number;
  isAddonAction?: boolean;
}
