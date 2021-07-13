import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { ModalController } from '@ionic/angular';
import { BuscarcomunaPage } from '../buscarcomuna/buscarcomuna.page';

@Component({
  selector: 'app-modifclientes',
  templateUrl: './modifclientes.page.html',
  styleUrls: ['./modifclientes.page.scss'],
})
export class ModifclientesPage implements OnInit {

  modificando = false;
  email = '';
  nrocelu = '';
  nombre = '';
  direccion = '';
  //
  comunayciudad = '';
  codciudad = '';
  codcomuna = '';
  //
  constructor( private funciones: FuncionesService,
               private netWork: NetworkengineService,
               public baseLocal: BaselocalService,
               private modalCtrl: ModalController ) {}
  //
  ngOnInit() {
     console.log(this.baseLocal.cliente);
    this.email          = this.baseLocal.cliente.email;
    this.nrocelu        = this.baseLocal.cliente.telefonos;
    this.nombre         = this.baseLocal.cliente.razonsocial;
    this.direccion      = this.baseLocal.cliente.direccion;
    this.comunayciudad  = this.baseLocal.cliente.comuna +', '+ this.baseLocal.cliente.ciudad;
    this.codcomuna      = this.baseLocal.cliente.codcomuna;
    this.codciudad      = this.baseLocal.cliente.codciudad;
  }
  //
  salir() {
    this.modalCtrl.dismiss();
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

  actualizarCliente() {
      this.modificando = true;
      this.netWork.consultaEstandar(  'ksp_modifClientes',
                                      { codigo:    this.baseLocal.cliente.codigo,
                                        sucursal:  this.baseLocal.cliente.sucursal,
                                        nombre:    this.nombre,
                                        direccion: this.direccion,
                                        comuna:    this.codcomuna,
                                        ciudad:    this.codciudad, 
                                        email:     this.email,
                                        nrocelu:   this.nrocelu },
                                      { codigo: this.baseLocal.user.KOFU,
                                        nombre: this.baseLocal.user.NOKOFU } )
          .subscribe( data => { this.revisa( data );           },
                      err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }

  revisa( data ) {
    this.modificando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('ATENCION : Cliente presenta problemas al intentar creación', 2 );
    } else {
      // console.log(data[0]);
      if ( data[0].resultado === true ) {
        //
        this.modalCtrl.dismiss({email: this.email, nrocelu: this.nrocelu});
        this.funciones.muestraySale('Cliente fue actualizado correctamente', 2 );
        //
      } else {
        this.funciones.msgAlert( 'ATENCION', data[0].mensaje );
      }
    }
  }

}
