import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { AlertController, IonSegment } from '@ionic/angular';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.page.html',
  styleUrls: ['./sugerencias.page.scss'],
})
export class SugerenciasPage implements OnInit {

  @ViewChild( IonSegment, {static: true} ) segment: IonSegment;

  segmento = 'Ingreso';
  enviando = false;
  sistema: any;
  prodbueno = null;
  preciomuybarato = null;
  prodconstock = null;
  prodconquiebre = null;
  cantidad = 0;
  observaciones = '';
  pendientes = [];
  informados = [];
  config;

  constructor( private funciones: FuncionesService,
               public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private router: Router,
               private alertCtrl: AlertController,
               private parametros: ActivatedRoute) {
      this.sistema = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
  }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    // console.log('ngOnInit',this.sistema);
    this.baseLocal.obtenUltimoConfig()
        .then( data => { 
          this.config = data;
        });
    this.segment.value = this.segmento;
    this.rescatarMisSugerencias();
  }

  segmentChanged( event ) {
    const valorSegmento = event.detail.value;
    this.segmento = valorSegmento;
  }

  rescatarMisSugerencias() {
    this.netWork.consultaEstandar(  'ksp_rescatarMisSugerencias',
                                    { codigo: this.baseLocal.user.KOFU },
                                    { codigo: this.baseLocal.user.KOFU,
                                      nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisaSuger( data );           },
                    err  => { this.funciones.msgAlert( '', err ); });
  }
  async revisaSuger( data ) {
    // console.log('revisaSuger', data[0]);
    try {
      if ( data === undefined || data === [] ) {
        this.funciones.muestraySale('No existen sugerencias que desplegar', 2 );
        this.pendientes = [];
        this.informados = [];
      } else {
        data.forEach( item => {
          if ( item.tipo === 'P' ) {
            this.pendientes.push( item );
          } else if ( item.tipo === 'C' ) {
            this.informados.push( item );
            // console.log(this.informados);
          }
        });
        // this.pendientes = await data.filter( item => { item.tipo === 'P' }).slice(); console.log(this.pendientes);
        // this.informados = await data.filter( item => { item.tipo === 'C' }).slice(); console.log(this.informados);
      }
    } catch (error) {
      console.log('sin data');
    }
  }

  limpiar() {
    this.prodbueno       = null;
    this.preciomuybarato = null;
    this.prodconstock    = null;
    this.prodconquiebre  = null;
    this.observaciones   = null;
    this.cantidad        = null;
    this.enviando        = false;
  }

  enviarSugerencia() {
    //
    if (this.prodbueno === null &&
        this.preciomuybarato === null &&
        this.prodconstock === null &&
        this.prodconquiebre === null &&
        ( this.cantidad === null || this.cantidad === 0 ) &&
        (this.observaciones === null || this.observaciones === '' )) {
        this.funciones.msgAlertErr('Debe completar algun dato para grabar la sugerencia.');
      } else {
        this.enviando = true;
        this.netWork.consultaEstandar(  'ksp_enviarSugerencias',
                                        { sucursal:        this.baseLocal.user.KOSU,
                                          usuario:         this.baseLocal.user.KOFU,
                                          observac:        this.observaciones,
                                          cantidad:        ( (this.cantidad === null || this.cantidad === 0) ? 0 : this.cantidad ),
                                          codprod:         this.sistema.codigo,
                                          codtecnico:      this.sistema.tecnico,
                                          descrip:         this.sistema.descrip,
                                          prodbueno:       (this.prodbueno       === 'si') ? 1 : ((this.prodbueno       === 'no') ? 0 : null ),
                                          preciomuybarato: (this.preciomuybarato === 'si') ? 1 : ((this.preciomuybarato === 'no') ? 0 : null ),
                                          prodconstock:    (this.prodconstock    === 'si') ? 1 : ((this.prodconstock    === 'no') ? 0 : null ),
                                          prodconquiebre:  (this.prodconquiebre  === 'si') ? 1 : ((this.prodconquiebre  === 'no') ? 0 : null ) },
                                        { codigo: this.baseLocal.user.KOFU,
                                          nombre: this.baseLocal.user.NOKOFU } )
            .subscribe( data => { this.revisa( data );           },
                        err  => { this.funciones.msgAlert( '', err ); });
      }
  }
  revisa( data ) {
    this.enviando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('Sugerencia presenta problemas al intentar grabación', 2 );
    } else {
      this.funciones.muestraySale(data[0].mensaje, 1 );
      if ( data[0].resultado === true ) {
        // this.navCtrl.pop();
        this.limpiar();
      }
    }
  }

  sinImagen( event ) {
    const imgFake = './assets/imgs/no-img.png';
    // console.log(event);
  }

  async darCierre( informado ) {
    if ( informado.estadorevisado === true ) {
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
