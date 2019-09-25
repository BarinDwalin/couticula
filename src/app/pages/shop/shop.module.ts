import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';
import { AbilityListComponent } from './ability-list/ability-list.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ShopPage } from './shop.page';

const routes: Routes = [
  {
    path: '',
    component: ShopPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [AbilityListComponent, EquipmentComponent, ShopPage],
  entryComponents: [AbilityListComponent, EquipmentComponent],
})
export class ShopModule {}
