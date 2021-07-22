import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaselocalService } from 'src/app/services/baselocal.service';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent implements OnInit {

  @Input() quees;

  aDesplegar = [];

  sugerencias = [
    { texto: 'Últimas Ventas',   icon: 'cloud-upload' },
    { texto: 'Últimas Compras',  icon: 'cloud-download' },
    { texto: 'Últimas NVV',      icon: 'layers-outline' },
    { texto: 'Reponer Stock',    icon: 'sync' },
    { texto: 'Sugerencias',      icon: 'bulb' },
    { texto: 'Notificaciones',   icon: 'notifications' },
    { texto: 'Copiar y Pegar',   icon: 'clipboard-outline' },
    { texto: 'Redes Sociales',   icon: 'share' },
    { texto: 'Ficha Técnica',    icon: 'attach' },
  ];

  clientes = [
    { texto: 'Actualizar datos', icon: 'at' },
    { texto: 'Agregar Patente',  icon: 'car' },
  ];

  usuario = [
    { texto: 'Hoy',           icon: '' },
    { texto: 'Ayer',          icon: '' },
    { texto: 'Esta semana',   icon: '' },
    { texto: 'Semana pasada', icon: '' },
    { texto: 'Este mes',      icon: '' },
    { texto: 'Mes pasado',    icon: '' },
  ];
  constructor( private popoverCtrl: PopoverController,
               public  baseLocal: BaselocalService ) {}

  ngOnInit() {
    // console.log(this.escliente);
    if ( this.quees === 'cliente' ) {
      this.aDesplegar = this.clientes;
    }
    if ( this.quees === 'usuario' ) {
      this.aDesplegar = this.usuario;
    }
    if ( this.quees === 'sugerencia' ) {
      this.aDesplegar = this.sugerencias;
    }
  }

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.aDesplegar[pos]
    });
  }

}
