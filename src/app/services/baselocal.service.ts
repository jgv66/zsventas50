import { Injectable } from '@angular/core';
import { Usuario, Cliente } from '../models/modelos.modelo';

import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class BaselocalService {

  user: Usuario;
  cliente: Cliente;
  listaComunas = []; /* si se pide una vez no se vuelve a buscar */
  config: any;
  empresa: number;
  soloCotizar = false;
  lasMarcas = [];

  constructor() {
    console.log('<<< BaseLocalProvider >>>');
  }

  initUsuario() {
    return {  KOFU: '',
              NOKOFU: '',
              RTFU: '',
              MODALIDAD: null,
              EMAIL: null,
              BODEGA: null,
              LISTAMODALIDAD: null,
              LISTACLIENTE: null,
              SUCURSAL: null,
              EMPRESA: null,
              usuario: '',
              nombre: '',
              modalidad: '',
              KOSU: '',
              sucursal: '',
              bodega: '',
              listamodalidad: '',
              nombrelista: '',
              empresa: '',
              razonsocial: '',
              NOKOBO: '',
              nombresuc: '',
              nombrebod: '',
              krpt: false,
              t6A_tipo: '',
              t6A_valor: 0,
              esuncliente: false,
              puedecrearcli: false,
              puedemodifdscto: false,
              kconcecionario: false,
              puedemoddesc: false,
              puedeverprov: false,
              puedevercosto: false,
              puedecrearnvi: false,
              puedemodifcli: false,
              codigoentidad: '' };
  }

  initCliente() {
    this.cliente = {codigo: '',
                    sucursal: '',
                    razonsocial: '',
                    telefonos: '',
                    direccion: '',
                    ciudad: '',
                    codciudad: '',
                    comuna: '',
                    codcomuna: '',
                    vendedor: '',
                    nombrevendedor: '',
                    listaprecios: '',
                    nombrelista: '',
                    email: '',
                    LISTACLIENTE: '',
                    marca: '',
                    modelo: '',
                    color: '',
                    anno: ''};
    return this.cliente;
  }

  initConfig() {
    return { descripcionamplia:     false,
             codigotecnico:         false,
             soloconstock:          false,
             usarlistacli:          false,
             ordenar:               '',
             imagenes:              true,
             ocultardscto:          true,
             puedevercosto:         false,
             puedemoddscto:         false,
             adq_imagenes:          true,
             adq_gps:               false,
             adq_enviarcorreolocal: false,
             adq_nvv_transitoria:   true,
             adq_ver_importaciones: false };
  }

  initTareaEncaDeta() {
    return [{ id_registro: 0,
              empresa: 0,
              codigousr: '',
              fechareg: null,
              obs: '',
              codigorol: '',
              roldescrip: '',
              id_detalle: 0,
              codigolabor: '',
              labdescrip: '',
              sino: false,
              fecha: null,
              cantidad: 0,
              obs_deta: '',
              textosino: '',
              textocantidad: '',
              textofecha: '',
              textoobs: '' }];
  }

  async guardaUltimoUsuario( data ) {
    // console.log('guardaUltimoUsuario()', data );
    if ( data.LISTACLIENTE === undefined ) {
      data.LISTACLIENTE = '';
    }
    this.user = data;
    await Storage.set( { key: 'ktp_ultimo_usuario',
                         value: JSON.stringify(this.user) });
  }

  async obtenUltimoUsuario() {
    //
    const ret = await Storage.get({ key: 'ktp_ultimo_usuario' });
    const usr = JSON.parse(ret.value);
    //
    this.user = (usr === null) ? this.initUsuario() : usr;
    //
    if ( this.user.LISTACLIENTE === undefined ) {
      this.user.LISTACLIENTE = '';
    }
    return this.user;
  }

  async guardaUltimoConfig( data ) {
    // console.log(data);
    this.config = data;
    await Storage.set( { key: 'ktp_ultimo_config',
                         value: JSON.stringify( this.config )
                       });
  }

  async obtenUltimoConfig() {
    //
    const ret = await Storage.get({ key: 'ktp_ultimo_config'});
    const cfg = JSON.parse(ret.value);
    //
    if ( cfg !== null || cfg !== undefined ) {
      try {
        this.config = cfg;
      } catch (error) {
        this.config = await this.initConfig();
        this.guardaUltimoConfig( this.config );
      }
    } else {
      this.config = await this.initConfig();
    }
    //
    return this.config;
  }

  actualizarConfig( pConfigp ) {
    if ( !this.config ) {
      this.config = this.initConfig();
    } else {
      this.config.adq_imagenes            = pConfigp.adq_imagenes;
      this.config.adq_gps                 = pConfigp.adq_gps;
      this.config.adq_enviarcorreolocal   = pConfigp.adq_correo;
      this.config.adq_nvv_transitoria     = pConfigp.adq_nvv_transitoria;
      this.config.adq_ver_importaciones   = pConfigp.adq_ver_importaciones;
    }
    //
    this.guardaUltimoConfig( this.config );
    //
  }

}
