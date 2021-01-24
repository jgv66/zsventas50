import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabinicioPage } from './tabinicio.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';

const routes: Routes = [
  {
    path: '',
    component: TabinicioPage
  }
];

@NgModule({
  entryComponents: [ TrespuntosComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [TabinicioPage]
})
export class TabinicioPageModule {}
