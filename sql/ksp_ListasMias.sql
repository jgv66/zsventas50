
-- exec ksp_ListasMias 'ZOP','01';
IF OBJECT_ID('ksp_ListasMias', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_ListasMias;  
GO  
CREATE PROCEDURE ksp_ListasMias (
    @usuario varchar(50) ,
    @empresa varchar(2)  ) With Encryption
AS
BEGIN
    SET NOCOUNT ON

    declare @xusuario   varchar(50);
    declare @xempresa   varchar(2);

    set @xusuario   = RTRIM(@usuario);
    set @xempresa   = RTRIM(@empresa);

	select (case when TL.MELT='N' then 'Neto ' else 'Bruto' end) as tipolista,
		   TL.NOKOLT as nombrelista,TL.KOLT as listaprecio,TL.MOLT as monedalista
    from TABPP   AS TL with (nolock) 
    WHERE EXISTS ( SELECT * FROM MAEUS WITH (nolock) WHERE MAEUS.KOOP='LI-'+TL.KOLT+'00' AND MAEUS.KOUS=@xusuario )
    ORDER BY TL.KOLT 
END
GO

