-- exec ksp_traeUltimosMovimientos  'NE20555160032','01','N','14726400';
IF OBJECT_ID('ksp_traeUltimosMovimientos', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_traeUltimosMovimientos;  
GO  
CREATE PROCEDURE ksp_traeUltimosMovimientos (
    @codigo	 char(13),
	@empresa char(2),
	@sistema char(1) = 'V',
	@cliente char(13) = '' ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON

	if ( @sistema='N' ) begin
		 select	top 30 
				ddo.IDMAEEDO as id
				,ddo.TIDO as td, ddo.NUDO as numero
				,ddo.KOFULIDO as vendedor, ddo.BOSULIDO AS bodega
				,(case when ddo.UDTRPR = 1 then ddo.CAPRCO1 else ddo.CAPRCO2 END ) as cantidad				
				,(case when ddo.UDTRPR = 1 then ddo.UD01PR else ddo.UD02PR END ) as unidad
				,(case when ddo.UDTRPR = 1 then ddo.PPPRNERE1 else ddo.PPPRNERE2 END ) as netolinea
				,en.NOKOEN as cliente
				,convert( nvarchar(10),ddo.FEEMLI,103) as fecha
				,rtrim(fu.NOKOFU) as nombre_v
		from MAEDDO		AS ddo with (nolock)
		left join MAEEN as en  with (nolock) on en.KOEN=ddo.ENDO and en.SUEN = ddo.SUENDO
		left join TABFU as fu  with (nolock) on fu.KOFU=ddo.KOFULIDO 
		where ddo.EMPRESA=@empresa
			and ddo.TIDO = 'NVV'
			and ddo.KOPRCT = @codigo
			and ddo.ESLIDO = ''
		order by ddo.FEEMLI desc
	end
	else begin
		if ( @sistema='V' ) begin 
			if ( @cliente = '' ) begin 
				select	top 15 
						ddo.IDMAEEDO as id
						,ddo.TIDO as td, ddo.NUDO as numero
						,ddo.KOFULIDO as vendedor, ddo.BOSULIDO AS bodega
						,(case when ddo.UDTRPR = 1 then ddo.CAPRCO1 else ddo.CAPRCO2 END ) as cantidad				
						,(case when ddo.UDTRPR = 1 then ddo.UD01PR else ddo.UD02PR END ) as unidad
						,(case when ddo.UDTRPR = 1 then ddo.PPPRNERE1 else ddo.PPPRNERE2 END ) as netolinea
						,en.NOKOEN as cliente
						,convert( nvarchar(10),ddo.FEEMLI,103) as fecha
				from MAEDDO AS ddo with (nolock)
				left join MAEEN as en  with (nolock) on en.KOEN=ddo.ENDO and en.SUEN = ddo.SUENDO
				where ddo.EMPRESA=@empresa
				  and ddo.TIDO in  ( 'FCV','BLV','NCV' )
				  and ddo.KOPRCT = @codigo
				order by ddo.FEEMLI desc
			end
			else begin
				select	top 15 
						ddo.IDMAEEDO as id
						,ddo.TIDO as td, ddo.NUDO as numero
						,ddo.KOFULIDO as vendedor, ddo.BOSULIDO AS bodega
						,(case when ddo.UDTRPR = 1 then ddo.CAPRCO1 else ddo.CAPRCO2 END ) as cantidad				
						,(case when ddo.UDTRPR = 1 then ddo.UD01PR else ddo.UD02PR END ) as unidad
						,(case when ddo.UDTRPR = 1 then ddo.PPPRNERE1 else ddo.PPPRNERE2 END ) as netolinea
						,en.NOKOEN as cliente
						,convert( nvarchar(10),ddo.FEEMLI,103) as fecha
				from MAEDDO AS ddo with (nolock)
				left join MAEEN as en  with (nolock) on en.KOEN=ddo.ENDO and en.SUEN = ddo.SUENDO
				where ddo.EMPRESA=@empresa
				  and ddo.TIDO in  ( 'FCV','BLV','NCV' )
				  and ddo.KOPRCT = @codigo
				  and ddo.ENDO = @cliente
				order by ddo.FEEMLI desc
			end
		end 
		else begin 
			select	top 15 
					ddo.IDMAEEDO as id
					,ddo.TIDO as td, ddo.NUDO as numero
					,ddo.KOFULIDO as vendedor
					,ddo.BOSULIDO AS bodega, (case when ddo.UDTRPR = 1 then ddo.CAPRCO1 else ddo.CAPRCO2 END ) as cantidad
					,(case when ddo.UDTRPR = 1 then ddo.PPPRNERE1 else ddo.PPPRNERE2 END ) as netolinea
					,en.NOKOEN as cliente
					,convert( nvarchar(10),ddo.FEEMLI,103) as fecha
			from MAEDDO AS ddo with (nolock)
			left join MAEEN as en  with (nolock) on en.KOEN=ddo.ENDO and en.SUEN = ddo.SUENDO
			where ddo.EMPRESA=@empresa
			  and ddo.TIDO in  ( 'FCC','BLC','NCC','DIN','GRC' )
			  and ddo.KOPRCT = @codigo
			order by ddo.FEEMLI desc;
		end;
	end;

END

-- AICUBVOL00191