/*  DROP FUNCTION kfn_cambiaPuntuacion6;  
print LOSROBLES.dbo.kfn_cambiaPuntuacion6( '  0.00', 0 )
*/  
CREATE FUNCTION kfn_cambiaPuntuacion6( @dato as char(6), @decimales as int )
RETURNS char(6)
WITH ENCRYPTION
AS
BEGIN 

	set @dato	= replace( @dato, ',', '#' );
	set @dato	= replace( @dato, '.', ',' );
	set @dato	= replace( @dato, '#', '.' );
	set @dato	= right( '  '+replace( @dato, ',00', ',000' ),6);

	return @dato;

END;
