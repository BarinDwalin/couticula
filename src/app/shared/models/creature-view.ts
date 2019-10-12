import { CreatureState, DiceTarget } from '@enums';

import { Ability } from './ability';
import { CreatureEquipment } from './creature-equipment';
import { Effect } from './effect';
import { Item } from './items';

export interface CreatureView {
  id: number;
  name: string;
  description;
  image: string;
  hitPoint;
  maxHitPoint;
  state: CreatureState;
  availableAbilities: Ability[]; // способности существа, доступные во время боя
  // usedInThisBattleAbilities: Map<AbilityType, number>; // способности существа, примененные в этом раунде
  // usedInThisRoundAbilities: AbilityType[]; // способности существа, примененные в этом бою
  currentEffects: Effect[]; // эффекты на существе во время боя
  equipment: CreatureEquipment;
  inventory: Item[];
  lastDiceValue: number;
  lastDiceTarget: DiceTarget;
  lastTargetInBattle: number;
}
