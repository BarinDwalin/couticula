import { CreaturesBoss, CreaturesLevel1, CreaturesLevel2, HeroTypes } from '@db';
import { EffectType, HeroClass, ItemType } from '@enums';
import {
  Creature,
  CreatureEquipment,
  CreatureSettings,
  Hero,
  HeroSettings,
  Monster,
  Shield,
} from '@models';
import { RandomService } from '@services';
import { EffectFabric } from './effect-fabric';
import { ItemFabric } from './item-fabric';

export class CreatureFabric {
  private static randomService: RandomService;
  private static GUID = 0;

  static initialize(randomService: RandomService) {
    CreatureFabric.randomService = randomService;
  }

  static createHero(heroClass: HeroClass): Hero {
    const settings: HeroSettings = HeroTypes.find(p => p.heroClass === heroClass);
    const equipment = CreatureFabric.createCreatureEquipment(settings);

    const newHero = new Hero(
      CreatureFabric.GUID++,
      settings.name,
      settings.img,
      settings.hitPoint,
      equipment
    );
    newHero.heroClass = heroClass;
    newHero.description = settings.description;
    newHero.maxAddonHitPoint = settings.maxAddonHitPoint;
    newHero.maxItemValue = settings.maxArmorValue;
    newHero.abilities = [...settings.abilites];
    newHero.inventory = [...settings.inventory];
    // TODO: убрать тестовое наполнение:
    newHero.effects = settings.effects.map(effectType => EffectFabric.createEffect(effectType));
    newHero.effects.push(EffectFabric.createEffect(EffectType.Poison3));
    newHero.effects.push(EffectFabric.createEffect(EffectType.MagicProtection));
    newHero.inventory.push(ItemFabric.createRandomEquipment());
    newHero.inventory.push(ItemFabric.createRandomEquipment());
    newHero.inventory.push(ItemFabric.createRandomEquipment());
    newHero.inventory.push(ItemFabric.createRandomEquipment());
    newHero.inventory.push(ItemFabric.createRandomEquipment());
    newHero.inventory.push(ItemFabric.createRandomBottle());
    newHero.inventory.push(ItemFabric.createRandomBottle());
    newHero.inventory.push(ItemFabric.createRandomBottle());
    return newHero;
  }

  static createRandomMonsterLevel1(): Monster {
    const randomIndex = CreatureFabric.randomService.getInt(0, CreaturesLevel1.length - 1);
    const settings = CreaturesLevel1[randomIndex];
    const newCreature = CreatureFabric.createMonster(settings);
    return newCreature;
  }

  static createRandomMonsterLevel2(): Monster {
    const randomIndex = CreatureFabric.randomService.getInt(0, CreaturesLevel2.length - 1);
    const settings = CreaturesLevel2[randomIndex];
    const newCreature = CreatureFabric.createMonster(settings);
    return newCreature;
  }

  static createRandomMonsterBoss(): Monster {
    const randomIndex = CreatureFabric.randomService.getInt(0, CreaturesBoss.length - 1);
    const settings = CreaturesBoss[randomIndex];
    const newCreature = CreatureFabric.createMonster(settings);
    return newCreature;
  }

  private static createMonster(settings: CreatureSettings): Monster {
    const equipment = CreatureFabric.createCreatureEquipment(settings);

    const newMonster = new Monster(
      CreatureFabric.GUID++,
      settings.name,
      settings.img,
      settings.hitPoint,
      equipment
    );
    newMonster.description = settings.description;
    newMonster.abilities = [...settings.abilites];
    newMonster.inventory = [...settings.inventory];
    newMonster.effects = settings.effects.map(effectType => EffectFabric.createEffect(effectType));
    return newMonster;
  }

  private static createCreatureEquipment(settings: CreatureSettings) {
    const equipment = new CreatureEquipment();
    equipment.Weapon = ItemFabric.createEquipment(ItemType.Weapon, settings.weapon);
    equipment.Head = ItemFabric.createEquipment(ItemType.Head, settings.head);
    equipment.Hands = ItemFabric.createEquipment(ItemType.Hands, settings.hands);
    equipment.Legs = ItemFabric.createEquipment(ItemType.Legs, settings.legs);
    equipment.Body = ItemFabric.createEquipment(ItemType.Body, settings.body);
    equipment.Shield = ItemFabric.createEquipment(ItemType.Shield, 0, { hitPoints: 0 }) as Shield;
    return equipment;
  }
}
