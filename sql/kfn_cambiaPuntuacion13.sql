/* DROP FUNCTION kfn_cambiaPuntuacion13;  
print kfn_cambiaPuntuacion13( ' 111,360.00', 0 )
*/  
CREATE FUNCTION kfn_cambiaPuntuacion13 ( @dato as char(13), @decimales as int )
RETURNS char(13)
WITH ENCRYPTION
AS
BEGIN 

	set @dato	= replace( @dato, ',', '#' );
	set @dato	= replace( @dato, '.', ',' );
	set @dato	= replace( @dato, '#', '.' );
	set @dato	= replace( @dato, ',00', ',00' );

	return @dato;

END;
