
-- ventas sucursal vendedor año mes dia 
select SULIDO as sucursal,
	   KOFULIDO as vendedor,
	   YEAR(FEEMLI) as anno, 
	   MONTH(FEEMLI) as mes,
	   day(FEEMLI) as dia,  
       SUM(VANELI * (CASE WHEN TIDO = 'NCV' THEN -1 ELSE 1 END ) ) as monto
from MAEDDO with (nolock)
WHERE FEEMLI>2016
group by SULIDO,KOFULIDO,YEAR(FEEMLI),MONTH(FEEMLI),day(FEEMLI)
order by SULIDO,KOFULIDO,YEAR(FEEMLI),MONTH(FEEMLI),day(FEEMLI)
