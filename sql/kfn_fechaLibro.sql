/*
IF OBJECT_ID('kfn_FechaLibro', 'P') IS NOT NULL  
    DROP FUNCTION kfn_FechaLibro;  
GO
*/  
CREATE FUNCTION [dbo].[kfn_FechaLibro] ( @libro as char(14), @fecha as datetime )
RETURNS datetime
WITH ENCRYPTION
AS
BEGIN 

	declare @horagrab	int		= 50000;
   	declare @anno		char(4) = substring( @libro, 1, 4 ),
			@mes		char(2) = substring( @libro, 5, 2 ),
			@dia		char(2) = right( '0' + ltrim(rtrim(cast( day(@fecha) as char(2) ) ) ), 2 ),
			@hora		char(2)	= right( '0' + ltrim(rtrim(cast( cast( @horagrab / 3600 as int ) as char(2) ) ) ), 2 ),
			@minuto		char(2),
			@segundo	char(2),
			@lafecha	varchar(23);
			
	set @minuto		= right( '0' + ltrim(rtrim(cast( cast( (@horagrab - ( cast(@hora as int) * 3600 ))/60 as int ) as char(2) ) ) ), 2 );
	set @segundo	= right( '0' + ltrim(rtrim(cast( @horagrab - cast(@hora as int)*3600 - cast(@minuto as int)*60 as char(2) )) ), 2 );
	-- set @lafecha	= @anno +'-'+ @mes +'-'+ @dia +'T'+ @hora +':'+ @minuto +':'+ @segundo +'.000';
	if ( cast( @dia as int ) > 28 ) begin 
		set @dia = '28';
	end
	set @lafecha = @anno +'-'+ @mes +'-'+ @dia +' 00:00:00.000';

	return cast( @lafecha as datetime );
	-- return @lafecha;

END;

