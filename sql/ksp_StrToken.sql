--declare @ss varchar(100);
--exec ksp_StrToken 'papa;mama;hijo;',3,';',@salida = @ss output;
--print @ss
 
IF OBJECT_ID('ksp_StrToken', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_StrToken;  
GO  
create procedure ksp_StrToken ( 
        @cadena  varchar(2500), 
        @pos     int, 
        @token   varchar(10),
        @salida  varchar(2500) OUTPUT ) --With Encryption
AS 
BEGIN
    set NOCOUNT ON
 
    declare @i      int, @j int, @k int, @largo int;
    declare @xpos   int;
    declare @car    char(1);
    declare @dev    varchar(2500);
 
    set @cadena = RTRIM( @cadena );
    set @largo  = LEN( @cadena );
    set @i      = 0;
    set @j      = 1;
    set @k      = 0;
 
    set @dev    = '';
    set @xpos   = 0
 
    WHILE ( @i <= @largo )
    BEGIN
        --
        set @i      = @i + 1;
        set @car    = substring( @cadena, @i, 1 );
        set @k      = @k + 1;
 
        --
        if @car = @token        -- encontró un token
        begin
            set @xpos += 1;     
            if @xpos = @pos     -- posicion encontrada es la buscada?
                begin
                    if @k > 1
                        set @dev = substring( @cadena, @j, @k-1 );      
                    else
                        set @dev = '';      
                    --
                    set @salida = @dev;
                    set @i = @largo+1; -- ya se encontró, salir !!
                end
            else
                begin
                    set @k  = 0;
                    set @j  = @i+1;
                end
        end
     END
     select @salida = @dev;
     RETURN
END 
GO