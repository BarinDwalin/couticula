import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InlineSVGModule } from 'ng-inline-svg';

import { CardHeroComponent } from './card-hero/card-hero.component';
import { ChoiceHeroPage } from './choice-hero.page';

const routes: Routes = [
  {
    path: '',
    component: ChoiceHeroPage,
  },
];

@NgModule({
  imports: [CommonModule, InlineSVGModule.forRoot(), IonicModule, RouterModule.forChild(routes)],
  declarations: [CardHeroComponent, ChoiceHeroPage],
})
export class ChoiceHeroModule {}
