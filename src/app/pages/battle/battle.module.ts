import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InlineSVGModule } from 'ng-inline-svg';

import { SharedModule } from '@shared/shared.module';
import { BattlePage } from './battle.page';
import { CreatureInfoShortComponent } from './creature-info-short/creature-info-short.component';
import { CreaturesListComponent } from './creatures-list/creatures-list.component';
import { TargetComponent } from './target/target.component';

const routes: Routes = [
  {
    path: '',
    component: BattlePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [CreatureInfoShortComponent, CreaturesListComponent, TargetComponent, BattlePage],
})
export class BattleModule {}
