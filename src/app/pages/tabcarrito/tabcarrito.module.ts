import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabcarritoPage } from './tabcarrito.page';

import { ComponentsModule } from '../../components/components.module';

import { AvisoservicioPage } from '../avisoservicio/avisoservicio.page';
import { AvisoservicioPageModule } from '../avisoservicio/avisoservicio.module';

import { BuscarvendedorPage } from '../buscarvendedor/buscarvendedor.page';
import { BuscarvendedorPageModule } from '../buscarvendedor/buscarvendedor.module';

const routes: Routes = [
  {
    path: '',
    component: TabcarritoPage
  }
];

@NgModule({
  entryComponents: [ BuscarvendedorPage, AvisoservicioPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    BuscarvendedorPageModule,
    AvisoservicioPageModule
  ],
  declarations: [TabcarritoPage]
})
export class TabcarritoPageModule {}
