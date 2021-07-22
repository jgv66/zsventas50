
-- exec ksp_misDeberes 'ZSS','01','Mes pasado' ;
IF OBJECT_ID('ksp_misDeberes', 'P') IS NOT NULL    
    DROP PROCEDURE ksp_misDeberes;  
GO
-- 
CREATE PROCEDURE ksp_misDeberes (
    @vendedor varchar(3), 
    @empresa  char(2), 
    @periodo  varchar(20) ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
	--
	declare @Error		nvarchar(250),
			@ErrMsg		nvarchar(2048),
			@fechaDesde date,
			@fechaHasta date,
			@mes		int,
			@anio		int,
			@quedia		int;
	--
	if ( @periodo = 'Hoy' ) begin
		set @fechaDesde = cast(getdate() as date);
		set @fechaHasta = @fechaDesde;
	end;
	if ( @periodo = 'Ayer' ) begin
		set @fechaDesde = cast( dateadd( dd, -1, getdate()) as date);
		set @fechaHasta = @fechaDesde;
	end;
	if ( @periodo = 'Esta semana' ) begin
		set @quedia		= DATEPART(dw,GETDATE()); -- lun=1, mar=2....
		set @fechaDesde = cast( dateadd( dd, (@quedia-1)*(-1), getdate()) as date);
		set @fechaHasta = cast( dateadd( dd, 6, @fechaDesde) as date );
	end;
	if ( @periodo = 'Semana pasada' ) begin
		set @quedia		= DATEPART(dw,GETDATE()); -- lun=1, mar=2....
		set @fechaDesde = cast( dateadd( dd, (@quedia-8), getdate()) as date);
		set @fechaHasta = cast( dateadd( dd, 6, @fechaDesde) as date );
	end;
	if ( @periodo = 'Este mes' ) begin
		set @fechaDesde = cast( cast( year(getdate()) as char(4) )+right( '0'+cast( month(getdate()) as varchar(2) ),2)+'01' as date);
		set @fechaHasta = cast( getdate() as date );
	end;
	if ( @periodo = 'Mes pasado' ) begin
		set @mes		= case when month(getdate())=1 then 12 else month(getdate())-1 end;
		set @anio		= case when month(getdate())=1 then year(getdate())-1 else year(getdate()) end;
		set @fechaDesde = cast( cast( @anio as char(4) )+right( '0'+cast( @mes as varchar(2) ),2)+'01' as date);
		set @fechaHasta = dateadd(dd,-1,cast( cast( year(getdate()) as char(4) )+right( '0'+cast( month(getdate()) as varchar(2) ),2)+'01' as date) ); 
	end;
	if ( @periodo = 'Este año' ) begin
		set @fechaDesde = cast( cast( year(getdate()) as char(4) )+'0101' as date);
		set @fechaHasta = cast(getdate() as date);
	end;
	-- print @fechaDesde;
	-- print @fechaHasta;
	--
	with documentos 
	as (select distinct edo.IDMAEEDO as id,sum(ddo.VANELI) as neto
		from MAEEDO as edo with (nolock)
		inner join MAEDDO as ddo with (nolock) on edo.IDMAEEDO=ddo.IDMAEEDO
		where edo.EMPRESA= '01'
		  and edo.TIDO in ('COV','NVV','FCV','BLV','NCV')
		  and cast(edo.FEEMDO as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date)
		  and ddo.KOFULIDO = @vendedor
		group by edo.IDMAEEDO )
	select	edo.TIDO
			,sum(doc.neto) as cuanto
			,count(*) as cuantos
			,'Cotizaciones' as tipo
			, 1 as orden
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on id=edo.IDMAEEDO
	where edo.TIDO='COV'
	group by edo.TIDO
	union
	select	edo.TIDO
			,sum(doc.neto) as cuanto
			,count(*) as cuantos
			,'Notas de Venta Pend.' as tipo
			,2 as orden
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on id=edo.IDMAEEDO
	where edo.TIDO='NVV'
	  and edo.ESDO = ''
	group by edo.TIDO
	union
	select	edo.TIDO
			,sum(doc.neto) as cuanto
			,count(*) as cuantos
			,'Notas de Venta Cerr.' as tipo
			,3 as orden
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on id=edo.IDMAEEDO
	where edo.TIDO='NVV'
	  and edo.ESDO = 'C'
	group by edo.TIDO
	union
	select	edo.TIDO
			,sum(doc.neto) as cuanto
			,count(*) as cuantos
			,'Facturas' as tipo
			,4 as orden
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on id=edo.IDMAEEDO
	where edo.TIDO='FCV'
	group by edo.TIDO
	union
	select	edo.TIDO
			,sum(doc.neto) as cuanto
			,count(*) as cuantos
			,'Boletas' as tipo
			,5 as orden
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on id=edo.IDMAEEDO
	where edo.TIDO='BLV'
	group by edo.TIDO
	union
	select	edo.TIDO
			,sum(doc.neto*-1) as cuanto
			,count(*) as cuantos
			,'Notas de Cred.' as tipo
			,6 as orden
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on id=edo.IDMAEEDO
	where edo.TIDO='NCV'
	group by edo.TIDO
	order by orden
	--
END;
go
