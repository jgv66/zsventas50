/*
IF OBJECT_ID('kfn_cambiaPuntuacion', 'P') IS NOT NULL  
    DROP FUNCTION kfn_cambiaPuntuacion;  
GO

print [dbo].kfn_cambiaPuntuacion( ' 111,360.00', 0 )

*/  
CREATE FUNCTION kfn_cambiaPuntuacion ( @dato as char(11), @decimales as int )
RETURNS char(11)
WITH ENCRYPTION
AS
BEGIN 

	set @dato	= replace( @dato, ',', '#' );
	set @dato	= replace( @dato, '.', ',' );
	set @dato	= replace( @dato, '#', '.' );
	set @dato	= '  '+replace( @dato, ',00', '' );

	return @dato;

END;