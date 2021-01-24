import { Component } from '@angular/core';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buscarclientes',
  templateUrl: './buscarclientes.page.html',
  styleUrls: ['./buscarclientes.page.scss'],
})
export class BuscarclientesPage {

  clientes: any[] = [];
  buscando = false;
  usuario;
  texto;

  constructor( private baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private funciones: FuncionesService,
               private modalCtrl: ModalController ) { }

  aBuscarClientes() {
    if ( this.texto === undefined || this.texto === '' ) {
      this.funciones.msgAlert('', 'Debe indicar algún dato para buscar clientes.');
    } else {
      this.buscando = true;
      this.netWork.traeUnSP( 'ksp_buscarDeNuevoClientes',
                            { dato:    this.texto,
                              codusr:  this.baseLocal.user.KOFU,
                              empresa: this.baseLocal.user.EMPRESA,
                              solouno: false } )
          .subscribe( data => { this.buscando = false; this.revisaRespuesta( data ); },
                      err  => { this.buscando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                    );
    }
  }

   revisaRespuesta( data ) {
    this.clientes = [];
    if ( data === undefined || data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else  {
      this.clientes.push( ...data );
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  salirConData( cliente ) {
    //
    this.baseLocal.soloCotizar = false;
    this.funciones.miCarrito = [];
    this.funciones.initCarro();
    this.funciones.refreshCarrito();
    //
    // console.log(cliente);
    this.modalCtrl.dismiss( {
      dato: cliente
    } );
  }

}
