import { ShopPageType } from '@enums';
import { AbilitySettings } from '../';

export interface ShopAbilitiesPage {
  typePage: ShopPageType;
  title: string;
  abilities: AbilitySettings[];
}
