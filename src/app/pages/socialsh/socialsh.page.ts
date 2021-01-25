import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { BaselocalService } from 'src/app/services/baselocal.service';

import { Plugins } from '@capacitor/core';
const { Share, FileSharer } = Plugins;

@Component({
  selector: 'app-socialsh',
  templateUrl: './socialsh.page.html',
  styleUrls: ['./socialsh.page.scss'],
})
export class SocialshPage implements OnInit {

  item;
  texto;
  imagen;
  url;
  buscando = false;

  constructor( private parametros: ActivatedRoute ) { 
    //
    this.item = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
    //
  }

  ngOnInit() {
    //
    // console.log(this.item);
    //
    this.texto = this.item.producto.codigo +' - '+
                 this.item.producto.descripcion +
                 // 'Precio '+this.item.tipolista+' : '+this.item.preciomayor.toString() + 
                 '\n\n';
    this.imagen = null;
    this.url    = 'http://www.zsmotor.cl/img/Producto/' + this.item.producto.codigo.trim() + '/' + this.item.producto.codigo.trim() + '.jpg';
    //
    // this.download();
  }

  async basicShare () {

    // if (navigator.share) {
    //   navigator.share({
    //     title: 'My awesome post!',
    //     text: 'This post may or may not contain the answer to the universe',
    //     url: window.location.href
    //   }).then(() => {
    //     console.log('Thanks for sharing!');
    //   })
    //   .catch(err => {
    //     console.log(`Couldn't share because of`, err.message);
    //   });
    // } else {
    //   console.log('web share not supported');
    // }
    await Share.share({
      title: 'Productos ZS-Motor',
      text: this.texto, 
      url: this.url,
      dialogTitle: 'Compártelo con amigos'
    });
  }


}
