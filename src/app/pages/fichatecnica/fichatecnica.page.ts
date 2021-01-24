import { Component, OnInit } from '@angular/core';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fichatecnica',
  templateUrl: './fichatecnica.page.html',
  styleUrls: ['./fichatecnica.page.scss'],
})
export class FichatecnicaPage implements OnInit {

  buscando = false;
  info: any;
  producto: any;
  ficha: any;

  constructor(private netWork: NetworkengineService,
              private funciones: FuncionesService,
              private parametros: ActivatedRoute ) {
      this.info = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
      this.producto = { codigo: this.info.producto.codigo, descripcion: this.info.producto.descripcion }
      console.log(this.producto);
  }

  ngOnInit() {
    this.buscando = true;
    this.netWork.consultaEstandar( 'ksp_traeFichaTecnica',
                                   { codigo: this.producto.codigo } )
        .subscribe( data => { this.revisa( data );           },
                    err  => { this.buscando = false;
                              this.funciones.msgAlert( 'ATENCION', err ); });
  }
  revisa( data ) {
    this.buscando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('ATENCION : Código de producto no posee ficha técnica', 2 );
    } else {
      console.log(data);
      this.ficha = data[0].ficha;
    }
  }


}

