
-- exec ksp_traeUltimosDocs 'NVV','14726400', '01' 
IF OBJECT_ID('ksp_traeUltimosDocs', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_traeUltimosDocs;  
GO  
CREATE PROCEDURE ksp_traeUltimosDocs (
    @td char(3),
	@cliente char(13),
	@empresa char(2) ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
 
    select	top 20
			edo.IDMAEEDO as id
			,edo.TIDO as td, edo.NUDO as numero
			,convert( nvarchar(10),edo.FEEMDO,103) as emision
			,edo.VABRDO as monto
			,edo.VABRDO-edo.VAABDO as saldo
			,edo.KOFUDO as vendedor
			,fu.NOKOFU as nombrevendedor
			,cast((case when edo.ESDO = 'C' then 'Cerrada' 
						when edo.ESDO = 'N' then 'Nula' 
						when edo.ESDO = ' ' then 'Pendiente'
						else '???' 
					end) as varchar(10)) as estado
    from MAEEDO AS edo with (nolock)
	left join TABFU as fu with (nolock) ON fu.KOFU=edo.KOFUDO
    where edo.EMPRESA = @empresa
	  and edo.ENDO = @cliente
	  and edo.TIDO = @td
    order by edo.FEEMDO desc
END

 