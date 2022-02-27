import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menuclientes',
  templateUrl: './menuclientes.component.html',
  styleUrls: ['./menuclientes.component.scss'],
})
export class MenuclientesComponent implements OnInit {

  @Input() baseLocal;

  menu = [];

  constructor( private popoverCtrl: PopoverController ) {}
  
  ngOnInit() {
    if ( this.baseLocal.cliente.codigo !== '' ) {
      this.menu.push({ texto: 'Pendientes de pago'  });  // (click)="consultarImpagos( cliente )"
      this.menu.push({ texto: 'Últimos documentos'  });  // (click)="ultimosDocs( $event )"      
    }
    if ( !this.baseLocal.user.esuncliente ) {
      this.menu.push({ texto: 'Buscar un cliente' });  // (click)="buscarOtroCliente()"
    }
    if ( this.baseLocal.cliente.codigo === '' && !this.baseLocal.user.esuncliente ) {
      this.menu.push({ texto: 'Crear un cliente'    });  // (click)="crearClientes()"
    }
  }

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.menu[pos]
    });
  }

}
