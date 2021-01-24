import { Component, OnInit, Input } from '@angular/core';
import { config } from 'rxjs';

@Component({
  selector: 'app-cardprod',
  templateUrl: './cardprod.component.html',
  styleUrls: ['./cardprod.component.scss'],
})
export class CardprodComponent implements OnInit {

  @Input() listaProductos;
  @Input() config;
  @Input() usuario;

  constructor() { }

  ngOnInit() {}

}
