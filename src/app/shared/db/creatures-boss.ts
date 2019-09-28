import { AbilityType, EffectType } from '@enums';
import { CreatureSettings, Item } from '@models';

export const CreaturesBoss: CreatureSettings[] = [
  {
    name: 'Двухголовая гидра',
    img: 'assets/img/monsters/boss.svg',
    hitPoint: 220,
    maxAddonHitPoint: 0,
    weapon: 4,
    head: 0,
    hands: 0,
    legs: 0,
    body: 0,
    description: `Регенерация 5. В начале хода возрождает змея. Атакует двоих.`,
    inventory: [],
    abilites: [AbilityType.MonsterBasicAttackTwoTargets],
    effects: [EffectType.Regeneration5, EffectType.RebirthSerpent],
  },
];
