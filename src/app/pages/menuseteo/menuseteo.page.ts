import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ModalController } from '@ionic/angular';

import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';

import { Cliente } from '../../models/modelos.modelo';

import { MovdoccliComponent } from '../../components/movdoccli/movdoccli.component';
import { BuscarclientesPage } from '../buscarclientes/buscarclientes.page';
import { MenuclientesComponent } from 'src/app/components/menuclientes/menuclientes.component';
import { ModifclientesPage } from '../modifclientes/modifclientes.page';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';
import { PatentesPage } from '../patentes/patentes.page';

@Component({
  selector: 'app-menuseteo',
  templateUrl: './menuseteo.page.html',
  styleUrls: ['./menuseteo.page.scss'],
})
export class MenuseteoPage {

  cliente: Cliente;
  barraTabs;  // variable para ocultar barra de tabs
  buscando = false;

  constructor( public baseLocal: BaselocalService,
               private router: Router,
               private modalCtrl: ModalController,
               private popoverCtrl: PopoverController,
               private funciones: FuncionesService ) {
      //
      this.cliente = this.baseLocal.cliente;
      //
  }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
  }

  ionViewWillEnter() {
    this.barraTabs = this.funciones.hideTabs();
  }
  ionViewWillLeave() {
    this.funciones.showTabs( this.barraTabs );
  }

  salir() {
    this.router.navigate(['/tabs']);
  }

  async menuClientes( ev ) {
    const popover = await this.popoverCtrl.create({
      component: MenuclientesComponent,
      componentProps: { baseLocal: this.baseLocal },
      event: ev,
      translucent: false
    });
    await popover.present();
    //
    const { data } = await popover.onDidDismiss();
    if ( data ) {
      if ( data.opcion.texto === 'Pendientes de pago' ) this.consultarImpagos( this.cliente );
      if ( data.opcion.texto === 'Últimos documentos' ) this.ultimosDocs( ev );
      if ( data.opcion.texto === 'Buscar un cliente'  ) this.buscarOtroCliente();
      if ( data.opcion.texto === 'Crear un cliente'   ) this.crearClientes();
    }
  }

  async buscarOtroCliente() {
    const modal = await this.modalCtrl.create({
      component: BuscarclientesPage,
    });
    await modal.present();
    //
    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.cliente = data.dato;
      this.baseLocal.cliente = data.dato;
      //
      if ( data.dato.listaprecios !== this.baseLocal.user.listamodalidad && data.dato.listaprecios !== '' ) {
        //
        // console.log('63->',data.dato.listaprecios);
        // console.log('64->',this.baseLocal.user)
        //
        this.baseLocal.user.LISTAMODALIDAD = data.dato.listaprecios;
        this.baseLocal.user.listamodalidad = data.dato.listaprecios;
        //
      }
    }
  }

  crearClientes() {
    if ( !this.baseLocal.user.puedecrearcli ) {
      this.funciones.msgAlert('ATENCION', 'Ud. no posee permisos para esta acción');
    } else {
      this.router.navigate(['/tabs/crearclientes']);
    }
  }

  consultarImpagos( cliente ) {
    if ( cliente === null || cliente === undefined || cliente.codigo === '' ) {
      this.funciones.muestraySale('ATENCION : Código de cliente no puede estar vacío', 1);
    } else {
      this.router.navigate(['/tabs/ctacteclientes']);
    }
  }

  async ultimosDocs( event ) {
    const popover = await this.popoverCtrl.create({
      component: MovdoccliComponent,
      event,
      mode: 'ios',
      translucent: false
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if ( data ) {
      const tido = this.funciones.derecha( data.opcion.texto, 3 ); // === 'Ultimas 15 NVV') ? 'NVV' : 'FCV' );
      this.router.navigate(['/tabs/ultimosdocs/' + tido ]);
    }
  }

  modifCliente = async () => {
    const modal = await this.modalCtrl.create({
      component: ModifclientesPage,
    });
    await modal.present();
    //
    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.cliente.email = data.email;
      this.cliente.telefonos = data.nrocelu;
      //
      this.baseLocal.cliente.email = data.email;
      this.baseLocal.cliente.telefonos = data.nrocelu;
    }
  }

  crearPatente = async () => {
    const modal = await this.modalCtrl.create({
      component: PatentesPage,
    });
    await modal.present();
    //
    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.cliente.email = data.email;
      this.cliente.telefonos = data.nrocelu;
      //
      this.baseLocal.cliente.email = data.email;
      this.baseLocal.cliente.telefonos = data.nrocelu;
    }
  }

  async opcionPuntos( event ) {
    //
    if ( this.baseLocal.cliente.codigo !== '') {
      const popover = await this.popoverCtrl.create({
        component: TrespuntosComponent,
        componentProps: { quees: 'cliente' },
        event,
        mode: 'ios',
        translucent: false
      });
      await popover.present();
      //
      const { data } = await popover.onDidDismiss();
      if ( data ) {
        switch (data.opcion.texto) {
          //
          case 'Actualizar datos':
            this.modifCliente();
            break;
          //
          case 'Agregar Patente':
            this.crearPatente();
            break;
          //
          default:
            console.log('vacio');
            break;
        }
      }
    }
  }

}
