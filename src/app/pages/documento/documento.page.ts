import { Component, OnInit, Input } from '@angular/core';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.page.html',
  styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {

  buscando = false;
  id       = '';
  detalle;

  constructor( private baseLocal:BaselocalService,
               private netWork: NetworkengineService,
               private funciones: FuncionesService,
               private parametros: ActivatedRoute ) {
      this.id = this.parametros.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_traeDocumento',
                           { id: parseInt( this.id, 0 ) },
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
      this.funciones.muestraySale('ATENCION : Código de cliente no presenta documentos impagos', 2 );
    } else {
      this.detalle = data;
    }
  }

  infoProd( pCodigo, pCliente, pSucCliente, pEmpresa, pDescrip ) {
    // this.navCtrl.push( Infoproducto2Page, { producto: pCodigo,
    //                                         descripc: pDescrip,
    //                                         cliente:  pCliente,
    //                                         sucursal: pSucCliente,
    //                                         empresa:  pEmpresa,
    //                                         usuario:  this.usuario } );
  }


}
