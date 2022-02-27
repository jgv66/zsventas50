import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabtareaPage } from './tabtarea.page';
import { ComponentsModule } from '../../components/components.module';
import { MedidasnuevasPageModule } from '../medidasnuevas/medidasnuevas.module';
import { MedidasnuevasPage } from '../medidasnuevas/medidasnuevas.page';
import { AdjuntarrecepcionesPage } from '../adjuntarrecepciones/adjuntarrecepciones.page';
import { AdjuntarrecepcionesPageModule } from '../adjuntarrecepciones/adjuntarrecepciones.module';

const routes: Routes = [
  {
    path: '',
    component: TabtareaPage
  }
];

@NgModule({
  entryComponents: [ MedidasnuevasPage, AdjuntarrecepcionesPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),    
    ComponentsModule,
    MedidasnuevasPageModule,
    AdjuntarrecepcionesPageModule
  ],
  declarations: [TabtareaPage]
})
export class TabtareaPageModule {}
