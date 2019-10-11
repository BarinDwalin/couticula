import { EffectType } from '@enums';

export interface EffectSettings {
  name: string;
  description: string;
  image: string;
  effectType: EffectType;
  isAttackActivation: boolean;
  isNewRoundActivation: boolean;
}
