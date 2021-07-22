-- exec ksp_traeLosDocDelVendedor 'AGL','01','2021-01-01T00:00:00.000Z','2021-06-01T00:00:00.000Z','NVV' ;
-- exec ksp_traeLosDocDelVendedor 'ZSS','01','2021-05-01T16:36:08.231Z', '2021-05-30T16:36:08.231Z', 'NVV';
IF OBJECT_ID('ksp_traeLosDocDelVendedor', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_traeLosDocDelVendedor;  
GO
-- 
CREATE PROCEDURE ksp_traeLosDocDelVendedor (
    @vendedor varchar(3), 
    @empresa  char(2), 
    @fechaDesde varchar(10), 
    @fechaHasta varchar(10),
	@documento  char(3) ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
	--
	declare @Error		nvarchar(250),
			@ErrMsg		nvarchar(2048);
	--
	with documentos 
	as (select distinct edo.IDMAEEDO as id
		from MAEEDO as edo with (nolock)
		inner join MAEDDO as ddo with (nolock) on edo.IDMAEEDO=ddo.IDMAEEDO
		where edo.EMPRESA= @empresa
			and edo.TIDO = ( case when @documento = 'NVP' then 'NVV' else @documento end )
			and cast(edo.FEEMDO as date) between cast(@fechaDesde as date) and cast(@fechaHasta as date)
			and edo.ESDO = ( case when @documento = 'NVP' then '' when @documento = 'COV' then edo.ESDO else 'C' end )
			and ddo.KOFULIDO = @vendedor )
	select	edo.IDMAEEDO as id
			,edo.TIDO as td, edo.NUDO as numero
			,convert(varchaR(10), edo.FEEMDO, 103 ) as emision
			,dbo.kfn_LaHora(edo.HORAGRAB) as lahora
			,(case when edo.ESDO='' then 'Pendiente' else 'Cerrada' end) as estado
			,rtrim(en.NOKOEN) as nombrecliente
			,edo.VABRDO as bruto,edo.VANEDO as neto
			,(select sum(ddo.VABRLI) 
				from MAEDDO as ddo with (nolock)
				where ddo.IDMAEEDO = edo.IDMAEEDO
				and ddo.KOFULIDO=@vendedor
				and ddo.LILG in ('SI','CR') ) as mibruto
			,(select sum(ddo.VANELI) 
				from MAEDDO as ddo with (nolock)
				where ddo.IDMAEEDO = edo.IDMAEEDO
				and ddo.KOFULIDO=@vendedor
				and ddo.LILG in ('SI','CR') ) as mineto
	from MAEEDO as edo with (nolock)
	inner join documentos as doc on edo.IDMAEEDO=doc.id
	left join MAEEN as en with (nolock) on en.KOEN = edo. ENDO and en.SUEN = edo.SUENDO
	order by emision desc ;
	--
END;
go
