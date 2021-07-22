IF OBJECT_ID('ksp_cambiatodo', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_cambiatodo;  
GO  
create procedure ksp_cambiatodo ( 
       @dato varchar(2500), 
       @salida varchar(2500) OUTPUT ) With Encryption
AS 
BEGIN
    declare @i      int;
    declare @largo  int;
    declare @car    char(1);
    declare @dev    varchar(2500);
 
    set @dato   = RTRIM( @dato );
    set @largo  = LEN( @dato );
    set @i      = 1;
    set @dev    ='';
 
    WHILE ( @i <= @largo )
    BEGIN
        set @car = substring( @dato, @i, 1 );
        if @car = ' ' OR @car = '%' OR ( @car >= '0' AND @car <= '9' )
            set @dev += @car;
        else
            set @dev += '['+UPPER(@car)+LOWER(@car)+']';
        set @i += 1;
     END
     select @salida = @dev;
     RETURN
END 
go