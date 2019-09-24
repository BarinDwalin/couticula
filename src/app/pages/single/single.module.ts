import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SinglePage } from './single.page';

const routes: Routes = [
  {
    path: '',
    component: SinglePage,
  },
];

@NgModule({
  imports: [IonicModule, RouterModule.forChild(routes)],
  declarations: [SinglePage],
})
export class SingleModule {}
