-- exec ksp_traeDocumento 676309 ;
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
		   DDO.NOKOPR as descrip, DDO.EMPRESA as empresa,
		   ( select COUNT(*) from ktb_documentos_attach as att with (nolock) where att.idmaeedo = DDO.IDMAEEDO and estado = 0 ) as attached,
		   edo.VANEDO as netodoc, edo.VAIVDO as ivadoc, edo.VABRDO as brutodoc, edo.IDMAEEDO as id
    from MAEDDO AS DDO with (nolock)
	inner join MAEEDO as edo with (nolock) on DDO.IDMAEEDO = edo.IDMAEEDO
	left join TABFU as FU with (nolock) ON FU.KOFU=DDO.KOFULIDO
    where DDO.IDMAEEDO = @id
      order by DDO.IDMAEDDO
END;
go
 

