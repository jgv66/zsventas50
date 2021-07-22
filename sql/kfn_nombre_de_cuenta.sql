
/*
declare @rut varchar(50);
select dbo.kfn_cuenta( 208789, 2 )  ;

*/

IF OBJECT_ID (N'dbo.kfn_cuenta', N'FN') IS NOT NULL  
    DROP FUNCTION dbo.kfn_cuenta;  
GO  
CREATE FUNCTION dbo.kfn_cuenta(	@id INTEGER, @caso int )  
RETURNS VARCHAR(50) With Encryption
AS
BEGIN
	--
	declare @dev	as varchar(50)	= '',
			@cuenta	as char(8)		= '',
			@sub	as char(13)		= '',
			@anno	as int			= 0,
			@id_e	as int			= 0;
	--
	select @cuenta=GRANCUE+MAYOR+CUENTA,@sub=SUBAUXI,@anno=e.PERIODO
	from [COMAGRORAMA_DEV].dbo.CCOMPRD as d with  (nolock)
	inner join [COMAGRORAMA_DEV].dbo.CCOMPRE as e with  (nolock) on e.IDCOMPRE=d.IDCOMPRE
	WHERE IDCOMPRD = @id;
	--
	if @caso = 1
		set @dev = @cuenta
	else
		if @caso = 2
			set @dev = @sub
		else
			select @dev = NOCUENTA from [COMAGRORAMA_DEV].dbo.CCUENTAS WHERE GRANCUE+MAYOR+CUENTA = @cuenta AND PERIODO=@anno ;
	--
	RETURN @dev
END;
GO
