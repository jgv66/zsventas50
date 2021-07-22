
-- exec ksp_BodegaMias 'JFF','01' ; 
IF OBJECT_ID('ksp_BodegaMias', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_BodegaMias;  
GO  
CREATE PROCEDURE ksp_BodegaMias (
    @usuario char(3),
	@empresa char(2) ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
 
    select	bo.KOBO as bodega
			,bo.NOKOBO as nombrebodega
			,bo.KOSU as sucursal
			,su.NOKOSU as nombresucursal
    from TABBO AS bo with (nolock)
	left join TABSU as su with (nolock) on su.KOSU = bo.KOSU
    where exists ( select * 
				   from MAEUS with (nolock)
				   where KOUS = @usuario
				     and KOOP like 'BO-'+bo.KOBO+'%'
					 and bo.EMPRESA=@empresa )
END

