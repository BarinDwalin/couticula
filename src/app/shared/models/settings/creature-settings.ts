import { AbilityType, EffectType } from '@enums';
import { Item } from '../items';

export interface CreatureSettings {
  name: string;
  description: string;
  img: string;
  hitPoint: number;
  maxAddonHitPoint: number;
  weapon: number;
  head: number;
  hands: number;
  legs: number;
  body: number;
  inventory: Item[];
  abilites: AbilityType[];
  effects: EffectType[];
}
