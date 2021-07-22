-- exec ksp_traeInfoProductos 'VALU-015','','','01'; 
IF OBJECT_ID('ksp_traeInfoProductos', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_traeInfoProductos;  
GO  
CREATE PROCEDURE ksp_traeInfoProductos (
    @kodigo		char(13) = '',
	@cliente	char(13) = '',
	@sucursal   char(10) = '',
	@empresa    char(2) = '01' ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
 
    select top 50 DDO.TIDO as tipo, DDO.NUDO as numero, DDO.ENDO as cliente,DDO.SUENDO as sucursal,
	       convert( nvarchar(10),EDO.FEEMDO,103) as emision, EDO.VABRDO as totaldocumento, 
		   DDO.BOSULIDO AS bodega, BO.NOKOBO as nombrebodega,
	       (case when DDO.UDTRPR = 1 then DDO.CAPRCO1 else DDO.CAPRCO2 END ) as cantidad,
	       (case when DDO.UDTRPR = 1 then DDO.UD01PR  else DDO.UD02PR END ) as unidad,
		   DDO.VANELI/(case when DDO.UDTRPR = 1 then DDO.CAPRCO1 else DDO.CAPRCO2 END ) as unitarioneto, 
		   DDO.VANELI as netototal
    from MAEDDO AS DDO with (nolock)
	inner join MAEEDO as EDO with (nolock) ON EDO.IDMAEEDO=DDO.IDMAEEDO   
	left join TABBO as BO with (nolock) ON BO.KOBO=DDO.BOSULIDO
    where DDO.KOPRCT=@kodigo
	  and DDO.ENDO=@cliente
	  and DDO.SUENDO=@sucursal
	  and DDO.EMPRESA=@empresa
	  and DDO.TIDO IN ('FCV','BLV','NCV')
    order by DDO.FEEMLI desc
END

 