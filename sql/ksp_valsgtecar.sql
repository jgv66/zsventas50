
/*
  
declare @car char(10) = 'CX10003154';
exec ksp_valsgtecar @car, @car output ;
print @car

*/
IF OBJECT_ID('ksp_valsgtecar', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_valsgtecar;  
GO  
CREATE PROCEDURE ksp_valsgtecar ( 
       @expresion	 char(10),  
	   @numerosalida char(10) output ) With Encryption
as
begin
    SET NOCOUNT ON
	--
	declare @x		int = 0,
			@j		int = len(@expresion),
			@i		int = 1,
			@nlargo	int = len(@expresion),
			@parten	varchar(10),
			@partec varchar(10)

	while ( @i <= @nlargo )
	begin
		if ( CHARINDEX( substring( @expresion, @j, 1 ),'0123456789') <> 0 ) 
		begin
			set @x = @j;
		end
		set @i += 1;
		set @j -= 1;
	end
	
	if ( @x > 0 )
		begin
		   set @parten = substring( @expresion, @x, 10-@x+1 );
		   set @parten = right( '0000000000' + cast((cast( @parten as int )+1) as varchar(10)), @nlargo-@x+1 ) ;
		   set @partec = left(@expresion,@x-1);
		   set @numerosalida = @partec + @parten ;
		end
	else
		begin 
		   set @numerosalida = 'ERROR-0001' ;
		end
END
go  




