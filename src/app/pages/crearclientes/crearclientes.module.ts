import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearclientesPage } from './crearclientes.page';
import { BuscarcomunaPageModule } from '../buscarcomuna/buscarcomuna.module';
import { BuscarcomunaPage } from '../buscarcomuna/buscarcomuna.page';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: CrearclientesPage
  }
];

@NgModule({
  entryComponents: [BuscarcomunaPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    BuscarcomunaPageModule,
    PipesModule
  ],
  declarations: [CrearclientesPage]
})
export class CrearclientesPageModule {}
