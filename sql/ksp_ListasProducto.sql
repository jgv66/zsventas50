-- exec ksp_ListasProducto 'NE16560140005','ZOP','01';
IF OBJECT_ID('ksp_ListasProducto', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_ListasProducto;  
GO  
CREATE PROCEDURE ksp_ListasProducto (
    @codigo  varchar(100), 
    @usuario varchar(50) ,
    @empresa varchar(2)  ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
 
    declare @xcodigo    varchar(100);
    declare @xusuario   varchar(50);
    declare @xempresa   varchar(2);

    set @xcodigo    = RTRIM(@codigo);
    set @xusuario   = RTRIM(@usuario);
    set @xempresa   = RTRIM(@empresa);

	select L.PP01UD as precio1,round((L.PP01UD-(L.PP01UD*L.DTMA01UD/100)),0) as preciomayor1,L.DTMA01UD as descuentomax1, round(L.PP01UD*L.DTMA01UD/100,0) as dsctovalor1,
		   L.PP02UD as precio2,round((L.PP02UD-(L.PP02UD*L.DTMA02UD/100)),0) as preciomayor2,L.DTMA02UD as descuentomax2, round(L.PP02UD*L.DTMA02UD/100,0) as dsctovalor2,
		   (case when TL.MELT='N' then 'Neto ' else 'Bruto' end) as tipolista,
		   TL.MELT as metodolista,TL.KOLT as listaprecio,TL.MOLT as monedalista
    FROM TABPRE        AS L  WITH (NOLOCK)  
    inner join TABPP   AS TL with (nolock) ON L.KOLT=TL.KOLT 
	inner join MAEPREM as PR with (nolock) ON L.KOPR=PR.KOPR and PR.EMPRESA=@xempresa
    WHERE L.KOPR=@xcodigo  
      AND PR.EMPRESA=@xempresa
	  AND L.PP01UD<>0
      AND EXISTS ( SELECT * FROM MAEUS WITH (nolock) WHERE MAEUS.KOOP='LI-'+TL.KOLT+'00' AND MAEUS.KOUS=@xusuario )
    ORDER BY L.KOLT 
END
GO
