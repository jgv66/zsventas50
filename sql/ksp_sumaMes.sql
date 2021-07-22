
/*
--select getdate(), dateadd( dd, 30, getdate())
declare @xx datetime = getdate(), @yy datetime;
exec ksp_sumaMes @xx, 2, 30, @yy output 
print @yy;
  
select * from TABPP

*/
use LOSROBLES
go
IF OBJECT_ID('ksp_sumaMes', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_sumaMes;  
GO  
CREATE PROCEDURE ksp_sumaMes (
    @fecha		 datetime, 
	@n			 int = 0,
    @nDiasVenci  int = 0,
	@fechaultima datetime output ) With Encryption
as
begin
    SET NOCOUNT ON
	--
	declare @veces int = 1
	--
	if ( @n = 0 or @n = 1 ) begin
		set @fechaultima = @fecha;
	end 
	else begin
		while @veces <= @n begin
			set @fecha = DATEADD( dd, ( case when @nDiasVenci=0 then 30 else @nDiasVenci end), @fecha );
			set @veces += 1;
		end
		set @fechaultima = @fecha;
	end
	--
end
go
  