IF OBJECT_ID (N'dbo.kfn_EnImportaciones', N'FN') IS NOT NULL  
    DROP FUNCTION kfn_EnImportaciones;  
GO  
CREATE FUNCTION dbo.kfn_EnImportaciones(@codproducto char(13), @empresa char(2) )  
RETURNS int   
AS   
BEGIN  
    declare @ret int;  
	-- solo para existencia
	SELECT @ret = sum(OCC.CAPRCO1)
	FROM MAEDDO AS FCC  (NOLOCK)
	LEFT  JOIN MAEDDO AS GRC with (nolock) ON GRC.IDRST=FCC.IDMAEDDO AND GRC.ARCHIRST='MAEDDO' AND GRC.TIDO='GRC'
	LEFT  JOIN MAEDDO AS OCC with (nolock) ON OCC.IDMAEDDO=FCC.IDRST AND FCC.ARCHIRST='MAEDDO' AND OCC.TIDO='OCC'
	INNER JOIN MAEEN  AS EN  with (nolock) ON EN.KOEN=FCC.ENDO       AND FCC.SUENDO=EN.SUEN
	WHERE FCC.KOPRCT=@codproducto
	  AND FCC.TIDO='FCC' 
      AND FCC.FEEMLI>=dateadd(dd,-120,GETDATE())
	  AND FCC.EMPRESA=@empresa
	  AND GRC.TIDO IS NULL 
	  AND OCC.TIDO IS NOT NULL 
	  AND ( EN.PAEN <>'CHI' OR FCC.ENDO = '77072570EX' );
    -- resultado
     IF (@ret IS NULL) set @ret = 0;
	 -- retornando el dato...  
    return @ret;  
END
go

