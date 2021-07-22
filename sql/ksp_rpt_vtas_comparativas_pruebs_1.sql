	with 
	pre_161718 as ( select DDO.KOPRCT as codigo,DDO.BOSULIDO as bodega,EDO.FEEMDO as fecha,
					sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRNELT*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as neto_lista,
					sum(DDO.VANELI*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as venta_neta,
					sum((case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end)*DDO.PPPRPM*(CASE WHEN DDO.TIDO='NCV' THEN -1 else 1 end)) as costo_neto,
					sum( case when DDO.UDTRPR=1 then DDO.CAPRCO1 else DDO.CAPRCO2 end ) as cantidad 
			from [BABYEVO]..MAEDDO as DDO WITH (nolock) 
			inner join [BABYEVO]..MAEEDO as EDO with (nolock) on EDO.IDMAEEDO=DDO.IDMAEEDO 
			where year(FEEMDO) in (2016,2017,2018)
			 and EDO.TIDO in ('BSV','BLV','FCV','FDV','NCV')
			 and DDO.LILG IN ('SI','CR')
			 and DDO.BOSULIDO IN ( select KOCARAC FROM [BABYEVO]..TABCARAC WITH (nolock) WHERE KOTABLA='LOCALES-RG' ) 
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
	vta_161718 as ( select codigo,bodega,anno_periodo,semana,
					sum(neto_lista) as neto_lista,
					sum(venta_neta) as venta_neta,
					sum(costo_neto) as costo_neto,
					sum(cantidad) as cantidad 
			from def_161718 as DDO WITH (nolock) 
			 group by codigo,bodega,anno_periodo,semana )
	select * 
	from vta_161718
	order by codigo,bodega,anno_periodo,semana
