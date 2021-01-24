import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuseteoPage } from './menuseteo.page';
import { ComponentsModule } from '../../components/components.module';
import { MovdoccliComponent } from '../../components/movdoccli/movdoccli.component';
import { BuscarclientesPage } from '../buscarclientes/buscarclientes.page';
import { BuscarclientesPageModule } from '../buscarclientes/buscarclientes.module';
import { ModifclientesPage } from '../modifclientes/modifclientes.page';
import { ModifclientesPageModule } from '../modifclientes/modifclientes.module';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';
import { PatentesPageModule } from '../patentes/patentes.module';
import { PatentesPage } from '../patentes/patentes.page';

const routes: Routes = [
  {
    path: '',
    component: MenuseteoPage
  }
];

@NgModule({
  entryComponents: [ MovdoccliComponent,
                     BuscarclientesPage,
                     ModifclientesPage,
                     TrespuntosComponent,
                     PatentesPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    BuscarclientesPageModule,
    ModifclientesPageModule,
    PatentesPageModule
  ],
  declarations: [MenuseteoPage]
})
export class MenuseteoPageModule {}
