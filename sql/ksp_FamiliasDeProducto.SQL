-- exec ksp_FamiliasDeProducto 
IF OBJECT_ID('ksp_FamiliasDeProducto', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_FamiliasDeProducto;  
GO  
CREATE PROCEDURE ksp_FamiliasDeProducto With Encryption
AS
BEGIN
    SET NOCOUNT ON
 
    select  F.KOFM,F.NOKOFM
    from TABFM as F  with (nolock) 
    ORDER BY F.KOFM

END
