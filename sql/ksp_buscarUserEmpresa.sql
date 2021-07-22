
-- ultima act: 25/07/2018
-- exec ksp_buscarUserEmpresa '76392511','jfaundez@zsmotor.cl','11111','ktp.cli' ;
IF OBJECT_ID('ksp_buscarUserEmpresa', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_buscarUserEmpresa;  
GO  
CREATE PROCEDURE ksp_buscarUserEmpresa (
    @rutempresa   varchar(20)  = '', 
    @emailpersona varchar(80)  = '', 
    @clave        varchar(100) = '',
	@sistema      varchar(20)  = '' ) With Encryption
AS
BEGIN

	declare @usuario		char(3)		;
	declare @listacli		char(8)		;
	declare @suc_cliente	varchar(10) ;
	declare @email			varchar(80)	;
	declare @rut			varchar(20)	;

    SET NOCOUNT ON
 
	-- el usuario encontrado debe estar autorizado para realizar compras 
	select @usuario = EN.KOFUEN, 
	       @listacli = EN.LVEN,
		   @suc_cliente = EN.SUEN
	from MAEEN          as EN  with (nolock) 
	inner join MAEENCON as CON with (nolock) on CON.KOEN=EN.KOEN
	where EN.KOEN=@rutempresa
		and EN.TIPOSUC='P'
		and CON.EMAILCON=@emailpersona
		and CON.RUTCONTACT=@clave
		and CON.AUTORIZADO=1 ;

	if @usuario IS NOT NULL
	begin

		select @email = FU.EMAIL, 
		       @rut = FU.RTFU 
		from TABFU as FU with (nolock)
		WHERE FU.KOFU=@usuario ;

		if @email is not null 
		begin 
			set @rut = substring(@rut,1,5);
			--exec ksp_buscarUsuario @email,@rut,'sistema';
			select  '01' as empresa, C.MODALIDAD as modalidad, F.KOFU as codigo, 
			        @rutempresa as rutempresa, @emailpersona as emailpersona, F.NOKOFU as nombre,
			        BO.KOSU AS sucursal,BO.KOBO AS bodega, 
					RIGHT(C.ELISTAVEN,3) as listamodalidad, right(@listacli,3) as listacliente,
					@rutempresa as cliente, @suc_cliente as suc_cliente,
					cast(0 as bit) as puedevercosto, 
					cast(0 as bit) as puedeverprov,
					cast(0 as bit) as puedemoddesc,
					cast(0 as bit) as krpt
			from TABFU         as F  with (nolock) 
			left join CONFIEST as C  with (nolock) on C.MODALIDAD=F.MODALIDAD
			left join CONFIGP  AS CO with (nolock) on CO.EMPRESA =C.EMPRESA
			left join TABBO    as BO with (nolock) on BO.KOBO=C.EBODEGA
			left join TABSU    AS SU with (nolock) on SU.KOSU=C.ESUCURSAL
			left join TABPP    AS LI with (nolock) on LI.KOLT=RIGHT(C.ELISTAVEN,3)
			where upper(F.EMAIL)=upper(@email) 
			 and LEFT(F.RTFU,5)=@rut 
			 and F.INACTIVO<>1 
			 and coalesce(C.EMPRESA,'01')='01' ;

		end

	end

end
go


