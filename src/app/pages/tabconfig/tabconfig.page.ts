import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonCardContent } from '@ionic/angular';
import { Router } from '@angular/router';

import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';

@Component({
  selector: 'app-tabconfig',
  templateUrl: './tabconfig.page.html',
  styleUrls: ['./tabconfig.page.scss'],
})
export class TabconfigPage {

  // collapsed = true;
  collapsedFiltro = true;
  collapsedConfig = true;
  collapsedOrden  = true;

  @ViewChild( 'filtros', {static: true} ) filt: IonCardContent;
  @ViewChild( 'config',  {static: true} ) conf: IonCardContent;
  @ViewChild( 'orden',   {static: true} ) orde: IonCardContent;
  
  buscando = false;
  usuario;
  config;

  constructor( private funciones: FuncionesService,
               private netWork: NetworkengineService,
               public baseLocal: BaselocalService,
               private alertCtrl: AlertController ) { 
    //
    this.usuario = this.baseLocal.user;
    this.config  = this.baseLocal.config;                 
    //
  }

  ionViewWillLeave() {
    // console.log('saliendo',this.config);
    this.baseLocal.guardaUltimoConfig( this.config );
  }

  toggleAccordion( caso ) {
    if ( caso === 1 ) {
      this.collapsedFiltro = ! this.collapsedFiltro;
    } else if ( caso === 2 ) {
      this.collapsedConfig = ! this.collapsedConfig;
    } else if ( caso === 3 ) {
      this.collapsedOrden = ! this.collapsedOrden;
    }
  }

  cambiarBodega() {
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_BodegaMias',
                          { empresa: this.baseLocal.user.EMPRESA },
                          { codigo: this.baseLocal.user.KOFU,
                            nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( bodegas => { this.revisaEoFBM( bodegas ); },
                    err     => { this.buscando = false;
                                 this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFBM( bodegas ) {
    this.buscando = false;
    if ( bodegas === undefined || bodegas.lenght === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Usted no tiene permiso para revisar todas las bodegas. Intente con otros datos.');
    } else {
      this.seleccionarBodega( bodegas );
    }
  }
  async seleccionarBodega( bodegas ) {
    if ( bodegas.length ) {
        //
        const nBodegas = [];
        bodegas.forEach( element => {
          nBodegas.push( { type: 'radio', label: element.bodega + ' - ' + element.nombrebodega.trim(), value: element } );
        });
        //
        const alertBod = await this.alertCtrl.create({
          header: 'Bodegas',
          message: 'Disponibles según sus permisos',
          inputs: nBodegas,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {}
            },
            {
              text: 'Ok',
              handler: (data) => { this.usuario.BODEGA    = data.bodega;
                                   this.usuario.nombrebod = data.nombrebodega;
                                   this.usuario.KOSU      = data.sucursal;
                                   this.usuario.nombresuc = data.nombresucursal;
                                   this.baseLocal.user   = this.usuario; }
            }
          ]
        });
        await alertBod.present();
        //
    } else {
        this.funciones.msgAlert('ATENCION', 'Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas. Intente con otros datos.' );
    }
  }
  cambiarLista() {
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_ListasMias',
                           { empresa: this.baseLocal.user.EMPRESA },
                           { codigo:  this.baseLocal.user.KOFU,
                             nombre:  this.baseLocal.user.NOKOFU } )
        .subscribe( listas => { this.revisaEoFLP( listas ); },
                    err    => { this.buscando = false;
                                this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFLP( listas ) {
    this.buscando = false;
    if ( listas === undefined || listas.length === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Usted no tiene permiso para revisar todas las listas. Intente con otros datos.');
    } else {
      this.seleccionarLista( listas );
    }
  }
  async seleccionarLista( listas ) {
    if ( listas.length ) {
        //
        const nListas = [];
        listas.forEach( element => {
          nListas.push( { type: 'radio', label: element.listaprecio + '/' + element.tipolista + ' - ' + element.nombrelista.trim(), value: element } );
        });
        //
        const alertLis = await this.alertCtrl.create({
          header: 'Listas de Precio',
          message: 'Disponibles según sus permisos',
          inputs: nListas,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {}
            },
            {
              text: 'Ok',
              handler: (data) => { this.usuario.LISTAMODALIDAD = data.listaprecio;
                                   this.usuario.listamodalidad = data.listaprecio;
                                   this.usuario.nombrelista    = data.nombrelista;
                                   this.usuario.NOKOLT         = data.nombrelista;
                                   this.usuario.nokolt         = data.nombrelista;
                                   this.baseLocal.user         = this.usuario; }
            }
          ]
        });
        await alertLis.present();
        //
    } else {
        this.funciones.msgAlert('ATENCION', 'Sin permiso para revisar todas las listas de precio. Intente con otros datos.' );
    }
  }

}
