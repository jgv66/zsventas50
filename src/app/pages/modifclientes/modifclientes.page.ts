import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modifclientes',
  templateUrl: './modifclientes.page.html',
  styleUrls: ['./modifclientes.page.scss'],
})
export class ModifclientesPage implements OnInit {

  modificando = false;
  email = '';
  nrocelu = '';

  constructor( private funciones: FuncionesService,
               private netWork: NetworkengineService,
               public baseLocal: BaselocalService,
               private modalCtrl: ModalController ) {}

  ngOnInit() {
    console.log(this.baseLocal.cliente);
    this.email = this.baseLocal.cliente.email;
    this.nrocelu = this.baseLocal.cliente.telefonos;
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  actualizarCliente() {
      this.modificando = true;
      this.netWork.consultaEstandar(  'ksp_modifClientes',
                                      { codigo:    this.baseLocal.cliente.codigo,
                                        sucursal:  this.baseLocal.cliente.sucursal,
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
