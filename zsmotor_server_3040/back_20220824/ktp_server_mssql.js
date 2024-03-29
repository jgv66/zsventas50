//
var express = require('express');
var app = express();
var async = require("async");
//
var dbconex = require('./conexion_mssql.js');
var configuracion = require('./configuracion_cliente.js');
var correos = require('./k_sendmail.js');
var elmail = require('./k_traemail.js');
var servicios = require('./k_serviciosweb.js');
var _Reportes = require('./k_reportes.js');
var _Activity = require('./k_regactiv.js');
//
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const fileExist = require('file-exists');
//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// envio de correos 
var nodemailer = require('nodemailer'); // email sender function 
exports.sendEmail = function(req, res) {
    console.log('enviando correo...');
};
//
// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));

// carpeta de imagenes: desde donde se levanta el servidor es esta ruta -> /root/trial-server-001/public
// app.use(express.static('public'));
app.use("/public", express.static('public'));
publicpath = path.resolve(__dirname, 'public');
app.use('/static', express.static(publicpath));
CARPETA_PDF = publicpath + '/pdf/';
CARPETA_HTML = publicpath + '/pdf/';
CARPETA_IMG = publicpath + '/attach/';
console.log(CARPETA_PDF);
console.log(CARPETA_IMG);

// servidor escuchando puerto 3040
var server = app.listen(3040, function() {
    console.log("Escuchando http en el puerto: %s", server.address().port);
});

// dejare el server mssql siempre activo
var sql = require('mssql');
var conex = sql.connect(dbconex);

//---------------------- pruebas
app.get('/ping',
    function(req, res) {
        //
        console.log('PONG');
        res.json({ resultado: "ok", datos: 'hola mundo' });
        //
    });
// --------------------- concecionarios
app.post('/ins_dataconcesionarios',
    function(req, res) {
        //
        servicios.ins_dataconce(sql, req.body)
            .then(function(data) {
                //console.log("/dataconcesionarios",data); 
                res.json({ resultado: 'ok', datos: data });
            })
            .catch(err => {
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/marca_autos',
    function(req, res) {
        //
        servicios.marca_autos(sql)
            .then(function(data) {
                res.json({ resultado: 'ok', datos: data });
            })
            .catch(err => {
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/modelo_autos',
    function(req, res) {
        //
        servicios.modelo_autos(sql, req.body)
            .then(function(data) {
                res.json({ resultado: 'ok', datos: data });
            })
            .catch(err => {
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/cargadatosconc',
    function(req, res) {
        //
        servicios.datosconc(sql, req.body)
            .then(function(data) {
                res.json({ resultado: 'ok', datos: data });
            })
            .catch(err => {
                res.json({ resultado: 'error', datos: err });
            });
    });

app.get('/ws/sucursales',
    function(req, res) {
        //
        servicios.Sucursales(sql)
            .then(function(data) {
                //console.log("/ws/Sucursales ",data); 
                res.json({ resultado: "ok", datos: data });
            });
    });
app.get('/ws/bodegas',
    function(req, res) {
        //
        servicios.Bodegas(sql)
            .then(function(data) {
                //console.log("/ws/Bodegas ",data); 
                res.json({ resultado: "ok", datos: data });
            });
    });
app.get('/ws/marcas',
    function(req, res) {
        //
        servicios.Marcas(sql)
            .then(function(data) {
                //console.log("/ws/Marcas ",data); 
                res.json({ resultado: "ok", datos: data });
            });
    });

app.post('/krpt',
    function(req, res) {
        //
        var empresa = req.body.datos.empresa;
        var caso = req.body.datos.reporte;
        var sucursal = req.body.datos.sucursal || '';
        var vendedor = req.body.datos.vendedor || '';
        var periodo = req.body.datos.periodo || '';
        //
        _Reportes.ventas(sql, empresa, caso, sucursal, vendedor, periodo)
            .then(function(data) {
                // console.log("krpt ", data);
                res.json({ resultado: 'ok', datos: data });
            });
    });

app.post('/soloEnviarCorreo',
    function(req, res) {
        //
        var carro = req.body.carro || [];
        var xTo = req.body.cTo || '';
        var xCc = req.body.cCc || '';
        var xObs = req.body.cObs || '';
        var xOcc = req.body.cOcc || '';
        var coti = req.body.cotizar || false;
        //
        var lineas = '';
        var htmlBody = '';
        var mailList = [];
        //
        var x2 = '',
            i = 0,
            monto = 0,
            neto = 0,
            iva = 0,
            bruto = 0,
            NoB = carro[0].metodolista;
        //
        _Activity.registra(sql, carro[0].vendedor, 'soloEnviarCorreo', xTo, xCc, x2);
        //
        console.log('detalle del correo...');
        carro.forEach(element => {
            lineas += '<tr>';
            lineas += '<td align="center"><img src="https://img.zsmotor.cl/fotos/app/' + element.codigo.trim() + '-1.jpg" width="150px" height="150px"/></td>';
            lineas += '<td align="center">' + element.cantidad.toString() + '</td>';
            lineas += '<td align="center">' + element.codigo + '</td>';
            lineas += '<td align="center">' + element.descrip + '</td>';
            lineas += '<td align="center">' + element.precio.toLocaleString() + '</td>';
            lineas += '<td align="center">' + element.descuentomax.toString() + '%</td>';
            lineas += '<td align="center">' + (element.preciomayor * element.cantidad).toLocaleString() + '</td>';
            lineas += '</tr>';
            monto += (element.preciomayor * element.cantidad);
            if (++i == carro.length) {
                if (NoB === 'N') {
                    neto = monto;
                    iva = Math.round(neto * 0.19);
                    bruto = neto + iva;
                } else {
                    bruto = monto;
                    neto = Math.round(bruto / 1.19);
                    iva = bruto - neto;
                }
                lineas += '<tr>';
                lineas += '<td colspan="6" align="right"><strong>TOTAL NETO :</strong></td>';
                lineas += '<td align="right">' + neto.toLocaleString() + '</td>';
                lineas += '</tr>';
                lineas += '<tr>';
                lineas += '<td colspan="6" align="right"><strong>IVA :</strong></td>';
                lineas += '<td align="right">' + iva.toLocaleString() + '</td>';
                lineas += '</tr>';
                lineas += '<tr>';
                lineas += '<td colspan="6" align="right"><strong>TOTAL BRUTO :</strong></td>';
                lineas += '<td align="right">' + bruto.toLocaleString() + '</td>';
                lineas += '</tr>';
                //            
            }
        });
        // es obligatorio que el vendedor tenga correo
        elmail.delVendedor(sql, carro[0].vendedor)
            .then(function(data) {
                x2 = data[0].correo;
                nombreVend = data[0].nombre;
                copiasadic = data[0].copiasadic || '';
                // datos del cliente
                if (coti === true) {
                    console.log('correo de cotizacion');
                    mailList.push({ cc: [xCc, x2, copiasadic], to: xTo });
                    htmlBody = correos.primeraParte(xObs, nombreVend, undefined, undefined, undefined, "Correo de cotización", '', xOcc, data[0].correo, data[0].fono) + lineas + correos.segundaParte();
                    correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
                } else {
                    console.log('correo normal');
                    elmail.delCliente(sql, carro[0].cliente, carro[0].suc_cliente)
                        .then(function(data) {
                            x1 = data[0].correo;
                            rs = data[0].rs;
                            //
                            mailList.push({ cc: [xCc, x2, copiasadic], to: xTo });
                            htmlBody = correos.primeraParte(xObs, nombreVend, rs, carro[0].cliente, carro[0].suc_cliente, "Correo de cotizacion", '', xOcc, data[0].correo, data[0].fono) + lineas + correos.segundaParte();
                            correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
                            //
                        });
                }
            });
    });

// agregado el 23/05/2018
app.post('/grabadocumentos',
    function(req, res) {
        // los parametros
        let carro = req.body.carro;
        let modalidad = req.body.modalidad;
        let tipodoc = req.body.tipodoc || 'PRE'; /* PRE, NVV, COV */
        let xObs = req.body.cObs || '';
        let xOcc = req.body.cOcc || ''; // incorporada 27/07/2018, se modifica ktp_encabezado -> occ varchar(40)
        let nKm = req.body.nKM || ''; // agregada el 21/10/2020, se modifica encabezado -> kilometraje varchar(20)
        let sucOrigen = req.body.sucOrigen || ''; // agregada el 13/09/2021, 
        // const suc_destino = req.body.sucursalDestino || '';
        // variables
        let xhoy = new Date();
        let hora = xhoy.getTime();
        //
        let lineas = '';
        let htmlBody = '';
        let mailList = [];
        let x1 = '';
        let x2 = '',
            rsocial = '',
            copiasadic = '',
            nombreVend = '',
            i = 0,
            monto = 0,
            neto = 0,
            iva = 0,
            bruto = 0,
            NoB = 'N'; // carro[0].metodolista; cambiado para leer solo data en NETO
        // 
        //console.log( carro );  
        _Activity.registra(sql, carro[0].vendedor, 'grabadocumentos', tipodoc);
        //
        let query = `
            declare @id int = 0, 
                    @id_edo int = 0,
                    @nrodoc char(10) = ''; 
            --
            declare @Error	nvarchar(250) , 
                    @ErrMsg	nvarchar(2048); 
            --            
            begin try;
                --
                begin transaction;
                    --
                    insert into ktp_encabezado (empresa,cliente,suc_cliente,vendedor,
                                                fechaemision,monto,observacion,occ,kilometraje,modalidad,valido,
                                                fechaentrega,horainicio,horafinal,suc_origen) 
                                        values ('${carro[0].empresa}','${carro[0].cliente}','${carro[0].suc_cliente}','${carro[0].vendedor}',
                                                getdate(),0,'${xObs.trim()}','${xOcc.trim()}','${nKm.toString()}','${modalidad}','',
                                                getdate(),'${hora}','${hora}','${sucOrigen}' ) ;
                    --
                    set @id = IDENT_CURRENT('ktp_encabezado');
                    --
                    %%%%detalle%%%%
                    --
                    update ktp_encabezado set monto=( select sum((d.cantidad1*d.precio)-d.descuentos) 
                                                      from ktp_detalle as d 
                                                      where d.id_preventa=ktp_encabezado.id_preventa )  
                    where id_preventa=@id ;
                    --

                    `;
        //
        if (tipodoc == 'PRE') {
            query += "exec ksp_grabaDocumentoPre_v1 'Pendiente', 'NVV', @id, @nrodoc output, @id_edo output ;";
        } else if (tipodoc == 'NVV' || tipodoc == 'COV' || tipodoc == 'NVI') {
            query += "exec ksp_grabaDocumentoDef_v1 '" + tipodoc + "', @id, @nrodoc output, @id_edo output ;";
        }
        //
        query += `       
                    if ( @@ERROR <> 0 ) begin
                        set  @Error = @@ERROR
                        set @ErrMsg = ERROR_MESSAGE();
                        THROW @Error, @ErrMsg, 0 ;  
                    end;     
                    --
                commit transaction ;
                select @nrodoc as numero, @id as id, @id_edo as id_edo ;
                --
            end try
            begin catch
                --
                set @Error = @@ERROR;
                set @ErrMsg = ERROR_MESSAGE();
                --
                if ( @@trancount > 0 ) ROLLBACK TRANSACTION ;
                select '' as numero, 0 as id, 0 as id_edo, @ErrMsg as errormsg ;
                --
            end catch;
            `;
        //
        let queryd = '';
        for (i = 0; i < carro.length; i++) {
            //
            queryd += `
                    insert into ktp_detalle (id_preventa,linea,sucursal,bodega,codigo,descripcion,vendedor,
                                            unidad_tr,unidad1,unidad2,cantidad1,cantidad2,listaprecio,metodolista,
                                            precio,porcedes,descuentos,porcerec,recargos,observacion,valido) 
                                    values (@id,${(i + 1).toString()},'${carro[i].sucursal}','${carro[i].bodega}','${carro[i].codigo.trim()}','${carro[i].descrip.trim()}','${carro[i].vendedor}',
                                            1,'','',${carro[i].cantidad.toString()}, 0,'${carro[i].listapre}','${carro[i].metodolista}',
                                            ${carro[i].precio.toString()},${carro[i].descuentomax.toString()},${((carro[i].precio - carro[i].preciomayor) * carro[i].cantidad).toString()},0,0,'','' );
                    --
               `;
            //
        }
        //    
        query = query.replace('%%%%detalle%%%%', queryd);
        //
        console.log(query);
        //
        conex
            .then(function() {
                //
                lineas = '';
                const request = new sql.Request();
                // 
                request.query(query)
                    .then(function(rs) {
                        // console.log("documento (" + tipodoc + ") grabado ", rs.recordset);
                        res.json({ resultado: 'ok', numero: rs.recordset[0].numero });
                        // es obligatorio que el vendedor tenga correo
                        elmail.delVendedor(sql, carro[0].vendedor)
                            .then(function(data) {
                                x2 = data[0].correo;
                                nombreVend = data[0].nombre;
                                copiasadic = data[0].copiasadic || '';
                                const correoVend = data[0].correo;
                                const fonoVend = data[0].fono;
                                //
                                elmail.delCliente(sql, carro[0].cliente, carro[0].suc_cliente)
                                    .then(function(data) {
                                        x1 = data[0].correo;
                                        rsocial = data[0].rs;
                                        //
                                        i = 0;
                                        monto = 0;
                                        neto = 0;
                                        iva = 0;
                                        bruto = 0;
                                        //
                                        correos.componeBody(sql, rs.recordset[0].id_edo)
                                            .then(data => {
                                                data.recordset.forEach(element => {
                                                    lineas += '<tr>';
                                                    lineas += '<td align="center"><img src="https://img.zsmotor.cl/fotos/app/' + element.codigo.trim() + '-1.jpg" width="150px" height="150px"/></td>';
                                                    lineas += '<td align="center">' + element.cantidad.toString() + '</td>';
                                                    lineas += '<td align="center">' + element.codigo + '</td>';
                                                    lineas += '<td align="center">' + element.descripcion + '</td>';
                                                    lineas += '<td align="center">' + element.preciounit.toLocaleString() + '</td>';
                                                    lineas += '<td align="center">' + element.porcentaje.toString() + '%</td>';
                                                    lineas += '<td align="center">' + element.subtotal.toLocaleString() + '</td>';
                                                    lineas += '</tr>';
                                                    monto += element.subtotal;
                                                    if (++i == data.recordset.length) {
                                                        if (NoB === 'N') {
                                                            neto = monto;
                                                            iva = Math.round(neto * 0.19);
                                                            bruto = neto + iva;
                                                        } else {
                                                            bruto = monto;
                                                            neto = Math.round(bruto / 1.19);
                                                            iva = bruto - neto;
                                                        }
                                                        lineas += '<tr>';
                                                        lineas += '<td colspan="6" align="right"><strong>TOTAL NETO :</strong></td>';
                                                        lineas += '<td align="center">' + neto.toLocaleString() + '</td>';
                                                        lineas += '</tr>';
                                                        lineas += '<tr>';
                                                        lineas += '<td colspan="6" align="right"><strong>IVA :</strong></td>';
                                                        lineas += '<td align="center">' + iva.toLocaleString() + '</td>';
                                                        lineas += '</tr>';
                                                        lineas += '<tr>';
                                                        lineas += '<td colspan="6" align="right"><strong>TOTAL BRUTO :</strong></td>';
                                                        lineas += '<td align="center">' + bruto.toLocaleString() + '</td>';
                                                        lineas += '</tr>';
                                                        //            
                                                    }
                                                });
                                                // 
                                                htmlBody = correos.primeraParte(xObs, nombreVend, rsocial, carro[0].cliente, carro[0].suc_cliente, rs.recordset[0].numero, tipodoc, xOcc, correoVend, fonoVend) + lineas + correos.segundaParte();
                                                //
                                                mailList.push({ cc: [x2, copiasadic], to: x1 });
                                                correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
                                            });
                                    });
                            });
                    })
                    .catch(function(er) {
                        console.log('error al grabar', er);
                        res.send(er);
                    });
            });
    });
app.post('/pregraba',
    function(req, res) {
        // los parametros
        var carro = req.body.carro;
        var modalidad = req.body.modalidad;
        var tipodoc = 'NVV';
        var xObs = req.body.cObs || '';
        // variables
        var query = '';
        var xhoy = new Date();
        var hora = xhoy.getTime();
        //
        var lineas = '';
        var htmlBody = '';
        var mailList = [];
        var x1 = '';
        var x2 = '';
        // es obligatorio que el vendedor tenga correo
        elmail.delVendedor(sql, carro[0].vendedor).then(function(data) { x1 = data; });
        elmail.delCliente(sql, carro[0].cliente, carro[0].suc_cliente).then(function(data) { x2 = data; });
        // 
        //console.log( xhoy, carro[0].vendedor, 'xsp -->> pregraba' );      
        _Activity.registra(sql, carro[0].vendedor, 'pregraba', tipodoc);
        //
        query = "declare @id     int      = 0 ; ";
        query += "declare @nrodoc char(10) = ''; ";
        query += "declare @Error nvarchar(250) ; ";
        query += "begin transaction ;";
        query += "insert into ktp_encabezado (empresa,cliente,suc_cliente,vendedor,fechaemision,";
        query += "monto,observacion,modalidad,valido,fechaentrega,horainicio,horafinal) ";
        query += "values ('" + carro[0].empresa + "','" + carro[0].cliente + "','" + carro[0].suc_cliente + "','" + carro[0].vendedor + "',getdate(),";
        query += "0,'','" + modalidad + "','',getdate(),'" + hora + "','" + hora + "') ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        query += "select @id = @@IDENTITY ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        //
        for (var i = 0; i < carro.length; i++) {
            //
            query += "insert into ktp_detalle (id_preventa,linea,sucursal,bodega,codigo,vendedor,unidad_tr,unidad1,unidad2,cantidad1,cantidad2,";
            query += "listaprecio,metodolista,precio,";
            query += "porcedes,descuentos,porcerec,recargos,observacion,valido)";
            query += " values ";
            query += "(@id," + (i + 1).toString() + ",'" + carro[i].sucursal + "','" + carro[i].bodega + "','" + carro[i].codigo + "','" + carro[i].vendedor + "',";
            query += "1,'',''," + carro[i].cantidad.toString() + ", 0,'" + carro[i].listapre + "','" + carro[i].metodolista + "'," + carro[i].precio.toString() + ",";
            query += carro[i].descuentomax.toString() + "," + ((carro[i].precio - carro[i].preciomayor) * carro[i].cantidad).toString() + ",0,0,'', '' ) ; ";
            query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
            //
        }
        query += "update ktp_encabezado set monto=( select sum((d.cantidad1*d.precio)-d.descuentos) from ktp_detalle as d where d.id_preventa=ktp_encabezado.id_preventa ) ";
        query += " where id_preventa=@id ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        query += "exec ksp_grabaDocumento 'Pendiente', '" + tipodoc + "', @id, @nrodoc output ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        query += "commit transaction ;";
        query += "select @nrodoc as numero, @id as id ;";
        query += "TratarError: ";
        query += "if @@Error<>0 ";
        query += "    BEGIN ";
        query += "    ROLLBACK TRANSACTION ";
        query += "    END ;";
        //
        // console.log( query );
        //
        conex
            .then(function() {
                //
                var request = new sql.Request();
                // 
                request.query(query)
                    .then(function(rs) {
                        // console.log("documento (" + tipodoc + ") grabado ", rs.recordset);
                        res.json({ resultado: 'ok', numero: rs.recordset[0].numero });
                        correos.componeBody(sql, rs.recordset[0].id)
                            .then(data => {
                                data.recordset.forEach(element => {
                                    lineas += '<tr>';
                                    lineas += '<td align="center"><img src="https://img.zsmotor.cl/fotos/app/' + element.codigo.trim() + '-1.jpg" width="150px" height="150px"/></td>';
                                    lineas += '<td align="center">' + element.cantidad.toString() + '</td>';
                                    lineas += '<td align="center">' + element.codigo + '</td>';
                                    lineas += '<td align="center">' + element.descripcion + '</td>';
                                    lineas += '<td align="center">' + element.preciounit.toLocaleString() + '</td>';
                                    lineas += '<td align="center">' + element.descuentos.toString() + '</td>';
                                    lineas += '<td align="center">' + element.subtotal.toLocaleString() + '</td>';
                                    lineas += '</tr>';
                                });
                                htmlBody = correos.primeraParte(xObs) + lineas + correos.segundaParte();
                                mailList.push({ cc: x2, to: x1 });
                                correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
                            });
                    })
                    .catch(function(er) { res.send(er); });
            })
            .catch(function(er) {
                console.log(er);
                res.send('error en conexion POST ->' + er);
            });
        //
    });

app.post('/seteocliente',
    function(req, res) {
        res.json({ configp: configuracion });
    });

app.post('/cliproalma',
    function(req, res) {
        // la tabla a leer
        var xsp = req.body.sp || '';
        var xdatos = req.body.datos || {};
        var xusuario = req.body.user || [];
        var query = '';
        //
        //console.log(req.body);
        //
        if (xsp == 'ksp_buscarUserEmpresa') {
            //
            if (xdatos.rutempresa == undefined) { xdatos.rutempresa = ''; }
            if (xdatos.emailpersona == undefined) { xdatos.emailpersona = ''; }
            if (xdatos.clave == undefined) { xdatos.clave = ''; }
            if (xdatos.sistema == undefined) { xdatos.sistema = ''; }
            //
            query = "exec " + xsp + " '" + xdatos.rutempresa + "','" + xdatos.emailpersona + "','" + xdatos.clave + "','" + xdatos.sistema + "' ;";
            _Activity.registra(sql, xdatos.rutempresa, xsp, xdatos.rutpersona, xdatos.clave, xdatos.sistema);
            //
        } else if (xsp == 'ksp_buscarAlCliente') {
            //
            if (xdatos.codcliente == undefined) { xdatos.codcliente = ''; } else { xdatos.codcliente = xdatos.codcliente.trim(); }
            if (xdatos.suc_cliente == undefined) { xdatos.suc_cliente = ''; } else { xdatos.suc_cliente = xdatos.suc_cliente.trim(); }
            if (xdatos.usuario == undefined) { xdatos.usuario = ''; } else { xdatos.usuario = xdatos.usuario.trim(); }
            if (xdatos.sistema == undefined) { xdatos.sistema = ''; } else { xdatos.sistema = xdatos.sistema.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codcliente + "', '" + xdatos.suc_cliente + "' ;";
            _Activity.registra(sql, xdatos.usuario, xsp, xdatos.codcliente, xdatos.suc_cliente);
            //        
        } else if (xsp == 'ksp_ListasProducto') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.usuario == undefined) { xdatos.usuario = ''; } else { xdatos.usuario = xdatos.usuario.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.usuario + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xdatos.usuario, xsp, xdatos.codproducto, xdatos.usuario, xdatos.empresa);
            //    
        } else if (xsp == 'ksp_BodegaProducto') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.usuario == undefined) { xdatos.usuario = ''; } else { xdatos.usuario = xdatos.usuario.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            console.log('xdatos->', xdatos);

            if (xdatos.cualquierbodega == undefined) {
                xdatos.cualquierbodega = '0';
            } else if (xdatos.cualquierbodega === 1) {
                xdatos.cualquierbodega = '1';
            }
            //
            query = `exec ${xsp} '${xdatos.codproducto}','${xdatos.usuario}','${xdatos.empresa}', ${xdatos.cualquierbodega} ;`;
            console.log(query);
            _Activity.registra(sql, xdatos.usuario, xsp, xdatos.codproducto, xdatos.usuario, xdatos.empresa);
            //    
        } else if (xsp == 'ksp_buscarProductos_v7_zscli') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.descripcion == undefined) { xdatos.descripcion = ''; } else { xdatos.descripcion = xdatos.descripcion.trim(); }
            if (xdatos.soloconstock == undefined) { xdatos.soloconstock = ''; } else { xdatos.soloconstock = xdatos.soloconstock; }
            if (xdatos.ordenar == undefined) { xdatos.ordenar = ''; } else { xdatos.ordenar = xdatos.ordenar.trim(); }
            if (xdatos.familias == undefined) xdatos.familias = '';
            if (xdatos.soloverimport == undefined) xdatos.soloverimport = '0';
            //
            if (xdatos.listacliente != '' && xdatos.listacliente != xdatos.usuario.listamodalidad) { listap = xdatos.listacliente; } else { listap = xdatos.listamodalidad; }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.descripcion + "','" + xdatos.bodega + "'," + xdatos.offset + ",'" + listap + "'," + xdatos.soloconstock + ",'" + xdatos.ordenar + "','" + xdatos.familias + "'," + xdatos.soloverimport + ",'" + xdatos.empresa + "','" + xdatos.usuario + "' ;";
            _Activity.registra(sql, xdatos.codigo, xsp, xdatos.codproducto, xdatos.descripcion, xdatos.bodega);
            //        
        }

        conex
            .then(function() {
                //
                var request = new sql.Request();
                // 
                request.query(query)
                    .then(function(rs) { res.json(rs); })
                    .catch(function(er) { res.send(er); });
            })
            .catch(function(er) {
                console.log(er);
                res.send('error en conexion POST ->' + er);
            });
    });
app.post('/proalma',
    function(req, res) {
        // la tabla a leer
        var xsp = req.body.sp || '';
        var xdatos = req.body.datos || {};
        var xusuario = req.body.user || req.body.datos.usuario || [];
        var listap = '';
        var query = '';
        //
        var versionNueva = req.body.versionNueva || false;
        //

        console.log(req.body);

        if (xsp == 'ksp_buscarUsuario') {
            //
            if (xdatos.rutocorreo == undefined) { xdatos.rutocorreo = ''; } else { xdatos.rutocorreo = xdatos.rutocorreo.trim(); }
            if (xdatos.clave == undefined) { xdatos.clave = ''; } else { xdatos.clave = xdatos.clave.trim(); }
            if (xdatos.sistema == undefined) { xdatos.sistema = ''; } else { xdatos.sistema = xdatos.sistema.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.rutocorreo + "','" + xdatos.clave + "','01' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.rutocorreo, xdatos.clave, xdatos.sistema);
            //
        } else if (xsp == 'ksp_buscarDeNuevoVendedores') {
            //
            query = "exec " + xsp + " '" + xdatos.dato + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xdatos.codigousr, xsp, xdatos.dato, '');
            //
        } else if (xsp == 'ksp_buscarClientes') {
            //
            if (xdatos.codcliente == undefined) { xdatos.codcliente = ''; } else { xdatos.codcliente = xdatos.codcliente.trim(); }
            if (xdatos.razonsocial == undefined) { xdatos.razonsocial = ''; } else { xdatos.razonsocial = xdatos.razonsocial.trim(); }
            if (xdatos.inilista == undefined) { xdatos.inilista = ''; } else { xdatos.inilista = xdatos.inilista.trim(); }
            if (xdatos.finlista == undefined) { xdatos.finlista = ''; } else { xdatos.finlista = xdatos.finlista.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codcliente + "', '" + xdatos.razonsocial + "',  '" + xdatos.inilista + "',  '" + xdatos.finlista + "', 'b' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codcliente, xdatos.razonsocial);
            //
        } else if (xsp == 'ksp_buscarDeNuevoClientes') {
            if (xdatos.solouno == undefined) { xdatos.solouno = '0'; } else { xdatos.solouno = (xdatos.solouno === true) ? '1' : '0'; }
            //
            query = "exec " + xsp + " '" + xdatos.dato + "', '" + xdatos.codusr + "','" + xdatos.empresa + "'," + xdatos.solouno + " ;";
            _Activity.registra(sql, xdatos.codigousr, xsp, xdatos.dato, '');
            //
        } else if (xsp == 'ksp_buscarProductos_v7_web') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.descripcion == undefined) { xdatos.descripcion = ''; } else { xdatos.descripcion = xdatos.descripcion.trim(); }
            if (xdatos.soloconstock == undefined) { xdatos.soloconstock = ''; } else { xdatos.soloconstock = xdatos.soloconstock; }
            if (xdatos.ordenar == undefined) { xdatos.ordenar = ''; } else { xdatos.ordenar = xdatos.ordenar.trim(); }
            if (xdatos.familias == undefined) xdatos.familias = '';
            if (xdatos.marcas == undefined) xdatos.marcas = '';
            if (xdatos.soloverimport == undefined) xdatos.soloverimport = '0';
            if (xdatos.filasOffset == undefined) xdatos.filasOffset = 20;
            //
            if (xdatos.usuario.LISTACLIENTE != '' && xdatos.usuario.LISTACLIENTE != xdatos.usuario.LISTAMODALIDAD) { listap = xdatos.usuario.LISTACLIENTE; } else { listap = xdatos.usuario.LISTAMODALIDAD; }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.descripcion + "','" + xdatos.bodega + "'," + xdatos.offset + ",'" + listap + "'," + xdatos.soloconstock + ",'" + xdatos.ordenar + "','" + xdatos.familias + "','" + xdatos.marcas + "'," + xdatos.soloverimport + ",'" + xusuario.empresa + "','" + xusuario.codigo + "'," + xdatos.filasOffset.toString() + " ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codproducto, xdatos.descripcion, xdatos.bodega);
            //
        } else if (xsp == 'ksp_buscarProductos_v7') {
            //
            // console.log('body->',req.body);
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.descripcion == undefined) { xdatos.descripcion = ''; } else { xdatos.descripcion = xdatos.descripcion.trim(); }
            if (xdatos.soloconstock == undefined) { xdatos.soloconstock = ''; } else { xdatos.soloconstock = xdatos.soloconstock; }
            if (xdatos.ordenar == undefined) { xdatos.ordenar = ''; } else { xdatos.ordenar = xdatos.ordenar.trim(); }
            if (xdatos.familias == undefined) xdatos.familias = '';
            if (xdatos.soloverimport == undefined) xdatos.soloverimport = '0';
            //
            if (xdatos.usuario.LISTACLIENTE && xdatos.usuario.LISTACLIENTE !== xdatos.usuario.LISTAMODALIDAD) {
                listap = xdatos.usuario.LISTACLIENTE;
            } else {
                listap = xdatos.usuario.LISTAMODALIDAD;
            }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.descripcion + "','" + xdatos.bodega + "'," + xdatos.offset + ",'" + listap + "'," + xdatos.soloconstock + ",'" + xdatos.ordenar + "','" +
                xdatos.familias + "'," + xdatos.soloverimport + ",'" + xusuario.empresa + "','" + ((xusuario.codigo) ? xusuario.codigo : xusuario.usuario) + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codproducto, xdatos.descripcion, xdatos.bodega);
            //
        } else if (xsp == 'ksp_buscarProductos_v8') {
            //
            console.log(xdatos);
            xsp = 'ksp_buscarProductos_v7';
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.descripcion + "','" + xdatos.bodega + "'," + xdatos.offset + ",'" + xdatos.listaprecio + "'," +
                xdatos.soloconstock + ",'" + xdatos.ordenar + "','" +
                xdatos.familias + "'," + (xdatos.soloverimport ? xdatos.soloverimport : false) + ",'" + xdatos.empresa + "','" + xdatos.usuario + "' ;";
            _Activity.registra(sql, xdatos.KOFU, xsp, xdatos.codproducto, xdatos.descripcion, xdatos.bodega);
            //
        } else if (xsp == 'ksp_ListasProducto') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.usuario == undefined) { xdatos.usuario.KOFU = ''; } else { xdatos.usuario.KOFU = xdatos.usuario.KOFU.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.usuario.KOFU + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codproducto, xdatos.usuario.KOFU, xdatos.empresa);
            //
        } else if (xsp == 'ksp_BodegaProducto') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; }
            if (xdatos.usuario == undefined) { xdatos.usuario.KOFU = ''; }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; }
            if (xdatos.cualquierbodega == undefined) { xdatos.cualquierbodega = '0'; }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.usuario + "','" + xdatos.empresa + "' ," + xdatos.cualquierbodega + " ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codproducto, xdatos.usuario.KOFU, xdatos.empresa);
            //
        } else if (xsp == 'ksp_traeImpagos') {
            //
            if (xdatos.codigo == undefined) { xdatos.codigo = ''; } else { xdatos.codigo = xdatos.codigo.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codigo, xdatos.empresa);
            //
        } else if (xsp == 'ksp_traeInfoProductos') {
            //
            if (xdatos.codigo == undefined) { xdatos.codigo = ''; } else { xdatos.codigo = xdatos.codigo.trim(); }
            if (xdatos.cliente == undefined) { xdatos.cliente = ''; } else { xdatos.cliente = xdatos.cliente.trim(); }
            if (xdatos.sucursal == undefined) { xdatos.sucursal = ''; } else { xdatos.sucursal = xdatos.sucursal.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codigo + "','" + xdatos.cliente + "','" + xdatos.sucursal + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codigo, xdatos.cliente, xdatos.sucursal);
            //
        } else if (xsp == 'ksp_traeDocumento') {
            //
            query = "exec " + xsp + " " + xdatos.id.toString() + " ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.id.toString());
            //
        } else if (xsp == 'ksp_traeUltimosDocs') {
            //
            query = "exec " + xsp + " '" + xdatos.tipo + "','" + xdatos.cliente + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.tipo);
            //
        } else if (xsp == 'ksp_traeUltimosMovimientos') {
            //
            var cliente = xdatos.cliente || '';
            query = "exec " + xsp + " '" + xdatos.codigo + "','" + xdatos.empresa + "','" + xdatos.sistema + "','" + cliente + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa, xdatos.codigo, cliente);
            //        
        } else if (xsp == 'ksp_BodegaMias') {
            //
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            if (xusuario.codigo == undefined) { xusuario.codigo = ''; } else { xusuario.codigo = xusuario.codigo.trim(); }
            //
            query = "exec " + xsp + " '" + xusuario.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            // 
        } else if (xsp == 'ksp_ListasMias') {
            //
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            if (xusuario.codigo == undefined) { xusuario.codigo = ''; } else { xusuario.codigo = xusuario.codigo.trim(); }
            //
            query = "exec " + xsp + " '" + xusuario.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            //
        } else if (xsp == 'ksp_EnImportaciones') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            //
        } else if (xsp == 'ksp_EnPedido') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            //        
        } else if (xsp == 'ksp_BuscarNvv') {
            //
            if (xdatos.numero == undefined) { xdatos.numero = ''; } else { xdatos.numero = xdatos.numero.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = '01'; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.numero + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            //               
        }

        conex
            .then(function() {
                //
                console.log(query);
                var request = new sql.Request();
                // 
                request.query(query)
                    .then(function(rs) {
                        if (xsp == 'ksp_buscarProductos_v7_web') {
                            res.json(rs.recordset);
                        } else {
                            if (versionNueva) {
                                res.json(rs.recordset);
                            } else {
                                res.json(rs);
                            }
                        }
                    })
                    .catch(function(er) { res.send(er); });
            })
            .catch(function(er) {
                console.log(er);
                res.send('error en conexion POST ->' + er);
            });

    });

app.post('/comunaciudad',
    function(req, res) {
        //
        servicios.CiudadComuna(sql)
            .then(function(data) {
                //console.log("CiudadComuna ",data); 
                res.json({ resultado: "ok", datos: data });
            });
    });
// select * from MAEEN where KOEN = '*cliente-web*'
app.post('/ksp_crearClientes',
    function(req, res) {
        //
        console.log(req.body);
        servicios.creacliente(sql, req.body.datos)
            .then(function(data) {
                // console.log("/ksp_crearClientes ", data);
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_modifClientes',
    function(req, res) {
        //
        console.log(req.body);
        servicios.modifCliente(sql, req.body.datos)
            .then(function(data) {
                // console.log("/ksp_crearClientes ", data);
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_crearSucursal',
    function(req, res) {
        //
        console.log(req.body);
        servicios.crearSucursal(sql, req.body.datos)
            .then(function(data) {
                // console.log("/ksp_crearSucursal ", data);
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_enviarSugerencias',
    function(req, res) {
        //
        servicios.enviarsugerencia(sql, req.body.datos)
            .then(function(data) {
                console.log("/ksp_enviarSugerencias ", data);
                if (data[0].resultado === true) {
                    htmlBody = correos.sugerido(req.body.datos, req.body.user, data[0].id);
                    correos.enviarCorreo(res, nodemailer, [{ to: 'ziad@zsmotor.cl', cc: ['kfarinez@zsmotor.cl', 'Doly@zsmotor.cl'] }], htmlBody);
                    // correos.enviarCorreo(res, nodemailer, [{ to: 'jogv66@gmail.com' }], htmlBody);
                }
                res.json(data); /* data viene en formato correcto */
            });
    });
app.get('/aSSevfdivDiff6549_kksdterm-htcallkksdterm',
    function(req, res) {
        //
        console.log(req.query);
        servicios.informarSugerencia(sql, req.query)
            .then(function(data) {
                console.log(data);
                res.status(200)
                    .send('Gracias, la sugerencia se informará como recibida.'); /* data viene en formato correcto */
            });
    });
app.post('/ksp_enviarNotificaciones',
    function(req, res) {
        //
        servicios.enviarNotificacion(sql, req.body.datos)
            .then(function(data) {
                if (data[0].resultado === true) {
                    htmlBody = correos.notificacion(req.body.datos);
                    correos.enviarCorreo(res, nodemailer, [{ to: req.body.datos.email, cc: req.body.user.email }], htmlBody, 'Notificación de Stock');
                }
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_rescatarMisNotificaciones',
    function(req, res) {
        //
        servicios.rescatarNotificacion(sql, req.body)
            .then(function(data) {
                // }
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_rescatarMisSugerencias',
    function(req, res) {
        //
        servicios.rescatarSugerencias(sql, req.body)
            .then(function(data) {
                // }
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_crearMedidasNuevas',
    function(req, res) {
        //
        console.log(req.body);
        servicios.crearMedidasNuevas(sql, req.body)
            .then(function(data) {
                // }
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_avisoProximoServicio',
    function(req, res) {
        //
        servicios.avisoProximoServicio(sql, req.body.datos)
            .then(async(data) => {
                if (data[0].resultado === true) {
                    htmlBody = await correos.proximoservicio(req.body.datos);
                    correos.enviarCorreo(res, nodemailer, [{ to: req.body.datos.email, cc: req.body.user.email }], htmlBody, 'Aviso de Próximo Servicio');
                }
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_buscarSucursal',
    function(req, res) {
        //
        console.log(req.body);
        servicios.buscaSucursal(sql, req.body.datos)
            .then(function(data) {
                // console.log("/ksp_buscarSucursal ", data);
                res.json(data); /* data viene en formato correcto */
            });
    });
app.post('/ksp_traeFichaTecnica',
    function(req, res) {
        //
        console.log(req.body.datos);
        servicios.buscaFicha(sql, req.body.datos)
            .then(function(data) {
                // console.log("/ksp_traeFichaTecnica ", data);
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_cerrarNotificacion',
    function(req, res) {
        //
        servicios.cierraNotificacion(sql, req.body.datos)
            .then(async(data) => {
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_cerrarSugerencia',
    function(req, res) {
        //
        servicios.cierraSugerencia(sql, req.body.datos)
            .then(async(data) => {
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_traeMisDeberes',
    function(req, res) {
        //
        console.log(req.body);
        servicios.misDeberes(sql, req.body)
            .then(function(data) {
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_traeMisContribuciones',
    function(req, res) {
        //
        console.log(req.body);
        servicios.misContribuciones(sql, req.body)
            .then(function(data) {
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_misDeberesTop',
    function(req, res) {
        //
        console.log(req.body);
        servicios.misDeberesTop(sql, req.body)
            .then(function(data) {
                res.json(data); /* data viene en formato correcto */
            });
    });

app.post('/ksp_traeMisNotoSug',
    function(req, res) {
        //
        console.log(req.body);
        servicios.traeMisNotifoSugerencia(sql, req.body)
            .then(function(data) {
                res.json(data); /* data viene en formato correcto */
            });
    });

//---------------------------------- multer funcionó
const upload = multer({ dest: CARPETA_IMG });
app.post('/imgUp',
    upload.single('kfoto'),
    async(req, res, next) => {
        //
        try {
            //
            const newPath = req.file.destination + req.file.originalname;
            const oldPath = req.file.path;
            console.log(newPath);
            console.log(oldPath);

            try {
                // borrar antes de grabar
                if (fileExist.sync(newPath)) {
                    fs.unlinkSync(newPath);
                }
                //file removed
            } catch (err) {
                console.error(err);
            }
            fs.renameSync(oldPath, newPath);
            // 
            servicios.saveDefinitionIMG(sql, req.body.name, req.body.extension, req.body.usuario, req.body.idmaeedo)
                .then(() => {
                    return res.status(200).json({ resultado: 'ok', mensaje: 'Imagen se guardó' });
                })
                .catch(function(error) {
                    res.status(500).json({ resultado: 'error', datos: error });

                });
            //
        } catch (e) {
            next(e);
        }
    });
app.post('/dettachFile',
    async(req, res, next) => {
        //
        const newPath = '/opt/zsventas/server/public/attach/' + req.body.data.imgb64;
        console.log(req.body);
        console.log(newPath);
        console.log(fileExist.sync(newPath));
        //
        try {
            // borrar archivo y borrar de tabla
            if (fileExist.sync(newPath)) {
                fs.unlinkSync(newPath);
                servicios.deleteDefinitionIMG(sql, req.body.data.imgb64, req.body.data.idmaeedo)
                    .then(() => {
                        res.status(200).json({ resultado: 'ok', mensaje: 'Imagen se eliminó' });
                    })
                    .catch(function(error) {
                        res.status(500).json({ resultado: 'error', datos: error });
                    });
                //
            } else {
                res.status(400).json({ resultado: 'error', mensaje: 'Imagen no existe' });
            }
            //file removed
        } catch (err) {
            console.error(err);
        }
    });
app.post('/getimages',
    function(req, res) {
        //
        servicios.getImages(sql, req.body.datos)
            .then(function(data) {
                //
                if (data.resultado === 'ok') {
                    //
                    if (data.resultado === 'ok') {
                        res.json({ resultado: 'ok', datos: data.datos });
                    } else {
                        res.json({ resultado: 'error', datos: data.mensaje });
                    }
                }
            })
            .catch(function(err) {
                console.log("/getimages ", err);
                res.json({ resultado: 'error', datos: err });
            });
    });
//---------------------------------- multer funcionó

const contruyeHTML = async(encabezado, obs, adjuntos, xHTML) => {
    //
    // obtener el detalle del documento
    console.log('antes->', xHTML);
    //
    return new Promise(resolve => {
            // variables por empresa
            xHTML = xHTML.replace('###-codCliente-###', encabezado[0].ENDO);
            xHTML = xHTML.replace('###-rsocial-###', encabezado[0].NOKOEN);
            xHTML = xHTML.replace('###-nombreVend-###', encabezado[0].NOKOFU);
            xHTML = xHTML.replace('###-cCorreoVend-###', encabezado[0].EMAIL);
            xHTML = xHTML.replace('###-documento-###', encabezado[0].TIDO + '-' + encabezado[0].NUDO);
            xHTML = xHTML.replace('###-cFonoVend-###', encabezado[0].FOFU);
            xHTML = xHTML.replace('###-cObs-###', obs);
            // 
            console.log("largo: ", adjuntos.length)
            if (adjuntos.length > 0) {
                let det = '<table border="0">';
                adjuntos.forEach(elem => {
                    if (elem.pdf === true) {
                        det += `
                        <tr>
                            <td>
                            <a href="${ elem.imgb64 }" target="_blank">PDF Adjunto ${ elem.pdf_name } </a>
                            </td>
                        </tr>
                        `;
                    } else {
                        det += `
                        <tr>
                            <td>
                            <img src="${ elem.imgb64 }" alt="imagenes" />
                            </td>
                        </tr>
                        `;
                    }
                });
                det += `
                </table>
                <br>
                `;
                xHTML = xHTML.replace('###-adjuntos-###', det);
            } else {
                xHTML = xHTML.replace('###-adjuntos-###', '');
            }
            //
            const filenameHTM = `attach_${encabezado[0].TIDO}${encabezado[0].NUDO}.html`;
            const fullpathHTM = path.join(CARPETA_PDF, filenameHTM);
            //
            fs.writeFile(fullpathHTM, xHTML, { encoding: 'utf-8' }, errData => {
                if (!errData) {
                    if (fileExist.sync(fullpathHTM)) {
                        console.log('exito-> archivo no existe->', fullpathHTM);
                        // El archivo no se necesita para convertirlo a PDF, basta pasarle el contenido html
                        resolve(xHTML);
                    }
                } else {
                    console.log('error en 581->', errData);
                    // throw Error(errData);
                    resolve();
                }
            });
        },
        reject => {
            reject('Algo pasó....');
        }
    )
};

app.post('/soloEnviarAdjuntos',
    async(req, res) => {
        //
        const xTo = req.body.cTo;
        const xCc = req.body.cCc || '';
        const tipo = req.body.tipo;
        const numero = req.body.numero;
        const vendedor = req.body.vendedor;
        const obs = req.body.obs;
        const adjuntos = JSON.parse(req.body.adjuntos);
        //
        const mailList = [];
        //
        _Activity.registra(sql, vendedor, 'soloEnviarAdjuntos', xTo, xCc, '');
        //
        console.log('correo soloEnviarAdjuntos', xTo);
        console.log('correo soloEnviarAdjuntos', adjuntos);
        //
        mailList.push({ cc: xCc, to: xTo });
        //
        let htmlBody = await correos.adjuntos();
        const datos = await servicios.buscaDatos(sql, '01', tipo, numero);
        console.log(datos);
        htmlBody = await contruyeHTML(datos.datos, obs, adjuntos, htmlBody);
        //
        correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
        //
    });

// --------------------------------------------sport
app.post('/sport_usuarios', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
            select	u.*
                    ,cat.descripcion as categoria_nombre
                    ,pr1.NOKOPR as descrip1
                    ,pr2.NOKOPR as descrip2
                    ,pr3.NOKOPR as descrip3
            from [ktb_sport_users] as u with (nolock)
            left join [ktb_sport_categorias] as cat with (nolock) on cat.categoria=u.categoria
            left join MAEPR as pr1 with (nolock) on pr1.KOPR=u.codigo1
            left join MAEPR as pr2 with (nolock) on pr2.KOPR=u.codigo2
            left join MAEPR as pr3 with (nolock) on pr3.KOPR=u.codigo3
            where email = '${ req.body.email }' 
                and clave = '${ req.body.pssw }' ;
        `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_categorias', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
                select * 
                from [ktb_sport_categorias] with (nolock)
                order by categoria ;
            `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_producto', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
                select pr.NOKOPR as descripcion 
                from MAEPR as pr with (nolock)
                where pr.KOPR = '${ req.body.codigo }' ;
            `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_instalaciones', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
                select *
                from [ktb_sport_instalaciones] with (nolock)
                order by lugar ;
            `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_asistentes', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
                select *,cast('' as varchar(50)) as imagen
                from [ktb_sport_asistentes] with (nolock)
                order by nombre ;
            `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_fechas', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
                select *,cast('' as varchar(50)) as imagen
                from [ktb_sport_fechas] with (nolock)
                order by id ;
            `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_pilotos', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
            select	u.*
                    ,cat.descripcion as categoria_nombre
                    ,pr1.NOKOPR as descrip1
                    ,pr2.NOKOPR as descrip2
                    ,pr3.NOKOPR as descrip3
                    ,cast('' as varchar(50)) as imagen
            from [ktb_sport_users] as u with (nolock)
            left join [ktb_sport_categorias] as cat with (nolock) on cat.categoria=u.categoria
            left join MAEPR as pr1 with (nolock) on pr1.KOPR=u.codigo1
            left join MAEPR as pr2 with (nolock) on pr2.KOPR=u.codigo2
            left join MAEPR as pr3 with (nolock) on pr3.KOPR=u.codigo3
            where u.tipodeusuario = 'PILOTO' ;
        `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_emailasistente', (req, res) => {
    //        
    console.log(req.body);
    //
    var query = '';
    if (req.body.accion === 'select') {
        //
        query = `
            SELECT  com.email as comercial
                    ,tec.email as tecnico
            FROM ktb_sport_users as usr with (nolock)
            left join ktb_sport_asistentes as com with (nolock) on usr.asistentecomercial=com.id
            left join ktb_sport_asistentes as tec with (nolock) on usr.asistentetecnico=tec.id
            where usr.id = ${ req.body.id } ;
        `;
        //
    } else if (req.body.accion === 'insert') {
        query = `
                insert into [ktb_usuarios] (email,nombre,pssw) 
                values ('${ req.body.email }',
                        '${ req.body.nombre }',
                        '${ req.body.pssw }') ;
            `;
    } else if (req.body.accion === 'update') {
        query = `update [ktb_usuarios]
                        set email='${ req.body.email }',
                            nombre='${ req.body.nombre }',
                            pssw='${ req.body.pssw }'
                        where id = ${id} ;
            `;
    } else if (req.body.accion === 'update') {
        query = `
                delete [ktb_usuarios]
                where id = ${ req.body.id } ;
            `;
    } else {
        query = `
                select 'sin accion en usuarios' as error ;
            `;
    }
    //        
    console.log(query);
    //
    servicios.sport_(sql, query)
        .then(function(data) {
            res.json(data); /* data viene en formato correcto */
        });
});

app.post('/sport_enviarCorreo',
    async(req, res) => {
        //
        console.log('sport_enviarCorreo------------', req.body);
        _Activity.registra(sql, '', 'sport_enviarCorreo', req.body.toComercial, req.body.toTecnico, 'ziad@zsmotor.cl', 'jogv66@gmail.com');
        //
        // const filenameHTM = `solicitud_${ req.body.id }.html`;
        //
        const mailList = [{ cc: [req.body.toTecnico, 'ziad@zsmotor.cl', 'jogv66@gmail.com'], to: req.body.toComercial }];
        htmlBody = await contruyeHTMLRally(req.body);
        correos.enviarCorreo(res, nodemailer, mailList, htmlBody, 'ZS Motor Sport - Michelin - COPEC Rally-Mobil');
        //
    });

contruyeHTMLRally = async(data) => {
    //
    return new Promise(resolve => {
            //
            let xHTML = correos.solicitudRally();
            // console.log(xHTML);
            xHTML = xHTML.replace('###_codigo_###', data.codigo); // titulo
            xHTML = xHTML.replace('###_codigo_###', data.codigo); // detalle
            xHTML = xHTML.replace('###_descripcion_###', data.descripcion); // detalle
            xHTML = xHTML.replace('###_medida_###', data.medida); // detalle
            xHTML = xHTML.replace('###_nombre_###', data.nombre); // detalle
            xHTML = xHTML.replace('###_fono_###', data.fono); // detalle
            xHTML = xHTML.replace('###_mail_###', data.mail); // detalle
            xHTML = xHTML.replace('###_cantidad_###', data.cantidad); // detalle
            xHTML = xHTML.replace('###_lugar_###', data.lugar); // detalle
            xHTML = xHTML.replace('###_fecha_###', data.fecha); // detalle
            xHTML = xHTML.replace('###_obs_###', data.obs); // detalle
            // 
            console.log(xHTML);
            resolve(xHTML);
            // 
        },
        reject => {
            reject('Algo paso....');
        }
    );
    //
};