import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NetworkengineService {

  url = environment.API_URL;

  constructor( private http: HttpClient ) {
    console.log('<<< NetworkengineService >>>');
  }

  soloEnviarCorreo( pCarro, cTo, cCc, cTextoObs, soloCotizar? )  {
    console.log('soloEnviarCorreo()->', pCarro);
    const accion = '/soloEnviarCorreo';
    const url    = this.url  + accion;
    const body   = { carro: pCarro, cTo, cCc, cObs: cTextoObs, cotizar: soloCotizar };
    return this.http.post( url, body );
  }

  soloEnviarAdjuntos( body )  {
    console.log('soloEnviarAdjuntos()->', body);
    const url  = this.url + '/soloEnviarAdjuntos';
    return this.http.post( url, body );
  }

  traeUnSP( cSP: string, parametros?: any, pUser?: any ) {
    const accion = '/proalma';
    const url    = this.url + accion;
    const body   = { sp: cSP, datos: parametros, user: pUser, versionNueva: true };
    // console.log(url, body);
    return this.http.post( url, body );
  }

  consultaEstandar( cSP: string, parametros?: any, pUser?: any ) {
    const accion = '/' + cSP;
    const url    = this.url + accion;
    const body   = { datos: parametros, user: pUser, versionNueva: true };
    return this.http.post( url, body );
  }

  consultaEstandarGet( cSP: string ) {
    const accion = '/' + cSP;
    const url    = this.url + accion;
    return this.http.get( url );
  }

  rescataSeteoCliente() {
    const accion = '/seteocliente';
    const url    = this.url  + accion;
    const body   = { x: 'ktp_configuracion' };
    return this.http.post( url, body );
  }

  grabarDocumentos( pCarro, pModalidad, cTipodoc, cTextoObs, cTextoOcc, cKilometraje, sucursalOrigen )  {
    const accion = '/grabadocumentos';
    const url    = this.url  + accion;
    const body   = { carro: pCarro, modalidad: pModalidad, tipodoc: cTipodoc, cObs: cTextoObs, cOcc: cTextoOcc, nKM: cKilometraje, sucOrigen: sucursalOrigen };
    return this.http.post( url, body );
  }

}
