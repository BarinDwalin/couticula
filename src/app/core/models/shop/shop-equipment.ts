import { ItemType } from '@enums';
import { ShopItem } from './shop-item';

export interface ShopEquipment {
  itemType: ItemType;
  name: string;
  img: string;
  items: ShopItem[];
}
