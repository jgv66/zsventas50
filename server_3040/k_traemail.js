// debo cambiarlo por ksp_

module.exports = {

    // cada funncion se separa por comas  
    delVendedor: function(sql, cVendedor) {
        //  
        var request = new sql.Request();
        //
        return request.query("select TOP 1 EMAIL as correo, EMAILSUP as copiasadic, FOFU as fono, NOKOFU as nombre from TABFU where KOFU='" + cVendedor.trim() + "' ;")
            .then(function(results) {
                return results.recordset;
            })
    },
    //
    delCliente: function(sql, cCodigo, cSucursal) {
        //  
        var request = new sql.Request();
        //
        return request.query("select TOP 1 EMAILCOMER as correo, NOKOEN as rs, KOEN as rut from MAEEN where KOEN='" + cCodigo.trim() + "' AND SUEN='" + cSucursal.trim() + "' ;")
            .then(function(results) {
                return results.recordset;
            })
    }
}