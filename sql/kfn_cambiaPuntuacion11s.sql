/*  DROP FUNCTION kfn_cambiaPuntuacion11s;  
print LOSROBLES.dbo.kfn_cambiaPuntuacion11s( 16548784.00 )
*/  
CREATE FUNCTION kfn_cambiaPuntuacion11s( @valor as decimal(18,3) )
RETURNS char(11)
WITH ENCRYPTION
AS
BEGIN 
	--
	declare @dato13 as char(13) = CONVERT(CHAR(13),CAST(@valor AS MONEY),1),
			@dato11	as char(11) = '';
	--
	set @dato13	= replace( @dato13, ',', '#' );
	set @dato13	= replace( @dato13, '.', ',' );
	set @dato13	= replace( @dato13, '#', '.' );
	set @dato13	= replace( @dato13, ',00', '' );
	set @dato11	= right( '          '+ rtrim(ltrim(@dato13)), 11 );
	return @dato11;

END;

