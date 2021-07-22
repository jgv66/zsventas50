-- exec ksp_traeDocumento 206560 
IF OBJECT_ID('ksp_traeDocumento', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_traeDocumento;  
GO  
CREATE PROCEDURE ksp_traeDocumento (
    @id int = 0 ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
 
    select	DDO.TIDO as td, DDO.NUDO as numero,
			DDO.BOSULIDO AS bodega, DDO.KOPRCT AS codigo,
	       (case when DDO.UDTRPR = 1 then DDO.CAPRCO1 else DDO.CAPRCO2 END ) as cantidad,
		   DDO.PPPRNE as precio, round(DDO.PODTGLLI,3) as porcentaje, DDO.VANELI as netolinea,
		   DDO.NOKOPR as descrip, DDO.EMPRESA as empresa
    from MAEDDO AS DDO with (nolock)
	left join TABFU as FU with (nolock) ON FU.KOFU=DDO.KOFULIDO
    where DDO.IDMAEEDO = @id
      order by DDO.IDMAEDDO
END

 