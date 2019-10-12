import { AbilityType, CreatureState, CreatureType, DiceTarget, EffectType } from '@enums';

import { Ability } from './ability';
import { CreatureEquipment } from './creature-equipment';
import { Effect } from './effect';
import { Item } from './items';

export class Creature {
  readonly type: CreatureType;
  readonly id: number;
  name: string;
  // image: ImageType = ImageType.NoImage;
  description = '';
  image: string;
  hitPoint = 0;
  maxHitPoint = 0;
  state: CreatureState = CreatureState.Alive;
  abilities: AbilityType[] = [];
  currentAbilities: Ability[] = []; // способности существа, доступные во время боя
  // !!! Каждая способность применяется только 1 раз за раунд
  usedInThisBattleAbilities: Map<AbilityType, number> = new Map<AbilityType, number>();
  usedInThisRoundAbilities: AbilityType[] = []; // способности существа, примененные в этом бою
  // !!! Позволяет создавать однотипные эффекты с разным описанием. Если реально не пригодится - заменить на тип эффекта
  effects: Effect[] = []; // эффекты на существе
  currentEffects: Effect[] = []; // эффекты на существе во время боя
  equipment: CreatureEquipment = null;
  inventory: Item[] = [];
  lastDiceValue: number = null;
  lastDiceTarget: DiceTarget = null;
  lastTargetInBattle: number = null;

  constructor(
    id: number,
    name: string,
    image: string,
    hitpoint: number,
    equipment: CreatureEquipment
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.hitPoint = hitpoint;
    this.maxHitPoint = hitpoint;
    this.equipment = equipment;
    this.abilities.push(AbilityType.MonsterBasicAttack);
  }

  convertToCreatureView() {
    return Object.assign({}, this, { availableAbilities: this.getAvailableAbilities() });
    // return { ...this, availableAbilities: this.getAvailableAbilities() } as CreatureView;
  }

  dropAbility(abilityType: AbilityType) {
    const indexAbility = this.abilities.findIndex(ability => ability === abilityType);
    if (indexAbility !== -1) {
      this.abilities.splice(indexAbility, 1);
    }
  }
  dropCurrentAbility(abilityType: AbilityType) {
    const indexAbility = this.currentAbilities.findIndex(ability => ability.type === abilityType);
    if (indexAbility !== -1) {
      this.currentAbilities.splice(indexAbility, 1);
    }
  }
  dropCurrentEffect(effectType: EffectType) {
    const indexEffect = this.currentEffects.findIndex(effect => effect.effectType === effectType);
    if (indexEffect !== -1) {
      this.currentEffects.splice(indexEffect, 1);
    }
  }
  dropCurrentEffects(effectType: EffectType[]) {
    effectType.forEach(p => this.dropCurrentEffect(p));
  }
  dropEffect(effectType: EffectType) {
    const indexEffect = this.effects.findIndex(effect => effect.effectType === effectType);
    if (indexEffect !== -1) {
      this.effects.splice(indexEffect, 1);
    }
  }
  dropEffects(effectType: EffectType[]) {
    effectType.forEach(p => this.dropEffect(p));
  }

  getAvailableAbilities() {
    return this.currentAbilities.filter(
      ability =>
        this.usedInThisRoundAbilities.indexOf(ability.type) === -1 &&
        (!ability.maxUseCount ||
          !this.usedInThisBattleAbilities.has(ability.type) ||
          ability.maxUseCount > this.usedInThisBattleAbilities.get(ability.type))
    );
  }

  isExistsEffect(effectType: EffectType) {
    return this.currentEffects.some(p => p.effectType === effectType);
  }
  isExistsSomeEffects(effectTypes: EffectType[]): boolean {
    return this.currentEffects.some(p => effectTypes.indexOf(p.effectType) !== -1);
  }

  increaseHitpoint(value: number): number {
    let healHitPoint = 0;
    if (!this.isExistsEffect(EffectType.BlockHeal)) {
      healHitPoint =
        this.hitPoint + value > this.maxHitPoint ? this.maxHitPoint - this.hitPoint : value;
      this.hitPoint = this.hitPoint + healHitPoint;
    }
    return healHitPoint;
  }

  decreaseHitpoint(value: number): number {
    let damage = 0;
    if (!this.isExistsEffect(EffectType.BlockDamage)) {
      if (
        this.hitPoint < damage ||
        (damage >= 13 && !this.isExistsEffect(EffectType.Destructible13))
      ) {
        damage = this.hitPoint;
        this.hitPoint = 0;
        this.state = CreatureState.DeadInThisTurn;
      } else {
        damage = value;
        this.hitPoint -= damage;
      }
    }
    return damage;
  }

  removeItemFormInventory(item: Item) {
    const index = this.inventory.findIndex(value => value === item);
    if (index !== -1) {
      return this.inventory.splice(index, 1)[0];
    }
  }
}
