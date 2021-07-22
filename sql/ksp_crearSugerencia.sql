/* 
exec ksp_guardarSugerencias '001','JFF','muy cochina la presentacion'                                ,'LAS','RM ','jogv66@gmail.com','962773834' ; 
exec ksp_crearSugerencia    '1CM','JFF','siempre con quiebres de stock, favor mejorar esta situacion','NE18555150008',
							'0',true,false,false,true,false,false,false,true,false,undefined 

*/
IF OBJECT_ID('ksp_crearSugerencia', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_crearSugerencia;  
GO  
CREATE PROCEDURE ksp_crearSugerencia (
    @sucursal		 char(3), 
    @usuario		 char(3), 
    @observac		 varchar(300), 
    @codprod		 char(13), 
    @cantidad		 decimal(18, 2), 
	@prodbueno	     bit,
	@prodregular     bit,
	@prodmalo		 bit,
	@preciomuybarato bit,
	@preciocorrecto  bit,
	@preciomuycaro   bit,
	@prodconstock    bit,
	@prodstockirreg  bit,
	@prodconquiebre  bit ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
	--
	declare @Error		nvarchar(250),
			@ErrMsg		nvarchar(2048);
	--
	begin try
		-- intentamos insertarlo
		insert into ktp_sugerencias (sucursal,estado,usuario,fecha,observaciones,codigoproducto,cantidad,
									 prodbueno,prodregular,prodmalo,preciomuybarato,preciocorrecto,preciomuycaro,prodconstock,prodstockirreg,prodconquiebre )
							values ( @sucursal,'',@usuario,getdate(),@observac,@codprod,@cantidad,
									 @prodbueno,@prodregular,@prodmalo,@preciomuybarato,@preciocorrecto,@preciomuycaro,@prodconstock,@prodstockirreg,@prodconquiebre);
		if (@Error <> 0) begin 
			set @Error = @@ERROR;
			set @ErrMsg = ERROR_MESSAGE();
			THROW @Error, @ErrMsg, 0 ;  
		end
		-- avisamos la creacion 
		select cast(1 as bit) resultado, cast(0 as bit) error, 'Sugerencia creada exitosamente' as mensaje ;
		--
	end try 
	--
	begin catch
		select cast(0 as bit) resultado, cast(1 as bit) error, @ErrMsg as mensaje ;
	end catch
	--
END; 
GO


