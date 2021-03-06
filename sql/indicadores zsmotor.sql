-- indidcadores 

-- NCV no asignadas a ctacte
select ENDO,SUENDO,NOKOEN,sum( VABRDO-VAABDO) as SALDO 
from MAEEDO WITH (nolock)
left join MAEEN on MAEEN.KOEN=MAEEDO.ENDO AND MAEEN.SUEN=MAEEDO.SUENDO
WHERE ESPGDO='P' 
  AND TIDO='NCV' 
  AND FEEMDO>'20161231'
GROUP BY ENDO,SUENDO,NOKOEN
HAVING sum( VABRDO-VAABDO) >100
ORDER BY SALDO desc

-- NCC no asignadas a ctacte
select ENDO,SUENDO,NOKOEN,sum( VABRDO-VAABDO) as SALDO 
from MAEEDO WITH (nolock)
left join MAEEN on MAEEN.KOEN=MAEEDO.ENDO AND MAEEN.SUEN=MAEEDO.SUENDO
WHERE ESPGDO='P' 
  AND TIDO='NCC' 
  AND FEEMDO>'20161231'
GROUP BY ENDO,SUENDO,NOKOEN
HAVING sum( VABRDO-VAABDO) >100
ORDER BY SALDO desc

-- test duro de ventas versus pagos 
select TIDO,YEAR(FEEMDO) as anno,MONTH(FEEMDO) as mes,
       count(*) as cantidad,
	   Sum(VABRDO) as TOTALBRUTO, 
	   sum(VAABDO) as PAGOS,
	   SUM(VABRDO-VAABDO) as SALDO
from MAEEDO WITH (nolock)
WHERE TIDO in ('BLV','BLX','BSV','ESC','FCV','FDB','FDE','FDV','FDX','FDZ','FEE','FEV','FVL','FVT','FVX','FVZ','FXV','FYV','NCE','NCV','NCX','NCZ','NEV','RIN')
	  and NUDONODEFI=0  
      and ESDO<>'N'
  AND FEEMDO>'20161231'
GROUP BY TIDO,YEAR(FEEMDO),MONTH(FEEMDO)
order by anno desc,mes desc, TIDO asc

select ENDO,TIDO,YEAR(FEEMDO) as anno,MONTH(FEEMDO) as mes,
       count(*) as cantidad,
	   Sum(VABRDO) as TOTALBRUTO, 
	   sum(VAABDO) as PAGOS,
	   SUM(VABRDO-VAABDO) as SALDO
from MAEEDO with (nolock)
WHERE TIDO in ('BLV','BLX','BSV','FCV','FDV','NCE','NCV','NCX','NCZ','NEV','RIN')
  and NUDONODEFI=0  
  and ESDO<>'N'
  and ESPGDO<>'C'
  AND FEEMDO>'20161231'
GROUP BY ENDO,TIDO,YEAR(FEEMDO),MONTH(FEEMDO)
order BY ENDO,TIDO,YEAR(FEEMDO),MONTH(FEEMDO)



 