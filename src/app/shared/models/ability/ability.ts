import { AbilityType } from '@enums';
import { Creature } from '../creature';
import { AbilitySettings } from '../settings';
import { AbilityResult } from './ability-result';
import { AbilityResultError } from './ability-result-error';

export class Ability {
  type: AbilityType;
  name: string;
  description: string;
  ability: (
    currentCreature: Creature,
    targetCreature: Creature
  ) => AbilityResult | AbilityResultError;
  image: string;
  // cost: number;
  maxUseCount: number;
  isImmediateAction: boolean;
  isAddonAction: boolean;
  countTarget: number;
  combo?: AbilityType[];

  constructor(
    settings: AbilitySettings,
    abilityFunction: (
      currentCreature: Creature,
      targetCreature: Creature
    ) => AbilityResult | AbilityResultError
  ) {
    this.type = settings.type;
    this.name = settings.name;
    this.description = settings.description;
    this.image = settings.image;
    this.isImmediateAction = settings.isImmediateAction || false;
    this.isAddonAction = settings.isAddonAction || false;
    this.maxUseCount = settings.maxUseCount || null;
    this.countTarget = settings.countTarget || 1;
    this.combo = settings.combo || null;
    this.ability = abilityFunction;
  }
}
