import { ButtonComponent } from './button/button.component';
import { DiceTargetComponent } from './dices/dice-target/dice-target.component';
import { DiceComponent } from './dices/dice/dice.component';
import { GoldComponent } from './gold/gold.component';
import { HeroInfoShortComponent } from './hero-info-short/hero-info-short.component';
import { HeroesInfoShortComponent } from './heroes-info-short/heroes-info-short.component';
import { ItemInfoShortComponent } from './item-info-short/item-info-short.component';

const SHARED_COMPONENTS: any[] = [
  ButtonComponent,
  DiceComponent,
  GoldComponent,
  HeroInfoShortComponent,
  HeroesInfoShortComponent,
  ItemInfoShortComponent,
  DiceTargetComponent,
];

export {
  SHARED_COMPONENTS,
  ButtonComponent,
  DiceComponent,
  GoldComponent,
  HeroInfoShortComponent,
  HeroesInfoShortComponent,
  ItemInfoShortComponent,
  DiceTargetComponent,
};
