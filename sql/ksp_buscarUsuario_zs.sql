-- exec ksp_buscarUsuario 'jfaundez@zsmotor.cl','18541','01' ;

-- insert into MAEOP (KOOP,NOKOOP) values ('RMKRPT10','KReportS v1.0')
-- insert into MAEOP (KOOP,NOKOOP) values ('RMCONC10','KConcesionarios v1.0')
-- 01-07-23018: se incorporo el sistema para validador
-- exec ksp_buscarUsuario 'jfaundez@zsmotor.cl','18541','01' ;

IF OBJECT_ID('ksp_buscarUsuario', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_buscarUsuario;  
GO  
CREATE PROCEDURE ksp_buscarUsuario (
    @email		varchar(100) = '', 
    @rut        varchar(50)  = '',
	@empresa    char(2) ) With Encryption
AS
BEGIN
    SET NOCOUNT ON
 
    declare @kodigo varchar(100);
    declare @xrut   varchar(2500);
 
    set @xrut   = RTRIM(@rut) ;
    set @kodigo = RTRIM(@email);
 
    select  F.KOFU as usuario
			,F.KOFU,F.NOKOFU as nombre,F.NOKOFU
			,F.MODALIDAD as modalidad,F.MODALIDAD
			,F.EMAIL as email,F.EMAIL
			,BO.KOSU AS sucursal,BO.KOSU
			,BO.KOBO AS bodega, BO.KOBO, BO.KOBO as BODEGA
			,RIGHT(C.ELISTAVEN,3) as listamodalidad,RIGHT(C.ELISTAVEN,3) as LISTAMODALIDAD,RIGHT(C.ELISTAVEN,3) as LISTACLIENTE 
            ,C.EMPRESA as empresa
			, C.EMPRESA
			, CO.RAZON AS razonsocial
			, SU.NOKOSU as nombresuc
			, BO.NOKOBO as nombrebod
			, LI.NOKOLT as nombrelista, 
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='UT000050'),0) as bit) as puedevercosto, 
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='UTM00051'),0) as bit) as puedeverprov,
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='TO000005'),0) as bit) as puedemoddesc,
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='TO000005'),0) as bit) as puedemodifdscto,
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='RMKRPT10'),0) as bit) as krpt,
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='RMCONC10'),0) as bit) as kconcecionario,
            cast(coalesce((select 1 from MAEUS where MAEUS.KOUS=F.KOFU and MAEUS.KOOP='PG000012'),0) as bit) as puedecrearcli
    from TABFU         as F  with (nolock) 
    left join CONFIEST as C  with (nolock) on C.MODALIDAD=F.MODALIDAD
    left join CONFIGP  AS CO with (nolock) on CO.EMPRESA =C.EMPRESA
    left join TABBO    as BO with (nolock) on BO.KOBO=C.EBODEGA
    left join TABSU    AS SU with (nolock) on SU.KOSU=C.ESUCURSAL
    left join TABPP    AS LI with (nolock) on LI.KOLT=RIGHT(C.ELISTAVEN,3)
    where upper(F.EMAIL)=upper(@kodigo) 
     and left(rtrim(F.RTFU),5)=left(rtrim(@xrut),5)
     and F.INACTIVO<>1 
     and C.EMPRESA=@empresa ;
END
                                                             

