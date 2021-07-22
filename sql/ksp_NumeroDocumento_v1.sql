/*
declare @nro char(10) = 'ksp_NumeroDocumento_v1';
exec ksp_NumeroDocumento_v1 '01','BODEG','GTI', @nro output ;
print @nro
*/

IF OBJECT_ID('ksp_NumeroDocumento_v1', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_NumeroDocumento_v1;  
GO  
CREATE PROCEDURE ksp_NumeroDocumento_v1 ( 
       @empresa		char(2) = '01', 
	   @modalidad	char(5) = '',
	   @tipodoc		char(3),
	   @numero		char(10) output ) With Encryption
AS
BEGIN
 
	declare @campo		char(3),
			@campolsr	varchar(10),
			@ndev		char(10),
			@ndev2		bit,
			@xelmodo    char(5),
			@maxnudo	char(10),
			@query      NVARCHAR(2500);		

	set @xelmodo	= @modalidad
	set @campo		= UPPER(@tipodoc) ;
	set @campolsr	= UPPER(@tipodoc)+'LSR' ;

	SET NOCOUNT ON
	--
	set @query = 'select @ndev = '+@campo+' from CONFIEST where EMPRESA = '+char(39)+@empresa+char(39)+' and MODALIDAD = '+char(39)+@xelmodo+char(39)+' ;';
	EXECUTE sp_executesql @query,N' @ndev char(10) output ',@ndev output;
	-- si esta vacio debe tomar valor de configuracion central
	if (coalesce(@ndev,'') = '' )
	begin
		set @xelmodo = char(5)+' '+char(5)+' '+char(5);
		--
		if exists ( select * from CONFIEST with (nolock) where EMPRESA = @empresa and MODALIDAD = @xelmodo ) begin
			set @query = 'select @ndev = '+@campo+' from CONFIEST where EMPRESA = '+char(39)+@empresa+char(39)+' and MODALIDAD = '+char(39)+@xelmodo+char(39)+' ;';
			EXECUTE sp_executesql @query,N' @ndev char(10) output ',@ndev output;
			--
			set @numero = @ndev ;
			--
		end
		else begin
			-- no se encontro numero en confiest
			set @numero = '0000000000' ;
		end
	end
	else
	-- de lo contrario se revisa la configuracion de estacion correspondiente
	begin
		/* devuelva el maximo numero para el documento */
		if ( @ndev = '0000000000' )
		begin 
			if ( @campo in ('GDV','GDD','GDP','GTI') ) begin
                select @maxnudo = coalesce( max(NUDO),'0000000000')
				from MAEEDO with (nolock)
                where TIDO IN ('GDV','GDD','GDP','GTI')
				  and EMPRESA = @empresa
			end
			else begin
                select @maxnudo = coalesce( max(NUDO),'0000000000')
				from MAEEDO with (nolock)
                where TIDO=@campo
				  and EMPRESA = @empresa
			end
            --
			exec ksp_valsgtecar @maxnudo, @numero output ;
			--
			-- existen pendientes con numeros mayores o iguales?
			if ( @campo = 'NVV' or @campo = 'OCC' ) and exists ( select * from KASIEDO with (nolock) where EMPRESA=@empresa and TIDO=@campo and LIBRO=@numero ) begin
                select @maxnudo = coalesce( max(LIBRO),'0000000000')
				from KASIEDO with (nolock)
                where TIDO=@campo
				  and EMPRESA = @empresa ;
                --
				exec ksp_valsgtecar @maxnudo, @numero output ;
				--
			end
		end
		else begin -- el numero que esta es el que deberia servir
            --
			set @numero = @ndev;
			--
		end
		-- verificar si existe... pero devuelvo el mismo ... y el grabador lo desecha
		if exists ( select * from MAEEDO with (nolock) where EMPRESA=@empresa and TIDO=@campo and NUDO=@numero ) begin
			-- nada pasa
			set @numero = @numero ;	
		end
   	end

END

