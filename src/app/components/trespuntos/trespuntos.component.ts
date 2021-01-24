import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaselocalService } from 'src/app/services/baselocal.service';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent implements OnInit {

  @Input() escliente;

  aDesplegar = [];

  sugerencias = [
    { texto: 'Últimas Ventas',   icon: 'cloud-upload' },
    { texto: 'Últimas Compras',  icon: 'cloud-download' },
    { texto: 'NVI para reponer', icon: 'sync' },
    { texto: 'Sugerencias',      icon: 'bulb' },
    { texto: 'Notificaciones',   icon: 'notifications' },
    { texto: 'Copy & Paste',     icon: 'clipboard-outline' },
    // { texto: 'Redes Sociales',   icon: 'share' },
    { texto: 'Ficha Técnica',    icon: 'attach' },
  ];

  clientes = [
    { texto: 'Actualizar datos', icon: 'at' },
    { texto: 'Agregar Patente',  icon: 'car' },
  ];

  constructor( private popoverCtrl: PopoverController,
               public  baseLocal: BaselocalService ) {}

  ngOnInit() {
    // console.log(this.escliente);
    this.aDesplegar = ( this.escliente === true ) ? this.clientes : this.sugerencias;
  }

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.aDesplegar[pos]
    });
  }

}
