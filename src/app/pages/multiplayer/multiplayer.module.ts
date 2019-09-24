import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MultiplayerPage } from './multiplayer.page';

const routes: Routes = [
  {
    path: '',
    component: MultiplayerPage,
  },
];

@NgModule({
  imports: [IonicModule, RouterModule.forChild(routes)],
  declarations: [MultiplayerPage],
})
export class MultiplayerModule {}
