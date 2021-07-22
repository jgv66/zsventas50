IF OBJECT_ID('ksp_TipoGoogle', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_TipoGoogle;  
GO  
 
create procedure ksp_TipoGoogle ( 
        @campo   varchar(20),   
        @cdescri varchar(2500), 
        @salida varchar(2500) OUTPUT ) With Encryption
AS 
BEGIN
    declare @ctoken     varchar(2500);
    declare @cdev       varchar(2500);
    declare @ccadena    varchar(2500);
    declare @n          int;
 
    set @campo      = LTRIM(RTRIM( @campo ));
    set @cdescri    = LTRIM(RTRIM( @cdescri ));
 
    set @ccadena    = @cdescri;
    set @n          = 1;
    set @cdev       = '';
 
    exec ksp_StrToken @ccadena,@n,' ',@salida = @ctoken output;
 
    WHILE @ctoken <> '' 
    BEGIN
        --
        if @n = 1
            set @cdev = @cdev + ' ';
        else
            set @cdev = @cdev + ' AND ';
        --   
        set @cdev += CONCAT( @campo,' LIKE ',char(39),'%', RTRIM(@ctoken), '%', char(39), ' ');
        set @n = @n + 1;
        exec ksp_StrToken @ccadena,@n,' ',@salida = @ctoken output;
     END
     select @salida = @cdev;
     RETURN
END 
go
 
