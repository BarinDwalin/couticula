import { AbilityType, CreatureState, CreatureType, DiceTarget, EffectType, ItemType } from '@enums';
import {
  Ability,
  AbilityResult,
  AbilityResultError,
  AbilitySettings,
  Bottle,
  Creature,
  Hero,
} from '@models';
import { RandomService } from '@services';
import {
  HeroBasicAbilities,
  MonsterAbilities,
  ShopAbilitiesAttack,
  ShopAbilitiesDefence,
  ShopAbilitiesHeal,
  ShopAbilitiesMagic,
  ShopAbilitiesSpecial,
} from '@shared/db';
import { EffectFabric } from './effect-fabric';
import { ItemFabric } from './item-fabric';

// максимально возможная броня равна 6
const ARMOR_MAX = 6;

export class AbilityFabric {
  static randomService: RandomService;

  private static abilities: Map<
    AbilityType,
    (currentCreature: Creature, targetCreature: Creature) => AbilityResult | AbilityResultError
  >;
  private static abilitiesSettings: Map<AbilityType, AbilitySettings>;

  static createAbility(abilityType: AbilityType): Ability {
    const settings = AbilityFabric.abilitiesSettings.get(abilityType);

    return AbilityFabric.createAbilityBySettings(settings);
  }

  static createAbilityBySettings(settings: AbilitySettings): Ability {
    const func = AbilityFabric.abilities.get(settings.type);

    if (func) {
      return new Ability(settings, func);
    } else {
      return new Ability(settings, () => {
        console.log('TODO: ability', AbilityType[settings.type]);
        return null;
      });
    }
  }

  static createAbilityByBottle(bottle: Bottle, countBottle: number): Ability {
    const settings: AbilitySettings = {
      type: bottle.abilityType,
      name: bottle.name,
      description: bottle.description,
      image: bottle.img,
      cost: null,
      maxUseCount: countBottle,
      isImmediateAction: false,
      isPassiveAction: false,
      isAddonAction: true,
      countTarget: 1,
    };
    return AbilityFabric.createAbilityBySettings(settings);
  }

  static initialize(randomService: RandomService) {
    AbilityFabric.randomService = randomService;
    AbilityFabric.prepareAbilitiesSettings();
    AbilityFabric.prepareAbilities();
  }

  private static prepareAbilitiesSettings() {
    AbilityFabric.abilitiesSettings = new Map();
    const allSettings = [
      ...HeroBasicAbilities,
      ...MonsterAbilities,
      ...ShopAbilitiesAttack,
      ...ShopAbilitiesDefence,
      ...ShopAbilitiesHeal,
      ...ShopAbilitiesMagic,
      ...ShopAbilitiesSpecial,
    ];
    allSettings.forEach(settings => {
      AbilityFabric.abilitiesSettings.set(settings.type, settings);
    });
  }

  private static prepareAbilities() {
    AbilityFabric.abilities = new Map();
    AbilityFabric.abilities.set(AbilityType.HeroBasicAttack, heroBasicAttack);
    AbilityFabric.abilities.set(AbilityType.HeroPoisonWeak, heroPoisonWeak);
    AbilityFabric.abilities.set(AbilityType.HeroPoisonMedium, heroPoisonMedium);
    AbilityFabric.abilities.set(AbilityType.HeroPoisonStrong, heroPoisonStrong);
    AbilityFabric.abilities.set(AbilityType.HeroRage, heroRage);
    AbilityFabric.abilities.set(AbilityType.HeroStanWeak, heroStanWeak);
    AbilityFabric.abilities.set(AbilityType.HeroStanMedium, heroStanMedium);
    AbilityFabric.abilities.set(AbilityType.HeroStanStrong, heroStanStrong);
    AbilityFabric.abilities.set(AbilityType.HeroThrowSpearow, heroThrowSpearow);

    AbilityFabric.abilities.set(AbilityType.HeroAttackOffset, heroAttackOffset);
    AbilityFabric.abilities.set(AbilityType.HeroResistPoisonWeak, heroResistPoisonWeak);
    AbilityFabric.abilities.set(AbilityType.HeroShieldWeak, heroShieldWeak);
    AbilityFabric.abilities.set(AbilityType.HeroShieldMedium, heroShieldMedium);
    AbilityFabric.abilities.set(AbilityType.HeroShieldStrong, heroShieldStrong);

    AbilityFabric.abilities.set(AbilityType.HeroBasicHeal, heroBasicHeal);
    AbilityFabric.abilities.set(AbilityType.HeroHealAfterBattle, heroHealAfterBattle);
    AbilityFabric.abilities.set(AbilityType.HeroHealPoison, heroHealFromPoison);
    AbilityFabric.abilities.set(AbilityType.HeroHealMedium, heroHealMedium);
    AbilityFabric.abilities.set(AbilityType.HeroHealStrong, heroHealStrong);
    AbilityFabric.abilities.set(AbilityType.HeroHealWeak, heroHealWeak);
    AbilityFabric.abilities.set(AbilityType.HeroHealWithAllies, heroHealWithAllies);

    AbilityFabric.abilities.set(
      AbilityType.HeroCastDecreaseRegeneration1,
      heroCastDecreaseRegeneration1
    );
    AbilityFabric.abilities.set(AbilityType.HeroCastFlash, heroCastFlash);
    AbilityFabric.abilities.set(AbilityType.HeroCastFireBall, heroCastFireBall);
    AbilityFabric.abilities.set(AbilityType.HeroCastImbecility, heroCastImbecility);
    AbilityFabric.abilities.set(AbilityType.HeroCastLightningStrikes, heroCastLightningStrikes);
    AbilityFabric.abilities.set(AbilityType.HeroCastMagicAttackStanned, heroCastMagicAttackStanned);
    AbilityFabric.abilities.set(AbilityType.HeroCastSlackness, heroCastSlackness);
    AbilityFabric.abilities.set(AbilityType.HeroCastTripleMagicAttack, heroCastTripleMagicAttack);
    AbilityFabric.abilities.set(AbilityType.HeroCastMagicProtection, heroCastMagicProtection);
    AbilityFabric.abilities.set(AbilityType.HeroCastTripleStan, heroCastTripleStan);
    AbilityFabric.abilities.set(AbilityType.HeroCastTurningToStone, heroCastTurningToStone);
    AbilityFabric.abilities.set(AbilityType.HeroCastSuppression, heroCastSuppression);

    AbilityFabric.abilities.set(AbilityType.HeroUseBottleOfHeal, heroUseBottleOfHeal);
    AbilityFabric.abilities.set(AbilityType.HeroUseBottleOfPoison, heroUseBottleOfPoison);
    AbilityFabric.abilities.set(AbilityType.HeroUseBottleOfStan, heroUseBottleOfStan);

    AbilityFabric.abilities.set(AbilityType.MonsterBasicAttack, monsterBasicAttack);
  }
}

// *****************************************************************************
// ABILITIES FUNCTIONS
// *****************************************************************************

// Attack:

function heroBasicAttack(currentCreature: Creature, targetCreature: Creature) {
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: true,
    magicAttack: false,
    fixedDamage: null,
    weaponDamage: null,
    damageCoefficient: 1,
    diceDamage: null,
    diceTarget: null,
  });
}

function heroPoisonWeak(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackWithPoisonWeak2);
  currentCreature.effects.push(newEffect);
  return null;
}
function heroPoisonMedium(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackWithPoisonMedium2);
  currentCreature.effects.push(newEffect);
  return null;
}
function heroPoisonStrong(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackWithPoisonStrong3);
  currentCreature.effects.push(newEffect);
  return null;
}

function heroRage(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.Rage);
  currentCreature.effects.push(newEffect);
  return null;
}

function heroStanWeak(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackWithStanWeak);
  currentCreature.effects.push(newEffect);
  return null;
}
function heroStanMedium(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackWithStanMedium);
  currentCreature.effects.push(newEffect);
  return null;
}
function heroStanStrong(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackWithStanStrong);
  currentCreature.effects.push(newEffect);
  return null;
}

function heroThrowSpearow(currentCreature: Creature, targetCreature: Creature) {
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: true,
    magicAttack: false,
    fixedDamage: null,
    weaponDamage: 1,
    damageCoefficient: 1,
    diceDamage: null,
    diceTarget: null,
  });
}

// Defense:

function heroAttackOffset(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.AttackOffset);
  currentCreature.effects.push(newEffect);
  return null;
}

function heroResistPoisonWeak(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.ResistPoison1);
  currentCreature.effects.push(newEffect);
  currentCreature.dropEffect(EffectType.Poison1);
  return null;
}

function heroShieldWeak(currentCreature: Creature, targetCreature: Creature) {
  const newShield = ItemFabric.createShield(2, 2);
  currentCreature.inventory.push(newShield);
  return null;
}
function heroShieldMedium(currentCreature: Creature, targetCreature: Creature) {
  const newShield = ItemFabric.createShield(3, 4);
  currentCreature.inventory.push(newShield);
  return null;
}
function heroShieldStrong(currentCreature: Creature, targetCreature: Creature) {
  const newShield = ItemFabric.createShield(2, 6);
  currentCreature.inventory.push(newShield);
  return null;
}

// Heal:

function heroBasicHeal(currentCreature: Creature, targetCreature: Creature) {
  return basicHeal(currentCreature, targetCreature, {
    useWeapon: true,
    fixedHeal: null,
    weaponHeal: null,
    diceHeal: null,
  });
}

function heroHealAfterBattle(currentCreature: Creature, targetCreature: Creature) {
  return basicHeal(currentCreature, currentCreature, {
    useWeapon: false,
    fixedHeal: 7,
    weaponHeal: null,
    diceHeal: null,
  });
}

function heroHealFromPoison(currentCreature: Creature, targetCreature: Creature) {
  if (
    !(targetCreature.type === CreatureType.Hero) ||
    !targetCreature.isExistsSomeEffects([
      EffectType.Poison1,
      EffectType.Poison2,
      EffectType.Poison3,
    ])
  ) {
    const error: AbilityResultError = { notCorrectTarget: true };
    return error;
  }

  const targetCreatureBefore = targetCreature.convertToCreatureView();

  targetCreature.dropCurrentEffects([EffectType.Poison1, EffectType.Poison2, EffectType.Poison3]);
  targetCreature.dropEffects([EffectType.Poison1, EffectType.Poison2, EffectType.Poison3]);

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroHealMedium(currentCreature: Creature, targetCreature: Creature) {
  return basicHeal(currentCreature, targetCreature, {
    useWeapon: false,
    fixedHeal: 15,
    weaponHeal: null,
    diceHeal: null,
  });
}
function heroHealStrong(currentCreature: Creature, targetCreature: Creature) {
  return basicHeal(currentCreature, targetCreature, {
    useWeapon: false,
    fixedHeal: 20,
    weaponHeal: null,
    diceHeal: null,
  });
}
function heroHealWeak(currentCreature: Creature, targetCreature: Creature) {
  return basicHeal(currentCreature, targetCreature, {
    useWeapon: false,
    fixedHeal: 5,
    weaponHeal: null,
    diceHeal: null,
  });
}

function heroHealWithAllies(currentCreature: Creature, targetCreature: Creature) {
  const newEffect = EffectFabric.createEffect(EffectType.HealWithAllies);
  currentCreature.effects.push(newEffect);
  return null;
}

// Magic:

function heroCastDecreaseRegeneration1(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();
  const newEffect = EffectFabric.createEffect(EffectType.DecreaseRegeneration1);
  targetCreature.currentEffects.push(newEffect);

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroCastFlash(currentCreature: Creature, targetCreature: Creature) {
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: true,
    magicAttack: true,
    fixedDamage: null,
    weaponDamage: 2,
    damageCoefficient: 1,
    diceDamage: null,
    diceTarget: null,
  });
}

function heroCastFireBall(currentCreature: Creature, targetCreature: Creature) {
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: true,
    magicAttack: true,
    fixedDamage: null,
    weaponDamage: 5,
    damageCoefficient: 1,
    diceDamage: null,
    diceTarget: null,
  });
}

function heroCastImbecility(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();
  // шанс 50%
  const dice = AbilityFabric.randomService.rollDiceD6();
  if (dice > 3) {
    const newEffect = EffectFabric.createEffect(EffectType.Imbecility);
    targetCreature.currentEffects.push(newEffect);
  }

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroCastLightningStrikes(currentCreature: Creature, targetCreature: Creature) {
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: false,
    magicAttack: true,
    fixedDamage: null,
    weaponDamage: null,
    damageCoefficient: 1,
    diceDamage: null,
    diceTarget: null,
  });
}

function heroCastMagicAttackStanned(currentCreature: Creature, targetCreature: Creature) {
  let damageCoefficient = 1;
  if (targetCreature.isExistsSomeEffects([EffectType.Stan, EffectType.Stan2])) {
    damageCoefficient = 2;
    targetCreature.dropCurrentEffects([EffectType.Stan, EffectType.Stan2]);
  }
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: false,
    magicAttack: true,
    fixedDamage: null,
    weaponDamage: null,
    damageCoefficient,
    diceDamage: null,
    diceTarget: null,
  });
}

function heroCastMagicProtection(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();
  const newEffect = EffectFabric.createEffect(EffectType.MagicProtection);
  targetCreature.currentEffects.push(newEffect);

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroCastSlackness(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();
  const newEffect = EffectFabric.createEffect(EffectType.Slackness);
  targetCreature.currentEffects.push(newEffect);

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroCastTripleMagicAttack(currentCreature: Creature, targetCreature: Creature) {
  currentCreature.decreaseHitpoint(4);

  return basicAttack(currentCreature, targetCreature, {
    useWeapon: false,
    magicAttack: true,
    fixedDamage: null,
    weaponDamage: null,
    damageCoefficient: 3,
    diceDamage: null,
    diceTarget: null,
  });
}

function heroCastTripleStan(currentCreature: Creature, targetCreature: Creature) {
  if (
    targetCreature.isExistsSomeEffects([EffectType.ResistStan, EffectType.Stan, EffectType.Stan2])
  ) {
    return { notCorrectTarget: true } as AbilityResultError;
  }

  const targetCreatureBefore = targetCreature.convertToCreatureView();
  // шанс 50%
  const dice = AbilityFabric.randomService.rollDiceD6();
  if (dice > 3) {
    const newEffect = EffectFabric.createEffect(EffectType.Stan);
    targetCreature.currentEffects.push(newEffect);
  }

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroCastTurningToStone(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();
  currentCreature.decreaseHitpoint(4);
  const newEffect = EffectFabric.createEffect(EffectType.BlockDamage);
  targetCreature.currentEffects.push(newEffect);

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

function heroCastSuppression(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();
  const newEffect = EffectFabric.createEffect(EffectType.Suppression);
  targetCreature.currentEffects.push(newEffect);

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: null,
    diceValue: null,
    value: null,
  };
  return abilityResult;
}

// Special:

function heroUseBottleOfHeal(currentCreature: Creature, targetCreature: Creature) {
  const dice: number = AbilityFabric.randomService.rollDiceD6();
  const bottle = currentCreature.inventory.find(item => item.type === ItemType.BottleOfHeal);
  currentCreature.removeItemFormInventory(bottle);
  return basicHeal(currentCreature, currentCreature, {
    useWeapon: false,
    fixedHeal: 5 * dice,
    weaponHeal: null,
    diceHeal: dice,
  });
}

function heroUseBottleOfPoison(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();

  if (
    !targetCreature.isExistsSomeEffects([
      EffectType.ResistPoisonAny,
      EffectType.Poison2,
      EffectType.Poison3,
    ])
  ) {
    const dice: number = AbilityFabric.randomService.rollDiceD6();
    const effectType = dice > 3 ? EffectType.Poison2 : EffectType.Poison1;
    const newEffect = EffectFabric.createEffect(effectType);
    const bottle = currentCreature.inventory.find(item => item.type === ItemType.BottleOfPoison);
    currentCreature.removeItemFormInventory(bottle);

    if (effectType === EffectType.Poison1) {
      if (!targetCreature.isExistsSomeEffects([EffectType.ResistPoison1, EffectType.Poison1])) {
        targetCreature.currentEffects.push(newEffect);
        // отравление остается после боя
        targetCreature.effects.push(newEffect);
      } else {
        // отравление не сработало
      }
    } else {
      targetCreature.dropCurrentEffect(EffectType.Poison1);
      targetCreature.currentEffects.push(newEffect);
      // отравление остается после боя
      targetCreature.dropEffect(EffectType.Poison1);
      targetCreature.effects.push(newEffect);
    }

    const abilityResult: AbilityResult = {
      targetCreatureBefore,
      targetCreatureAfter: targetCreature.convertToCreatureView(),
      diceTarget: null,
      diceValue: dice,
      value: null,
    };
    return abilityResult;
  } else {
    return { notCorrectTarget: true } as AbilityResultError;
  }
}

function heroUseBottleOfStan(currentCreature: Creature, targetCreature: Creature) {
  const targetCreatureBefore = targetCreature.convertToCreatureView();

  if (!targetCreature.isExistsSomeEffects([EffectType.ResistStan, EffectType.Stan2])) {
    const dice: number = AbilityFabric.randomService.rollDiceD6();
    const effectType = dice > 3 ? EffectType.Stan2 : EffectType.Stan;
    const newEffect = EffectFabric.createEffect(effectType);
    const bottle = currentCreature.inventory.find(item => item.type === ItemType.BottleOfStan);
    currentCreature.removeItemFormInventory(bottle);
    targetCreature.dropCurrentEffect(EffectType.Stan);
    targetCreature.currentEffects.push(newEffect);

    const abilityResult: AbilityResult = {
      targetCreatureBefore,
      targetCreatureAfter: targetCreature.convertToCreatureView(),
      diceTarget: null,
      diceValue: dice,
      value: null,
    };
    return abilityResult;
  } else {
    return { notCorrectTarget: true } as AbilityResultError;
  }
}

// Monsters:

function monsterBasicAttack(currentCreature: Creature, targetCreature: Creature) {
  return basicAttack(currentCreature, targetCreature, {
    useWeapon: true,
    magicAttack: false,
    fixedDamage: null,
    weaponDamage: null,
    damageCoefficient: 1,
    diceDamage: null,
    diceTarget: null,
  });
}

/** HELPERS FUNCTIONS */

function basicAttack(
  currentCreature: Creature,
  targetCreature: Creature,
  options: {
    useWeapon: boolean;
    magicAttack: boolean;
    fixedDamage: number;
    weaponDamage: number;
    damageCoefficient: number;
    diceDamage: number;
    diceTarget: DiceTarget;
  }
): AbilityResult {
  const targetCreatureBefore = targetCreature.convertToCreatureView();

  let diceTarget = throwDiceTarget(currentCreature, targetCreature, options.diceTarget);
  if (diceTarget === DiceTarget.Head && targetCreature.isExistsEffect(EffectType.AttackOffset)) {
    while (diceTarget === DiceTarget.Head) {
      diceTarget = throwDiceTarget(currentCreature, targetCreature);
    }
    targetCreature.dropCurrentEffect(EffectType.AttackOffset);
  }
  // проверка на фиксированный бросок и замену оружия
  const diceDamage = options.diceDamage || throwDiceDamage(currentCreature);
  const weaponDamage = calcWeaponValue(currentCreature, options);
  let damageValue = options.fixedDamage || diceDamage + weaponDamage;

  // действия при атаке
  currentCreature.currentEffects
    .filter(effect => effect.isAttackActivation)
    .forEach(effect => effect.action(targetCreature));
  if (diceTarget === DiceTarget.Legs) {
    // особое оглушение для монстра
    currentCreature.currentEffects.some(effect => {
      if (effect.effectType === EffectType.SpecialAttackLegs) {
        effect.action(targetCreature);
        return true;
      }
    });
  }

  if (!options.magicAttack) {
    const armor = calcTargetCreatureArmor(currentCreature, targetCreature, diceTarget);
    damageValue -= armor;
  }

  const damageCoefficient = calcDamageCoefficient(
    currentCreature,
    targetCreature,
    diceDamage,
    diceTarget,
    options
  );
  damageValue *= damageCoefficient;

  if (currentCreature.isExistsEffect(EffectType.Slackness)) {
    damageValue -= 2;
  }

  damageValue = damageValue < 0 ? 0 : decreaseHitPoints(targetCreature, damageValue);
  decreaseShield(targetCreature);

  // Состояние броска
  currentCreature.lastDiceTarget = options.magicAttack ? null : diceTarget;
  currentCreature.lastDiceValue = options.fixedDamage ? null : diceDamage;

  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: currentCreature.lastDiceTarget,
    diceValue: currentCreature.lastDiceValue,
    value: damageValue,
  };
  return abilityResult;
}

function basicHeal(
  currentCreature: Creature,
  targetCreature: Creature,
  options: {
    useWeapon: boolean;
    fixedHeal: number;
    weaponHeal: number;
    diceHeal: number;
  }
): AbilityResult {
  const targetCreatureBefore = targetCreature.convertToCreatureView();

  const diceHeal = options.diceHeal || throwDiceDamage(currentCreature);
  const weaponHeal = calcWeaponValue(currentCreature, options);
  const healCoefficient = calcHealCoefficient(currentCreature, diceHeal);
  const healValueMax = options.fixedHeal || (weaponHeal + diceHeal) * healCoefficient;
  const healValue = increaseHitPoints(currentCreature, healValueMax);

  // Состояние броска
  currentCreature.lastDiceTarget = null;
  currentCreature.lastDiceValue = options.fixedHeal ? null : diceHeal;

  // Совместное лечение
  if (currentCreature !== targetCreature) {
    currentCreature.currentEffects.forEach(effect => {
      if (effect.effectType === EffectType.HealWithAllies) {
        effect.action(currentCreature);
      }
    });
  }

  // TODO: Возвращать Array<AbilityResult>, для информации по нескольким существам
  const abilityResult: AbilityResult = {
    targetCreatureBefore,
    targetCreatureAfter: targetCreature.convertToCreatureView(),
    diceTarget: currentCreature.lastDiceTarget,
    diceValue: currentCreature.lastDiceValue,
    value: healValue,
  };
  return abilityResult;
}

function throwDiceDamage(creature: Creature): number {
  if (creature.isExistsEffect(EffectType.Course)) {
    return 1;
  }
  const dice: number = AbilityFabric.randomService.rollDiceD6();
  return dice;
}

function throwDiceTarget(
  currentCreature: Creature,
  targetCreature: Creature,
  dice?: DiceTarget
): DiceTarget {
  if (
    currentCreature.isExistsEffect(EffectType.TargetAttackLegs) &&
    !targetCreature.isExistsEffect(EffectType.CreatureWithoutLegs)
  ) {
    return DiceTarget.Legs;
  }
  if (!dice) {
    dice = AbilityFabric.randomService.rollDiceD6();
  }
  switch (dice) {
    case 1:
      if (targetCreature.isExistsEffect(EffectType.CreatureWithoutHead)) {
        return throwDiceTarget(currentCreature, targetCreature);
      } else {
        return DiceTarget.Head;
      }
    case 2:
      if (targetCreature.isExistsEffect(EffectType.CreatureWithoutHands)) {
        return throwDiceTarget(currentCreature, targetCreature);
      } else {
        return DiceTarget.Hands;
      }
    case 3:
      if (targetCreature.isExistsEffect(EffectType.CreatureWithoutLegs)) {
        return throwDiceTarget(currentCreature, targetCreature);
      } else {
        return DiceTarget.Legs;
      }
    default:
      if (targetCreature.isExistsEffect(EffectType.CreatureWithoutBody)) {
        return throwDiceTarget(currentCreature, targetCreature);
      } else {
        return DiceTarget.Body;
      }
  }
}

function calcTargetCreatureArmor(
  currentCreature: Creature,
  targetCreature: Creature,
  diceTarget: DiceTarget
) {
  // проверка игнорирования брони атакующим
  if (currentCreature.isExistsEffect(EffectType.AttackWithIgnoringArmor)) {
    return 0;
  }
  // проверка на игнорирование и наличие щита
  let armor =
    !targetCreature.equipment.Shield ||
    currentCreature.isExistsEffect(EffectType.AttackWithIgnoringShield)
      ? 0
      : targetCreature.equipment.Shield.value;

  // определение брони части тела цели
  switch (diceTarget) {
    case DiceTarget.Head:
      if (targetCreature.equipment.Head) {
        armor += targetCreature.equipment.Head.value;
      }
      break;
    case DiceTarget.Hands:
      if (targetCreature.equipment.Hands) {
        armor += targetCreature.equipment.Hands.value;
      }
      break;
    case DiceTarget.Legs:
      if (
        targetCreature.equipment.Legs &&
        !currentCreature.isExistsEffect(EffectType.SpecialAttackLegs)
      ) {
        armor += targetCreature.equipment.Legs.value;
      }
      break;
    case DiceTarget.Body:
      if (targetCreature.equipment.Body) {
        armor += targetCreature.equipment.Body.value;
      }
      break;
  }
  return armor > ARMOR_MAX ? ARMOR_MAX : armor;
}

function calcDamageCoefficient(
  currentCreature: Creature,
  targetCreature: Creature,
  diceDamage: number,
  diceTarget: DiceTarget,
  options: {
    damageCoefficient: number;
    magicAttack: boolean;
  }
) {
  let damageCoefficient = (options && options.damageCoefficient) || 1;

  if (options && options.magicAttack) {
    if (targetCreature.isExistsEffect(EffectType.MagicProtection)) {
      damageCoefficient = 0;
    }
  } else {
    if (diceTarget === DiceTarget.Head) {
      damageCoefficient *= 2;
    }
    if (diceDamage === 6 && currentCreature.isExistsEffect(EffectType.Rage)) {
      damageCoefficient *= 2;
    }
    if (
      targetCreature.isExistsSomeEffects([EffectType.Stan2, EffectType.Stan]) &&
      targetCreature.isExistsEffect(EffectType.ResistStanSpecial)
    ) {
      // особое сопротивление оглушению для монстра
      targetCreature.dropCurrentEffects([EffectType.Stan2, EffectType.Stan]);
      damageCoefficient *= 2;
    }
  }

  if (targetCreature.isExistsEffect(EffectType.Suppression)) {
    damageCoefficient *= 2;
  }

  return damageCoefficient;
}

function calcHealCoefficient(creature: Creature, dice: number) {
  if (creature.isExistsEffect(EffectType.WounderHeal) && (dice === 5 || dice === 6)) {
    return 2;
  } else {
    return 1;
  }
}

function calcWeaponValue(
  currentCreature: Creature,
  options: {
    useWeapon: boolean;
    weaponDamage?: number;
    weaponHeal?: number;
  }
) {
  if (options && options.useWeapon) {
    if (options.weaponDamage) {
      return options.weaponDamage;
    } else if (options.weaponHeal) {
      return options.weaponHeal;
    } else {
      return currentCreature.equipment.Weapon ? currentCreature.equipment.Weapon.value : 0;
    }
  } else {
    return 0;
  }
}
function decreaseHitPoints(creature: Creature, damageValue: number) {
  let damage = 0;
  if (!creature.isExistsEffect(EffectType.BlockDamage)) {
    if (
      creature.hitPoint <= damageValue ||
      (damageValue >= 13 && creature.isExistsEffect(EffectType.Destructible13))
    ) {
      damage = creature.hitPoint;
      creature.hitPoint = 0;
      creature.state = CreatureState.DeadInThisTurn;
    } else {
      damage = damageValue;
      creature.hitPoint -= damageValue;
    }
  }
  return damage;
}

function increaseHitPoints(creature: Creature, healValue: number): number {
  let addonHitPoint = 0;

  if (!creature.isExistsEffect(EffectType.BlockHeal)) {
    addonHitPoint =
      creature.hitPoint + healValue > creature.maxHitPoint
        ? creature.maxHitPoint - creature.hitPoint
        : healValue;
    creature.hitPoint = creature.hitPoint + addonHitPoint;
  }
  return addonHitPoint;
}

function decreaseShield(creature: Creature) {
  if (creature.equipment.Shield && creature.equipment.Shield.currentHitPoint > 0) {
    creature.equipment.Shield.currentHitPoint -= 1; // даже при игнорировании щита он ломается
    if (creature.equipment.Shield.currentHitPoint === 0) {
      // поломка щита
      creature.dropCurrentEffect(EffectType.Shield);
    }
  }
}
