// k_serviciosweb.js

module.exports = {
    //
    Bodegas: function(sql) {
        //  
        var request = new sql.Request();
        return request.query("select KOCARAC as bodega, NOKOCARAC as descripcion from TABCARAC where KOTABLA='BODEGAS' ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    Sucursales: function(sql) {
        //  
        var request = new sql.Request();
        return request.query("select EMPRESA as empresa, KOSU as sucursal, NOKOSU as nombre from TABSU order by KOSU ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //    
    buscaSucursal: function(sql, body) {
        //  
        var request = new sql.Request();
        return request.query("select top 1 KOSU as sucursal from TABBO where KOBO='" + body.bodega + "' and EMPRESA='" + body.empresa + "' ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    ListasDePrecio: function(sql) {
        //  
        var request = new sql.Request();
        return request.query("select KOLT as listaprecio, NOKOLT as descripcion, MELT as metodolista, MOLT as monedalista from TABPP order by KOLT ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    Marcas: function(sql) {
        //  
        var request = new sql.Request();
        return request.query("select KOMR as marca, NOKOMR as descripcion from TABMR order by KOMR ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    marca_autos: function(sql) {
        //  
        var request = new sql.Request();
        return request.query("select distinct marca from jf_marca_autos order by marca ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    modelo_autos: function(sql, body) {
        //  
        var request = new sql.Request();
        return request.query("select * from jf_marca_autos where marca='" + body.marca + "' order by modelo ;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //    
    datosconc: function(sql, body) {
        //  
        var request = new sql.Request();
        return request.query("select * FROM jf_data_concesionarios order by id desc;")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    CiudadComuna: function(sql, body) {
        //
        var request = new sql.Request();
        return request.query("select rtrim(co.NOKOCM) as comuna, rtrim(ci.NOKOCI) as ciudad, co.KOCM as codcm, ci.KOCI as codci " +
                " from TABCM as co with (nolock) " +
                " inner join TABCI as ci with (nolock) on co.KOCI = ci.KOCI " +
                " where co.KOPA='CHI' ; ")
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    creacliente: function(sql, body) {
        //
        var query = "exec ksp_crearClientes '" + body.rut + "','" + body.nombre + "','" + body.direccion + "','" + body.comuna + "','" + body.ciudad + "','" + body.email + "','" + body.nrocelu + "','" + body.giro + "' ; ";
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    modifCliente: function(sql, body) {
        //
        var query = `exec ksp_modifClientes '${body.codigo}','${body.sucursal}','${body.email}','${body.nrocelu}','${body.nombre}','${body.direccion}','${body.comuna}','${body.ciudad}' ;`;
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    crearSucursal: function(sql, body) {
        //
        var query = "exec ksp_CrearSucursal '" + body.codigo + "','" + body.sucursal + "','" + body.marca + "','" + body.modelo + "','" + body.color + "','" + body.anno + "' ; ";
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    buscaFicha: function(sql, body) {
        //
        var query = "exec ksp_buscarFicha '" + body.codigo + "' ; ";
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    enviarsugerencia: function(sql, body) {
        //
        var query = "exec ksp_crearSugerencia '" +
            body.sucursal + "','" +
            body.usuario + "','" +
            body.observac + "','" +
            body.codprod + "'," +
            body.prodbueno + "," +
            body.preciomuybarato + "," +
            body.prodconstock + "," +
            body.cantidad.toString() + "," +
            body.prodconquiebre + " ;";
        //
        console.log(query);
        //
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    // 
    enviarNotificacion: function(sql, body) {
        //
        var query = "exec ksp_crearNotificacion '" +
            body.tipo + "','" +
            body.sucursal + "','" +
            body.usuario + "','" +
            body.codprod + "','" +
            body.nombre + "','" +
            body.email + "','" +
            body.fono + "','" +
            body.observaciones + "'," +
            body.cantidad.toString() + " ;";
        //
        console.log(query);
        //
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    rescatarNotificacion: function(sql, body) {
        //
        // console.log(body);
        var query = "exec ksp_rescatarNotificacion '" + body.user.codigo + "','" + body.datos.bodega + "', '" + body.datos.tipo + "' ;";
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    rescatarSugerencias: function(sql, body) {
        //
        // console.log(body);
        var query = "exec ksp_rescatarSugerencias '" + body.user.codigo + "' ;";
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    informarSugerencia: (sql, body) => {
        //
        console.log('informarSugerencia->', body);
        const query = `exec ksp_darPorRecibidaSugerencia ${body.value} ; `;
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    crearMedidasNuevas: (sql, body) => {
        //
        // console.log(body);
        const query = `
                exec ksp_crearMedidasNuevas '${body.datos.marca          }',
                                            '${body.datos.modelo         }',
                                            '${body.datos.periodo        }',
                                            '${body.datos.version        }',
                                            '${body.datos.marcaneu       }',
                                            '${body.datos.modeloneu      }',
                                            '${body.datos.medidadelantera}',
                                            '${body.datos.ivdelantera    }',
                                            '${body.datos.icdelantera    }',
                                            '${body.datos.medidatrasera  }',
                                            '${body.datos.ivtrasera      }',
                                            '${body.datos.ictrasera      }',
                                            '${body.datos.runflat        }',
                                            '${body.datos.comentarios    }',
                                            '${body.user.codigo          }';
            `;
        console.log(query);
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    ins_dataconce: function(sql, body) {
        var request = new sql.Request();
        return request.query(`
            insert into jf_data_concesionarios (
                marca,modelo,anno,hp,
                d_marca,d_modelo,
                d_ancho,d_alto,d_aro,
                d_peso,d_velocidad,
                d_runflat,d_homologado,d_tipohomologado,
                t_marca,t_modelo,
                t_ancho,t_alto,t_aro,
                t_peso,t_velocidad,
                t_runflat,t_homologado,t_tipohomologado) 
            values ( 
                '${body.marca}','${body.modelo}','${body.anno}','${body.hp}',
                '${body.d_marca}','${body.d_modelo}',
                '${body.d_ancho}','${body.d_alto}','${body.d_aro}',
                '${body.d_peso}','${body.d_velocidad}',
                '${body.d_runflat}','${body.d_homologado}','${body.d_tipohomologado}',
                '${body.t_marca}','${body.t_modelo}',
                '${body.t_ancho}','${body.t_alto}','${body.t_aro}',
                '${body.t_peso}','${body.t_velocidad}',
                '${body.t_runflat}','${body.t_homologado}','${body.t_tipohomologado}') ;`)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    avisoProximoServicio: function(sql, body) {
        //
        var query = "exec ksp_avisoProximoServicio '" +
            body.tipo + "','" +
            body.sucursal + "','" +
            body.usuario + "','" +
            body.codprod + "','" +
            body.nombre + "','" +
            body.email + "','" +
            body.fono + "'," +
            body.km.toString() + ",'" +
            body.observaciones + "'," +
            body.dias.toString() + " ;";
        //
        console.log(query);
        //
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    cierraNotificacion: function(sql, body) {
        //
        var query = "exec ksp_cierraNotificacion " + body.id + " ;";
        //
        console.log(query);
        //
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    cierraSugerencia: function(sql, body) {
        //
        var query = "exec ksp_cierraSugerencia " + body.id + " ;";
        //
        console.log(query);
        //
        var request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    saveDefinitionIMG: function(sql, ib64, extension, usuario, idmaeedo) {
        // 
        const query = `
                    insert into ktb_documentos_attach (idmaeedo, usuario, fechains, img_exten, img_name, estado )
                      values( ${ idmaeedo }, '${ usuario }', getdate(), '${ extension }', '${ ib64 }', 0);
                    `;
        console.log('saveIMG', query);
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                return { resultado: 'ok', datos: resultado };
            })
            .catch(err => {
                console.log('saveIMG error ', err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    deleteDefinitionIMG: (sql, name, id) => {
        // --------------------------------------------------------------------------------------------------
        const query = `
            if exists ( select * from ktb_documentos_attach with (nolock) where idmaeedo = ${ id } and img_name = '${ name }') begin
                update ktb_documentos_attach set estado = 1
                where idmaeedo = ${ id }
                  and img_name = '${ name }'
            end
            else begin
                select 'nodata' as resultado; 
            end;
        `;
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .catch(err => {
                // console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    // 
    getImages: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
            if exists ( select * from ktb_documentos_attach with (nolock) where idmaeedo = ${ body.idmaeedo } ) begin
                select  'ok' as resultado
                        ,img_name as imgb64
                        ,'' as pdf_name 
                        ,cast((case when upper(img_exten)='PDF' then 1 else 0 end) as bit) as pdf
                        ,idmaeedo
                        ,convert(nvarchar(10), fechains, 103) as fecha
                        ,convert(nvarchar(5), fechains, 108) as hora
                from ktb_documentos_attach with (nolock)
                where idmaeedo = ${ body.idmaeedo };
            end
            else begin
                select 'nodata' as resultado; 
            end;
        `;
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    misDeberes: (sql, body) => {
        // 
        const query = `exec ksp_misDeberes '${ body.datos.usuario }','${ body.datos.empresa }','${ body.datos.periodo }' ;`;
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //        
    misContribuciones: (sql, body) => {
        // 
        const query = `exec ksp_misContribuciones '${ body.datos.usuario }','${ body.datos.periodo }' ;`;
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //        
    misDeberesTop: (sql, body) => {
        // 
        const query = `exec ksp_traeLosDocDelVendedor '${ body.datos.usuario }','${ body.datos.empresa }','${ body.datos.desde }','${ body.datos.hasta }','${ body.datos.tipodoc }' ;`;
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //   
    traeMisNotifoSugerencia: (sql, body) => {
        // 
        const query = `exec ksp_traeMisNotoSug '${ body.datos.usuario }','${ body.datos.desde }','${ body.datos.hasta }','${ body.datos.tipo }','${ body.datos.estado }' ;`;
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    buscaDatos: function(sql, empresa, tipo, numero) {
        // 
        const query = `
            select  edo.TIDO,edo.NUDO,edo.ENDO
                    ,en.NOKOEN
                    ,fu.NOKOFU,fu.EMAIL,fu.FOFU
            from MAEEDO as edo with (nolock)
            left join MAEEN as en with (nolock) on en.KOEN = edo.ENDO and en.SUEN = edo.SUENDO
            left join TABFU as fu with (nolock) on fu.KOFU = edo.KOFUDO
            where edo.EMPRESA = '${ empresa }'
                and edo.TIDO = '${ tipo }' 
                and edo.NUDO = '${ numero }';
            `;
        console.log('buscaDatos', query);
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                return { resultado: 'ok', datos: resultado };
            })
            .catch(err => {
                console.log('buscaDatos error ', err);
                return { resultado: 'error', datos: err };
            });
    },
    //    
    sport_: (sql, query) => {
        // 
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                return { resultado: 'ok', datos: resultado };
            })
            .catch(err => {
                console.log('sport_ error ', err);
                return { resultado: 'error', datos: err };
            });
    },
    //      

};