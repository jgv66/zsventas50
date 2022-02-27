import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { NetworkengineService } from 'src/app/services/networkengine.service';
import { VerfotoPage } from '../verfoto/verfoto.page';

@Component({
  selector: 'app-adjuntarrecepciones',
  templateUrl: './adjuntarrecepciones.page.html',
  styleUrls: ['./adjuntarrecepciones.page.scss'],
})
export class AdjuntarrecepcionesPage implements OnInit {

  cargando = false;
  numero = '';
  imagen;
  fotos = [];
  notas = [];
  id_edo;
  //
  constructor( private modalCtrl: ModalController,
               private baseLocal: BaselocalService,
               private funciones: FuncionesService,
               private netWork: NetworkengineService,
               private router: Router ) {}

    ngOnInit() {
      if ( !this.baseLocal.user ) {
        this.router.navigateByUrl('/login');
      }
    }
  
    salir() {
      this.modalCtrl.dismiss();
    }

    aBuscarNvv() {
      if ( this.numero === undefined || this.numero === '' ) {
        this.funciones.msgAlert('', 'Debe indicar algún dato para buscar clientes.');
      } else {
        this.cargando = true;
        this.netWork.traeUnSP( 'ksp_BuscarNvv',
                              { numero:  this.numero,
                                codusr:  this.baseLocal.user.KOFU,
                                empresa: this.baseLocal.user.EMPRESA } )
            .subscribe( data => { this.cargando = false; this.revisaRespuesta( data ); },
                        err  => { this.cargando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                      );
      }      
    }

    revisaRespuesta( data ) {
      // console.log(data);
      this.notas = [];
      if ( data === undefined || data.length === 0 ) {
          this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
      } else  {
        this.notas.push( ...data );
      }
    }

    // this.fotos = [];
    // this.id_pqt = this.id;
    // this.cargaFotos();

    cargaFotos() {
      this.cargando = true;
      //
      const IMG_URL = this.netWork.url + '/public/img/' ;
      const ATT_URL = this.netWork.url + '/public/attach/' ;
      //
      this.netWork.consultaEstandar( '/getimages', { id_pqt:0 } )
          .subscribe( (dev: any) => {
            this.cargando = false;
            if ( dev.datos[0].resultado === 'ok' ) {
              //
              dev.datos.forEach( element => { 
                //              
                if ( element.attach === true ) {
                  element.imgb64 = ATT_URL + element.attach_name;
                } else {
                  element.imgb64 = IMG_URL + element.imgb64;
                }
                //
              });
              //
              this.fotos = dev.datos;
              //
            } else if ( dev.datos[0].resultado === 'nodata' ) {
              this.funciones.msgAlert('', 'No existen archivos ligados a este documento.');
            }
          });
    }

    grabar() {
      if ( this.numero === ''  ) {
        this.funciones.msgAlertErr('Debe completar los datos obligatorios');
        return;
      }
      this.cargando = true;
      this.netWork.consultaEstandar(  'ksp_crearMedidasNuevas',
                                      { numero: this.numero },
                                      { codigo: this.baseLocal.user.KOFU,
                                        nombre: this.baseLocal.user.NOKOFU,
                                        email:  this.baseLocal.user.EMAIL } )
          .subscribe( data => { this.revisa( data );           },
                      err  => { this.funciones.msgAlert( '', err ); });
    }

    revisa( data ) {
      console.log(data);
      this.cargando = false;
      if ( data === undefined ) {
        this.funciones.muestraySale('Adjuntar presenta problemas al intentar grabación', 2 );
      } else {
        this.funciones.muestraySale(data[0].mensaje, 1 );
        if ( data[0].resultado === true ) {
          this.salir();
        }
      }
    }

    adjuntarArchivos( idmaeedo ) {
      this.funciones.addImage( this.baseLocal.user.KOFU, idmaeedo )
    }

    async verAdjuntos( nvv ) {
      const modal = await this.modalCtrl.create({
      component: VerfotoPage,
      componentProps: { idmaeedo: nvv.id,
                        tipo: nvv.td,
                        numero: nvv.numero }
      });
      await modal.present();
    }

}
