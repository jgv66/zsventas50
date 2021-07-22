-- exec ksp_BodegaProducto 'NE16560140005','ZOP','01';
IF OBJECT_ID('ksp_BodegaProducto', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_BodegaProducto;  
GO  
CREATE PROCEDURE ksp_BodegaProducto (
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
 
    select BO.KOBO AS bodega, BO.KOSU as sucursal,BO.NOKOBO as nombrebodega,
	       COALESCE(ST.STFI1,0) as stock_ud1,
		   COALESCE(ST.STFI2,0) as stock_ud2 
    from TABBO          AS BO with (nolock) 
    inner join TABBOPR  AS BP with (nolock) on BP.KOBO=BO.KOBO
    inner join MAEST    AS ST with (nolock) on ST.KOPR=BP.KOPR and ST.KOBO=BP.KOBO 
    WHERE BO.EMPRESA=@xempresa  
      AND BP.KOPR=@xcodigo
      AND EXISTS ( SELECT * FROM MAEUS WITH (nolock) WHERE MAEUS.KOOP='BO-'+BO.KOBO+'00' AND MAEUS.KOUS=@xusuario )
      AND ST.STFI1 is NOT NULL
      AND ST.STFI1>0
    order by ST.STFI1 DESC 
END

