/*  DROP FUNCTION kfn_cambiaPuntuacion11;  
print LOSROBLES.dbo.kfn_cambiaPuntuacion11( '  0.00', 0 )
*/  
CREATE FUNCTION kfn_cambiaPuntuacion11( @dato as char(11), @decimales as int )
RETURNS char(11)
WITH ENCRYPTION
AS
BEGIN 

	set @dato	= replace( @dato, ',', '#' );
	set @dato	= replace( @dato, '.', ',' );
	set @dato	= replace( @dato, '#', '.' );
	set @dato	= right( '          '+ @dato, 11 );
	return @dato;

END;
