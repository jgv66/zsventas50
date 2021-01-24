import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  count: Observable<number>;

  constructor( public funciones: FuncionesService) {}

  ngOnInit() {
      this.count = this.funciones.CartZise;
  }

}
