import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

import { FuncionesService } from 'src/app/services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';

import { Plugins } from '@capacitor/core';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {
  //
  @ViewChild( IonContent, {static: true} ) content: IonContent;
  //
  headerHeight    = 150;
  newheaderHeight: any;
  //
  lScrollInfinito = false;
  offset          = 0;
  scrollSize      = 20;
  codproducto     ;
  descripcion     ;
  cliente         ;
  Carro           = [];
  config: any;
  Importados      = [];
  nombreEmpresa   = '';
  firstcall       = false;
  tipoTarjeta     = true;
  codSuperFam     = '';
  filtroFamilias  = false;
  codFamilias     = '';
  // get's
  listaProductos  = [];
  pProd           = '';
  pDesc           = '';
  pFami           = '';
  buscando        = false;
  //
  sin_imagen      = 'assets/imgs/no-img.png';
  slideOpts       = {
    loop: true,
    lazy: true,
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    on: {
      beforeInit: function() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };
  
        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(this.originalParams, overwriteParams);
      },
      setTranslate: function() {
        const swiper = this;
        const {
          $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }
  
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + (round * 4 * swiperSize);
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = (3 * swiperSize) + (swiperSize * 4 * round);
          }
          if (rtl) {
            tx = -tx;
          }
  
           if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }
  
           const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = (slideIndex * 90) + (progress * 90);
            if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`,
        });
  
         if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
            const multiplier = 1.5 - (
              (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
              + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
            );
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }
  
        const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
        $wrapperEl
          .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      },
      setTransition: function(duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      },
    }
  };
  
  // familias zsmotor   jgv 01-05-2018
  listaFamilias: any = [ { cod: 'NEUM', descrip: 'Neumáticos'            },
                         { cod: 'LLAN', descrip: 'Llantas'               },
                         { cod: 'AEXT', descrip: 'Accesorios exterior'   },
                         { cod: 'AINT', descrip: 'Accesorios interior'   },
                         { cod: 'ACCL', descrip: 'Accesorios llantas'    },
                         { cod: 'DET ', descrip: 'Detailing'             },
                         { cod: 'ILUM', descrip: 'Iluminación'           },
                         { cod: '4X4 ', descrip: 'Off Road'              },
                         { cod: 'SEGU', descrip: 'Protección y seguridad'},
                         { cod: 'THUL', descrip: 'Thule'                 },
                         { cod: 'TUNI', descrip: 'Tunning'               } ];

  constructor( private netWork: NetworkengineService,
               public baseLocal: BaselocalService,
               public  funciones: FuncionesService,
               private alertCtrl: AlertController,
               private router: Router,
               private popoverCtrl: PopoverController ) {
    this.filtroFamilias = false;
    this.codproducto   = '';
    this.descripcion   = '';
    this.codSuperFam   = '';
    this.firstcall     = true;
    this.cliente = this.baseLocal.initCliente();
    //
  }
  
  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.funciones.initCarro();
    this.baseLocal.soloCotizar = false;
    //
    this.baseLocal.obtenUltimoConfig()
        .then( data => { 
          this.config = data;
        });
    // console.log('oninit', this.baseLocal.user, this.baseLocal.user);
    if ( this.baseLocal.user.esuncliente === true ) {
      // console.log(this.baseLocal.user);
      this.esUnCliente();
    }
  }

  esUnCliente() {
    //
    this.baseLocal.user.LISTACLIENTE = '';
    // cliente aqui...
    this.netWork.traeUnSP( 'ksp_buscarDeNuevoClientes',
                          { dato:    this.baseLocal.user.codigoentidad,
                            codusr:  this.baseLocal.user.KOFU,
                            empresa: this.baseLocal.user.EMPRESA,
                            solouno: true } )
        .subscribe( (cli: any) => {
            // console.log(cli[0]);
            this.baseLocal.cliente = cli[0];
            this.cliente = cli[0];
            this.baseLocal.user.LISTACLIENTE = cli[0].listaprecios;
        });
    //
  }

  ionViewDidLoad() {}
  ionViewDidEnter() {}
  ionViewWillEnter() {
    this.cliente = this.baseLocal.cliente;
  }
  ionViewWillLeave() {}

  ScrollToTop() {
    this.content.scrollToTop(1500);
  }

  loadDefaultImg( event ) {
    event.target.src = 'assets/imgs/no-img.png';
  }

  aBuscarProductos( pProducto?, pDescripcion?, pCodFamilias?, xdesde?, infiniteScroll? ) {
    if ( pProducto === '' && pDescripcion === '' && pCodFamilias === '' ) {
      this.funciones.msgAlert('', 'Debe indicar algún dato para buscar...');
    } else {
      //
      if ( xdesde === 1 ) {
        this.buscando = true;
        this.offset          = 0 ;
        this.listaProductos  = [];
        this.pProd           = pProducto ;
        this.pDesc           = pDescripcion ;
        this.pFami           = pCodFamilias ;
        this.lScrollInfinito = true;
      } else {
        this.offset += this.scrollSize ;
        pProducto    = this.pProd ;
        pDescripcion = this.pDesc ;
        pCodFamilias = this.pFami ;
      }
      //
      if ( pCodFamilias === this.listaProductos ) {
        pCodFamilias = '';
      }
      // console.log(this.baseLocal.config);
      this.netWork.traeUnSP( 'ksp_buscarProductos_v8',
                            {  codproducto:   pProducto,
                               descripcion:   pDescripcion,
                               bodega:        this.baseLocal.user.BODEGA,
                               offset:        this.offset.toString(),
                               listaprecio:   (( this.baseLocal.user.LISTACLIENTE && this.baseLocal.user.LISTACLIENTE !== this.baseLocal.user.LISTAMODALIDAD ))
                                              ? this.baseLocal.user.LISTACLIENTE
                                              : this.baseLocal.user.LISTAMODALIDAD,
                               soloconstock:  ( this.baseLocal.config.soloconstock ? true : false ),
                               ordenar:       ( this.baseLocal.config.ordenar ? this.baseLocal.config.ordenar : '' ) ,
                               familias:      pCodFamilias,
                               soloverimport: ( this.baseLocal.config.soloverimport ? this.baseLocal.config.soloverimport : false ),
                               empresa:       this.baseLocal.user.EMPRESA,
                               usuario:       this.baseLocal.user.KOFU })
          .subscribe( data => { this.buscando = false;
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll );
                              },
                      err  => { this.buscando = false;
                                this.funciones.msgAlert( 'ATENCION', err );
                              }
                    );
    }
  }
  revisaExitooFracaso( data, xdesde, infiniteScroll ) {
    // console.log(data);
    if ( data === undefined || data.length === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( data.length > 0 ) {
      //
      data.forEach( item =>{
        item.imagen = 'https://zsmotor.cl/storage/mobile/' + item.codigo + '/img_1.jpg';
      });
      this.listaProductos.push( ...data  );
      //
      if ( infiniteScroll ) {
        infiniteScroll.target.complete();
      }
      //
      if ( data.length < this.scrollSize ) {
        this.lScrollInfinito = false ;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
    }
  }
  masDatos( infiniteScroll: any ) {
    this.aBuscarProductos( this.pProd, this.pDesc, this.pFami, 0, infiniteScroll );
  }

  CeroBlanco( valor ) {
    if ( valor === 0 ) {
        return '';
    } else {
        return '      (' + valor.toLocaleString('es-ES') + '%)';
    }
  }

  cargaListas( producto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_ListasProducto',
                           { codproducto: producto.codigo, usuario: this.baseLocal.user, empresa: '01' },
                           {codigo: this.baseLocal.user.KOFU, nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFLP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' , err );  }
                  );
  }
  revisaEoFLP( producto, data ) {
    const rs    = data;
    const largo = data.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('','Producto sin asignacion a listas de precio o usted no tiene permiso para revisar todas las listas.');
    } else if ( largo > 0 ) {
      this.seleccionarLista( producto, rs );
    }
  }
  async seleccionarLista( producto, listas ) {
    if ( listas.length ) {
      //
      const listasConst = [];
      listas.forEach( element => {
        listasConst.push( { name: element.listaprecio,
                            type: 'radio',
                            label: '(' + element.metodolista + '/' + element.listaprecio + ') -> ' +
                                    element.monedalista.trim() + '   ' +
                                    element.precio1.toLocaleString('es-ES') + this.CeroBlanco(element.descuentomax1),
                            value: element });
      });
      //
      const alert = await this.alertCtrl.create({
            header: 'Precios para : ' + producto.codigo,
            inputs: listasConst,
            mode: 'ios',
            buttons: [ {  text: 'Cancelar',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: () => {}
                        },
                        { text: 'Ok',
                          handler: data => { this.cambiaListaProductos( data, producto, 2 ); }
                        }
                      ]} );
      await alert.present();
      //
    } else {
        this.funciones.msgAlert('ATENCION',
                                'Producto sin stock o sin asignación a listas o sin permiso para revisar todas las listas.' +
                                ' Intente con otros datos.' );
    }
  }
  cargaBodegas( producto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_BodegaProducto',
                          { codproducto: producto.codigo, usuario: this.baseLocal.user.usuario, empresa: '01', cualquierbodega: 0 },
                          {codigo: this.baseLocal.user.KOFU, nombre: this.baseLocal.user.nombre } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFBP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFBP( producto, data ) {
    // console.log(producto, data);
    if ( data === undefined || data.length === 0 ) {
      this.funciones.msgAlert('ATENCION',
                              'Producto sin stock, sin asignación a bodegas o usted no tiene permiso para revisar todas las bodegas.');
    } else if ( data.length > 0 ) {
      this.seleccionarBodega( producto, data );
    }
  }
  async seleccionarBodega( producto, bodegas ) {
    if ( bodegas.length ) {
        const bodconst = [];
        //
        bodegas.forEach( element => {
          bodconst.push( { name: element.bodega,
                           type: 'radio',
                           label: 'Stock: ' + element.stock_ud1.toString() + ' [ ' + element.nombrebodega.trim() + ' ]' ,
                           value: element });
        });
        //
        const alert = await this.alertCtrl.create({
          header: 'Bodegas con stock para : ' + producto.codigo,
          inputs: bodconst,
          mode: 'ios',
          buttons: [ {  text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {}
                      },
                      { text: 'Ok',
                        handler: data => { this.cambiaListaProductos( data, producto, 1 ); }
                      }
                    ]} );

        await alert.present();
    } else {
        this.funciones.msgAlert('ATENCION',
                                'Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas.' );
    }
  }
  cambiaListaProductos( data, producto, caso ) {
    let i = 0;
    /* deberia mejorarla con un filter... */
    if ( caso === 1 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo === producto.codigo ) {
            producto.stock_ud1    = data.stock_ud1;
            producto.bodega       = data.bodega;
            producto.sucursal     = data.sucursal;
            producto.nombrebodega = data.nombrebodega;
            producto.apedir       = 1;
        }
        ++i;
      });
    } else if ( caso === 2 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo === producto.codigo ) {
            producto.precio       = data.precio1;
            producto.preciomayor  = data.preciomayor1;
            producto.montolinea   = data.montolinea1;
            producto.descuentomax = data.descuentomax1;
            producto.dsctovalor   = data.dsctovalor1;
            producto.tipolista    = data.tipolista;
            producto.metodolista  = data.metodolista;
            producto.listaprecio  = data.listaprecio;
          }
        ++i;
      });
    }
  }

  agregarAlCarro( producto ) {
    if ( producto.modificable === false ) {
      this.funciones.pideCantidad( producto );
    } else {
      this.funciones.pideCantidadyDescrip( producto );
    }
  }

  ConfiguracionLocal() {
    this.router.navigate(['/tabs/menuseteo']);
  }
  masOpciones() {
    // console.log('masOpciones()', this.filtroFamilias);
    this.filtroFamilias = !this.filtroFamilias ;
    if ( !this.filtroFamilias ) {
      this.codFamilias = '';
    }
  }

  async limpiarCliente() {
    const confirm = await this.alertCtrl.create({
      header: 'Limpiar datos',
      message: 'Iniciará búsquedas sin mencionar a cliente y no podrá agregar al carro sin este dato.' +
               ' Desea limpiar los datos del cliente activo?',
      buttons: [
                  { text: 'No, gracias', handler: () => {} },
                  { text: 'Sí, limpiar', handler: () => { this.cliente = this.baseLocal.initCliente();
                                                          this.baseLocal.user.LISTACLIENTE = '';
                                                          this.baseLocal.cliente = this.cliente;
                                                          this.funciones.guardaUltimoCliente( this.cliente ); } }
               ]
    });
    await confirm.present();
  }

  largoListaProductos() {
    return this.listaProductos.length;
  }
  scrollToTop() {
    // this.content.scrollToTop();
  }

  async cambiaDescuento( producto ) {
    let conAutonomia = false;
    if ( this.baseLocal.user.t6A_tipo === '1' ) {
      conAutonomia = true;
    }
    // console.log(this.baseLocal.user);
    if ( !this.baseLocal.user.puedemodifdscto && !conAutonomia ) {
      this.funciones.muestraySale('Ud. no posee permiso para hacer esta modificación.', 2 );
    } else {
      const dmax   = producto.descuentomax;
      const prompt = await this.alertCtrl.create({
        header:  'Descto. Máximo : ' + producto.descuentomax.toString() + '%',
        message: 'Ingrese el nuevo descuento máximo a utilizar.',
        inputs:  [ { name: 'dmax', placeholder: dmax } ],
        buttons: [
          { text: 'Salir',     handler: () => {} },
          { text: 'Cambiar !', handler: data => {
            if ( data.dmax < 0 || data.dmax > 100 ) {
              this.funciones.msgAlert('', 'Descuento digitado está incorrecto. Intente con otro valor.');
            } else if ( conAutonomia === true ) {
              const desmax = ( this.baseLocal.user.t6A_valor / 100 ) * dmax;
              if ( desmax < data.dmax ) {
                this.funciones.msgAlert('', 'Descuento digitado supera su autonomía. Corrija y reintente.');
              } else {
                producto.descuentomax = data.dmax;
                producto.preciomayor  = Math.round((producto.precio - ( producto.precio * data.dmax / 100)));
                producto.dsctovalor   = producto.precio - producto.preciomayor;
                }
            } else {
              producto.descuentomax = data.dmax;
              producto.preciomayor  = Math.round((producto.precio - ( producto.precio * data.dmax / 100)));
              producto.dsctovalor   = producto.precio - producto.preciomayor;
            }
          } }
        ]
      });
      await prompt.present();
    }
  }
  cargaDatoImportado( codigoprod ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_EnImportaciones',
                           { codproducto: codigoprod,
                             usuario: this.baseLocal.user.KOFU,
                             empresa: this.baseLocal.user.EMPRESA },
                           { codigo: this.baseLocal.user.KOFU,
                             nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( (data: any) => { this.funciones.descargaEspera();
                                     this.Importados = data;
                                     this.muestraImportados( codigoprod ); },
                    (err: any) => { this.funciones.descargaEspera();
                                    this.funciones.msgAlert( 'ATENCION', err ); }
                  );
  }
  async muestraImportados( codproducto ) {
    if ( this.Importados.length ) {
      //
      const impconst: any = [];
      this.Importados.forEach( element => {
        impconst.push( {  type: 'radio',
                          label: 'Cant: ' + element.cantidad.toString() + '  [ Llegada: ' + element.fecha + ' ]',
                          value: element } );
      });
      //
      const alert = await this.alertCtrl.create({
        header: 'Importaciones : ' + codproducto,
        inputs: impconst,
        mode: 'ios',
        buttons:  [ { text: 'Ok', handler: (data: any) => {} } ]} );
      await alert.present();
    } else {
        this.funciones.msgAlert('', 'Producto sin importaciones. Intente con otros datos.' );
    }
  }

  cargaDatoPedido( codigoprod ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_EnPedido',
                           { codproducto: codigoprod,
                             usuario: this.baseLocal.user.KOFU,
                             empresa: this.baseLocal.user.EMPRESA },
                           { codigo: this.baseLocal.user.KOFU,
                             nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( (data: any) => { this.funciones.descargaEspera();
                                     this.Importados = data;
                                     this.muestraPedidos( codigoprod ); },
                    (err: any) => { this.funciones.descargaEspera();
                                    this.funciones.msgAlert( 'ATENCION', err ); }
                  );
  }
  async muestraPedidos( codproducto ) {
    if ( this.Importados.length ) {
      //
      const impconst: any = [];
      this.Importados.forEach( element => {
        impconst.push( {  type: 'radio',
                          label: 'Cant: ' + element.cantidad.toString() + '  [ Llegada: ' + element.fecha + ' ]',
                          value: element } );
      });
      //
      const alert = await this.alertCtrl.create({
        header: 'Pedidos : ' + codproducto,
        inputs: impconst,
        mode: 'ios',
        buttons:  [ { text: 'Ok', handler: () => {} } ]} );
      await alert.present();
    } else {
        this.funciones.msgAlert('', 'Producto sin pedidos. Intente con otros datos.' );
    }
  }

  async opcionPuntos( event, producto ) {
      //
      const popover = await this.popoverCtrl.create({
        component: TrespuntosComponent,
        componentProps: { quees: 'sugerencia' },
        event,
        mode: 'ios',
        translucent: false
      });
      await popover.present();
      //
      const { data } = await popover.onDidDismiss();
      //
      if ( data ) {
        if (data.opcion.texto === 'Últimas Ventas' ) {
            const dataParam = JSON.stringify({tipo: 'V', codigo: producto.codigo });
            this.router.navigate(['/tabs/ultmovs', dataParam]);
        } else if (data.opcion.texto === 'Últimas Compras' ) {
            if ( this.baseLocal.user.puedevercosto === true ) {
              const dataParam = JSON.stringify({tipo: 'C', codigo: producto.codigo });
              this.router.navigate(['/tabs/ultmovs', dataParam]);
            } else {
              this.funciones.msgAlert('ATENCION', 'Ud. no posee autorización para ver esta información.' );
            }
        } else if (data.opcion.texto === 'Sugerencias' ) {
            const dataParam = JSON.stringify({ codigo: producto.codigo, tecnico: producto.codtecnico, descrip: producto.descripcion });
            this.router.navigate(['/tabs/sugerencias', dataParam]);
        } else if (data.opcion.texto === 'Notificaciones' ) {
            const dataParam = JSON.stringify({ codigo: producto.codigo, tecnico: producto.codtecnico, descrip: producto.descripcion });
            this.router.navigate(['/tabs/notif', dataParam]);
        } else if (data.opcion.texto === 'NVI para reponer' ) {
            if ( this.baseLocal.user.puedecrearnvi === true ) {
              const dataParam = JSON.stringify({ producto, usuario: this.baseLocal.user.usuario });
              this.router.navigate(['/tabs/crearnvi', dataParam]);
            } else {
              this.funciones.msgAlert('ATENCION', 'Ud. no posee autorización para crear este documento.' );
            }
        } else if (data.opcion.texto === 'Compartir' ) {
            const dataParam = JSON.stringify({ producto, usuario: this.baseLocal.user.usuario });
            this.router.navigate(['/tabs/socialsh', dataParam]);
        } else if (data.opcion.texto === 'Copy & Paste' ) {
            this.copyPaste( producto )
        } else if (data.opcion.texto === 'Ficha técnica' ) {
            const dataParam = JSON.stringify({ producto, usuario: this.baseLocal.user.usuario });
            this.router.navigate(['/tabs/fichatecnica', dataParam]);
        } else if (data.opcion.texto === 'Redes Sociales' ) {
            const dataParam = JSON.stringify({ producto, usuario: this.baseLocal.user.usuario });
            this.router.navigate(['/tabs/socialsh', dataParam]);
        }
      }
  }

  onoffCotizar() {
    if ( this.baseLocal.cliente.codigo === '' ) {
      if ( this.baseLocal.soloCotizar && !this.funciones.aunVacioElCarrito() ) {
        this.funciones.initCarro();
      }
      this.baseLocal.soloCotizar = !this.baseLocal.soloCotizar;
      this.funciones.muestraySale( (this.baseLocal.soloCotizar) ? 'Cotizar: ACTIVO' : 'Cotizar: INACTIVO', 1, 'middle', 'success' );
    } else {
      this.funciones.msgAlert('ATENCION', 'Esta funcionalidad solo aplica sin cliente activo.' );
    }
  }

  copyPaste( producto ) {
    //
    let texto = '';
    texto += 'Código : '+producto.codigo+'\n';
    texto += 'Descripcion : '+producto.descripcion+'\n' ;
    texto += 'Bodega ('+producto.bodega.trim()+') : '+producto.nombrebodega+'\n' ;
    //
    if ( producto.preciomayor > 0 ) {
      texto += 'Precio '+producto.tipolista+' : '+producto.preciomayor.toLocaleString()+'\n\n' ;
    }
    //
    texto +='https://zsmotor.cl/storage/mobile/'+producto.codigo.trim()+'/img_1.jpg'+'\n' ;
    
    Clipboard.write({ string: texto,
                      url: 'https://zsmotor.cl/storage/mobile/'+producto.codigo.trim()+'/img_1.jpg',
                      label: 'ZSMotor' })
        .then( response=>{ 
          this.funciones.muestraySale('Copiado al porta-papeles. Puedo Pegarlo en cualquier aplicación.',1.5,'middle');
        })
        .catch( err => {
          this.funciones.muestraySale('problemas al copiar -> '+ err,2,'middle');
        });
    //
    //
  }

  scanBarcode() {
    this.funciones.msgAlert('ATENCION', 'Lectura de códigos de barra momentáneamente en construcción.' );
  }

}


