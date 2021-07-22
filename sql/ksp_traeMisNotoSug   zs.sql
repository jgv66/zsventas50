
-- exec ksp_traeMisNotoSug 'ZSS','2021-05-01', '2021-05-30','N','T';
-- exec ksp_traeMisNotoSug 'ZSS','2021-05-01T14:55:38.047Z','2021-05-31T14:55:38.047Z','N','C' ;
IF OBJECT_ID('ksp_traeMisNotoSug', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_traeMisNotoSug;  
GO
-- 
CREATE PROCEDURE ksp_traeMisNotoSug (
    @vendedor varchar(3), 
    @fechaDesde varchar(10), 
    @fechaHasta varchar(10),
	@tipo char(1),
	@estado char(1) ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
	--
	declare @Error		nvarchar(250),
			@ErrMsg		nvarchar(2048);
	--
	if ( @tipo = 'S' ) begin 
		-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   SUGERENCIAS
		select	sug.id
				,sug.codigoproducto
				,rtrim(pr.NOKOPR) as descripcion
				,rtrim(sug.observaciones) as observaciones
				,convert(varchar(10), sug.fecha, 103) as fsugerencia
				,convert(varchar(10), sug.recepcionada, 103) as frecepcion
				,sug.revisado
				,convert(varchar(10), sug.fecharevisado, 103) as frevision
		from ktp_sugerencias as sug with (nolock)
		left join MAEPR as pr with (nolock) on pr.KOPR=sug.codigoproducto
		where cast(sug.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
		  and sug.usuario = @vendedor
		order by fsugerencia desc;
	end
	else begin
		-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   NOTIFICACIONES
		if ( @tipo = 'N' and @estado = 'T' ) begin 
			select	noti.id
					,noti.codigoproducto
					,rtrim(pr.NOKOPR) as descripcion
					,noti.cantidadesperada as cantidad
					,rtrim(noti.observaciones) as observaciones
					,rtrim(noti.nombrecliente) as cliente
					,rtrim(noti.emailcliente) as email
					,rtrim(noti.fonocliente) as fono
					,convert(varchar(10), noti.fecha, 103) as fsolicitud
					,convert(varchar(10), noti.fechacierre, 103) as fcierre
					,noti.revisado
					,convert(varchar(10), noti.fecharevisado, 103) as frevision
			from ktp_notificaciones as noti with (nolock)
			left join MAEPR as pr with (nolock) on pr.KOPR=noti.codigoproducto
			where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
			  and noti.usuario = @vendedor
			order by fsolicitud desc;
		end;
		if ( @tipo = 'N' and @estado = 'C' ) begin 
			select	noti.id
					,noti.codigoproducto
					,rtrim(pr.NOKOPR) as descripcion
					,noti.cantidadesperada as cantidad
					,rtrim(noti.observaciones) as observaciones
					,rtrim(noti.nombrecliente) as cliente
					,rtrim(noti.emailcliente) as email
					,rtrim(noti.fonocliente) as fono
					,convert(varchar(10), noti.fecha, 103) as fsolicitud
					,convert(varchar(10), noti.fechacierre, 103) as fcierre
					,noti.revisado
					,convert(varchar(10), noti.fecharevisado, 103) as frevision
			from ktp_notificaciones as noti with (nolock)
			left join MAEPR as pr with (nolock) on pr.KOPR=noti.codigoproducto
			where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
			  and noti.usuario = @vendedor
			  and noti.fechacierre is not null
			  and noti.fecharevisado is null
			order by fsolicitud desc;
		end;
		if ( @tipo = 'N' and @estado = 'A' ) begin 
			select	noti.id
					,noti.codigoproducto
					,rtrim(pr.NOKOPR) as descripcion
					,noti.cantidadesperada as cantidad
					,rtrim(noti.observaciones) as observaciones
					,rtrim(noti.nombrecliente) as cliente
					,rtrim(noti.emailcliente) as email
					,rtrim(noti.fonocliente) as fono
					,convert(varchar(10), noti.fecha, 103) as fsolicitud
					,convert(varchar(10), noti.fechacierre, 103) as fcierre
					,noti.revisado
					,convert(varchar(10), noti.fecharevisado, 103) as frevision
			from ktp_notificaciones as noti with (nolock)
			left join MAEPR as pr with (nolock) on pr.KOPR=noti.codigoproducto
			where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
			  and noti.usuario = @vendedor
			  and noti.fechacierre is null
			  and noti.fecharevisado is null
			order by fsolicitud desc;
		end;
		if ( @tipo = 'N' and @estado = 'R' ) begin 
			select	noti.id
					,noti.codigoproducto
					,rtrim(pr.NOKOPR) as descripcion
					,noti.cantidadesperada as cantidad
					,rtrim(noti.observaciones) as observaciones
					,rtrim(noti.nombrecliente) as cliente
					,rtrim(noti.emailcliente) as email
					,rtrim(noti.fonocliente) as fono
					,convert(varchar(10), noti.fecha, 103) as fsolicitud
					,convert(varchar(10), noti.fechacierre, 103) as fcierre
					,noti.revisado
					,convert(varchar(10), noti.fecharevisado, 103) as frevision
			from ktp_notificaciones as noti with (nolock)
			left join MAEPR as pr with (nolock) on pr.KOPR=noti.codigoproducto
			where cast(noti.fecha as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date) 
			  and noti.usuario = @vendedor
			  and noti.fecharevisado is not null
			order by fsolicitud desc;
		end;
		--
	end;
	--
END;
go
