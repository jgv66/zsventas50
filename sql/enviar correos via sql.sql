DECLARE @bodyhtml  NVARCHAR(MAX) ;  

SET @bodyhtml =  
    N'<H1>' +  
    @titulo +  
    N'</H1>' +  
    N'<table border="1">' +  
    N'<tr>' +  
    N' <th>Codigo</th>' +  
    N' <th>Nombre</th>' +  
    N' <th>Stock físico</th>' +  
    N'</tr>' +  
    CAST ( ( SELECT top 10 
	                td = PR.KOPR,   '',  
                    td = PR.NOKOPR, '',  
                    td = cast(PR.STFI1 as decimal(12,2))  
              FROM MAEPR as PR with (nolock)  
              ORDER BY PR.NOKOPR ASC  
              FOR XML PATH('tr'), TYPE   
    ) AS NVARCHAR(MAX) ) +  
    N'</table>' ;  

EXEC msdb.dbo.sp_send_dbmail 
    @recipients='jfaundez@zsmotor.cl;jogv66@gmail.com',  
    @subject = 'Ordenadito',  
    @body = @bodyhtml,  
    @body_format = 'HTML' ;  

