import { CreatureView } from './creature-view';

export interface CharactersStateDelta {
  characterBefore: CreatureView;
  characterAfter: CreatureView;
}
