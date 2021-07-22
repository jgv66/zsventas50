
-- exec ksp_buscarAlCliente '76392511','';
IF OBJECT_ID('ksp_buscarAlCliente', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_buscarAlCliente;  
GO  
CREATE PROCEDURE ksp_buscarAlCliente (
    @codcliente	varchar(13) = '', 
    @suc_client varchar(10) = '' ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON;

    select EN.KOEN as codigo,EN.SUEN AS sucursal, EN.NOKOEN as razonsocial,EN.DIEN as direccion,
           EN.KOFUEN as vendedor, PP.KOLT as listaprecios,PP.KOLT as listaprecio,
           FU.NOKOFU as nombrevendedor, FU.EMAIL as emailvend, FU.FOFU as telefonovend,
		   PP.NOKOLT as nombrelista,
           CI.NOKOCI as ciudad, CM.NOKOCM as comuna, EN.EMAILCOMER as email, EN.FOEN as telefonos,
           ( case when EN.TIPOSUC='S' then 'suc' else '' end ) as tiposuc 
    FROM MAEEN AS EN WITH (NOLOCK) 
    left join TABFU as FU with (nolock) on FU.KOFU=EN.KOFUEN 
    left join TABPP as PP with (nolock) on 'TABPP'+PP.KOLT=EN.LVEN 
    left join TABCI as CI with (nolock) on CI.KOPA=EN.PAEN AND CI.KOCI=EN.CIEN 
    left join TABCM as CM with (nolock) on CM.KOPA=EN.PAEN AND CM.KOCI=EN.CIEN AND CM.KOCM=EN.CMEN 
	where EN.KOEN=@codcliente
	  and EN.SUEN=@suc_client
     
END
GO
