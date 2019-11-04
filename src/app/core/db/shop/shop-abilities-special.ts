import { AbilityType, HeroClass } from '@enums';
import { AbilitySettings } from '@models';

export const ShopAbilitiesSpecial: AbilitySettings[] = [
  {
    heroClass: HeroClass.Warrior,
    type: AbilityType.HeroThrowAxe,
    name: 'Метание топора',
    description: 'Атака противника на 4 + "бросок", 1 раз в ход (2 раза за бой)',
    image: 'assets/img/abilities/throw-axe.jpg',
    cost: 500,
    maxUseCount: 2,
    isImmediateAction: false,
    isAddonAction: true,
    countTarget: 1,
  },
  {
    heroClass: HeroClass.Warrior,
    type: AbilityType.HeroSimpleAttackTwoTargets,
    name: 'Удар по двоим',
    description: 'Атака противника на X("бросок" + оружие), до 2х целей',
    image: 'assets/img/abilities/basic-attack-two-targets.jpg',
    cost: 500,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: false,
    countTarget: 2,
  },
  {
    heroClass: HeroClass.Warrior,
    type: AbilityType.HeroHideCreature,
    name: 'Скрытие/раскрытие героя',
    description: 'Цель не может взаимодействовать с противником и не может быть целью атаки',
    image: 'assets/img/abilities/hide-creature.jpg',
    cost: 2000,
    maxUseCount: null,
    isImmediateAction: false,
    isAddonAction: true,
    countTarget: 1,
  },
  {
    heroClass: HeroClass.Prist,
    type: AbilityType.HeroWonderHeal,
    name: 'Чудотворное лечение',
    description: 'При выпадании 5 или 6 во время лечения - двойной эффект',
    image: 'assets/img/abilities/wonder-heal.jpg',
    cost: 500,
    maxUseCount: null,
    isImmediateAction: true,
    isPassiveAction: true,
    isAddonAction: false,
    countTarget: null,
  },
  {
    heroClass: HeroClass.Prist,
    type: AbilityType.HeroSacrifice,
    name: 'Жертва',
    description: 'Клирик отдает 1/2 своих жизней выбранному существу',
    image: 'assets/img/abilities/sacrifice.jpg',
    cost: 500,
    maxUseCount: null,
    isImmediateAction: false,
    isPassiveAction: false,
    isAddonAction: false,
    countTarget: 1,
  },
  {
    heroClass: HeroClass.Prist,
    type: AbilityType.HeroIncreaseHealTarget,
    name: '+1 к количеству исцеляемых',
    description: 'Увеличивает число целей базового лечения (не более 3х)',
    image: 'assets/img/abilities/increase-heal-target.jpg',
    cost: 1000,
    maxUseCount: null,
    isImmediateAction: true,
    isPassiveAction: true,
    isAddonAction: false,
    countTarget: null,
  },
  {
    heroClass: HeroClass.Scout,
    type: AbilityType.HeroTargetAttack,
    name: 'Прицельная атака',
    description: 'Возможность выбора части тела для удара',
    image: 'assets/img/abilities/target-attack.jpg',
    cost: 500,
    maxUseCount: null,
    isImmediateAction: true,
    isPassiveAction: true,
    isAddonAction: false,
    countTarget: null,
  },
];