import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSegment, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  @ViewChild( IonSegment, {static: true} ) segment: IonSegment;

  segmento = 'Ingreso';
  enviando = false;
  sistema: any;

  nombre = '';
  email = '';
  fono = '';
  observaciones = '';
  cantidad ;
  pendientes = [];
  informados = [];
  config;

  constructor( private funciones: FuncionesService,
               public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private router: Router,
               private alertCtrl: AlertController,
               private navCtrl: NavController,
               private parametros: ActivatedRoute) {
      this.sistema = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
  }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.rescatarMisNotificaciones('P');
    this.rescatarMisNotificaciones('C');
    this.segment.value = this.segmento;
    //
    this.baseLocal.obtenUltimoConfig()
        .then( data => { 
          this.config = data;
        });    
    //
    if ( this.baseLocal.cliente.codigo !== '' ) {
      this.nombre = this.baseLocal.cliente.razonsocial;
      this.email = this.baseLocal.cliente.email;
      this.fono = this.baseLocal.cliente.telefonos
    }
    //
  }

  segmentChanged( event ) {
    const valorSegmento = event.detail.value;
    this.segmento = valorSegmento;
  }

  rescatarMisNotificaciones( tipo ) {
    this.netWork.consultaEstandar(  'ksp_rescatarMisNotificaciones',
                                    { bodega: this.baseLocal.user.bodega, tipo },
                                    { codigo: this.baseLocal.user.KOFU,
                                      nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisaNotif( data, tipo );           },
                    err  => { this.funciones.msgAlert( '', err ); });
  }
  revisaNotif( data, tipo ) {
    // console.log('revisaNotif', data);
    try {
      if ( data === undefined || data === [] ) {
        this.funciones.muestraySale('Notificaciones presenta problemas al intentar leer', 2 );
      } else {
        if ( tipo === 'P' ) {
          this.pendientes = data;
        } else {
          this.informados = data;
        }
      }
    } catch (error) {
      console.log('sin data');
    }
  }

  enviarNotificacion() {
    if ( this.email === '' || this.cantidad === 0 ) {
      this.funciones.msgAlertErr('Debe completar los datos obligatorios');
    } else {
      this.enviando = true;
      this.netWork.consultaEstandar(  'ksp_enviarNotificaciones',
                                      { sucursal:      this.baseLocal.user.KOSU,
                                        usuario:       this.baseLocal.user.KOFU,
                                        codprod:       this.sistema.codigo,
                                        codtecnico:    this.sistema.tecnico,
                                        descrip:       this.sistema.descrip,
                                        tipo:          'STOCK',
                                        nombre:        this.nombre,
                                        email:         this.email,
                                        fono:          this.fono,
                                        observaciones: this.observaciones,
                                        cantidad:      this.cantidad },
                                      { codigo:        this.baseLocal.user.KOFU,
                                        nombre:        this.baseLocal.user.NOKOFU,
                                        email:         this.baseLocal.user.EMAIL } )
          .subscribe( data => { this.revisa( data );           },
                      err  => { this.funciones.msgAlert( '', err ); });
    }
  }
  revisa( data ) {
    // console.log(data);
    this.enviando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('Notificaciones presenta problemas al intentar grabación', 2 );
    } else {
      this.funciones.muestraySale(data[0].mensaje, 1 );
      if ( data[0].resultado === true ) {
        this.navCtrl.pop();
      }
    }
  }

  async darCierre( informado ) {
    if ( informado.estadorevisado === true ) {
      const alert = await this.alertCtrl.create({
        message: 'Esta notificación se dará por cerrada. Continúa?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => { informado.estadorevisado = false; }
          }, {
            text: 'Sí',
            handler: () => {
              this.cerrarNotificacion( informado );
            }
          }
        ]
      });
      await alert.present();
    }
  }

  cerrarNotificacion( informado ) {
      this.enviando = true;
      this.netWork.consultaEstandar(  'ksp_cerrarNotificacion',
                                      { id: informado.id },
                                      { codigo: this.baseLocal.user.KOFU,
                                        nombre: this.baseLocal.user.NOKOFU,
                                        email:  this.baseLocal.user.EMAIL } )
          .subscribe( data => { 
              informado.revisado = 1;
              informado.frevision = 'AHORA';
              this.funciones.muestraySale('Notificación Cerrada',1.5,'bottom'); 
            },
            err  => { this.funciones.msgAlert( '', err ); 
            });
  }

}
