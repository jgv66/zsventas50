
module.exports = {
  // cada funncion se separa por comas  
  registra: function( sql, usr, actividad, info1, info2, info3 ) { 
    //  
    if ( info1 == '' || info1 == undefined ) { info1 = '' };
    if ( info2 == '' || info2 == undefined ) { info2 = '' };
    if ( info3 == '' || info3 == undefined ) { info3 = '' };
    //
    query = "";
    query +="insert into ktp_actividad (fecha,usuario,actividad,geolat,geolon,info1,info2,info3) ";
    query +=" values (getdate(),'"+usr+"','"+actividad.trim()+"','','','"+info1.trim()+"','"+info2.trim()+"','"+info3.trim()+"' ) ;"
    //
    //console.log( query );
    //
    var request = new sql.Request();
    request.query( query )
      .then(  function(rs) { console.log("actvidad ",usr); })
      .catch( function(er) { console.log('error al registrar actividad '+usr+' -> '+er); });
    //
  },

  // llamada proc para insertar en wms: WAYUP  
  inserta_wms: function( sql, numero, bodega ) { 
      //
      query = "exec ktp_nvv_hacia_wms '"+numero.trim()+"','"+bodega.trim()+"' ; ";
      //
      console.log( query );
      //
      var request = new sql.Request();
      request.query( query )
        .then(  function() { console.log( "insertado en wms : "+numero.trim() ); })
        .catch( function(er) { console.log('error al insertar en wms -> '+er); });
      //
    },
  
}
