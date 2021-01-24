import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listprod',
  templateUrl: './listprod.component.html',
  styleUrls: ['./listprod.component.scss'],
})
export class ListprodComponent implements OnInit {

  @Input() listaProductos;
  @Input() config;
  @Input() usuario;

  @Output() cargaBodegas: EventEmitter<any>;

  constructor() {
    this.cargaBodegas = new EventEmitter();
  }

  ngOnInit() {}

  _carBodegas( producto ) {
    this.cargaBodegas.emit( producto );
  }
}
