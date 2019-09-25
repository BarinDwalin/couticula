import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InlineSVGModule } from 'ng-inline-svg';

import { SharedModule } from '@shared/shared.module';
import { CellComponent } from './cell/cell.component';
import { EventAttackComponent } from './event-attack/event-attack.component';
import { EventSearchComponent } from './event-search/event-search.component';
import { EventTreasuresComponent } from './event-treasures/event-treasures.component';
import { FieldComponent } from './field/field.component';
import { MapPage } from './map.page';

const routes: Routes = [
  {
    path: '',
    component: MapPage,
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
  declarations: [
    CellComponent,
    EventAttackComponent,
    EventSearchComponent,
    EventTreasuresComponent,
    FieldComponent,
    MapPage,
  ],
  entryComponents: [EventAttackComponent, EventSearchComponent, EventTreasuresComponent],
})
export class MapModule {}
