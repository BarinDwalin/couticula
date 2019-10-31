import { Creature, Effect, EffectSettings } from '@models';
import { RandomService } from '@services';
import { Effects } from '@db';
import { EffectType } from '@enums';

export class EffectFabric {
  static randomService: RandomService;

  private static actions: Map<EffectType, (currentCreature: Creature) => void>;

  static createEffect(effectType: EffectType): Effect {
    const settings: EffectSettings = Effects.find(effect => effect.effectType === effectType);
    const func = EffectFabric.actions.get(settings.effectType);

    if (func) {
      return new Effect(settings, func);
    } else {
      return new Effect(settings, () => {
        console.log('TODO: effect', EffectType[settings.effectType]);
      });
    }
  }

  static initialize(randomService: RandomService) {
    EffectFabric.randomService = randomService;
    EffectFabric.prepareActions();
  }

  private static prepareActions() {
    EffectFabric.actions = new Map();
    EffectFabric.actions.set(EffectType.AttackWithBlockHeal, attackWithBlockHeal);
    EffectFabric.actions.set(EffectType.AttackWithCourse, attackWithCourse);
    EffectFabric.actions.set(EffectType.AttackWithPoisonWeak1, attackWithPoisonWeak1);
    EffectFabric.actions.set(EffectType.AttackWithPoisonWeak2, attackWithPoisonWeak2);
    EffectFabric.actions.set(EffectType.AttackWithPoisonMedium2, attackWithPoisonMedium2);
    EffectFabric.actions.set(EffectType.AttackWithPoisonStrong3, attackWithPoisonStrong3);
    EffectFabric.actions.set(EffectType.AttackWithStanWeak, attackWithStanWeak);
    EffectFabric.actions.set(EffectType.AttackWithStanMedium, attackWithStanMedium);
    EffectFabric.actions.set(EffectType.AttackWithStanStrong, attackWithStanStrong);
    EffectFabric.actions.set(EffectType.SpecialAttackLegs, specialAttackLegs);

    EffectFabric.actions.set(EffectType.Poison1, actionPoison1);
    EffectFabric.actions.set(EffectType.Poison2, actionPoison2);
    EffectFabric.actions.set(EffectType.Poison3, actionPoison3);
    EffectFabric.actions.set(EffectType.Regeneration1, actionRegeneration1);
    EffectFabric.actions.set(EffectType.Regeneration5, actionRegeneration5);
    EffectFabric.actions.set(EffectType.HealWithAllies, actionHealWithAllies);
  }
}

function attackWithBlockHeal(creature: Creature) {
  if (!creature.isExistsEffect(EffectType.BlockHeal)) {
    const newEffect = EffectFabric.createEffect(EffectType.BlockHeal);
    creature.currentEffects.push(newEffect);
  }
}

function attackWithCourse(creature: Creature) {
  if (!creature.isExistsEffect(EffectType.Course)) {
    const newEffect = EffectFabric.createEffect(EffectType.Course);
    creature.currentEffects.push(newEffect);
  }
}

function attackWithPoisonWeak1(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice === 6) {
    if (
      !creature.isExistsSomeEffects([
        EffectType.ResistPoisonAny,
        EffectType.ResistPoison1,
        EffectType.Poison1,
        EffectType.Poison2,
        EffectType.Poison3,
      ])
    ) {
      const newEffect = EffectFabric.createEffect(EffectType.Poison1);
      creature.currentEffects.push(newEffect);
      // Отравление остается после боя
      creature.effects.push(newEffect);
    }
  }
}
function attackWithPoisonWeak2(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice === 6) {
    if (
      !creature.isExistsSomeEffects([
        EffectType.ResistPoisonAny,
        EffectType.Poison2,
        EffectType.Poison3,
      ])
    ) {
      creature.dropCurrentEffect(EffectType.Poison1);
      const newEffect = EffectFabric.createEffect(EffectType.Poison2);
      creature.currentEffects.push(newEffect);
      // Отравление остается после боя
      creature.dropEffect(EffectType.Poison1);
      creature.effects.push(newEffect);
    }
  }
}
function attackWithPoisonMedium2(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice >= 5) {
    if (
      !creature.isExistsSomeEffects([
        EffectType.ResistPoisonAny,
        EffectType.Poison2,
        EffectType.Poison3,
      ])
    ) {
      creature.dropCurrentEffect(EffectType.Poison1);
      const newEffect = EffectFabric.createEffect(EffectType.Poison2);
      creature.currentEffects.push(newEffect);
      // Отравление остается после боя
      creature.dropEffect(EffectType.Poison1);
      creature.effects.push(newEffect);
    }
  }
}
function attackWithPoisonStrong3(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice >= 4) {
    if (!creature.isExistsSomeEffects([EffectType.ResistPoisonAny, EffectType.Poison3])) {
      creature.dropCurrentEffects([EffectType.Poison1, EffectType.Poison2]);
      const newEffect = EffectFabric.createEffect(EffectType.Poison3);
      creature.currentEffects.push(newEffect);
      // Отравление остается после боя
      creature.dropEffects([EffectType.Poison1, EffectType.Poison2]);
      creature.effects.push(newEffect);
    }
  }
}

function attackWithStanWeak(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice === 6) {
    if (!creature.isExistsSomeEffects([EffectType.ResistStan, EffectType.Stan])) {
      const newEffect = EffectFabric.createEffect(EffectType.Stan);
      creature.currentEffects.push(newEffect);
    }
  }
}
function attackWithStanMedium(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice >= 5) {
    if (!creature.isExistsSomeEffects([EffectType.ResistStan, EffectType.Stan])) {
      const newEffect = EffectFabric.createEffect(EffectType.Stan);
      creature.currentEffects.push(newEffect);
    }
  }
}
function attackWithStanStrong(creature: Creature) {
  const dice = EffectFabric.randomService.rollDiceD6();
  if (dice >= 4) {
    if (!creature.isExistsSomeEffects([EffectType.ResistStan, EffectType.Stan])) {
      const newEffect = EffectFabric.createEffect(EffectType.Stan);
      creature.currentEffects.push(newEffect);
    }
  }
}

function specialAttackLegs(creature: Creature) {
  if (!creature.isExistsSomeEffects([EffectType.ResistStan, EffectType.Stan2, EffectType.Stan])) {
    const newEffect = EffectFabric.createEffect(EffectType.Stan);
    creature.currentEffects.push(newEffect);
  }
}

function actionPoison1(creature: Creature) {
  actionPoison(creature, 1);
}
function actionPoison2(creature: Creature) {
  actionPoison(creature, 2);
}
function actionPoison3(creature: Creature) {
  actionPoison(creature, 3);
}
function actionPoison(creature: Creature, value: number) {
  creature.decreaseHitpoint(value);
}
function actionRegeneration1(creature: Creature) {
  actionRegeneration(creature, 1);
}
function actionRegeneration5(creature: Creature) {
  const value = creature.isExistsEffect(EffectType.DecreaseRegeneration1) ? 4 : 5;
  actionRegeneration(creature, value);
}
function actionRegeneration(creature: Creature, value: number) {
  creature.increaseHitpoint(value);
}
function actionHealWithAllies(creature: Creature) {
  creature.increaseHitpoint(4);
}
