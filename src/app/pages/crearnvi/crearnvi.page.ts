import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { ClassField } from '@angular/compiler';

@Component({
  selector: 'app-crearnvi',
  templateUrl: './crearnvi.page.html',
  styleUrls: ['./crearnvi.page.scss'],
})
export class CrearnviPage implements OnInit {

  item;
  bodegas = [];
  sucursal = '';
  cantidad = 0.0;
  grabando = false;
  leyendo = false;

  constructor( private funciones: FuncionesService,
               public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private router: Router,
               private parametros: ActivatedRoute) {}

  ngOnInit() {
    this.item = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
    this.cargaBodegas();
  }

  cargaBodegas() {
    const producto = this.item.producto.codigo;
    this.leyendo = true;
    this.netWork.traeUnSP( 'ksp_BodegaProducto',
                          { codproducto: this.item.producto.codigo, usuario: this.baseLocal.user.KOFU, empresa: this.baseLocal.user.empresa, cualquierbodega: 1 },
                          {codigo: this.baseLocal.user.KOFU, nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisaEoFBP( producto, data ); },
                    err  => { this.leyendo = false;
                              this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFBP( producto, data ) {
    // console.log(data);
    if ( data === undefined || data.length === 0 ) {
      this.funciones.msgAlert('ATENCION', 'No existe información de bodegas para el producto.');
    } else if ( data.length > 0 ) {
      this.leyendo = false;
      this.bodegas = data;
    }
  }

  grabarNVI() {
    //
    if ( this.sucursal === '' ) {
      this.funciones.msgAlert( 'ATENCION', 'Debe seleccionar sucursal de destino.' );
    } else if ( this.cantidad <= 0 ) {
      this.funciones.msgAlert( 'ATENCION' , 'Debe definir la cantidad a requerir correctamente.' );
    } else {
      this.grabando = true;
      const miCarrito = [{empresa: this.baseLocal.user.empresa,
                          vendedor: this.baseLocal.user.KOFU,
                          bodega: this.item.usuario.bodega,      // this.bodega,
                          sucursal: this.item.usuario.sucursal,  // this.sucursal,
                          cliente: '77358700-0',
                          suc_cliente: this.sucursal,
                          codigo: this.item.producto.codigo,
                          descrip: this.item.producto.descripcion,
                          cantidad: this.cantidad,
                          stock_ud1: 0,
                          precio: this.item.producto.precio,
                          preciomayor: this.item.producto.precio,
                          descuentomax: 0,
                          listapre: this.item.producto.listaprecio,
                          metodolista: this.item.producto.metodolista }];
      //
      this.netWork.grabarDocumentos( miCarrito, this.baseLocal.user.MODALIDAD, 'NVI', 'Solicitud desde KTP', '', '' )
          .subscribe( data => { this.grabando = false;
                                this.revisaExitooFracaso( data ); },
                      err  => { this.grabando = false;
                                this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error -> ' + err );
                              });
    }
  }
  revisaExitooFracaso( data ) {
    if ( data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Los datos ingresados podrían estar incorrectos. Vuelva a revisar y reintente.' );
    } else {
      try {
        if ( data.resultado === 'ok' ) {
          //
          this.funciones.msgAlert('DOCUMENTO: ' + data.numero,
                                  'Su Nro. de documento es el ' + data.numero + '. Ya ha llegado al sistema.' +
                                  ' Una copia del documento será despachado a su correo para verificación.' );
          //
          this.router.navigate(['/tabs/inicio']);
          //
        } else {
          console.log( 'Error en grabación ', data );
        }
      } catch (e) {
        this.funciones.msgAlert('ATENCION', 'Ocurrió un error al intentar guardar el documento -> ' + e );
      }
    }
  }

}
