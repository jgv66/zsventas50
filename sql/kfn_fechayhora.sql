/*
IF OBJECT_ID('kfn_FechayHora', 'P') IS NOT NULL  
    DROP FUNCTION kfn_FechayHora;  
GO
*/  
CREATE FUNCTION [dbo].[kfn_FechayHora] ( @fecha as datetime, @horagrab as int )
RETURNS datetime
WITH ENCRYPTION
AS
BEGIN 

	if ( coalesce(@horagrab,0) = 0 ) begin 
		set @horagrab = 50000;
	end;

   	declare @anno		char(4) = cast( year(@fecha) as char(4)),
			@mes		char(2) = right( '0' + ltrim(rtrim(cast( month(@fecha) as char(2) ) ) ), 2 ),
			@dia		char(2) = right( '0' + ltrim(rtrim(cast( day(@fecha) as char(2) ) ) ), 2 ),
			@hora		char(2)	= right( '0' + ltrim(rtrim(cast( cast( @horagrab / 3600 as int ) as char(2) ) ) ), 2 ),
			@minuto		char(2),
			@segundo	char(2),
			@lafecha	varchar(23);
			
	set @minuto		= right( '0' + ltrim(rtrim(cast( cast( (@horagrab - ( cast(@hora as int) * 3600 ))/60 as int ) as char(2) ) ) ), 2 );
	set @segundo	= right( '0' + ltrim(rtrim(cast( @horagrab - cast(@hora as int)*3600 - cast(@minuto as int)*60 as char(2) )) ), 2 );
	set @lafecha	= @anno +'-'+ @mes +'-'+ @dia +'T'+ @hora +':'+ @minuto +':'+ @segundo +'.000';

	return cast( @lafecha as datetime );
	--return @lafecha;

END;
