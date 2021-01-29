import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { Observable } from 'rxjs';
import { BaselocalService } from 'src/app/services/baselocal.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  count: Observable<number>;

  constructor( public funciones: FuncionesService,
               public baseLocal: BaselocalService ) {}

  ngOnInit() {
      this.count = this.funciones.CartZise;
  }

}
