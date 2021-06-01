import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';

@Component({
  selector: 'app-detallexvend',
  templateUrl: './detallexvend.component.html',
  styleUrls: ['./detallexvend.component.scss'],
})
export class DetallexvendComponent {

  id;
  buscando = false;
  detalle = [];

  constructor( private modalCtrl: ModalController,
               private funciones: FuncionesService,
               private baseLocal: BaselocalService,
               private netWork: NetworkengineService ) { 
    this.funciones.getter()
      .then( dato => { this.id = dato;
                       this.rescataDetalle();
      });
  }

  rescataDetalle() {
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_traeDocumento',
                           { id: this.id },
                           { codigo: this.baseLocal.user.KOFU,
                             nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisa( data );           },
                    err  => { this.buscando = false;
                              this.funciones.msgAlert( 'ATENCION', err ); });
  }

  revisa( data ) {
    // console.log(data);
    this.buscando = false;
    if ( data === undefined || data.length === 0 ) {
      this.funciones.muestraySale('ATENCION : No existe detalle', 2 );
    } else {
      this.detalle = [ ...data ];
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
