-- exec ksp_Familias 
IF OBJECT_ID('ksp_Familias', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_Familias;  
GO  
CREATE PROCEDURE ksp_Familias With Encryption
AS
BEGIN
    SET NOCOUNT ON
 
    select  F.KOFM as cod ,F.NOKOFM as descrip
    from TABFM as F  with (nolock) 
    ORDER BY F.NOKOFM

END
