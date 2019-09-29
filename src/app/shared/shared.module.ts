import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SHARED_COMPONENTS } from './components';
import { SHARED_PIPES } from './pipes';

@NgModule({
  declarations: [SHARED_COMPONENTS, SHARED_PIPES],
  imports: [CommonModule, IonicModule],
  exports: [SHARED_COMPONENTS, SHARED_PIPES],
})
export class SharedModule {}
