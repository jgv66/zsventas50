
-- exec ksp_TraeDetalleK 152 ;
IF OBJECT_ID('ksp_TraeDetalleK', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_TraeDetalleK;  
GO  
CREATE PROCEDURE ksp_TraeDetalleK ( 
       @id int ) With Encryption
as
begin
    SET NOCOUNT ON
	--
	select	d.codigo as principal, pr.KOPRTE as codigo,d.cantidad1 as cantidad,unidad1 as unidad, 
			d.precio as preciounit,
			d.porcedes as porcentaje, d.descuentos,
			(d.cantidad1*d.precio)-d.descuentos as subtotal,
		   pr.NOKOPR as descripcion
	from ktp_encabezado	   as e  with (nolock)
	inner join ktp_detalle as d  with (nolock) on e.id_preventa=d.id_preventa
	inner join MAEPR	   as pr with (nolock) on d.codigo=pr.KOPR
	where e.id_preventa=@id 
	order by d.id_detalle ;
end
go
