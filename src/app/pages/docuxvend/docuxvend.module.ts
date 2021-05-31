import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocuxvendPageRoutingModule } from './docuxvend-routing.module';

import { DocuxvendPage } from './docuxvend.page';
import { DetallexvendComponent } from '../detallexvend/detallexvend.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocuxvendPageRoutingModule
  ],
  declarations: [DocuxvendPage, DetallexvendComponent],
  entryComponents: [ DetallexvendComponent ]
})
export class DocuxvendPageModule {}
