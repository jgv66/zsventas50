module.exports = {
    // cada funncion se separa por comas  
    componeBody: function(sql, id) {
        //  
        var request = new sql.Request();
        request.input('id', sql.Int, id);
        return request.execute("ksp_TraeDetalleK")
            //
    },

    enviarCorreo: function(res, nodemailer, mailList, htmlBody) {
        //
        sender = 'preventa@zsmotor.cl';
        psswrd = 'zsmotor3762';
        //
        cTo = mailList[0].to;
        cCc = mailList[0].cc;
        cSu = 'Contacto de pre-venta';
        // si no tiene correo se envia al vendedor
        if (cTo == '' || cTo == undefined) {
            cTo = cCc;
            cSu = 'Contacto de pre-venta (CLIENTE SIN CORREO)';
        }
        console.log(11111);
        // datos del enviador
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: sender,
                pass: psswrd
            }
        });
        console.log(22222);
        // opciones del correo
        var mailOptions = {
            from: { name: "ZS-Motor 👻", address: sender },
            to: cTo,
            cc: cCc, // [{ name: "ZS-Motor 👻", address: 'jogv66@gmail.com'}, 'pedroalfonsofrancisco@gmail.com' ],
            subject: cSu,
            html: htmlBody
        };
        console.log(33333);
        // enviar el correo
        transporter.sendMail(mailOptions, function(error, info) {
            console.log(8888);
            if (error) {
                console.log('error en sendmail->', error);
                res.json({ resultado: "error", datos: error });
            } else {
                console.log("Email enviado a -> ", cTo);
                console.log("Email con copia -> ", cCc);
                res.json({ resultado: "ok", datos: 'Correo enviado a : ' + cTo });
            }
        });
    },

    primeraParte: function(cObs, nombreVend, rsocial, codCliente, sucCliente, num, tipodoc, cOcc) {
        return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width" />
        
            <style type="text/css">
                * { margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; line-height: 1.65; }
                img { max-width: 100%; margin: 0 auto; }
                body, .body-wrap { width: 100% !important; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; }
                a { color: #71bc37; text-decoration: none; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-left { text-align: left; }
                .button { display: inline-block; color: white; background: #71bc37; border: solid #71bc37; border-width: 10px 20px 8px; font-weight: bold; border-radius: 4px; }
                h1, h2, h3, h4, h5, h6 { margin-bottom: 20px; line-height: 1.25; }
                h1 { font-size: 32px; }
                h2 { font-size: 28px; }
                h3 { font-size: 24px; }
                h4 { font-size: 20px; }
                h5 { font-size: 16px; }
                p, ul, ol { font-size: 16px; font-weight: normal; margin-bottom: 20px; }
                .container { display: block !important; clear: both !important; margin: 0 auto !important; max-width: 980px !important; }
                .container table { width: 100% !important; border-collapse: collapse; }
                .container .masthead { padding: 10px 10px 10px ; background: #222; color: white; }
                .container .masthead h1 { margin: 0 auto !important; max-width: 90%; text-transform: uppercase; }
                .container .rayaroja { max-height: 2px; background: #ca2121; color: #ca2121; }
                .container .content { background: white; padding: 30px 35px; }
                .container .content.footer { background: none; }
                .container .content.footer p { margin-bottom: 0; color: #888;  text-align: center; font-size: 10px; }
                .container .content.footer a { color: #888; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        
        <body>
            <table class="body-wrap">
                <tr>
                    <td class="container">
                            <!-- Message start -->
                            <table>

                                <tr>
                                    <td align="left" class="masthead">
                                        <img src="http://www.zsmotor.cl/img/logo-zs-motors.png" alt="zsmotor.cl"></img>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="rayaroja">
                                        <p> </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="content">
            
                                        <h3>` + (codCliente != undefined && codCliente != '' ? 'Datos Cliente' : 'Datos Vendedor') + `</h3>

                                        <table border="1">
                                            ` + (codCliente != undefined && codCliente != '' ? '<tr><td>Código Cliente   </td><td align="left">' + codCliente + '     </td></tr>' : '') + `
                                            ` + (rsocial != undefined && rsocial != '' ? '<tr><td>Razón Social     </td><td align="left">' + rsocial + '        </td></tr>' : '') + `
                                            ` + (sucCliente != undefined && sucCliente.trim() != '' ? '<tr><td>Sucursal Cliente </td><td align="left">' + sucCliente + '     </td></tr>' : '') + `
                                            ` + (nombreVend != '' && nombreVend != undefined ? '<tr><td>Vendedor Asignado</td><td align="left">' + nombreVend + '     </td></tr>' : '') + `
                                            ` + (num != '' && num != undefined ? '<tr><td>Documento        </td><td align="left">' + tipodoc + '-' + num + '</td></tr>' : '') + `
                                            ` + (cObs != '' && cObs != undefined ? '<tr><td>Observaciones    </td><td align="left">' + cObs + '           </td></tr>' : '') + `
                                            ` + (cOcc != '' && cOcc != undefined ? '<tr><td>Orden de Compra  </td><td align="left">' + cOcc + '           </td></tr>' : '') + `
                                        <!--  KINETIK -->
                                        </table>
                                        <br>
                                        <h3>Detalle de la atención</h3>
            
                                        <table border="1">
                                            <tr>
                                                <td align="center">Cantidad</td>
                                                <td align="center">Código</td>
                                                <td align="center">Descripción</td>
                                                <td align="center">Precio Unit</td>
                                                <td align="center">Descto.</td>
                                                <td align="center">SubTotal</td>  
                                            </tr>`;
    },

    segundaParte: function() {
        return `          </table>

                            </td>
                        </tr>
                        <!--  KINETIK -->
                    </table>
                    
                    <p>Estimado cliente: Este documento es una copia de respaldo a la atención prestada. Tenga en cuenta que stocks y precios podrían variar en el tiempo. Sírvase revisar con el vendedor los datos definitivos de su pedido.</p>

                </td>
            </tr>
                <tr>
                    <td class="container">
                        <!-- Message start -->
                        <table>
                            <tr>
                                <td class="content footer" align="center">
                                    <p>Desarrollado por Kinetik - Soluciones Móviles</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            </body>

            </html>`;
    }

};