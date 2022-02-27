import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { BaselocalService } from '../../services/baselocal.service';

// const { Share, FileSharer } = Plugins;

@Component({
  selector: 'app-verfoto',
  templateUrl: './verfoto.page.html',
  styleUrls: ['./verfoto.page.scss'],
})
export class VerfotoPage implements OnInit {

  @Input() idmaeedo;
  @Input() tipo;
  @Input() numero;
  
  fotos = [];
  cargando = false;
  enviando = false;
  enviarCorreo = false;
  email = '';
  copia = '';
  obs = '';

  constructor( private netWork: NetworkengineService,
               private funciones: FuncionesService,
               private baseLocal: BaselocalService,
               private modalCtrl: ModalController ) {}

  ngOnInit() {
    this.cargaFotos();
    this.email = this.baseLocal.cliente.email || '';
  }

  cargaFotos() {
    this.cargando = true;
    const ATT_URL = this.netWork.url + '/public/attach/' ;
    //
    this.netWork.consultaEstandar( 'getimages', { idmaeedo: this.idmaeedo } )
      .subscribe( (dev: any) => {
        this.cargando = false;
        if ( dev.datos[0].resultado === 'ok' ) {
          //
          dev.datos.forEach( element => { 
            if ( element.pdf === true ) element.pdf_name = element.imgb64;
            element.imgb64 = ATT_URL + element.imgb64;
          });
          //
          this.fotos = dev.datos;
          //
        } else if ( dev.datos[0].resultado === 'nodata' ) {
          this.funciones.msgAlert('', 'No existen adjuntos ligados a este documento.');
        }
      });
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  async SocialShare() {
    //
    // if ( this.platform.is('ios') || this.platform.is('android') ) {
    //   //
    //   const titulo = (this.subject === '' || this.subject === undefined) ? this.desde : this.subject;
    //   //
    //   await Share.share({
    //     title: 'PDF a compartir',
    //     text: titulo,
    //     url: this.pdfEnServer
    //   });
    //   //
    // } else {
    //   this.funciones.muestraySale( 'Solo disponible en versiones nativas IOS o Android.',1.5,'middle');
    // }
  }

  prepararEmail() {
    this.enviarCorreo = !this.enviarCorreo;
  }

  sendEmail() {
    if ( this.email !== '' ) {
      this.enviando = true;
      this.netWork.soloEnviarAdjuntos( { cTo: this.email,
                                         cCc: this.copia,
                                         tipo: this.tipo,
                                         numero: this.numero,
                                         obs: this.obs,
                                         adjuntos: JSON.stringify(this.fotos),
                                         vendedor: this.baseLocal.user.KOFU } )
          .subscribe( data => { this.enviando = false;
                                this.revisaCorreo( data ); },
                      err  => { this.enviando = false;
                                this.funciones.msgAlert( 'ATENCION', 'Ocurrió un error -> ' + err ); }
                    );
    } else {
      this.funciones.msgAlert( '', 'Debe indicar datos para enviar el correo.' );
    }
  }
  revisaCorreo( data ) {
    try {
      if ( data.resultado === 'ok' ) {
          this.funciones.msgAlert('', 'El correo fue enviado exitosamente.');
          this.salir()
      } else {
        this.funciones.msgAlert('', 'El correo aparentemente no fue enviado. Reintente luego.');
      }
    } catch (err) {
      this.funciones.msgAlert('','Ocurrió un error al intentar enviar el correo -> ' + err );
    }
  }

}
