import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSegment, ModalController } from '@ionic/angular';

import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { DocumentoPage } from '../documento/documento.page';

@Component({
  selector: 'app-ctacteclientes',
  templateUrl: './ctacteclientes.page.html',
  styleUrls: ['./ctacteclientes.page.scss'],
})
export class CtacteclientesPage implements OnInit {

  @ViewChild( IonSegment, {static: true} ) segment: IonSegment;

  buscando = false;
  segmento = 'Vencidos';
  documentos    = [];

  constructor( private router: Router,
               private modalCtrl: ModalController,
               private baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private funciones: FuncionesService ) { }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.segment.value = 'todos';
    this.segmento      = '';
    this.cargaImpagos();
  }

  segmentChanged( event ) {
    const valorSegmento = event.detail.value;
    //
    if ( valorSegmento === 'todos' ) {
      this.segmento = '';
      return;
    }
    //
    this.segmento = valorSegmento;
  }

  cargaImpagos() {
    this.buscando = true;
    this.netWork.traeUnSP(  'ksp_traeImpagos',
                            { codigo:  this.baseLocal.cliente.codigo,
                              empresa: this.baseLocal.user.EMPRESA },
                              { codigo: this.baseLocal.user.KOFU,
                                nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisaExitooFracaso( data );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  revisaExitooFracaso( data ) {
    this.buscando = false;
    if ( data === undefined || data.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Cliente no presenta documentos impagos', 2 );
    } else {
      this.documentos.push( ...data );
      // suma de totales aqui
    }
  }

  // muestraID( id ) {
  //   this.router.navigate( ['/tabs/documento/' + id.toString() ]);
  // }
  async muestraID( id ) {
    const modal = await this.modalCtrl.create({
      component: DocumentoPage,
      componentProps: { id }
    });
    await modal.present();
  }  

}
