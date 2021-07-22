
-- exec ksp_misContribuciones 'ZSS','Mes pasado';
IF OBJECT_ID('ksp_misContribuciones', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_misContribuciones;  
GO
-- 
CREATE PROCEDURE ksp_misContribuciones (
    @vendedor varchar(3), 
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
	--
	-- print @fechaDesde;
	-- print @fechaHasta;
	--
	select	count(*) as cuantas
			,'Sugerencias' as tipo
			,1 as orden
			,'S' as tipomov
			,'' as estado
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from ktp_sugerencias as sug with (nolock)
	where cast(sug.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
	  and sug.usuario = @vendedor
	union  
	select	count(*) as cuantas
			,'Total Notificaciones' as tipo
			,2 as orden
			,'N' as tipomov
			,'T' as estado
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from ktp_notificaciones as noti with (nolock)
	where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
	  and noti.usuario = @vendedor
	union  
	select	count(*) as cuantas
			,'Notificaciones Cerradas' as tipo
			,3 as orden
			,'N' as tipomov
			,'C' as estado
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from ktp_notificaciones as noti with (nolock)
	where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
	  and noti.usuario = @vendedor
	  and noti.fechacierre is not null
	  and noti.fecharevisado is null
	union  
	select	count(*) as cuantas
			,'Notificaciones Abiertas' as tipo
			,4 as orden
			,'N' as tipomov
			,'A' as estado
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from ktp_notificaciones as noti with (nolock)
	where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
	  and noti.usuario = @vendedor
	  and noti.fechacierre is null
	  and noti.fecharevisado is null
	union  
	select	count(*) as cuantas
			,'Notificaciones Revisadas' as tipo
			,5 as orden
			,'N' as tipomov
			,'R' as estado
			,@fechaDesde as fechadesde
			,@fechaHasta as fechahasta
	from ktp_notificaciones as noti with (nolock)
	where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
	  and noti.usuario = @vendedor
	  and noti.fecharevisado is not null
	order by orden;
	--
END;
go
