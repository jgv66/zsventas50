

USE [BABYEVO_REPORTING]

-- exec ksp_rpt_sumas
if OBJECT_ID('ksp_rpt_sumas', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_sumas;  
GO  
CREATE PROCEDURE ksp_rpt_sumas With Encryption
as
begin
    SET NOCOUNT ON

	-- ventas sucursal vendedor año mes dia 
	if object_id('krpt_vta_svym')>0 drop table krpt_vta_svym;
	--
	select SUDO as sucursal,su.NOKOSU as nombresuc,
		   KOFULIDO as vendedor, ve.NOKOFU as nombreven,
		   YEAR(FEEMDO) as anno, 
		   MONTH(FEEMDO) as mes,
		   SUM( case when EDO.TIDO<>'GDV'                                    THEN DDO.VANELI * (CASE WHEN EDO.TIDO = 'NCV' THEN -1 ELSE 1 END )
		             when EDO.TIDO= 'GDV' and DDO.UDTRPR=1 AND DDO.CAPRCO1>0 THEN ( ((DDO.CAPRCO1-DDO.CAPRAD1-DDO.CAPREX1)*DDO.VANELI)/DDO.CAPRCO1 )
					 when EDO.TIDO= 'GDV' and DDO.UDTRPR=2 AND DDO.CAPRCO2>0 THEN ( ((DDO.CAPRCO2-DDO.CAPRAD2-DDO.CAPREX2)*DDO.VANELI)/DDO.CAPRCO2 )
					 else 0
				end ) as monto,
		   SUM((CASE WHEN DDO.UDTRPR=1 THEN DDO.PPPRNERE1 ELSE DDO.PPPRNERE2         END )*
				(CASE WHEN DDO.UDTRPR=1 
					  THEN (CASE WHEN DDO.TIDO IN ('GDV','GDP')			THEN DDO.CAPRCO1-DDO.CAPREX1  
					 			 WHEN DDO.TIDO IN ('NCV','NCX','NEV')	THEN DDO.CAPRCO1*(-1)  
								 ELSE										 DDO.CAPRCO1  END )
					  ELSE (CASE WHEN DDO.TIDO IN ('GDV','GDP')			THEN DDO.CAPRCO2-DDO.CAPREX2  
								 WHEN DDO.TIDO IN ('NCV','NCX','NEV')	THEN DDO.CAPRCO2*(-1)  
								 ELSE										 DDO.CAPRCO2 END ) 
				END )) as montoreal,
		   SUM((CASE WHEN DDO.UDTRPR=1 THEN DDO.PPPRPM    ELSE DDO.PPPRPM*DDO.RLUDPR END ) * 
				(CASE WHEN DDO.UDTRPR=1 
					  THEN (CASE WHEN DDO.TIDO IN ('GDV','GDP')			THEN DDO.CAPRCO1-DDO.CAPREX1  
					 			 WHEN DDO.TIDO IN ('NCV','NCX','NEV')	THEN DDO.CAPRCO1*(-1)  
								 ELSE										 DDO.CAPRCO1  END )
					  ELSE (CASE WHEN DDO.TIDO IN ('GDV','GDP')			THEN DDO.CAPRCO2-DDO.CAPREX2  
								 WHEN DDO.TIDO IN ('NCV','NCX','NEV')	THEN DDO.CAPRCO2*(-1)  
								 ELSE										 DDO.CAPRCO2 END ) 
				END )) as costopm
	into krpt_vta_svym
	from       [BABYEVO]..MAEEDO as EDO with (nolock)
	inner join [BABYEVO]..MAEDDO as DDO with (nolock) on EDO.IDMAEEDO=DDO.IDMAEEDO and DDO.LILG in ('SI','GR')
	left join  [BABYEVO]..TABFU  as ve  with (nolock) on ve.KOFU=DDO.KOFULIDO
	left join  [BABYEVO]..TABSU  as su  with (nolock) on su.KOSU=EDO.SUDO 
	WHERE EDO.EMPRESA='03'
	  and year(FEEMDO)>2016
	  and (      EDO.TIDO in ('BLV','BLX','BSV','ESC','FCV','FDB','FDE','FDV','FDX','FDZ','FEE','FEV','FVL','FVT','FVX','FVZ','FXV','FYV','NCE','NCV','NCX','NCZ','NEV','RIN')
	        or ( EDO.TIDO='GDV' and DDO.CAPRCO1<>DDO.CAPRAD1+DDO.CAPREX1 ) )
	  and EDO.NUDONODEFI=0  
      and EDO.ESDO<>'N'
	group by SUDO,su.NOKOSU,KOFULIDO,ve.NOKOFU,YEAR(FEEMDO),MONTH(FEEMDO);
end
go

-- exec ksp_rpt_vtas '01',2018,6 ;
if OBJECT_ID('ksp_rpt_vtas', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas;  
GO  
CREATE PROCEDURE ksp_rpt_vtas ( 
       @empresa char(2),
	   @anno	int,
	   @mes		int  ) With Encryption
as
begin
    SET NOCOUNT ON
	-- Sucursal, Mes 
	select sucursal, nombresuc, anno, mes, 
			sum(monto) as ventas,
			sum(montoreal) as real,
			sum(costopm) as pm
	from krpt_vta_svym with (nolock)
	where anno = @anno
	  and mes  = @mes
	group by sucursal, nombresuc, anno, mes
	order by ventas desc
end
go

-- exec ksp_rpt_vtas_suc '01',2018,6 ;
if OBJECT_ID('ksp_rpt_vtas_suc', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc ( 
       @empresa char(2),
	   @anno	int,
	   @mes		int ) With Encryption
as
begin
    SET NOCOUNT ON
	-- sucursales, Mes actual
	select DISTINCT sucursal, nombresuc
	from krpt_vta_svym with (nolock)
	where anno = @anno
	  and mes  = @mes
	order by sucursal 
end
go

-- exec ksp_rpt_vtas_suc_ven '01',2018,6,'1CM' ;
if OBJECT_ID('ksp_rpt_vtas_suc_ven', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc_ven;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc_ven ( 
       @empresa char(2),
	   @anno	int,
	   @mes		int,
	   @sucursal varchar(200) ) With Encryption
as
begin
    SET NOCOUNT ON
	-- vendedor, Mes actual
	select nombresuc, vendedor, left(nombreven,23) as nombreven, 
	       sum(monto) as ventas,
		   sum(montoreal) as real,
		   sum(costopm) as pm
	from krpt_vta_svym with (nolock)
	where anno = @anno
	  and mes  = @mes
	  and sucursal in ( @sucursal )
	group by nombresuc, vendedor, nombreven, mes
	order by ventas desc
end
go

-- exec ksp_rpt_vtas_ven '01',2018,6 ;
if OBJECT_ID('ksp_rpt_vtas_ven', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_ven;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_ven ( 
       @empresa char(2),
	   @anno	int,
	   @mes		int ) With Encryption
as
begin
    SET NOCOUNT ON
	-- sucursales, Mes actual
	select DISTINCT vendedor, nombreven
	from krpt_vta_svym with (nolock)
	where anno = @anno
	  and mes  = @mes
	order by nombreven 
end
go

-- exec ksp_rpt_vtas_ven_suc '01',2018,6,'LOD' ; 
if OBJECT_ID('ksp_rpt_vtas_ven_suc', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_ven_suc;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_ven_suc ( 
       @empresa  char(2),
	   @anno	 int,
	   @mes		 int,
	   @vendedor varchar(200) ) With Encryption
as
begin
    SET NOCOUNT ON
	-- vendedor, Mes actual
	select sucursal, nombresuc, vendedor, left(nombreven,23) as nombreven, 
		   sum(monto) as ventas,
		   sum(montoreal) as real,
		   sum(costopm) as pm
	from krpt_vta_svym with (nolock)
	where anno = @anno
	  and mes  = @mes
	  and vendedor in ( @vendedor )
	group by vendedor, nombreven, sucursal, nombresuc, mes
	order by ventas desc
end
go

-- exec ksp_rpt_vtas_ven_tot '01',2018,6 ; 
if OBJECT_ID('ksp_rpt_vtas_ven_tot', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_ven_tot;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_ven_tot ( 
       @empresa  char(2),
	   @anno	 int,
	   @mes		 int  ) With Encryption
as
begin
    SET NOCOUNT ON
	-- vendedor, Mes actual
	select vendedor, left(nombreven,23) as nombreven, mes, 
	       sum(monto) as ventas,
		   sum(montoreal) as real,
		   sum(costopm) as pm
	from krpt_vta_svym with (nolock)
	where anno    = @anno
	  and mes     = @mes
	group by vendedor, nombreven, mes
	order by ventas desc
end
go

-- exec ksp_rpt_vtas_hist ;
if OBJECT_ID('ksp_rpt_vtas_hist', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_hist;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_hist With Encryption
as
begin
    SET NOCOUNT ON
	-- sucursales, historico
	select DISTINCT cast( anno as char(4) )+right( '0'+rtrim(cast( mes as char(2) )),2) as periodo, 
					case 
						when mes = 1  then 'Enero' 
						when mes = 2  then 'Febrero' 
						when mes = 3  then 'Marzo' 
						when mes = 4  then 'Abril' 
						when mes = 5  then 'Mayo' 
						when mes = 6  then 'Junio' 
						when mes = 7  then 'Julio' 
						when mes = 8  then 'Agosto' 
						when mes = 9  then 'Septiembre' 
						when mes = 10 then 'Octubre' 
						when mes = 11 then 'Noviembre' 
						when mes = 12 then 'Diciembre' 
						else               '??'
					end + ' / ' + cast( anno as char(4) ) as annomesnom
	from krpt_vta_svym with (nolock)
	order by periodo desc 
end
go

-- exec ksp_rpt_vtas_suc_anno_dato ;
if OBJECT_ID('ksp_rpt_vtas_suc_anno_dato', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc_anno_dato;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc_anno_dato With Encryption
as
begin
    SET NOCOUNT ON
	-- sucursales, historico
	select DISTINCT anno, sucursal, nombresuc, cast(anno as char(4))+sucursal as sucursalanno
	from krpt_vta_svym with (nolock)
	order by sucursalanno desc 
end
go

 
-- exec ksp_rpt_vtas_suc_anno '01',2018,'1CM' ;
-- exec ksp_rpt_vtas_suc_anno '01',2018,'4MA' ;
if OBJECT_ID('ksp_rpt_vtas_suc_anno', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc_anno;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc_anno ( 
       @empresa char(2),
	   @anno	int,
	   @sucursal varchar(200) ) With Encryption
as
begin
    SET NOCOUNT ON
	-- vendedor, Mes actual
	select sucursal, left(nombresuc,23) as nombresuc, mes, 
			case 
				when mes = 1  then 'Enero' 
				when mes = 2  then 'Febrero' 
				when mes = 3  then 'Marzo' 
				when mes = 4  then 'Abril' 
				when mes = 5  then 'Mayo' 
				when mes = 6  then 'Junio' 
				when mes = 7  then 'Julio' 
				when mes = 8  then 'Agosto' 
				when mes = 9  then 'Septiembre' 
				when mes = 10 then 'Octubre' 
				when mes = 11 then 'Noviembre' 
				when mes = 12 then 'Diciembre' 
				else               '??'
			end as nombremes,	
	sum(monto) as ventas,
	( select sum(monto) 
	  from krpt_vta_svym as pasado with (nolock) 
	  where pasado.anno = @anno-1 
	    and pasado.mes = krpt_vta_svym.mes 
		and pasado.sucursal = @sucursal ) as pasado
	from krpt_vta_svym with (nolock)
	where anno = @anno
	  and sucursal = @sucursal 
	group by sucursal, nombresuc, mes
	order by mes  
end
go

-- exec ksp_rpt_vtas_suc_anno_tot_dato ;
if OBJECT_ID('ksp_rpt_vtas_suc_anno_tot_dato', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc_anno_tot_dato;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc_anno_tot_dato With Encryption
as
begin
    SET NOCOUNT ON
	-- sucursales, historico
	select DISTINCT anno
	from krpt_vta_svym with (nolock)
	order by anno desc 
end
go

-- exec ksp_rpt_vtas_suc_anno_tot 2018;
if OBJECT_ID('ksp_rpt_vtas_suc_anno_tot', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc_anno_tot;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc_anno_tot ( @anno int ) With Encryption
as
begin
    SET NOCOUNT ON

	SELECT anno, sucursal, nombresuc,
		   [1] Ene, [2] Feb, [3] Mar, [4] Abr, [5] May, [6] Jun, [7] Jul, [8] Ago, [9] Sep, [10] Oct, [11] Nov, [12] Dic
	FROM
	(
		select anno, sucursal, left(nombresuc,23) as nombresuc, mes, 
			   sum(monto) as ventas,
			   sum(montoreal) as real,
			   sum(costopm) as pm
		from krpt_vta_svym with (nolock)
		where anno = @anno
		group by anno, sucursal, nombresuc, mes ) as valores
	PIVOT ( sum(ventas) FOR mes IN ([1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12]) ) as PT
end
go


-- exec ksp_rpt_vtas_suc_hist ;
if OBJECT_ID('ksp_rpt_vtas_suc_hist', 'P') IS NOT NULL  
   DROP PROCEDURE ksp_rpt_vtas_suc_hist;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_suc_hist With Encryption
as
begin
    SET NOCOUNT ON
	-- sucursales, historico
	select DISTINCT sucursal, nombresuc
	from krpt_vta_svym with (nolock)
	order by sucursal  
end
go
