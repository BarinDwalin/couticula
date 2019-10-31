import { HeroClass } from '@enums';
import { CreatureSettings } from './creature-settings';

export interface HeroSettings extends CreatureSettings {
  heroClass: HeroClass;
  maxAddonHitPoint: number;
  maxArmorValue: number;
  maxWeaponValue: number;
}
