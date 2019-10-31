import { AbilityType } from '@enums';
import { AbilitySettings } from '@models';

export const HeroBasicAbilities: AbilitySettings[] = [
  {
    type: AbilityType.HeroBasicAttack,
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
    type: AbilityType.HeroBasicHeal,
    name: 'Базовое лечение',
    description: 'Лечение союзника на X("бросок" + оружие)',
    image: 'assets/img/abilities/basic-heal.jpg',
    cost: 0,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    type: AbilityType.HeroDoubleSimpleAttack,
    name: 'Двойная атака по цели',
    description: 'Атака противника на X("бросок" + оружие) дважды',
    image: 'assets/img/abilities/double-basic-attack.jpg',
    cost: 0,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
];
