
/*
exec ksp_TraeDetalleK 28 ;
exec ksp_revisaStockDetalleK 28  ;
*/
IF OBJECT_ID('ksp_revisaStockDetalleK', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_revisaStockDetalleK;  
GO  
CREATE PROCEDURE ksp_revisaStockDetalleK ( 
       @id int ) With Encryption
as
begin
    SET NOCOUNT ON
	--
	select	d.codigo,d.cantidad1 as cantidad,d.unidad_tr as unidad,d.unidad1 as cod_unidad, 
			( case when d.unidad_tr=1 
				then COALESCE(st.STFI1,0)-coalesce(st.STOCNV1,0)
				else COALESCE(st.STFI2,0)-coalesce(st.STOCNV2,0)
			  end ) as stock,
			pr.NOKOPR as descripcion
	from ktp_encabezado	   as e  with (nolock)
	inner join ktp_detalle as d  with (nolock) on e.id_preventa=d.id_preventa
	inner join MAEPR	   as pr with (nolock) on d.codigo=pr.KOPR
	left  join MAEST       as st with (nolock) on d.bodega=st.KOBO and d.codigo=st.KOPR
	where e.id_preventa=@id
	  and (( case when d.unidad_tr=1 
				then COALESCE(st.STFI1,0)-coalesce(st.STOCNV1,0)
				else COALESCE(st.STFI2,0)-coalesce(st.STOCNV2,0)
			end )<=0 
		or ( case when d.unidad_tr=1 
				then COALESCE(st.STFI1,0)-coalesce(st.STOCNV1,0)
				else COALESCE(st.STFI2,0)-coalesce(st.STOCNV2,0)
			end )-d.cantidad1<0 )
	order by d.id_detalle ;
end;
go

