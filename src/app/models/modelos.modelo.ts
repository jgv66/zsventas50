export interface Usuario {
    KOFU: string;   // codigo de usuario
    usuario: string;
    NOKOFU: string;
    nombre: string;
    RTFU: string;
    EMAIL: string;
    MODALIDAD: string;
    modalidad: string;
    KOSU: string;
    sucursal: string;
    BODEGA: string;
    bodega: string;
    LISTAMODALIDAD: string;
    listamodalidad: string;
    nombrelista: string;
    LISTACLIENTE: string;
    SUCURSAL: string;
    EMPRESA: string;
    empresa: string;
    razonsocial: string;
    NOKOBO: string;
    nombresuc: string;
    nombrebod: string;
    esuncliente: boolean;
    puedecrearcli: boolean;
    puedemodifdscto: boolean;
    krpt: boolean;
    t6A_tipo: string;
    t6A_valor: number;
    kconcecionario: boolean;
    puedemoddesc: boolean;
    puedeverprov: boolean;
    puedevercosto: boolean;
    puedecrearnvi: boolean;
    puedemodifcli: boolean;
    codigoentidad: string;
}

export interface Cliente {
  codigo: string;
  sucursal: string;
  email: string;
  telefonos: string;
  razonsocial: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  vendedor: string;
  nombrevendedor: string;
  listaprecios: string;  // char(3)
  nombrelista: string;
  LISTACLIENTE: string;
  marca: string;
  modelo: string;
  color: string;
  anno: string;
}

export interface Configuracion {
  descripcionamplia: boolean;
  codigotecnico: boolean;
  soloconstock: boolean;
  usarlistacli: boolean;
  ordenar: string;
  imagenes: boolean;
  ocultardscto: boolean;
  soloverimport: boolean;
  adq_imagenes: boolean;
  adq_gps: boolean;
  adq_enviarcorreolocal?: boolean;
  adq_nvv_transitoria?: boolean;
  adq_ver_importaciones?: boolean;
  adq_imprimir_docs_pdf?: boolean;
}

