-- drop table ktb_pruebas_1718
use BABYEVO_REPORTING;
go

-- exec ksp_rpt_vtas_comparativas_anual ;
IF OBJECT_ID('ksp_rpt_vtas_comparativas_anual', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_rpt_vtas_comparativas_anual;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_comparativas_anual With Encryption
as
begin
	-- borrar si existe 
	if object_id('ktb_anual_161718')>0 drop table ktb_anual_161718;
	-- crearla 
	with 
	pre_161718 as ( select DDO.KOPRCT as codigo,year(EDO.FEEMDO) as anno,
					sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRNELT*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as neto_lista,
					sum(DDO.VANELI*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as venta_neta,
					sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRPM*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as costo_neto,
					sum( case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end ) as cantidad 
			from MAEDDO as DDO WITH (nolock) 
			inner join MAEEDO as EDO with (nolock) on EDO.IDMAEEDO=DDO.IDMAEEDO 
			where year(FEEMDO) in (2016,2017,2018)
			 and EDO.TIDO in ('BSV','BLV','FCV','FDV','NCV')
			 and DDO.LILG IN ('SI','CR')
			 and DDO.BOSULIDO IN ( select KOCARAC FROM TABCARAC WITH (nolock) WHERE KOTABLA='LOCALES-RG' ) 
			 group by DDO.KOPRCT,year(EDO.FEEMDO) )
	select	PR.KOPR AS CODIGO, PR.NOKOPR as DESCRIPCION,PR.RLUD as UMD,PR.ATPR as OCULTO,
			coalesce(SFAM.NOKOFM,'') as Area,
			coalesce(FAMI.NOKOPF,'') as Familia,
			coalesce(SUBF.NOKOHF,'') as [Sub Familia],
			coalesce(MR.NOKOMR,'') as Marca,
			coalesce(RU.NOKORU,'') as Proveedor,
			coalesce(LI01C.PP01UD,0) as [Costo-01C],
			coalesce(LI01P.PP01UD,0) as [PVP-01P],
			coalesce(t16.neto_lista,0) as neto_lista_16, coalesce(t17.neto_lista,0) as neto_lista_17, coalesce(t18.neto_lista,0) as neto_lista_18, 
			coalesce(t16.venta_neta,0) as venta_neta_16, coalesce(t17.venta_neta,0) as venta_neta_17, coalesce(t18.venta_neta,0) as venta_neta_18, 
			coalesce(t16.costo_neto,0) as costo_neto_16, coalesce(t17.costo_neto,0) as costo_neto_17, coalesce(t18.costo_neto,0) as costo_neto_18, 
			coalesce(t16.cantidad,0) as unids_vta_16, coalesce(t17.cantidad,0) as unids_vta_17, coalesce(t18.cantidad,0) as unids_vta_18,
			coalesce(PR.STFI1,0) as [Stock Final Periodo], 
			coalesce((PR.STFI1 * LI01C.PP01UD ),0) as [Stock Total Costo],
			coalesce((PR.STFI1 * LI01P.PP01UD ),0) as [Stock Total PVP]
	into ktb_anual_161718 
	from MAEPR as PR with (nolock)
	left join pre_161718 as t16 on t16.codigo = PR.KOPR and t16.anno=2016
	left join pre_161718 as t17 on t17.codigo = PR.KOPR and t17.anno=2017
	left join pre_161718 as t18 on t18.codigo = PR.KOPR and t18.anno=2018
	left join TABMR  as MR    with (nolock) on MR.KOMR=PR.MRPR 
	left join TABRU  as RU    with (nolock) on RU.KORU=PR.RUPR 
	left join TABFM  as SFAM  with (nolock) on SFAM.KOFM=PR.FMPR 
	left join TABPF  as FAMI  with (nolock) on FAMI.KOFM=PR.FMPR AND FAMI.KOPF=PR.PFPR 
	left join TABHF  as SUBF  with (nolock) on SUBF.KOFM=PR.FMPR AND SUBF.KOPF=PR.PFPR AND SUBF.KOHF=PR.HFPR 
	left join TABPRE as LI01C with (nolock) on LI01C.KOLT='01C' AND LI01C.KOPR=PR.KOPR  -- costo
	left join TABPRE as LI01P with (nolock) on LI01P.KOLT='01P' AND LI01P.KOPR=PR.KOPR  -- pvp
	--where PR.KOPR='10001'  -- codigo de pruebas
	order by PR.KOPR ;
end;
go
-- select * from ktb_anual_161718
-- select count(distinct KOPRCT ) from MAEDDO WHERE YEAR(FEEMLI)=2018


-- exec ksp_rpt_vtas_comparativas_anual_bodega ;
IF OBJECT_ID('ksp_rpt_vtas_comparativas_anual_bodega', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_rpt_vtas_comparativas_anual_bodega;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_comparativas_anual_bodega With Encryption
as
begin
	-- borrar si existe 
	if object_id('ktb_anual_bodega_161718')>0 drop table ktb_anual_bodega_161718;
	-- crearla 
	with 
	pre_161718 as ( select DDO.KOPRCT as codigo,DDO.BOSULIDO as bodega,year(EDO.FEEMDO) as anno,
					sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRNELT*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as neto_lista,
					sum(DDO.VANELI*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as venta_neta,
					sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRPM*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as costo_neto,
					sum( case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end ) as cantidad 
			from MAEDDO as DDO WITH (nolock) 
			inner join MAEEDO as EDO with (nolock) on EDO.IDMAEEDO=DDO.IDMAEEDO 
			where year(FEEMDO) in (2016,2017,2018)
			 and EDO.TIDO in ('BSV','BLV','FCV','FDV','NCV')
			 and DDO.LILG IN ('SI','CR')
			 and DDO.BOSULIDO IN ( select KOCARAC FROM TABCARAC WITH (nolock) WHERE KOTABLA='LOCALES-RG' ) 
			 group by DDO.KOPRCT,DDO.BOSULIDO,year(EDO.FEEMDO) )
	select	PR.KOPR AS CODIGO, PR.NOKOPR as DESCRIPCION,PR.RLUD as UMD,PR.ATPR as OCULTO,
			coalesce( tc.KOCARAC, '' ) as bodega,
			(select NOKOBO from TABBO as bo WHERE bo.KOBO=tc.KOCARAC ) as [Descrip.Bodega],
			coalesce(SFAM.NOKOFM,'') as Area,
			coalesce(FAMI.NOKOPF,'') as Familia,
			coalesce(SUBF.NOKOHF,'') as [Sub Familia],
			coalesce(MR.NOKOMR,'') as Marca,
			coalesce(RU.NOKORU,'') as Proveedor,
			coalesce(LI01C.PP01UD,0) as [Costo-01C],
			coalesce(LI01P.PP01UD,0) as [PVP-01P],
			coalesce(t16.neto_lista,0)	as neto_lista_16,	coalesce(t17.neto_lista,0)	as neto_lista_17,	coalesce(t18.neto_lista,0)	as neto_lista_18, 
			coalesce(t16.venta_neta,0)	as venta_neta_16,	coalesce(t17.venta_neta,0)	as venta_neta_17,	coalesce(t18.venta_neta,0)	as venta_neta_18, 
			coalesce(t16.costo_neto,0)	as costo_neto_16,	coalesce(t17.costo_neto,0)	as costo_neto_17,	coalesce(t18.costo_neto,0)	as costo_neto_18, 
			coalesce(t16.cantidad,0)	as unids_vta_16,	coalesce(t17.cantidad,0)	as unids_vta_17,	coalesce(t18.cantidad,0)	as unids_vta_18,
			coalesce(ST.STFI1,0) as [Stock Final Periodo], 
			coalesce((PR.STFI1 * LI01C.PP01UD ),0) as [Stock Total Costo],
			coalesce((PR.STFI1 * LI01P.PP01UD ),0) as [Stock Total PVP]
	into ktb_anual_bodega_161718 
	from MAEPR as PR with (nolock)
	inner join TABCARAC as tc WITH (nolock) ON tc.KOTABLA='LOCALES-RG' 
	left join pre_161718 as t16 on t16.codigo = PR.KOPR and t16.anno=2016 and t16.bodega=tc.KOCARAC
	left join pre_161718 as t17 on t17.codigo = PR.KOPR and t17.anno=2017 and t17.bodega=tc.KOCARAC
	left join pre_161718 as t18 on t18.codigo = PR.KOPR and t18.anno=2018 and t18.bodega=tc.KOCARAC
	left join MAEST  as ST    with (nolock) on ST.KOBO=tc.KOCARAC
	left join TABMR  as MR    with (nolock) on MR.KOMR=PR.MRPR 
	left join TABRU  as RU    with (nolock) on RU.KORU=PR.RUPR 
	left join TABFM  as SFAM  with (nolock) on SFAM.KOFM=PR.FMPR 
	left join TABPF  as FAMI  with (nolock) on FAMI.KOFM=PR.FMPR AND FAMI.KOPF=PR.PFPR 
	left join TABHF  as SUBF  with (nolock) on SUBF.KOFM=PR.FMPR AND SUBF.KOPF=PR.PFPR AND SUBF.KOHF=PR.HFPR 
	left join TABPRE as LI01C with (nolock) on LI01C.KOLT='01C' AND LI01C.KOPR=PR.KOPR  -- costo
	left join TABPRE as LI01P with (nolock) on LI01P.KOLT='01P' AND LI01P.KOPR=PR.KOPR  -- pvp
	--where PR.KOPR='10001'  -- codigo de pruebas
	order by PR.KOPR ;
end;
go
-- select * from ktb_anual_bodega_161718


IF OBJECT_ID('ksp_rpt_vtas_comparativas_anual_bodega_semana', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_rpt_vtas_comparativas_anual_bodega_semana;  
GO  
CREATE PROCEDURE ksp_rpt_vtas_comparativas_anual_bodega_semana With Encryption
as 
begin
	-- borrar si existe 
	if object_id('ktb_anual_bodega_semana_161718')>0 drop table ktb_anual_bodega_semana_161718;
	-- crearla 
	with 
	pre_161718 as ( select DDO.KOPRCT as codigo,DDO.BOSULIDO as bodega,EDO.FEEMDO as fecha,
							sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRNELT*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as neto_lista,
							sum(DDO.VANELI*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as venta_neta,
							sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRPM*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as costo_neto,
							sum( case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end ) as cantidad 
					from MAEDDO as DDO WITH (nolock) 
					inner join MAEEDO as EDO with (nolock) on EDO.IDMAEEDO=DDO.IDMAEEDO 
					where year(FEEMDO) in (2016,2017,2018)
					--where year(FEEMDO) in (2016) and month(FEEMDO)=1
					 and EDO.TIDO in ('BSV','BLV','FCV','FDV','NCV')
					 and DDO.LILG IN ('SI','CR')
					 and DDO.BOSULIDO IN ( select KOCARAC FROM TABCARAC WITH (nolock) WHERE KOTABLA='LOCALES-RG' ) 
					 group by DDO.KOPRCT,DDO.BOSULIDO,EDO.FEEMDO ),
	def_161718 as ( select codigo,bodega,fecha,
							( select anno from ktb_tabla_semanas where fecha between fechaini and fechafin  ) as anno_periodo,
							datepart(ISO_WEEK,fecha) as semana,
							sum(neto_lista) as neto_lista,
							sum(venta_neta) as venta_neta,
							sum(costo_neto) as costo_neto,
							sum(cantidad) as cantidad 
					from pre_161718 as DDO WITH (nolock) 
					group by codigo,bodega,fecha ),
	vta_161718 as ( select codigo,bodega,anno_periodo as anno,semana,
							sum(neto_lista) as neto_lista,
							sum(venta_neta) as venta_neta,
							sum(costo_neto) as costo_neto,
							sum(cantidad) as cantidad 
					from def_161718 as DDO WITH (nolock) 
					group by codigo,bodega,anno_periodo,semana )	
	select	PR.KOPR AS CODIGO, PR.NOKOPR as DESCRIPCION,PR.RLUD as UMD,PR.ATPR as OCULTO,
			coalesce( tc.KOCARAC, '' ) as bodega,
			( select NOKOBO from TABBO as bo WHERE bo.KOBO=tc.KOCARAC ) as [Descrip.Bodega],
			coalesce(SFAM.NOKOFM,'') as Area,
			coalesce(FAMI.NOKOPF,'') as Familia,
			coalesce(SUBF.NOKOHF,'') as [Sub Familia],
			coalesce(MR.NOKOMR,'') as Marca,
			coalesce(RU.NOKORU,'') as Proveedor,
			coalesce(LI01C.PP01UD,0) as [Costo-01C],
			coalesce(LI01P.PP01UD,0) as [PVP-01P],
			coalesce(t,0) as [Año],
			coalesce(t16.neto_lista,0)	as neto_lista_16,	coalesce(t17.neto_lista,0)	as neto_lista_17,	coalesce(t18.neto_lista,0)	as neto_lista_18, 
			coalesce(t16.venta_neta,0)	as venta_neta_16,	coalesce(t17.venta_neta,0)	as venta_neta_17,	coalesce(t18.venta_neta,0)	as venta_neta_18, 
			coalesce(t16.costo_neto,0)	as costo_neto_16,	coalesce(t17.costo_neto,0)	as costo_neto_17,	coalesce(t18.costo_neto,0)	as costo_neto_18, 
			coalesce(t16.cantidad,0)	as unids_vta_16,	coalesce(t17.cantidad,0)	as unids_vta_17,	coalesce(t18.cantidad,0)	as unids_vta_18,
			coalesce(ST.STFI1,0) as [Stock Final Periodo], 
			coalesce((PR.STFI1 * LI01C.PP01UD ),0) as [Stock Total Costo],
			coalesce((PR.STFI1 * LI01P.PP01UD ),0) as [Stock Total PVP]
	into ktb_anual_bodega_semana_161718 
	from ktb_tabla_semanas as semanas with (nolock)
	left join MAEPR		 as PR    with (nolock)
	left join vta_161718 as t16 on t16.codigo = PR.KOPR and t16.anno=2016 --and t16.bodega=tc.KOCARAC
	left join vta_161718 as t17 on t17.codigo = PR.KOPR and t17.anno=2017 --and t17.bodega=tc.KOCARAC
	left join vta_161718 as t18 on t18.codigo = PR.KOPR and t18.anno=2018 --and t18.bodega=tc.KOCARAC
	left join MAEST  as ST    with (nolock) on ST.KOBO=coalesce( tc.KOCARAC, '' ) and ST.KOPR=PR.KOPR
	left join TABMR  as MR    with (nolock) on MR.KOMR=PR.MRPR 
	left join TABRU  as RU    with (nolock) on RU.KORU=PR.RUPR 
	left join TABFM  as SFAM  with (nolock) on SFAM.KOFM=PR.FMPR 
	left join TABPF  as FAMI  with (nolock) on FAMI.KOFM=PR.FMPR AND FAMI.KOPF=PR.PFPR 
	left join TABHF  as SUBF  with (nolock) on SUBF.KOFM=PR.FMPR AND SUBF.KOPF=PR.PFPR AND SUBF.KOHF=PR.HFPR 
	left join TABPRE as LI01C with (nolock) on LI01C.KOLT='01C' AND LI01C.KOPR=PR.KOPR  -- costo
	left join TABPRE as LI01P with (nolock) on LI01P.KOLT='01P' AND LI01P.KOPR=PR.KOPR -- pvp
	--where PR.KOPR='10001'  -- codigo de pruebas
	--order by PR.KOPR ;
end;
go
-- exec ksp_rpt_vtas_comparativas_anual_bodega_semana ;
-- select * from ktb_anual_bodega_semana_161718
