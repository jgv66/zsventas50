import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocuxvendPage } from './docuxvend.page';

const routes: Routes = [
  {
    path: '',
    component: DocuxvendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocuxvendPageRoutingModule {}
