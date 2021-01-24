import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-patentes',
  templateUrl: './patentes.page.html',
  styleUrls: ['./patentes.page.scss'],
})
export class PatentesPage implements OnInit {

  modificando = false;
  patente = '';
  marca = '';
  modelo = '';
  color = '';
  anno = '';

  constructor( private funciones: FuncionesService,
               private netWork: NetworkengineService,
               public baseLocal: BaselocalService,
               private modalCtrl: ModalController ) {}

  ngOnInit() {
    console.log(this.baseLocal.cliente);
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  crearPatente() {
    this.modificando = true;
    this.netWork.consultaEstandar(  'ksp_crearSucursal',
                                    { codigo:   this.baseLocal.cliente.codigo,
                                      sucursal: this.patente,
                                      marca:    this.marca,
                                      modelo:   this.modelo,
                                      color:    this.color,
                                      anno:     this.anno },
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
        this.funciones.muestraySale('Sucursal creada correctamente', 1 );
        //
      } else {
        this.funciones.msgAlert( 'ATENCION', data[0].mensaje );
      }
    }
  }

}
