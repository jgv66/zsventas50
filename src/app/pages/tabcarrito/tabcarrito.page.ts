import { Component, ViewChild } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, IonList, IonCardContent } from '@ionic/angular';
import { NetworkengineService } from '../../services/networkengine.service';
import { BuscarvendedorPage } from '../buscarvendedor/buscarvendedor.page';
import { AvisoservicioPage } from '../avisoservicio/avisoservicio.page';

@Component({
  selector: 'app-tabcarrito',
  templateUrl: './tabcarrito.page.html',
  styleUrls: ['./tabcarrito.page.scss'],
})
export class TabcarritoPage {

  @ViewChild('lista', { static: false }) lista: IonList;

  collapsedOcc  = true;
  collapsedObs  = true;
  collapsedKM   = true;
  collapsedSave = true;

  @ViewChild( 'filtros', {static: false} ) filt: IonCardContent;

  enviando = false;
  queHacerConCarrito = 'Acción a realizar?';
  textoObs = '';
  textoOcc = '';
  cantidadKM = 0;
  cTo = '';
  cCc = '';

  constructor( public funciones: FuncionesService,
               public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private alertCtrl: AlertController,
               private modalCtrl: ModalController,
               private router: Router ) { }

  toggleAccordion( caso ) {
    if ( caso === 1 ) {
      this.collapsedOcc = ! this.collapsedOcc;
    } else if ( caso === 2 ) {
      this.collapsedObs = ! this.collapsedObs;
    } else if ( caso === 3 ) {
      this.collapsedKM = ! this.collapsedKM;
    } else if ( caso === 4 ) {
      this.collapsedSave = ! this.collapsedSave;
    }
  }

  sumaCarrito() {
    return this.funciones.sumaCarrito();
  }

  async quitarDelCarro( producto ) {
    const alert = await this.alertCtrl.create({
      header: 'ATENCION',
      message: 'Este item será eliminado del carrito de compras. Está seguro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Sí, borrar',
          handler: () => {this.funciones.quitarDelCarro( producto ); }
        }
      ]
    });
    await alert.present();
  }

  cambiarCantidad( producto ) {
    this.funciones.modificaCantidad( producto );
    this.lista.closeSlidingItems();
  }

  infoProducto( producto ) {
    const dataParam = JSON.stringify({ tipo: 'V',
                                       codigo: producto.codigo,
                                       cliente: this.baseLocal.cliente.codigo });
    this.router.navigate(['/tabs/ultmovs', dataParam]);
    this.lista.closeSlidingItems();
  }

  async cambiarKofu( producto ) {
    const modal = await this.modalCtrl.create({
      component: BuscarvendedorPage,
      componentProps: { kofu: producto.vendedor }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if ( data ) {
      producto.vendedor = data.dato.kofu;
      producto.nombrevend = data.dato.nombre;
    }
    this.lista.closeSlidingItems();
  }

  async addAvisoServicio( producto ) {
    console.log(producto);
    const modal = await this.modalCtrl.create({
      component: AvisoservicioPage,
      componentProps: { producto }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if ( data ) {
      console.log( data )
    }
  }

  accionDelCarrito() {
    if ( this.queHacerConCarrito === 'Grabar una Pre-Venta' ) {
      this.enviarCarrito( 'PRE' );
    } else if ( this.queHacerConCarrito === 'Grabar una cotización' ) {
      this.enviarCarrito( 'COV' );
    } else if ( this.queHacerConCarrito === 'Grabar NVV definitiva' ) {
      this.enviarCarrito( 'NVV' );
    } else if ( this.queHacerConCarrito === 'Solo enviar un correo' ) {
      this.enviarCorreo();
    }
  }
  enviarCarrito( cTipoDoc ) {
    this.enviando = true;
    this.netWork.grabarDocumentos( this.funciones.miCarrito, this.baseLocal.user.MODALIDAD, cTipoDoc, this.textoObs, this.textoOcc, this.cantidadKM.toString() )
        .subscribe( data => { this.enviando = false;
                              this.revisaExitooFracaso( data ); },
                    err  => { this.enviando = false;
                              this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error -> ' + err ); 
                            });
  }
  revisaExitooFracaso( data ) {
    if ( data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Los datos ingresados podrían estar incorrectos. Vuelva a revisar y reintente.' );
    } else {
      try {
        if ( data.resultado === 'ok' ) {
          //
          this.funciones.msgAlert( 'DOCUMENTO: ' + data.numero,
                                                  'Su Nro. de documento es el ' + data.numero + '. Ya ha llegado al sistema.' +
                                                  ' Una copia del documento será despachado a su correo para verificación. Gracias por utilizar nuestro carro de compras.' );
          //
          this.funciones.miCarrito = [];
          this.funciones.initCarro();
          this.funciones.refreshCarrito(); // next method updates the stream value
          //
          this.router.navigate(['/tabs/inicio']);
          //
        } else {
          console.log( 'Error en grabación ', data );
        }
      } catch (e) {
        this.funciones.msgAlert('ATENCION', 'Ocurrió un error al intentar guardar el documento -> ' + e );
      }
    }
  }

  enviarCorreo() {
    if ( this.cTo !== '' ) {
      this.enviando = true;
      this.netWork.soloEnviarCorreo( this.funciones.miCarrito, this.cTo, this.cCc, this.textoObs, this.baseLocal.soloCotizar )
          .subscribe( data => { this.enviando = false;
                                this.revisaCorreo( data );
                              },
                      err  => { this.enviando = false;
                                this.funciones.msgAlert( 'ATENCION', 'Ocurrió un error -> ' + err );
                              }
                    );
    } else {
      this.funciones.msgAlert( 'Correo vacío', 'Debe indicar datos para enviar el correo.' );
    }
  }
  revisaCorreo( data ) {
    try {
      if ( data.resultado === 'ok' ) {
          this.funciones.msgAlert('Correo enviado', 'El correo fue enviado exitosamente.');
          this.funciones.initCarro();
          this.router.navigate(['/tabs/inicio']);
      } else {
        this.funciones.msgAlert('Correo con problemas', 'El correo aparentemente no fue enviado. Reintente luego.');
      }
    } catch (err) {
      this.funciones.msgAlert('ATENCION','Ocurrió un error al intentar enviar el correo -> ' + err );
    }
  }

}
