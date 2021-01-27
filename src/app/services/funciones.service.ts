import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

import { Usuario, Cliente } from '../models/modelos.modelo';
import { BaselocalService } from './baselocal.service';

import { Subject, Observable } from 'rxjs';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  listSizeSubject: Subject<number>;
  misCompras: Observable<number>;

  loader: any;
  usuario: Usuario;
  cliente: Cliente;
  config: any;
  copiaPendientes: any;
  pendientes: number;
  documento: any;
  nPos = 0;
  miCarrito: Array<{  empresa: string,
                      vendedor: string,
                      nombrevend?: string,
                      bodega: string,
                      sucursal: string,
                      cliente: string,
                      suc_cliente: string,
                      codigo: string,
                      descrip: string;
                      cantidad: number,
                      stock_ud1: number,
                      precio: number,
                      preciomayor: number,
                      descuentomax: number,
                      listapre: string,
                      metodolista: string }>;

  constructor(  private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private toastCtrl: ToastController,
                private baseLocal: BaselocalService ) {
      //
      console.log('<<< FuncionesService >>>');
      //
      this.listSizeSubject = new Subject();
      this.misCompras = this.listSizeSubject.asObservable();
      //
  }

  get CartZise() {
    return this.misCompras;
  }
  refreshCarrito() {
    //
    this.listSizeSubject.next( this.miCarrito.length ); // next method updates the stream value
    //
  }

  textoSaludo() {
    const dia   = new Date();
    if ( dia.getHours() >= 8  && dia.getHours() < 12 ) {
      return 'buenos días ';
    } else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) {
      return 'buenas tardes ';
    } else {
      return 'buenas noches '; }
  }

  async cargaEspera( milisegundos? ) {
    this.loader = await this.loadingCtrl.create({
      duration: ( milisegundos != null && milisegundos !== undefined ? milisegundos : 3000 )
      });
    await this.loader.present();
  }

  hideTabs() {
    let estilo = '';
    const elem   = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      estilo             = elem.style.display;  // se guarda
      elem.style.display = 'none';              // se anula
    }
    return estilo;
  }

  showTabs( estilo ) {
    // tslint:disable-next-line: no-angle-bracket-type-assertion tslint:disable-next-line: whitespace
    const elem = <HTMLElement>document.querySelector('.tabbar');
    if (elem != null) {
      elem.style.display = estilo;
    }
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  async msgAlert( titulo, texto ) {
    const alert = await this.alertCtrl.create({
      // header: titulo,
      mode: 'md',
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async msgAlertErr( texto ) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alertaError',
      mode: 'md',
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestraySale( cTexto, segundos, posicion?, color? ) {
    const toast = await this.toastCtrl.create({
      message: cTexto,
      duration: 1500 * segundos,
      position: posicion || 'middle',
      color: ( color ) ? color : 'danger'
    });
    toast.present();
  }

  inicializaTodo() {
    this.usuario = this.baseLocal.initUsuario();
    if ( this.usuario ) {
      this.usuario.LISTACLIENTE = '';
    }
    this.cliente    = this.baseLocal.initCliente();
    this.config     = this.baseLocal.initConfig();
    this.pendientes = 0;
    this.initCarro();
  }

  initCarro() {
    this.miCarrito = [{ empresa: '', vendedor: '', nombrevend: '', bodega: '', sucursal: '',
                        cliente: '', suc_cliente: '',
                        codigo: '', descrip: '', cantidad: 0, stock_ud1: 0, precio: 0, preciomayor: 0, descuentomax: 0,
                        listapre: '', metodolista: '' }];
  }

  async guardaUltimoCliente( data ) {
    this.cliente = data;
    await Storage.set( { key: 'ktp_ultimo_cliente',
                         value: JSON.stringify(this.cliente) 
                       });
  }

  async obtenUltimoCliente() {
    const ret = await Storage.get( { key: 'ktp_ultimo_cliente'});
    const cli = JSON.parse(ret.value);
    //
    this.cliente = (cli === null) ? this.baseLocal.initCliente() : cli;
    //
    return this.cliente;
  }

  async pideCantidad( producto ) {
    const cantidad = '1';
    const prompt = await this.alertCtrl.create({
      header:   'Stock Bodega : ' + producto.stock_ud1.toString(),
      subHeader: 'Ingrese la cantidad a solicitar de este producto.',
      message: 'No debe sobrepasar el stock actual ni lo pedido si ya existe en el carro. El sistema lo validará',
      inputs:  [ { name: 'cantidad', placeholder: cantidad } ],
      buttons: [
        { text: 'Cancelar', handler: ()   => {} },
        { text: 'Guardar',  handler: data => {  producto.apedir = parseInt( data.cantidad, 0 ) || 1 ;
                                                this.Add2Cart( producto ); } }
      ]
    });
    await prompt.present();
  }

  async pideCantidadyDescrip( producto ) {
    //
    const cantidad = producto.apedir;
    const descrip  = producto.descripcion;
    const precio   = producto.precio;
    //
    const prompt = await this.alertCtrl.create({
      cssClass: 'alert-ancho',
      header:   'Stock Bodega : ' + producto.stock_ud1.toString(),
      subHeader: 'Ingrese la cantidad a solicitar de este producto.',
      message: 'No debe sobrepasar el stock actual ni lo pedido si ya existe en el carro. El sistema lo validará',
      inputs: [
        { name: 'cantidad', type: 'number', placeholder: 'cantidad' },
        { name: 'descrip',  type: 'text',   placeholder: 'descripcion'  },
        { name: 'precio',   type: 'number', placeholder: 'precio del servicio'   }
      ],
      buttons: [
        { text: 'Cancelar', handler: ()   => {} },
        { text: 'Guardar',  handler: data => { producto.apedir       = parseInt( data.cantidad, 0 ) || 1 ;
                                               producto.descripcion  = data.descrip;
                                               producto.precio       = parseInt( data.precio, 0 );
                                               producto.preciomayor  = parseInt( data.precio, 0 );
                                               producto.descuentomax = 0;
                                               this.Add2Cart( producto ); } }
      ]
    });
    await prompt.present();
  }

  async modificaCantidad( producto ) {
    const cantidad = producto.cantidad;
    const prompt = await this.alertCtrl.create({
      header:   'Stock Bodega : ' + producto.stock_ud1.toString(),
      subHeader: 'Ingrese la cantidad a solicitar de este producto.',
      message: 'No debe sobrepasar el stock actual ni la suma de lo pedido. El sistema lo validará',
      inputs:  [ { name: 'cantidad', placeholder: cantidad } ],
      buttons:
      [
        { text: 'Salir',
          handler: () => {}
        },
        { text: 'Cambiar !',
          handler: data => { producto.apedir = parseInt(data.cantidad, 0 ) || 1 ;
                             if ( producto.apedir > producto.stock_ud1 &&  this.baseLocal.soloCotizar === false ) {
                               this.msgAlert('ATENCION', 'Stock insuficiente para esta operación. Intente con otra cantidad.');
                             } else {
                               this.modificaCarrito( producto );
                               const largo = this.miCarrito.length;
                               for ( let i = 0 ; i < largo ; i++ ) {
                                   if ( this.miCarrito[i].codigo.trim() === producto.codigo.trim() &&
                                       this.miCarrito[i].bodega.trim() === producto.bodega.trim() ) {
                                       this.miCarrito[i].cantidad = producto.apedir;
                                   }
                               }
                             }
                            }
        }
      ]
    });
    await prompt.present();
  }

  Add2Cart( producto ) {
    console.log(producto);
    if ( this.stockAlcanza( producto )  ) {
        if ( this.aunVacioElCarrito() ) {
            this.miCarrito[0].empresa      = this.baseLocal.user.EMPRESA;
            this.miCarrito[0].vendedor     = this.baseLocal.user.KOFU;
            this.miCarrito[0].bodega       = producto.bodega;
            this.miCarrito[0].sucursal     = producto.sucursal;
            this.miCarrito[0].cliente      = this.baseLocal.cliente.codigo;
            this.miCarrito[0].suc_cliente  = this.baseLocal.cliente.sucursal;
            this.miCarrito[0].codigo       = producto.codigo;
            this.miCarrito[0].descrip      = producto.descripcion.slice( 0, 49 );
            this.miCarrito[0].cantidad     = producto.apedir;
            this.miCarrito[0].stock_ud1    = producto.stock_ud1;
            this.miCarrito[0].precio       = producto.precio;
            this.miCarrito[0].preciomayor  = producto.preciomayor;
            this.miCarrito[0].descuentomax = producto.descuentomax;
            this.miCarrito[0].listapre     = producto.listaprecio;
            this.miCarrito[0].metodolista  = producto.metodolista;
        } else if ( this.existeEnCarrito( producto ) ) {
            this.agregaACarrito( producto );
        } else {
            this.miCarrito.push({ empresa:      this.baseLocal.user.EMPRESA,
                                  vendedor:     this.baseLocal.user.KOFU,
                                  bodega:       producto.bodega,
                                  sucursal:     producto.sucursal,
                                  cliente:      this.baseLocal.cliente.codigo,
                                  suc_cliente:  this.baseLocal.cliente.sucursal,
                                  codigo:       producto.codigo,
                                  descrip:      producto.descripcion.slice(0, 49),
                                  cantidad:     producto.apedir,
                                  stock_ud1:    producto.stock_ud1,
                                  precio:       producto.precio,
                                  preciomayor:  producto.preciomayor,
                                  descuentomax: producto.descuentomax,
                                  listapre:     producto.listaprecio,
                                  metodolista:  producto.metodolista });
        }
        //
        this.muestraySale( 'Item agregado a pre-venta', 0.5, 'middle', (this.baseLocal.soloCotizar !== true ) ? 'danger' : 'success' );
        this.refreshCarrito(); // next method updates the stream value
        //
    } else {
      this.msgAlert('ATENCION', 'Stock insuficiente para esta operación. Intente con otra cantidad.');
    }
  }
  stockAlcanza( producto ) {
    let stock = 0;
    this.miCarrito.forEach( element => {
      if ( element.codigo === producto.codigo && element.bodega === producto.bodega ) {
        stock += element.cantidad;
      }
    });
    return ( this.baseLocal.soloCotizar || (stock + producto.apedir ) <= producto.stock_ud1 ) ;
  }
  existeEnCarrito( producto ) {
    if ( this.baseLocal.soloCotizar === true ) {
      return false;
    }
    const posicion = this.miCarrito.findIndex( item => item.codigo === producto.codigo  && item.bodega === producto.bodega );
    return ( posicion !== -1 ? true : false );
  }
  agregaACarrito( producto ) {
    const posicion = this.miCarrito.findIndex( item => item.codigo === producto.codigo  && item.bodega === producto.bodega );
    this.miCarrito[posicion].cantidad += producto.apedir;
  }
  modificaCarrito( producto ) {
    if ( producto.apedir <= 0 ) {
      this.muestraySale( 'Solo están permitidos valores positivos mayores a cero.', 1.5, 'middle' );
    } else {
      const posicion = this.miCarrito.findIndex( item => item.codigo === producto.codigo  && item.bodega === producto.bodega );
      this.miCarrito[posicion].cantidad -= this.miCarrito[posicion].cantidad;
      this.miCarrito[posicion].cantidad += producto.apedir;
    }
  }
  aunVacioElCarrito() {
    return ( this.miCarrito.length === 1 && this.miCarrito[0].codigo === '' );
  }
  sumaCarrito() {
    let tot = 0;
    this.miCarrito.forEach( element => {
      if ( element.descuentomax <= 0 || element.descuentomax === undefined ) {
        tot += element.cantidad * element.precio;
      } else {
        tot += element.cantidad * element.preciomayor;
      }
    });
    return tot;
  }
  quitarDelCarro( producto ) {
    //
    if ( !this.aunVacioElCarrito() ) {
        for (let i = 0; i < this.miCarrito.length; i++) {
          if ( this.miCarrito[i].codigo === producto.codigo && this.miCarrito[i].bodega === producto.bodega ) {
            this.miCarrito.splice(i, 1);
          }
        }
    }
    //
    if ( this.miCarrito.length === 0 ) {
         this.initCarro();
    }
    //
    this.refreshCarrito(); // next method updates the stream value
    //
  }

  izquierda(str, n) {
    if (n <= 0) {
        return '';
    } else if (n > String(str).length) {
        return str;
    } else {
      return String(str).substring(0,n);
    }
  }

  derecha(str, n) {
    if (n <= 0) {
        return '';
    } else if (n > String(str).length) {
        return str;
    } else {
        const iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
  }
}
