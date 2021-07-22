/* 
select * from MAEEN where KOEN = '*cliente-web*'
exec ksp_crearClientes '9484178-K','julio gonzalez','pehuen 7224, depto 101','LAS','RM ','jogv66@gmail.com','962773834' ; 
*/
IF OBJECT_ID('ksp_crearClientes', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_crearClientes;  
GO  
CREATE PROCEDURE ksp_crearClientes (
    @rut varchar(20), 
    @nombre varchar(50), 
    @direccion varchar(50), 
    @codcomuna varchar(4), 
    @codciudad varchar(4), 
    @email varchar(50) = '', 
	@nrocelu varchar(20) = '', 
	@giro varchar(100) = '' ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
	--
	declare @Error		nvarchar(250),
			@ErrMsg		nvarchar(2048);
	declare @codigo		varchar(20),
			@rut8		char(13),
			@pos		int; 
	--
	begin try
		set @codigo = replace(ltrim(rtrim( @rut )),'.' ,'');
		--
		SELECT @pos = charindex('-', @codigo ); 
		if ( @pos <= 0 ) begin
			set @Error = '50410';
			set @ErrMsg = 'Error: rut no esta bien escrito falta guión y dígito verificador';
			THROW @Error, @ErrMsg, 0 ;  
		end
		--
		set @codigo = substring( @rut, 1, @pos-1 );
		set @rut8	= right( '00000000' + @codigo, 8 );
		if exists ( select * from MAEEN with (nolock) where ( KOEN = @codigo and TIPOSUC = 'P' ) or RTEN = @rut8 ) begin
			set @Error = '50420';
			set @ErrMsg = 'Error: rut de cliente ( '+@rut+' ) ya existe en la base de clientes';
			THROW @Error, @ErrMsg, 0 ;  
		end
		-- 
		if not exists ( select * from MAEEN with (nolock) where KOEN = 'CLIENTEAPP' ) begin
			set @Error = '50400';
			set @ErrMsg = 'Error: no existe *cliente-web* para creación de clientes on-line';
			THROW @Error, @ErrMsg, 0 ;  
		end
		-- buscar la entidad modelo
		select * into #pasoen from MAEEN with (nolock) where KOEN = 'CLIENTEAPP';
		if (@Error <> 0) begin 
			set @Error = @@ERROR;
			set @ErrMsg = ERROR_MESSAGE();
			THROW @Error, @ErrMsg, 0 ;  
		end
		-- poner los nuevos datos en la tabla de paso
		update #pasoen set KOEN = left(rtrim(@codigo),13)
						   ,NOKOEN = left(rtrim(@nombre),50)
						   ,NOKOENAMP = left(rtrim(@nombre),100)
						   ,RTEN = rtrim(@rut8)
						   ,GIEN = left(rtrim(@giro),100)
						   ,SUEN = ''
						   ,TIPOSUC = 'P'
						   ,TIPOEN = 'C'
						   ,DIEN = left(rtrim(@direccion),50)
						   ,CMEN = left(@codcomuna,3)
						   ,CIEN = left(@codciudad,3)
						   ,EMAIL = left(@email,50)
						   ,EMAILCOMER = left(@email,50)
						   ,FOEN = left(@nrocelu,20) ;
		if (@Error <> 0) begin 
			set @Error = @@ERROR;
			set @ErrMsg = ERROR_MESSAGE();
			THROW @Error, @ErrMsg, 0 ;  
		end
		-- intentamos insertarlo
		insert into MAEEN select * from #pasoen;
		if (@Error <> 0) begin 
			set @Error = @@ERROR;
			set @ErrMsg = ERROR_MESSAGE();
			THROW @Error, @ErrMsg, 0 ;  
		end
		-- avisamos la creacion 
		select cast(1 as bit) resultado, cast(0 as bit) error, 'Cliente creado exitosamente' as mensaje ;
		--
		drop table #pasoen;
		--
	end try 
	--
	begin catch
		select cast(0 as bit) resultado, cast(1 as bit) error, @ErrMsg as mensaje ;
	end catch
	--
END; 
GO


