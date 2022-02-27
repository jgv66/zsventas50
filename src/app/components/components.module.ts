import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ExpandheaderComponent } from './expandheader/expandheader.component';
import { FlashCardComponent } from './flash-card/flash-card.component';
import { CardprodComponent } from './cardprod/cardprod.component';
import { ListprodComponent } from './listprod/listprod.component';
import { TrespuntosComponent } from './trespuntos/trespuntos.component';
import { MovdoccliComponent } from './movdoccli/movdoccli.component';
import { MenuclientesComponent } from 'src/app/components/menuclientes/menuclientes.component';

@NgModule({
  declarations: [ CardprodComponent,
                  ListprodComponent,
                  ExpandheaderComponent,
                  FlashCardComponent,
                  TrespuntosComponent,
                  MovdoccliComponent,
                  MenuclientesComponent ],
  exports:      [ CardprodComponent,
                  ListprodComponent,
                  ExpandheaderComponent,
                  FlashCardComponent,
                  TrespuntosComponent,
                  MovdoccliComponent,
                  MenuclientesComponent ],
  imports:      [ CommonModule, IonicModule, FormsModule ]
})

export class ComponentsModule { }
