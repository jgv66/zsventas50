import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabusuarioPage } from './tabusuario.page';

const routes: Routes = [
  {
    path: '',
    component: TabusuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabusuarioPageRoutingModule {}
