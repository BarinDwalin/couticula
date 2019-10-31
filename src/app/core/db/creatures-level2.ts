import { AbilityType, EffectType } from '@enums';
import { CreatureSettings, Item } from '@models';

export const CreaturesLevel2: CreatureSettings[] = [
  {
    name: 'Тролль',
    img: 'assets/img/monsters/level-2.svg',
    hitPoint: 200,
    maxAddonHitPoint: 0,
    weapon: 4,
    head: 0,
    hands: 3,
    legs: 0,
    body: 1,
    description: 'Игнорирует щиты',
    inventory: [],
    abilites: [AbilityType.MonsterBasicAttack],
    effects: [EffectType.AttackWithIgnoringShield],
  },
];
