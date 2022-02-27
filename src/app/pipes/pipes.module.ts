import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { DefaultPipe } from './default.pipe';

@NgModule({
  declarations: [ FiltroPipe, DefaultPipe ],
  exports: [ FiltroPipe, DefaultPipe ],
})
export class PipesModule { }
