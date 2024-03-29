import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MedidasnuevasPage } from '../medidasnuevas/medidasnuevas.page';
import { AdjuntarrecepcionesPage } from '../adjuntarrecepciones/adjuntarrecepciones.page';

@Component({
  selector: 'app-tabtarea',
  templateUrl: './tabtarea.page.html',
  styleUrls: ['./tabtarea.page.scss'],
})
export class TabtareaPage implements OnInit {

  constructor( private modalCtrl: ModalController ) { }

  ngOnInit() {
  }

  async medidasNuevas() {
    const modal = await this.modalCtrl.create({
      component: MedidasnuevasPage,
      componentProps: { value: 123 }
    });
    await modal.present();
  }

  async adjuntarRecepciones() {
    const modal = await this.modalCtrl.create({
      component: AdjuntarrecepcionesPage,
    });
    await modal.present();
  }

}
