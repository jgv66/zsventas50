
/*
declare @rut char(10);
select dbo.kfn_digitoVerificador( '14173298' )  ;

*/

use SQMC_R2S
go
IF OBJECT_ID (N'dbo.kfn_digitoVerificador', N'FN') IS NOT NULL  
    DROP FUNCTION dbo.kfn_digitoVerificador;  
GO  
CREATE FUNCTION dbo.kfn_digitoVerificador(	@rut INTEGER )  
RETURNS VARCHAR(1) With Encryption
AS
BEGIN

 DECLARE @dv VARCHAR(1)
 DECLARE @rutAux INTEGER
 DECLARE @Digito INTEGER
 DECLARE @Contador INTEGER
 DECLARE @Multiplo INTEGER
 DECLARE @Acumulador INTEGER

 SET @Contador = 2;
 SET @Acumulador = 0;
 SET @Multiplo = 0;

	WHILE(@rut!=0)
		BEGIN

			SET @Multiplo = (@rut % 10) * @Contador;
			SET @Acumulador = @Acumulador + @Multiplo;
			SET @rut = @rut / 10;
			SET @Contador = @Contador + 1;
			if(@Contador = 8)
			BEGIN
				SET @Contador = 2;
			End;
		END;

	SET @Digito = 11 - (@Acumulador % 11);

	SET @dv = LTRIM(RTRIM(CONVERT(VARCHAR(2),@Digito)));

	IF(@Digito = 10)
	BEGIN
		SET @dv = 'K';
	END;

	IF(@Digito = 11)
	BEGIN
		SET @dv = '0';
	END;

RETURN @dv
END;
GO
