import { Component } from '@angular/core';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buscarvendedor',
  templateUrl: './buscarvendedor.page.html',
  styleUrls: ['./buscarvendedor.page.scss'],
})
export class BuscarvendedorPage {

  vendedores = [];
  buscando = false;

  constructor(private baseLocal: BaselocalService,
              private netWork: NetworkengineService,
              private funciones: FuncionesService,
              private modalCtrl: ModalController) { }

  buscarVendedores( event ) {
    if ( event.detail.value !== '' ) {
      this.aBuscarVendedor( event.detail.value );
    } else {
      this.vendedores = [];
    }
  }

  aBuscarVendedor( pDato ) {
    if ( pDato === undefined || pDato === '' ) {
      this.funciones.msgAlert('VACIO', 'Debe indicar algún dato para buscar vendedor.');
    } else {
      this.buscando = true;
      this.netWork.traeUnSP( 'ksp_buscarDeNuevoVendedores',
                            { dato:    pDato,
                              empresa: this.baseLocal.user.EMPRESA } )
          .subscribe( data => { this.buscando = false; this.revisaRespuesta( data ); },
                      err  => { this.buscando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                    );
    }
  }
  revisaRespuesta( data ) {
    console.log(data);
    this.vendedores = [];
    if ( data === undefined || data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else  {
      this.vendedores.push( ...data );
    }
  }

  salirConData( vendedor ) {
    //
    this.modalCtrl.dismiss( {
      dato: vendedor
    } );
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
