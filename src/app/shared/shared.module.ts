import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SHARED_COMPONENTS } from './components';
import { SHARED_PIPES } from './pipes';
import { SHARED_SERVICES } from './services';

@NgModule({
  declarations: [SHARED_COMPONENTS, SHARED_PIPES],
  imports: [CommonModule, IonicModule],
  exports: [SHARED_COMPONENTS, SHARED_PIPES],
  providers: [SHARED_SERVICES],
})
export class SharedModule {}
