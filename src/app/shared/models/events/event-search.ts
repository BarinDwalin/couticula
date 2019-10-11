import { SearchEventType } from '@enums';

export interface SearchEvent {
  type: SearchEventType;
  text: string;
  dice?: number;
}
