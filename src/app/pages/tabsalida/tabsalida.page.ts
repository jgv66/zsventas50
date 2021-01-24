import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-tabsalida',
  templateUrl: './tabsalida.page.html',
  styleUrls: ['./tabsalida.page.scss'],
})
export class TabsalidaPage {

  norecordar = false;

  constructor( private router: Router ) { }

  salirDelSistema() {
    // no recordar
    if ( this.norecordar ) {
      Storage.remove( {key: 'ktp_ultimo_config'});
      Storage.remove( {key: 'ktp_ultimo_usuario'} );
      Storage.remove( {key: 'ktp_ultimo_cliente'} );
    }
    //
    this.router.navigate( ['/home' ]);
  }

}
