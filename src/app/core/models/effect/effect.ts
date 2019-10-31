import { EffectType } from '@enums';
import { Creature } from '../creature';
import { EffectSettings } from '../settings';

export class Effect implements EffectSettings {
  name: string;
  description: string;
  image: string;
  effectType: EffectType;
  isAttackActivation: boolean;
  isNewRoundActivation: boolean;

  action: (creature: Creature) => void;

  static checkEffectTypeOnСombat(type: EffectType) {
    return [EffectType.BreakingChests, EffectType.ForceBreakingChests].indexOf(type) === -1;
  }

  constructor(settings: EffectSettings, actionFunction: (currentCreature: Creature) => void) {
    this.effectType = settings.effectType;
    this.name = settings.name;
    this.description = settings.description;
    this.image = settings.image;
    this.isAttackActivation = settings.isAttackActivation;
    this.isNewRoundActivation = settings.isNewRoundActivation;
    this.action = actionFunction;
  }
}
