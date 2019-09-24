import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';
import { StartPage } from './start.page';

const routes: Routes = [
  {
    path: '',
    component: StartPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [StartPage],
})
export class StartModule {}
