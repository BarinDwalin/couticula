import { AbilityType, EffectType } from '@enums';
import { CreatureSettings, Item } from '@models';

export const CreaturesLevel1: CreatureSettings[] = [
  {
    name: 'Виверна',
    img: 'assets/img/monsters/level-1.svg',
    hitPoint: 35,
    maxAddonHitPoint: 0,
    weapon: 4,
    head: 2,
    hands: 3,
    legs: 3,
    body: 0,
    description: 'Яд 1, шанс 1d6',
    inventory: [],
    abilites: [AbilityType.MonsterBasicAttack],
    effects: [EffectType.AttackWithPoisonWeak1],
  },
];
