import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { DocumentoPage } from '../documento/documento.page';

@Component({
  selector: 'app-ultimosdocs',
  templateUrl: './ultimosdocs.page.html',
  styleUrls: ['./ultimosdocs.page.scss'],
})
export class UltimosdocsPage implements OnInit {

  buscando   = false;
  documentos = [];
  td;
  scanActive=false;

  constructor( public baseLocal: BaselocalService,
               private router: Router,
               private modalCtrl: ModalController,
               private parametros: ActivatedRoute,
               private netWork: NetworkengineService,
               private funciones: FuncionesService ) {
      this.td = this.parametros.snapshot.paramMap.get('td');
  }

  ngOnInit() {
    // if ( !this.baseLocal.user ) {
    //   this.router.navigateByUrl('/login');
    // }
    this.traeDocumentos();
  }

  traeDocumentos() {
    this.buscando = true;
    this.netWork.traeUnSP(  'ksp_traeUltimosDocs',
                            { cliente: this.baseLocal.cliente.codigo,
                              empresa: this.baseLocal.user.EMPRESA,
                              tipo:    this.td },
                              { codigo: this.baseLocal.user.KOFU,
                                nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisa( data );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }
  
  revisa( data ) {
    // console.log(data);
    this.buscando = false;
    const rs = data;
    if ( data === undefined || data.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Cliente no presenta documentos', 2 );
    } else {
      this.documentos.push( ...data );
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
