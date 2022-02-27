import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdjuntarrecepcionesPage } from './adjuntarrecepciones.page';
import { BrMaskerModule } from 'br-mask';
import { VerfotoPage } from '../verfoto/verfoto.page';
import { VerfotoPageModule } from '../verfoto/verfoto.module';

@NgModule({
  entryComponents: [ VerfotoPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    VerfotoPageModule
  ],
  declarations: [AdjuntarrecepcionesPage ]
})
export class AdjuntarrecepcionesPageModule {}
