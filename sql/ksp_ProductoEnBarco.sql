
-- exec ksp_ProductoEnBarco 'NE17570130014','01';
IF OBJECT_ID('ksp_ProductoEnBarco', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_ProductoEnBarco;  
GO  
CREATE PROCEDURE ksp_ProductoEnBarco ( 
       @codproducto char(13) = '', 
	   @empresa     char(2)  = '01' ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON

	-- solo para existencia
	SELECT FCC.KOPRCT as codigo
	FROM MAEDDO AS FCC  (NOLOCK)
	LEFT JOIN MAEDDO AS GRC (NOLOCK) ON FCC.IDMAEDDO=GRC.IDRST AND GRC.ARCHIRST='MAEDDO'
	LEFT JOIN MAEDDO AS OCC (NOLOCK) ON FCC.IDRST=OCC.IDMAEDDO AND FCC.ARCHIRST='MAEDDO'
	INNER JOIN MAEEN (NOLOCK) ON FCC.ENDO=MAEEN.KOEN AND FCC.SUENDO=MAEEN.SUEN
	WHERE FCC.KOPRCT=@codproducto
	  AND FCC.EMPRESA=@empresa
	  AND FCC.TIDO='FCC' 
	  AND GRC.TIDO IS NULL 
	  AND OCC.TIDO IS NOT NULL 
	  AND ( MAEEN.PAEN <>'CHI' OR FCC.ENDO = '77072570EX' )
      AND FCC.FEEMLI>=dateadd(dd,-120,GETDATE());
END
go

-- exec ksp_ProductoEnBarcoConInfo 'NE17570130014','01';
IF OBJECT_ID('ksp_ProductoEnBarcoConInfo', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_ProductoEnBarcoConInfo;  
GO  
CREATE PROCEDURE ksp_ProductoEnBarcoConInfo ( 
       @codproducto char(13) = '', 
	   @empresa     char(2)  = '01' ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON

	-- detallado
	SELECT FCC.TIDO as tipo,FCC.NUDO as numero,FCC.ENDO as proveedor,
           FCC.KOPRCT as codigo,FCC.NOKOPR as descripcion,
	       convert( nvarchar(10),FCC.FEERLI,103) as fechallegada,FCC.CAPRCO1 as cantidad
	FROM MAEDDO AS FCC  (NOLOCK)
	LEFT JOIN MAEDDO AS GRC (NOLOCK) ON FCC.IDMAEDDO=GRC.IDRST AND GRC.ARCHIRST='MAEDDO'
	LEFT JOIN MAEDDO AS OCC (NOLOCK) ON FCC.IDRST=OCC.IDMAEDDO AND FCC.ARCHIRST='MAEDDO'
	INNER JOIN MAEEN (NOLOCK) ON FCC.ENDO=MAEEN.KOEN AND FCC.SUENDO=MAEEN.SUEN
	WHERE FCC.KOPRCT=@codproducto
	  AND FCC.EMPRESA=@empresa
	  AND FCC.TIDO='FCC' 
	  AND GRC.TIDO IS NULL 
	  AND OCC.TIDO IS NOT NULL 
	  AND ( MAEEN.PAEN <>'CHI' OR FCC.ENDO = '77072570EX' )
      AND FCC.FEEMLI>=dateadd(dd,-300,GETDATE());
END
go
