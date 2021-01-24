import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UltimosdocsPage } from './ultimosdocs.page';

const routes: Routes = [
  {
    path: '',
    component: UltimosdocsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UltimosdocsPage]
})
export class UltimosdocsPageModule {}
