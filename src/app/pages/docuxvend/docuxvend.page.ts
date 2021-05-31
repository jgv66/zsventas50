import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { DetallexvendComponent } from '../detallexvend/detallexvend.component';

@Component({
  selector: 'app-docuxvend',
  templateUrl: './docuxvend.page.html',
  styleUrls: ['./docuxvend.page.scss'],
})
export class DocuxvendPage implements OnInit {

  @Input() data: any[];

  buscando   = false;
  documentos = [];

  constructor( public baseLocal: BaselocalService,
               private router: Router,
               private modalCtrl: ModalController,
               private funciones: FuncionesService ) {}

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.revisa();
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  revisa() {
    // console.log(this.data);
    if ( this.data === undefined || this.data.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Vendedor no presenta documentos', 2 );
    } else {
      this.documentos = this.data;    
    }
  }

  async muestraID( id ) {
    this.funciones.setter( id );
    // console.log(id);  
    const modal = await this.modalCtrl.create({
      component: DetallexvendComponent,
    });
    return await modal.present();
  }  

}
