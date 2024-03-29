import { Component, OnInit } from '@angular/core';
import { NetworkengineService } from '../../services/networkengine.service';
import { BaselocalService } from '../../services/baselocal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { ModalController } from '@ionic/angular';
import { DocumentoPage } from '../documento/documento.page';

@Component({
  selector: 'app-ultimosmovs',
  templateUrl: './ultimosmovs.page.html',
  styleUrls: ['./ultimosmovs.page.scss'],
})
export class UltimosmovsPage implements OnInit {

  titulo   = 'Ult.Movs.Venta';
  detalles = [];
  buscando = false;
  sistema: any;

  constructor( public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private funciones: FuncionesService,
               private router: Router,
               private modalCtrl: ModalController,
               private parametros: ActivatedRoute ) {
      this.sistema = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
  }

  ngOnInit() {
    if ( this.sistema.tipo === 'N' ) {
      this.titulo = 'Últimas NVV';
    } else {
      this.titulo = ( this.sistema.tipo === 'V' ) ? 'Ultimas Ventas' : 'Ultimas Compras';
    }
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_traeUltimosMovimientos',
                          { codigo:  this.sistema.codigo,
                            empresa: this.baseLocal.user.EMPRESA,
                            sistema: this.sistema.tipo,
                            cliente: ( this.sistema.cliente ? this.sistema.cliente : null ) },
                          { codigo: this.baseLocal.user.KOFU,
                            nombre: this.baseLocal.user.NOKOFU })
        .subscribe( data => { 
          this.revisa( data ); 
        },
        err  => { 
          this.buscando = false;
          this.funciones.msgAlert( 'ATENCION', err ); 
        });
  }
  
  revisa( data ) {
    console.log(data);
    this.buscando = false;
    if ( data === undefined || data.length === 0 ) {
      if ( this.sistema.tipo === 'N' ) {
        this.funciones.muestraySale('Código de producto no presenta NVV pendientes.', 2 );
      } else {
        this.funciones.muestraySale('ATENCION : Código de producto no presenta movimientos.', 2 );
      }
    } else {
      this.detalles = data;
    }
  }

  async verDocumento( id ) {
    const modal = await this.modalCtrl.create({
    component: DocumentoPage,
    componentProps: { id }
    });
      await modal.present();
  }
  // verDocuxmento( id ) {
  //   this.router.navigate( ['/tabs/documento/' + id.toString() ]);
  // }

}
