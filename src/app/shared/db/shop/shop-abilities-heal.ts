import { AbilityType } from '@app/shared/enums';
import { AbilitySettings } from '@app/shared/models';

export const ShopAbilitiesHeal: AbilitySettings[] = [
  {
    type: AbilityType.HeroHealAfterBattle,
    name: 'Мгновенное лечение',
    description: 'Лечение на 7 (вне боя)',
    image: 'assets/img/abilities/heal-after-battle.jpg',
    cost: 100,
    maxUseCount: null,
    isImmediateAction: true,
    isAddonAction: false,
    countTarget: null,
  },
  {
    type: AbilityType.HeroHealPoison,
    name: 'Лечение от яда',
    description: 'Снимает эффект отравления',
    image: 'assets/img/abilities/heal-poison.jpg',
    cost: 500,
    maxUseCount: null,
    isImmediateAction: true,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    type: AbilityType.HeroHealWeak,
    name: 'Слабое лечение',
    description: 'Лечение на 5',
    image: 'assets/img/abilities/heal-weak.jpg',
    cost: 300,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    type: AbilityType.HeroHealMedium,
    name: 'Среднее лечение',
    description: 'Лечение на 15 (1 раз за бой)',
    image: 'assets/img/abilities/heal-medium.jpg',
    cost: 500,
    maxUseCount: 1,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    type: AbilityType.HeroHealStrong,
    name: 'Сильное лечение',
    description: 'Лечение на 20 (2 раза за бой)',
    image: 'assets/img/abilities/heal-medium.jpg',
    cost: 800,
    maxUseCount: 2,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    type: AbilityType.HeroHealWithAllies,
    name: 'Совместное лечение',
    description: 'При лечении союзников лечит себя на 4',
    image: 'assets/img/abilities/heal-with-allies.jpg',
    cost: 400,
    maxUseCount: null,
    isImmediateAction: true,
    isPassiveAction: true,
    isAddonAction: false,
    countTarget: null,
  },
];
