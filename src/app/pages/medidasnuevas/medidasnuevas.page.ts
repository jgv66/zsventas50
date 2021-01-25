import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { NetworkengineService } from 'src/app/services/networkengine.service';

@Component({
  selector: 'app-medidasnuevas',
  templateUrl: './medidasnuevas.page.html',
  styleUrls: ['./medidasnuevas.page.scss'],
})
export class MedidasnuevasPage implements OnInit {

  grabando = false;
  marca;
  modelo;
  anno;
  version;
  marcaneu;
  modeloneu;
  medidadelantera; ivdelantera; icdelantera;
  medidatrasera; ivtrasera; ictrasera;
  runflat;
  comentarios;
  
  constructor( private modalCtrl: ModalController,
               private baseLocal: BaselocalService,
               private funciones: FuncionesService,
               private netWork: NetworkengineService,
               private router: Router ) { }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.init();
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  init() {
    this.marca = '';
    this.modelo = '';
    this.anno = '';
    this.version = '';
    this.marcaneu = '';
    this.modeloneu = '';
    this.medidadelantera = '';  this.ivdelantera = ''; this.icdelantera = '';
    this.medidatrasera = ''; this.ivtrasera = ''; this.ictrasera = '';
    this.runflat = false;
    this.comentarios = '';
  }

  grabar() {
    if ( this.marca === '' || this.modelo === '' || this.medidadelantera === '' || this.medidatrasera === '' ) {
      this.funciones.msgAlertErr('Debe completar los datos obligatorios');
    } else {
      this.grabando = true;
      this.netWork.consultaEstandar(  'ksp_crearMedidasNuevas',
                                      { marca:           this.marca,
                                        modelo:          this.modelo,
                                        periodo:         this.anno,
                                        version:         this.version,
                                        marcaneu:        this.marcaneu,
                                        modeloneu:       this.modeloneu,
                                        medidadelantera: this.medidadelantera,
                                        ivdelantera:     this.ivdelantera,
                                        icdelantera:     this.icdelantera,
                                        medidatrasera:   this.medidatrasera,
                                        ivtrasera:       this.ivtrasera,
                                        ictrasera:       this.ictrasera,
                                        runflat:         (this.runflat===false) ? 0 : 1,
                                        comentarios:     this.comentarios },
                                      { codigo: this.baseLocal.user.KOFU,
                                        nombre: this.baseLocal.user.NOKOFU,
                                        email:  this.baseLocal.user.EMAIL } )
          .subscribe( data => { this.revisa( data );           },
                      err  => { this.funciones.msgAlert( '', err ); });
    }
  }
  revisa( data ) {
    console.log(data);
    this.grabando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('Nuevas Medidas presenta problemas al intentar grabación', 2 );
    } else {
      this.funciones.muestraySale(data[0].mensaje, 1 );
      if ( data[0].resultado === true ) {
        this.salir();
      }
    }
  }

}
