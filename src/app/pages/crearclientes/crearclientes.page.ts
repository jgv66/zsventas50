import { Component } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { BuscarcomunaPage } from '../buscarcomuna/buscarcomuna.page';

@Component({
  selector: 'app-crearclientes',
  templateUrl: './crearclientes.page.html',
  styleUrls: ['./crearclientes.page.scss'],
})
export class CrearclientesPage {

  rut = '';
  nombre = '';
  direccion = '';
  comunayciudad = '';
  codciudad = '';
  codcomuna = '';
  email = '';
  nrocelu = '';
  giro = '';

  comunaciudad = [];
  creando = false;

  constructor(private baseLocal: BaselocalService,
              private netWork: NetworkengineService,
              private funciones: FuncionesService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private navCtrl: NavController) {
      this.limpiar();
  }

  limpiar() {
    this.rut = '';
    this.nombre = '';
    this.direccion = '';
    this.comunayciudad = '';
    this.codciudad = '';
    this.codcomuna = '';
    this.email = '';
    this.nrocelu = '';
    this.giro = '';
  }

  async buscarCiudad() {
    const modal = await this.modalCtrl.create({
      component: BuscarcomunaPage,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.comunayciudad = data.dato.comuna + ', ' +  data.dato.ciudad;
      this.codciudad     = data.dato.codci;
      this.codcomuna     = data.dato.codcm;
    }

  }

  async confirmaCrearCliente() {
    const alert = await this.alertCtrl.create({
      header: 'ATENCION',
      subHeader: 'Este nuevo cliente será creado',
      message: this.nombre,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok, crearlo',
          handler: () => { this.crear(); }
        }
      ]
    });
    await alert.present();
  }

  crear() {
    this.creando = true;
    this.netWork.consultaEstandar(  'ksp_crearClientes',
                                    { rut:       this.rut,
                                      nombre:    this.nombre,
                                      direccion: this.direccion,
                                      comuna:    this.codcomuna,
                                      ciudad:    this.codciudad,
                                      email:     this.email,
                                      nrocelu:   this.nrocelu,
                                      giro:      this.giro },
                                      { codigo: this.baseLocal.user.KOFU,
                                        nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisa( data );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }
  revisa( data ) {
    this.creando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('ATENCION : Cliente presenta problemas al intentar creación', 2 );
    } else {
      // console.log(data[0]);
      if ( data[0].resultado === 'ok' ) {
        this.limpiar();
      }
      this.funciones.msgAlert( 'ATENCION', data[0].mensaje );
    }
  }

}
