import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichatecnicaPage } from './fichatecnica.page';

const routes: Routes = [
  {
    path: '',
    component: FichatecnicaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichatecnicaPage]
})
export class FichatecnicaPageModule {}
