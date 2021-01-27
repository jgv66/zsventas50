import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { NetworkengineService } from 'src/app/services/networkengine.service';

@Component({
  selector: 'app-avisoservicio',
  templateUrl: './avisoservicio.page.html',
  styleUrls: ['./avisoservicio.page.scss'],
})
export class AvisoservicioPage implements OnInit {

  @Input() producto;

  enviando = false;
  email='';
  nombre='';
  fono='';
  observaciones='';
  cantidadKM=0;
  dias='';
  periodos = [{dias:'7 días',  cantidad:7  },
              {dias:'15 días', cantidad:15 },
              {dias:'1 mes',   cantidad:30 },
              {dias:'2 meses', cantidad:60 },
              {dias:'3 meses', cantidad:90 },
              {dias:'4 meses', cantidad:120},
              {dias:'5 meses', cantidad:150},
              {dias:'6 meses', cantidad:180},
              {dias:'7 meses', cantidad:210},
              {dias:'8 meses', cantidad:240},
              {dias:'9 meses', cantidad:270},
              {dias:'10 meses', cantidad:300},
              {dias:'11 meses', cantidad:330},
              {dias:'12 meses', cantidad:360}];

  constructor( private modalCtrl: ModalController,
               private funciones: FuncionesService,
               private baseLocal: BaselocalService,
               private router: Router,
               private netWork: NetworkengineService ) {}

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }    
    //
    if ( this.baseLocal.cliente.codigo !== '' ) {
      this.nombre = this.baseLocal.cliente.razonsocial;
      this.email = this.baseLocal.cliente.email;
      this.fono = this.baseLocal.cliente.telefonos
    }
    //    
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  enviarAviso() {
    if ( this.email === '' || this.dias === '' ) {
      this.funciones.msgAlertErr('Debe completar los datos obligatorios');
    } else {
      this.enviando = true;
      this.netWork.consultaEstandar(  'ksp_avisoProximoServicio',
                                      { sucursal:      this.baseLocal.user.KOSU,
                                        usuario:       this.baseLocal.user.KOFU,
                                        codprod:       this.producto.codigo,
                                        codtecnico:    this.producto.tecnico,
                                        descrip:       this.producto.descrip,
                                        tipo:          'AVISO',
                                        nombre:        this.nombre,
                                        email:         this.email,
                                        fono:          this.fono,
                                        km:            this.cantidadKM,
                                        observaciones: this.observaciones,
                                        dias:          this.dias },
                                      { codigo:        this.baseLocal.user.KOFU,
                                        nombre:        this.baseLocal.user.NOKOFU,
                                        email:         this.baseLocal.user.EMAIL } )
          .subscribe( data => { this.revisa( data ); },
                      err  => { this.funciones.msgAlert( '', err ); });
    }
  }
  revisa( data ) {
    // console.log(data);
    this.enviando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale('Notificaciones presenta problemas al intentar grabación', 2 );
    } else {
      this.funciones.muestraySale(data[0].mensaje, 1 );
      if ( data[0].resultado === true ) {
        this.salir();
      }
    }
  }

}
