import { AbilityType, HeroClass } from '@shared/enums';

export interface AbilitySettings {
  type: AbilityType;
  name: string;
  description: string;
  image: string;
  cost: number;
  /** число целей способости в бою */
  countTarget: number;
  /** максимальное число использований способности за бой */
  maxUseCount: number;
  /** используется ли способность сразу после покупки */
  isImmediateAction: boolean;
  /** продолжается ли ход после использования способности */
  isAddonAction?: boolean;
  /** является ли урон магическим */
  isMagicAttack?: boolean;
  /** является ли действие способности постоянным эффектом */
  isPassiveAction?: boolean;
  /** классовое ограничение применения способности */
  heroClass?: HeroClass;
  /** способность является комбинацией из нескольких других */
  combo?: AbilityType[];
}
