IF OBJECT_ID (N'dbo.EnImportaciones', N'FN') IS NOT NULL  
    DROP FUNCTION EnImportaciones;  
GO  
CREATE FUNCTION dbo.EnImportaciones(@codproducto char(13), @empresa char(2) )  
RETURNS int   
AS   
BEGIN  
    declare @ret int;  
	-- solo para existencia
	SELECT @ret = count(*)
	FROM MAEDDO AS FCC  (NOLOCK)
	LEFT  JOIN MAEDDO AS GRC with (nolock) ON GRC.IDRST=FCC.IDMAEDDO AND GRC.ARCHIRST='MAEDDO'
	LEFT  JOIN MAEDDO AS OCC with (nolock) ON OCC.IDMAEDDO=FCC.IDRST AND FCC.ARCHIRST='MAEDDO'
	INNER JOIN MAEEN  AS EN  with (nolock) ON EN.KOEN=FCC.ENDO       AND FCC.SUENDO=EN.SUEN
	WHERE FCC.KOPRCT=@codproducto
	  AND FCC.EMPRESA=@empresa
	  AND FCC.TIDO='FCC' 
	  AND GRC.TIDO IS NULL 
	  AND OCC.TIDO IS NOT NULL 
	  AND ( EN.PAEN <>'CHI' OR FCC.ENDO = '77072570EX' )
      AND FCC.FEEMLI>=dateadd(dd,-120,GETDATE());

    -- resultado
     IF (@ret IS NULL) set @ret = 0;  
    return @ret;  
END
go


--declare @car char(10) = 'XXX0001111';
--exec ksp_valsgtecar @car, @car output ;
IF OBJECT_ID('ksp_EnImportaciones', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_EnImportaciones;  
GO  
CREATE PROCEDURE ksp_EnImportaciones ( 
       @codproducto	char(13),  
	   @empresa		char(2) = '01' ) With Encryption
as
begin
    SET NOCOUNT ON
	--
	SELECT OCC.CAPRCO1 as cantidad, convert( nvarchar(10),FCC.FEEMLI,103) as fecha
	FROM MAEDDO AS FCC  (NOLOCK)
	LEFT  JOIN MAEDDO AS GRC with (nolock) ON GRC.IDRST=FCC.IDMAEDDO AND GRC.ARCHIRST='MAEDDO'
	LEFT  JOIN MAEDDO AS OCC with (nolock) ON OCC.IDMAEDDO=FCC.IDRST AND FCC.ARCHIRST='MAEDDO'
	INNER JOIN MAEEN  AS EN  with (nolock) ON EN.KOEN=FCC.ENDO       AND FCC.SUENDO=EN.SUEN
	WHERE FCC.KOPRCT=@codproducto
	  AND FCC.EMPRESA=@empresa
	  AND FCC.TIDO='FCC' 
	  AND GRC.TIDO IS NULL 
	  AND OCC.TIDO IS NOT NULL 
	  AND ( EN.PAEN <>'CHI' OR FCC.ENDO = '77072570EX' )
      AND FCC.FEEMLI>=dateadd(dd,-120,GETDATE());
END
go
