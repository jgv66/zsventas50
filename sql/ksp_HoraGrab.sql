/*
declare @segundos int = 0;
exec ksp_HoraGrab @segundos output ;
print @segundos  
*/
use B2BRANDOM
IF OBJECT_ID('ksp_HoraGrab', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_HoraGrab;  
GO  
CREATE PROCEDURE ksp_HoraGrab (	@segundos int output ) With Encryption
as
begin
    SET NOCOUNT ON
	--
	declare @hora	varchar(50),
			@x		varchar(50),
			@l		int = 0,
			@y		varchar(50),
			@m		int = 0,
			@h		int = 0,
			@s		int = 0
	--
	SELECT @hora = CONVERT( VARCHAR(45), CURRENT_TIMESTAMP, 9 ) ;
	--
	set @x = rtrim( @hora );
	set @l = len( @x );
	set @y = substring( @x, @l-1,2); -- PM,AM
	set @m = cast( substring( @x, @l-10,2) as int ); -- minutos
	set @h = cast( substring( @x, @l-13,2) as int ); -- horas
	set @s = cast( substring( @x, @l-7,2)  as int);  -- segundos
	--			
	if UPPER(@y) = 'PM' and @h<>12
	begin
		set @segundos = ((@h + 12) * 3600) + ( @m * 60 ) + @s;
	end
	else
	begin
		set @segundos = (@h * 3600) + ( @m * 60 ) + @s;
	end
end
go 
