import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UltimosmovsPage } from './ultimosmovs.page';

const routes: Routes = [
  {
    path: '',
    component: UltimosmovsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UltimosmovsPage]
})
export class UltimosmovsPageModule {}
