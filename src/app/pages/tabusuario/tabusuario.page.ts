import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';
import { DocuxvendPage } from '../docuxvend/docuxvend.page';
import { NotificacionysugerenciaComponent } from '../notificacionysugerencia/notificacionysugerencia.component';

const DUMMY_DATE = new Date();

@Component({
  selector: 'app-tabusuario',
  templateUrl: './tabusuario.page.html',
  styleUrls: ['./tabusuario.page.scss'],
})
export class TabusuarioPage implements OnInit {

  segment: string = "venta";
  deberes = [];
  deberesDet = [];
  contribuciones = [];
  miFoto;
  arr = new Array(8);
  buscando = false;
  buscandoChico = false;
  desde: Date;
  hasta: Date;

  constructor( public baseLocal: BaselocalService,
               private funciones: FuncionesService,
               private netWork: NetworkengineService,
               private router: Router,
               private popoverCtrl: PopoverController,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    const dateStr = new Date();
    this.hasta    = dateStr;
    this.desde    = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - ( dateStr.getDate() - 1 ) ) ); 
    //
    this.getMyImage()
    this.getMisVentas();
    this.getMisContribuciones();
  }
  
  getMyImage() {
    this.netWork.consultaEstandar( 'getimage',
                                   { usuario: this.baseLocal.user.KOFU },
                                   { codigo:  this.baseLocal.user.KOFU,
                                     nombre:  this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.miImagen( data );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });    
  }
  miImagen( data ) {
    if ( data.resultado === 'ok') {
      this.miFoto = this.funciones.url + '/static/img/' + data.datos[0].image_name;
    }
  }

  doRefresh(event) {
    this.deberes = [];
    this.getMisVentas( event );
    this.getMisContribuciones( event );
  }

  getMisVentas( event? ) {
    this.buscando = true;
    this.netWork.consultaEstandar( 'ksp_traeMisDeberes',
                                   { usuario: this.baseLocal.user.KOFU,
                                     empresa: this.baseLocal.user.EMPRESA,
                                     desde:   this.desde,
                                     hasta:   this.hasta },
                                   { codigo:  this.baseLocal.user.KOFU,
                                     nombre:  this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisa( data, event );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });    
  }
  revisa( data, event ) {
    // console.log(data);
    this.buscando = false;
    // const rs = data;
    if ( data === undefined || data.datos.length === 0 ) {
      this.funciones.muestraySale('Usuario no presenta información', 1.2 );
      this.deberes = [
        {cuantos:0,tipo:'Cotizaciones',desde: this.desde,hasta:this.hasta},
        {cuantos:0,tipo:'Notas de Venta',desde: this.desde,hasta:this.hasta},
        {cuantos:0,tipo:'Facturas',desde: this.desde,hasta:this.hasta},
        {cuantos:0,tipo:'Boletas',desde: this.desde,hasta:this.hasta},
        {cuantos:0,tipo:'Notas de Crédito',desde: this.desde,hasta:this.hasta}
      ]
    } else {
      this.deberes = data.datos;
      if ( event ) {
        event.target.complete();
      }
    }
  }

  getMisContribuciones( event? ) {
    this.buscando = true;
    this.netWork.consultaEstandar( 'ksp_traeMisContribuciones',
                                   { usuario: this.baseLocal.user.KOFU,
                                     empresa: this.baseLocal.user.EMPRESA,
                                     desde:   this.desde,
                                     hasta:   this.hasta },
                                   { codigo:  this.baseLocal.user.KOFU,
                                     nombre:  this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisaContrib( data, event );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });    
  }
  revisaContrib( data, event ) {
    // console.log(data.datos);
    this.buscando = false;
    // const rs = data;
    if ( data === undefined || data.datos.length === 0 ) {
      // this.funciones.muestraySale('Usuario no presenta información', 1.2 );
      this.contribuciones = [
        {cuantos:0,tipo:'Sugerencias',desde: this.desde,hasta:this.hasta},
        {cuantos:0,tipo:'Notificaciones',desde: this.desde,hasta:this.hasta}
      ]
    } else {
      this.contribuciones = data.datos;
      if ( event ) {
        event.target.complete();
      }
    }
  }

  rescataDato( item ) {
    // console.log(item);
    if ( item.detalle === false ) {
      //
      this.deberes.forEach( it => { it.detalle = false });
      this.deberesDet = [];
      //
      item.detalle = true;
      this.buscandoChico = true;
      this.netWork.consultaEstandar( 'ksp_misDeberesTop',
                                      { usuario: this.baseLocal.user.KOFU,
                                        tipodoc: ( item.TIDO === 'NVV' && item.tipo === 'Notas de Venta Pend.' ? 'NVP' : item.TIDO ),
                                        empresa: this.baseLocal.user.EMPRESA,
                                        desde:   this.desde,
                                        hasta:   this.hasta },
                                      { codigo:  this.baseLocal.user.KOFU,
                                        nombre:  this.baseLocal.user.NOKOFU } )
          .subscribe( data => { this.revisaDato( data );           },
          err  => { this.funciones.msgAlert( 'ATENCION', err ); });    
    } else {
      item.detalle = false;
    }
  }
  async revisaDato( data ){
    const modal = await this.modalCtrl.create({
      component: DocuxvendPage,
      componentProps: { data: data.datos },
    });
    return await modal.present();
  }

  async rescataInformacion( item ) {
    const modal = await this.modalCtrl.create({
      component: NotificacionysugerenciaComponent,
      componentProps: { item,
                        desde: this.desde,
                        hasta: this.hasta,
                        tipo: item.tipomov,
                        estado: item.estado,
                      },
    });
    return await modal.present();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  async tomarFoto() {
    // Take a photo
    await this.funciones.addImage( this.baseLocal.user.KOFU );
    // console.log(this.funciones.xfoto);
    this.miFoto = ( this.funciones.xfoto === undefined ) ? this.miFoto : this.funciones.xfoto;
  }

  async opcionFechas( event ) {
    //
    const popover = await this.popoverCtrl.create({
      component: TrespuntosComponent,
      componentProps: { quees: 'usuario' },
      event,
      mode: 'ios',
      translucent: false
    });
    await popover.present();
    //
    const { data } = await popover.onDidDismiss();
    if ( data ) {
      if ( data.opcion.texto === 'Ayer' ) {
        const dateStr = new Date();
        const days = -1;
        const result = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + days));
        //
        this.desde = result;
        this.hasta = result;
        //
        this.getMisVentas();
        this.getMisContribuciones();
        //
      } else if ( data.opcion.texto === 'Esta semana' ) {
        //
        const dateStr = new Date();
        const quedia  = dateStr.getDay();  // dom=0, lun=1, mar=2....
        //
        if ( quedia === 0 ) { 
          //
          this.hasta = dateStr;
          const result = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - 6 ));
          this.desde = result;
          this.getMisVentas();
          this.getMisContribuciones();
          //
        } else if ( quedia === 1 ) { 
          //
          this.desde = dateStr;
          const result = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + 6 ));
          this.hasta = result;
          this.getMisVentas();
          this.getMisContribuciones();
          //
        } else { 
          const diaIni = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - ( quedia - 1 ) ));
          this.desde = diaIni;
          const diaFin = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + ( 7 - quedia ) ));
          this.hasta = diaFin;
          this.getMisVentas();
          this.getMisContribuciones();
          //
        }
      } else if ( data.opcion.texto === 'Semana pasada' ) {
        //
        const result = new Date();
        const dateStr  = new Date(new Date(result).setDate(new Date(result).getDate() - 7 ));
        const quedia  = result.getDay();  // dom=0, lun=1, mar=2....
        // console.log(result,quedia);
        //
        if ( quedia === 0 ) { 
          //
          this.hasta = dateStr;
          const result = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - 6 ));
          this.desde = result;
          this.getMisVentas();
          this.getMisContribuciones();
          //
        } else if ( quedia === 1 ) { 
          //
          this.desde = dateStr;
          const result = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + 6 ));
          this.hasta = result;          
          this.getMisVentas();
          this.getMisContribuciones();
          //
        } else { 
          const diaIni = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - ( quedia - 1 ) ));
          this.desde = diaIni;
          const diaFin = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + ( 7 - quedia ) ));
          this.hasta = diaFin;
          this.getMisVentas();
          this.getMisContribuciones();
          //
        }
      } else if ( data.opcion.texto === 'Este mes' ) {
        //
        const dateStr = new Date();
        this.hasta    = dateStr;
        this.desde    = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - ( dateStr.getDate() - 1 ) ) ); 
        this.getMisVentas();
        this.getMisContribuciones();
        //
      } else if ( data.opcion.texto === 'Mes pasado' ) {
        //
        const dateStr = new Date();
        this.hasta    = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() - ( dateStr.getDate() ) ) ); 
        this.desde    = new Date(new Date(this.hasta).setDate(new Date(this.hasta).getDate() - ( this.hasta.getDate() - 1 ) ) ); 
        this.getMisVentas();
        this.getMisContribuciones();
        //
      }
    }
  }
    
}
