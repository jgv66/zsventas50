import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabusuarioPageRoutingModule } from './tabusuario-routing.module';

import { TabusuarioPage } from './tabusuario.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NotificacionysugerenciaComponent } from '../notificacionysugerencia/notificacionysugerencia.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabusuarioPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TabusuarioPage, NotificacionysugerenciaComponent],
  entryComponents: [NotificacionysugerenciaComponent]
})
export class TabusuarioPageModule {}
