
-- exec ksp_BuscarNvv '12085', '01' 
IF OBJECT_ID('ksp_BuscarNvv', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_BuscarNvv;  
GO  
CREATE PROCEDURE ksp_BuscarNvv (
    @numero  varchar(10),
	@empresa char(2) ) With Encryption
AS
BEGIN
	--
    SET NOCOUNT ON
	--
    select	top 20
			edo.IDMAEEDO as id
			,edo.TIDO as td, edo.NUDO as numero
			,rtrim(en.NOKOEN) as cliente
			,convert( nvarchar(10),edo.FEEMDO,103) as emision
			,dbo.kfn_LaHora(edo.HORAGRAB) as lahora
			,edo.VABRDO as monto
			,edo.KOFUDO as vendedor
			,fu.NOKOFU as nombrevendedor
			,cast((case when edo.ESDO = 'C' then 'Cerrada' 
						when edo.ESDO = 'N' then 'Nula' 
						when edo.ESDO = ' ' then 'Pendiente'
						else '???' 
					end) as varchar(10)) as estado
			,( select COUNT(*) from ktb_documentos_attach as att with (nolock) where att.idmaeedo = edo.IDMAEEDO and estado = 0 ) as attached
    from MAEEDO AS edo with (nolock)
	left join TABFU as fu with (nolock) ON fu.KOFU=edo.KOFUDO
	left join MAEEN as en with (nolock) ON en.KOEN = edo.ENDO and en.SUEN = edo.SUENDO
    where edo.EMPRESA = @empresa
	  and edo.TIDO = 'NVV'
	  and edo.NUDO LIKE '%'+ @numero + '%'
    order by edo.FEEMDO desc
END

 