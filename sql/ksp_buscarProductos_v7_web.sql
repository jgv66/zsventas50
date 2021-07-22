
-- exec ksp_buscarProductos_v7_web 'LL13008HNE001','','CLM',0,'10P',false,'','','',false,'01','ZOP',20 ;
-- exec ksp_buscarProductos_v7_web '','','CLM',0,'02P',false,'',                '','MOMO',0,    '01','ZOP',100;
IF OBJECT_ID('ksp_buscarProductos_v7_web', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_buscarProductos_v7_web;  
GO  
CREATE PROCEDURE ksp_buscarProductos_v7_web (
    @codproducto	varchar(13)   = '', 
    @descripcion	varchar(50)   = '',
    @bodega			char(3)       = '',
    @offset			int           = 0 ,   
    @listapre		char(3)       = '',
    @soloconstock	bit           = 0 ,
    @ordenar		varchar(50)   = '',
	@familias		varchar(100)  = '',
	@marcas 		varchar(100)  = '',
	@soloimport		bit           = 0 ,
	@empresa		char(2)       = '01',	
	@usuario		char(3)       = '',
	@desplazamiento int			  = 20 ) With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
 
    declare @kodigo     varchar(60);
    declare @descri     varchar(2500);
    declare @xbodega    char(3);
    declare @xlistapre  char(3);
    declare @query      NVARCHAR(3000);
    declare @xnokopr    varchar(2500) = '';
    declare @xkopr      varchar(200)  = '';
    declare @letraN     char(1)       = 'N';
    declare @neto       char(5)       = 'Neto ';
    declare @bruto      char(5)       = 'Bruto';
    declare @stock      varchar(50)   = '';
    declare @xorden     varchar(50)   = ' ORDER BY PR.KOPR ';
	declare @xempresa   char(2);
	declare @xusuario   char(3);
	declare @paginar	varchar(100) = '';	

	declare @solosuperfam   varchar(400) = '';
	declare @xmarcas		varchar(400) = '';
	declare @soloimportados varchar(500) = ''; 
	declare @campoimportado varchar(500) = '0 as importado,';

	declare @soloconprecio	varchar(500) = '';
 
    set @codproducto    = RTRIM(@codproducto);
    set @descripcion    = RTRIM(@descripcion);
    set @xbodega        = RTRIM(@bodega);
    set @xlistapre      = RTRIM(@listapre);
	set @xempresa		= RTRIM(@empresa);
	set @xusuario		= RTRIM(@usuario);
 
    if @soloimport=1 set @campoimportado = 'dbo.kfn_EnImportaciones( PR.KOPR, '+char(39)+@empresa+char(39)+' ) importado,';  

    set @query  = 'select PR.KOPR as codigo,PR.NOKOPR AS descripcion, ';
    set @query +=         'COALESCE((select SUM(COALESCE(ST.STFI1,0)) ';
    set @query +=                   'from TABBO AS BO with (nolock) ';
    set @query +=                   'inner join TABBOPR AS BP with (nolock) on BP.KOBO=BO.KOBO ';
    set @query +=                   'inner join MAEST AS ST with (nolock) on ST.KOPR=BP.KOPR and ST.KOBO=BP.KOBO ';
    set @query +=                   'WHERE BO.EMPRESA='+char(39)+@xempresa+char(39)+' AND BP.KOPR=PR.KOPR ';
    set @query +=                   ' AND EXISTS ( SELECT * FROM MAEUS WITH (nolock) WHERE MAEUS.KOOP LIKE '+char(39)+'BO-%00'+char(39)+' AND MAEUS.KOUS='+char(39)+@xusuario+char(39)+' ) ';
    set @query +=                   ' AND ST.STFI1 is NOT NULL AND ST.STFI1>0),0) as stock_total_ud1,';
    set @query +=         'COALESCE((select SUM(COALESCE(ST.STFI2,0)) ';
    set @query +=                   'from TABBO AS BO with (nolock) ';
    set @query +=                   'inner join TABBOPR AS BP with (nolock) on BP.KOBO=BO.KOBO ';
    set @query +=                   'inner join MAEST AS ST with (nolock) on ST.KOPR=BP.KOPR and ST.KOBO=BP.KOBO ';
    set @query +=                   'WHERE BO.EMPRESA='+char(39)+@xempresa+char(39)+' AND BP.KOPR=PR.KOPR ';
    set @query +=                   ' AND EXISTS ( SELECT * FROM MAEUS WITH (nolock) WHERE MAEUS.KOOP LIKE '+char(39)+'BO-%00'+char(39)+' AND MAEUS.KOUS='+char(39)+@xusuario+char(39)+' ) ';
    set @query +=                   ' AND ST.STFI2 is NOT NULL AND ST.STFI2>0),0) as stock_total_ud2,';
    set @query +=         'COALESCE(BO.STFI1,0) as stock_ud1,';
    set @query +=         'COALESCE(BO.STFI2,0) as stock_ud2,';
    set @query +=         '(case when BO.KOSU is null then 0 else 1 end) as apedir,'+@campoimportado;
    set @query +=         'BO.KOSU as sucursal,'+char(39)+@bodega+char(39)+' as bodega,null as nombrebodega,coalesce(FI.FICHA,'+char(39)+char(39)+') as ficha,';
    set @query +=         'L.PP01UD as precio,round((L.PP01UD-(L.PP01UD*L.DTMA01UD/100)),0) as preciomayor,round((L.PP01UD-(L.PP01UD*L.DTMA02UD/100)),0) as preciomayor2,0.0 as montolinea,L.DTMA01UD as descuentomax,L.DTMA02UD as descuentomax2,round(L.PP01UD*L.DTMA01UD/100,0) as dsctovalor,round(L.PP01UD*L.DTMA02UD/100,0) as dsctovalor2,';
    set @query +=         '(case when TL.MELT='+char(39)+@letraN+char(39)+' then '+char(39)+@neto+char(39)+' else '+char(39)+@bruto+char(39)+' end) as tipolista,TL.MELT as metodolista,';
	set @query +=         char(39)+@xlistapre+char(39)+' as listaprecio, PR.CLALIBPR as clasifica, ';
	set @query +=         '(case when UPPER(PR.MRPR) in (''PIRELLI'',''MOMO'',''THULE'') then UPPER(PR.MRPR) else ''ZS MOTOR'' end) as marca ';
    set @query += 'FROM MAEPR          AS PR WITH (NOLOCK) ';
    set @query += 'inner join MAEPREM  AS ME WITH (NOLOCK) on PR.KOPR=ME.KOPR and ME.EMPRESA='+char(39)+@empresa+char(39)+' ';
    set @query += 'left  join MAEST    AS BO WITH (NOLOCK) ON BO.KOBO='+char(39)+@bodega+char(39)+' AND BO.KOPR = PR.KOPR ';
    set @query += 'left  join TABPRE   AS L  with (nolock) ON L.KOLT='+char(39)+@xlistapre+char(39)+' AND L.KOPR=PR.KOPR ';
    set @query += 'left  join TABPP    AS TL with (nolock) ON L.KOLT=TL.KOLT ';
    set @query += 'left  join MAEFICHD AS FI with (nolock) ON FI.KOPR=PR.KOPR AND FI.FICHA not LIKE ''%TRATAMIENTO%'' ';
 
    if @soloconstock=1  set @stock		    = ' AND BO.STFI1 > 0 ';
    if @familias<>''    set @solosuperfam   = ' AND PR.FMPR IN ('+char(39)+ replace(@familias,',',char(39)+','+char(39)) +char(39)+') ';
    if @marcas<>''      set @xmarcas        = ' AND PR.MRPR IN ('+char(39)+ replace(@marcas,',',char(39)+','+char(39)) +char(39)+') ';
	if @soloimport=1    set @soloimportados = ' AND dbo.kfn_EnImportaciones( PR.KOPR, '+char(39)+@empresa+char(39)+' ) > 0 ';
	-- solo con precio 20/08/2018
	set @soloconprecio = ' AND COALESCE(L.PP01UD,0)<>0 ';

	set @paginar = ' OFFSET '+rtrim(cast(@offset as varchar(5)))+' ROWS FETCH NEXT '+cast(@desplazamiento as char(5))+' ROWS ONLY; ';

    if @ordenar=''                  set @xorden = ' ORDER BY PR.KOPR ';
    if @ordenar='preciomenormayor'  set @xorden = ' ORDER BY preciomayor ASC ,PR.KOPR ';
    if @ordenar='preciomayormenor'  set @xorden = ' ORDER BY preciomayor DESC,PR.KOPR ';
    if @ordenar='stockmenormayor'   set @xorden = ' ORDER BY BO.STFI1 ASC ,PR.KOPR ';
    if @ordenar='stockmayormenor'   set @xorden = ' ORDER BY BO.STFI1 DESC,PR.KOPR ';

    -- pasadas por ksp_cambiatodo
    exec ksp_cambiatodo @codproducto, @salida = @kodigo OUTPUT ;
    exec ksp_cambiatodo @descripcion, @salida = @descri OUTPUT ;
 
    set @kodigo = case when @kodigo<>'' then @kodigo else '' end;
    set @descri = case when @descri<>'' then @descri else '' end;

	if @xmarcas<>'' and  @solosuperfam='' and @descri='' and @kodigo=''  -- solo marcas
    begin
		set @xmarcas = replace( @xmarcas, ' AND ', ' ' ); 
		set @query = concat( @query, ' WHERE ', @xmarcas, @solosuperfam, @stock, @soloimportados, @soloconprecio, @xorden, @paginar ); 
   		EXECUTE sp_executesql @query
	end
	else
		if @solosuperfam<>'' and @xmarcas='' and @descri='' and @kodigo=''  -- solo superfamilia
		begin
			set @solosuperfam = replace( @solosuperfam, ' AND ', ' ' );
			set @query = concat( @query, ' WHERE ', @solosuperfam, @stock, @soloimportados, @soloconprecio, @xorden, @paginar ); 
			EXECUTE sp_executesql @query
		end
		else
		begin
			if @descri<>'' and @kodigo<>''                  -- ambos con datos
			begin
				exec ksp_TipoGoogle 'PR.KOPR',  @kodigo, @salida = @xkopr   output;
				exec ksp_TipoGoogle 'PR.NOKOPR',@descri, @salida = @xnokopr output;
				set @query = concat( @query, ' WHERE ', @xkopr, ' AND ',  @xnokopr, @stock, @solosuperfam, @soloimportados, @soloconprecio, @xorden, @paginar ); 
				EXECUTE sp_executesql @query
			end
			else
			begin
				if @descri<>'' and @kodigo=''               -- solo descripcion con datos
				begin
					exec ksp_TipoGoogle 'PR.NOKOPR',@descri, @salida = @xnokopr output;
					set @query = concat( @query, ' WHERE ', @xnokopr, @stock, @solosuperfam, @soloimportados, @soloconprecio, @xorden, @paginar ); 
					EXECUTE sp_executesql @query
				end         
			else
			begin 
				if @descri='' and @kodigo<>''               -- solo codigo con datos
				begin
					exec ksp_TipoGoogle 'PR.KOPR',@kodigo, @salida = @xkopr output;
					set @query = concat( @query, ' WHERE ', @xkopr, @stock, @solosuperfam, @soloimportados, @soloconprecio, @xorden, @paginar ); 
					EXECUTE sp_executesql @query
				end 
			end
		end 
	end
END
go
