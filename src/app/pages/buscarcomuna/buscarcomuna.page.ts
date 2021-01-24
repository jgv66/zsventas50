import { Component, OnInit } from '@angular/core';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { ModalController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';


@Component({
  selector: 'app-buscarcomuna',
  templateUrl: './buscarcomuna.page.html',
  styleUrls: ['./buscarcomuna.page.scss'],
})
export class BuscarcomunaPage implements OnInit {

  buscando = false;
  comunas  = [];
  todas    = [];
  textoBuscar = '';

  constructor( private netWork: NetworkengineService,
               private funciones: FuncionesService,
               private baseLocal: BaselocalService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    if ( this.baseLocal.listaComunas.length > 0 ) {
      this.comunas = this.baseLocal.listaComunas;
    } else {
      this.buscando = true;
      this.netWork.consultaEstandar( 'comunaciudad' )
          .subscribe( (cmci: any) => { this.buscando = false;
                                       this.comunas  = cmci.datos;
                                       this.baseLocal.listaComunas = cmci.datos; },
                      err         => { this.buscando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                    );
    }
  }

  buscarComuna( event ) {
    if ( event.detail.value !== '' ) {
      this.textoBuscar = event.detail.value;
    } else {
      this.comunas = this.baseLocal.listaComunas;
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  salirConData( cmci ) {
    this.modalCtrl.dismiss( {
      dato: cmci
    } );
  }

}
