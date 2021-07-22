
-- exec ksp_revisaQuiebres '01';
IF OBJECT_ID('ksp_revisaQuiebres', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_revisaQuiebres;  
GO  
CREATE PROCEDURE ksp_revisaQuiebres ( 
		@empresa char(3) ) With Encryption
AS
BEGIN
    --SET NOCOUNT ON
 
	with 
	pendientes as ( select  ddo.KOPRCT as codigo,
							ddo.BOSULIDO as bodega,
							sum(ddo.CAPRCO1-ddo.CAPRAD1-ddo.CAPREX1) as pedidos1,
							sum(ddo.CAPRCO2-ddo.CAPRAD2-ddo.CAPREX2) as pedidos2
					from MAEDDO as ddo  with (nolock) 
					inner join MAEEDO as edo with (nolock) on edo.IDMAEEDO=ddo.IDMAEEDO
					where	edo.EMPRESA=@empresa 
						and edo.FEEMDO>'20180801'
						and ddo.CAPRCO1-ddo.CAPRAD1-ddo.CAPREX1<>0
					group by ddo.KOPRCT, ddo.BOSULIDO )
    select  pr.KOPR as codigo, pr.NOKOPR as descripcion,pr.UD01PR as unidad_1,pr.UD02PR as unidad_2,pr.RLUD as rtu,
			ddo.bodega,ddo.pedidos1, ddo.pedidos2,
			round(st.STFI1,2) as st_bo_1,
			round(st.STFI2,2) as st_bo_2,
			round(pr.STFI1,2) as st_total_1,
			round(pr.STFI2,2) as st_total_2,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='PIN' and b.KOPR=ddo.codigo ),2) as bod_PIN_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='PIN' and b.KOPR=ddo.codigo ),2) as bod_PIN_02,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='01 ' and b.KOPR=ddo.codigo ),2) as bod_01_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='01 ' and b.KOPR=ddo.codigo ),2) as bod_01_02,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='02 ' and b.KOPR=ddo.codigo ),2) as bod_02_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='02 ' and b.KOPR=ddo.codigo ),2) as bod_02_02,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='03 ' and b.KOPR=ddo.codigo ),2) as bod_03_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='03 ' and b.KOPR=ddo.codigo ),2) as bod_03_02,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='04 ' and b.KOPR=ddo.codigo ),2) as bod_04_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='04 ' and b.KOPR=ddo.codigo ),2) as bod_04_02,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='05 ' and b.KOPR=ddo.codigo ),2) as bod_05_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='05 ' and b.KOPR=ddo.codigo ),2) as bod_05_02,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='K  ' and b.KOPR=ddo.codigo ),2) as bod_K_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='K  ' and b.KOPR=ddo.codigo ),2) as bod_K_02
	from MAEPR				as pr  with (nolock) 
	inner join pendientes	as ddo on ddo.codigo=pr.KOPR
	inner join MAEST		as st on st.EMPRESA=@empresa and st.KOPR=pr.KOPR and st.KOBO=ddo.bodega
	where ( ddo.pedidos1>st.STFI1 or ddo.pedidos2>st.STFI2 )
    ORDER BY codigo,ddo.bodega ;

END;
go


-- exec ksp_revisaQuiebres_resumen '01';
IF OBJECT_ID('ksp_revisaQuiebres_resumen', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_revisaQuiebres_resumen;  
GO  
CREATE PROCEDURE ksp_revisaQuiebres_resumen ( 
		@empresa char(3) ) With Encryption
AS
BEGIN
    --SET NOCOUNT ON
 
	with 
	pendientes as ( select  ddo.KOPRCT as codigo,
							sum(ddo.CAPRCO1-ddo.CAPRAD1-ddo.CAPREX1) as pedidos1,
							sum(ddo.CAPRCO2-ddo.CAPRAD2-ddo.CAPREX2) as pedidos2
					from MAEDDO as ddo  with (nolock) 
					inner join MAEEDO as edo with (nolock) on edo.IDMAEEDO=ddo.IDMAEEDO
					where	edo.EMPRESA=@empresa 
						and edo.FEEMDO>'20180801'
						and ddo.BOSULIDO='PIN'
						and ddo.CAPRCO1-ddo.CAPRAD1-ddo.CAPREX1<>0
					group by ddo.KOPRCT )
    select  pr.KOPR as codigo, pr.NOKOPR as descripcion,pr.UD01PR as unidad_1,pr.UD02PR as unidad_2,pr.RLUD as rtu,
			ddo.pedidos1, 
			ddo.pedidos2,
			round((select b.STFI1 from MAEST as b with (nolock) where b.KOBO='PIN' and b.KOPR=ddo.codigo ),2) as bod_PIN_01,
			round((select b.STFI2 from MAEST as b with (nolock) where b.KOBO='PIN' and b.KOPR=ddo.codigo ),2) as bod_PIN_02
	from MAEPR				as pr  with (nolock) 
	inner join pendientes	as ddo on ddo.codigo=pr.KOPR
	where ( ddo.pedidos1>pr.STFI1 or ddo.pedidos2>pr.STFI2 )
    ORDER BY codigo ;

END;
go

