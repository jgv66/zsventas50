
-- exec ksp_EnImportaciones 'NE21570160012','01' ;
-- exec ksp_EnImportaciones 'NE20555160010','01' ;
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
      AND FCC.FEEMLI>=dateadd(dd,-120,GETDATE())
	order by FCC.FEEMLI desc;
END
go
