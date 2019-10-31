import { AbilityType } from '@enums';
import { AbilitySettings } from '@models';

export const MonsterAbilities: AbilitySettings[] = [
  {
    type: AbilityType.MonsterBasicAttack,
    name: 'Базовая атака',
    description: 'Атака противника на X("бросок" + оружие)',
    image: 'assets/img/abilities/basic-attack.jpg',
    cost: 0,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    type: AbilityType.MonsterBasicAttackTwoTargets,
    name: 'Атака по двум целям',
    description: 'Атака двух противников на X("бросок" + оружие)',
    image: 'assets/img/abilities/basic-attack-two-targets.jpg',
    cost: 0,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 2,
  },
];
