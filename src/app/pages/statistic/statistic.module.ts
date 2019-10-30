import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { StatisticPage } from './statistic.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: StatisticPage,
      },
    ]),
  ],
  declarations: [StatisticPage],
})
export class StatisticPageModule {}
