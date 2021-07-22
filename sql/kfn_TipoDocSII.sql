
IF OBJECT_ID (N'dbo.kfn_TipoDocSII', N'FN') IS NOT NULL  
    DROP FUNCTION dbo.kfn_TipoDocSII;  
GO  
CREATE FUNCTION dbo.kfn_TipoDocSII( @tido char(3), @subtido char(3), @electronica bit )  
RETURNS char(3)
AS   
BEGIN  
	--
    declare @ret char(3);  
	-- 
	select @ret = ( 
	         CASE 
				 when @electronica = 1 and @tido in ('FCV','FCC')				then  '33'
				 when @electronica = 1 and @tido in ('FDV','FDC')				then  '56'
				 when @electronica = 1 and @tido in ('NCV','NCC')				then  '61'
				 when @electronica = 1 and @tido in ('NCX')						then  '61'
				 when @electronica = 1 and @tido  in ('FCT','FVT')				then  '46'
				 when @electronica = 1 and @tido  in ('FVX','FCX')				then  '34'
				 when @electronica = 1 and @tido  in ('GDV','GDP','GTI','GDD')  then  '52'
				 when @electronica = 1 and @tido  = 'GRC'						then  '52' 
				 when @electronica = 1 and @tido  = 'BSV'						then  '39'
				 when @electronica = 1 and @tido  = 'BLV'						then  '39'
				 when @electronica = 1 and @tido  = 'BLX'						then  '41'
				 when @electronica = 1 and @tido  = 'DIN'						then  '914'
				 when @electronica = 1 and @tido  = 'FVL'						then  '43'
				 when @electronica = 1 and @tido  in ('FEV','FEE')				then  '110'
				 when @electronica = 1 and @tido = 'FDE'						then  '111'
				 when @electronica = 1 and @tido = 'NEV'						then  '112'
				 when @electronica = 1 and @tido = 'FDX'						then  '111'
				 when @electronica = 1 and @tido = 'FVZ'						then  '102'
				 when @electronica = 1 and @tido = 'SRF'						then  '108'
				 when @electronica = 1 and @tido = 'FCL'						then  '43'
				 when @electronica = 1 and @tido = 'FCZ'						then  '909'
				 when @electronica <> 1 and @tido	  in ('FCV','FCC')			then  '30'
				 when @electronica <> 1 and @tido	  in ('FDV','FDC')			then  '55'
				 when @electronica <> 1 and @tido	  in ('NCV','NCC')			then  '60'
				 when @electronica <> 1 and @tido	  in ('NCX')				then  '60'
				 when @electronica <> 1 and @tido	  in ('NEV')				then  '106'
				 when @electronica <> 1 and @tido	  in ('FCT','FVT')			then  '45'
				 when @electronica <> 1 and @tido	  in ('FVX','FCX')			then  '32'
				 when @electronica <> 1 and @tido	  in ('FXV')				then  '901'
				 when @electronica <> 1 and @tido	  in ('FYX','FYV')			then  '108'
				 when @electronica <> 1 and @tido	  in ('GDV')				then  '50'
				 when @electronica <> 1 and @subtido in ('TJV')					then  '48'
				 when @electronica <> 1 and @tido    in ('TJV')					then  '48'
				 when @electronica <> 1 and @tido    in ('BSV')					then  '35'
				 when @electronica <> 1 and @tido    in ('BLV')					then  '35'
				 when @electronica <> 1 and @tido    in ('BLX')					then  '38'
				 when @electronica <> 1 and @tido    in ('DIN')					then  '914'
				 when @electronica <> 1 and @tido    in ('FVL')					then  '40'
				 when @electronica <> 1 and @tido    in ('FEV','FEE')			then  '101'
				 when @electronica <> 1 and @tido    in ('FDE')					then  '104'
				 when @electronica <> 1 and @tido    in ('FDX')					then  '104'
				 when @electronica <> 1 and @tido    in ('FVZ')					then  '102'
				 when @electronica <> 1 and @tido    in ('SRF')					then  '108'
				 when @electronica <> 1 and @tido    in ('FCZ')					then  '909'
				 when @electronica <> 1 and @tido    in ('FCL')					then  '40'
				 when @tido in ('RGA')											then  'RGA'
				 when @tido in ('RIN')											then  'RIN'
				 else																  '???'
			END )
    -- resultado
     IF (@ret IS NULL) set @ret = '???';
	 -- retornando el dato...  
    return @ret;  
END;
go



