import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';
import { Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';

@Component({
  selector: 'app-notificacionysugerencia',
  templateUrl: './notificacionysugerencia.component.html',
  styleUrls: ['./notificacionysugerencia.component.scss'],
})
export class NotificacionysugerenciaComponent implements OnInit {

  @Input() item: any[];
  @Input() desde;
  @Input() hasta;
  @Input() tipo: string;
  @Input() estado: string;

  enviando = false;
  buscando   = false;
  sugerencias = [];
  titulo = '';

  constructor( public baseLocal: BaselocalService,
               private router: Router,
               private netWork: NetworkengineService,
               private modalCtrl: ModalController,
               private alertCtrl: AlertController,
               private funciones: FuncionesService ) {}

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.titulo = ( this.tipo === 'S' ) ? 'Sugerencias' : 'Notificaciones';
    this.revisaNoS();
  }

  revisaNoS() {
    this.buscando = true;
    this.netWork.consultaEstandar( 'ksp_traeMisNotoSug',
                                   { usuario: this.baseLocal.user.KOFU,
                                     desde:   this.desde,
                                     hasta:   this.hasta,
                                     tipo:    this.tipo,
                                     estado:  this.estado },
                                   { codigo:  this.baseLocal.user.KOFU,
                                     nombre:  this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisaNoSResultado( data );           },
                    err  => { this.buscando = false; this.funciones.msgAlert( 'ATENCION', err ); });        
  }
  revisaNoSResultado( data ) {
    this.buscando = false;
    console.log('revisaNoSResultado', data);
    try {
      if ( data === undefined || data.datos === [] ) {
        this.funciones.muestraySale('No existen sugerencias o notificaciones que desplegar', 2 );
      } else {
        this.sugerencias = [ ...data.datos ];
      }
    } catch (error) {
      console.log('sin data');
    }    
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  async darCierre(informado) {
    const alert = await this.alertCtrl.create({
      message: 'Esta sugerencia se dará por cerrada. Continúa?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { informado.estadorevisado = false; }
        }, {
          text: 'Sí',
          handler: () => {
            this.cerrarSugerencia( informado );
          }
        }
      ]
    });
    await alert.present();
  }    

  cerrarSugerencia( informado ) {
    this.enviando = true;
    this.netWork.consultaEstandar(  'ksp_cerrarSugerencia',
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
