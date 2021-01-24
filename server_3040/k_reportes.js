
module.exports = {
    
    ventas: function( sql, empresa, caso, sucursal, vendedor, periodo ) {   // ventas sucursal, mes actual
        //  
        let query   = '';
        var xhoy    = new Date();
        var anno    = xhoy.getFullYear();    
        var mes     = xhoy.getMonth()+1;    
        var request = new sql.Request();
        //            
        if ( periodo != '' ) {
            anno = periodo.slice(0,4);    
            mes  = periodo.slice(4);    
        }
        //
        console.log( anno, mes, caso, sucursal, vendedor, periodo );
        //
        if ( caso == 1 ) {
            query +="exec ksp_rpt_vtas '"+empresa+"',"+anno+","+mes+" ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 20 ) {
            query +="exec ksp_rpt_vtas_suc_hist ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 2 ) {
            query +="exec ksp_rpt_vtas_suc_ven '"+empresa+"',"+anno+","+mes+",'"+sucursal+"' ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 30 ) {
            query +="exec ksp_rpt_vtas_ven '"+empresa+"',"+anno+","+mes+" ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 3 ) {
            query +="exec ksp_rpt_vtas_ven_suc '"+empresa+"',"+anno+","+mes+",'"+vendedor+"' ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 4 ) {
            query +="exec ksp_rpt_vtas_ven_tot '"+empresa+"',"+anno+","+mes+" ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 11 ) {
            query +="exec ksp_rpt_vtas_hist ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 210 ) {
            query +="exec ksp_rpt_vtas_suc_anno_dato ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 21 ) {
            query +="exec ksp_rpt_vtas_suc_anno '"+empresa+"',"+anno+",'"+sucursal+"' ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 50 ) {
            query +="exec ksp_rpt_vtas_suc_anno_tot_dato ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        } else if ( caso == 5 ) {
            query +="exec ksp_rpt_vtas_suc_anno_tot "+anno+" ; ";
            return request.query( query ).then( function(results) { return results.recordset; } )
        }
    },
}
  