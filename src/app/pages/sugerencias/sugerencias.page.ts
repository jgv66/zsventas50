import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.page.html',
  styleUrls: ['./sugerencias.page.scss'],
})
export class SugerenciasPage implements OnInit {

  enviando = false;
  sistema: any;
  prodbueno = null;
  preciomuybarato = null;
  prodconstock = null;
  prodconquiebre = null;
  cantidad = 0;
  observaciones = '';

  constructor( private funciones: FuncionesService,
               public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private router: Router,
               private navCtrl: NavController,
               private parametros: ActivatedRoute) {
      this.sistema = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
  }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    // console.log(this.sistema);
  }

  limpiar() {
    this.prodbueno       = null;
    this.preciomuybarato = null;
    this.prodconstock    = null;
    this.prodconquiebre  = null;
    this.observaciones   = null;
    this.cantidad        = null;
    this.enviando        = false;
  }

  enviarSugerencia() {
    //
    if (this.prodbueno === null &&
        this.preciomuybarato === null &&
        this.prodconstock === null &&
        this.prodconquiebre === null &&
        ( this.cantidad === null || this.cantidad === 0 ) &&
        (this.observaciones === null || this.observaciones === '' )) {
        this.funciones.msgAlertErr('Debe completar algun dato para grabar la sugerencia.');
      } else {
        this.enviando = true;
        this.netWork.consultaEstandar(  'ksp_enviarSugerencias',
                                        { sucursal:        this.baseLocal.user.KOSU,
                                          usuario:         this.baseLocal.user.KOFU,
                                          observac:        this.observaciones,
                                          cantidad:        ( (this.cantidad === null || this.cantidad === 0) ? 0 : this.cantidad ),
                                          codprod:         this.sistema.codigo,
                                          codtecnico:      this.sistema.tecnico,
                                          descrip:         this.sistema.descrip,
                                          prodbueno:       (this.prodbueno       === 'si') ? 1 : ((this.prodbueno       === 'no') ? 0 : null ),
                                          preciomuybarato: (this.preciomuybarato === 'si') ? 1 : ((this.preciomuybarato === 'no') ? 0 : null ),
                                          prodconstock:    (this.prodconstock    === 'si') ? 1 : ((this.prodconstock    === 'no') ? 0 : null ),
                                          prodconquiebre:  (this.prodconquiebre  === 'si') ? 1 : ((this.prodconquiebre  === 'no') ? 0 : null ) },
                                        { codigo: this.baseLocal.user.KOFU,
                                          nombre: this.baseLocal.user.NOKOFU } )
            .subscribe( data => { this.revisa( data );           },
                        err  => { this.funciones.msgAlert( '', err ); });
      }
  }
  revisa( data ) {
    this.enviando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('Sugerencia presenta problemas al intentar grabación', 2 );
    } else {
      this.funciones.muestraySale(data[0].mensaje, 1 );
      if ( data[0].resultado === true ) {
        this.navCtrl.pop();
      }
    }
  }

}
