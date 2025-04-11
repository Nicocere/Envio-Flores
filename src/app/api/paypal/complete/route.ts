import { NextResponse } from "next/server";

import nodemailer from 'nodemailer';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { baseDeDatos } from "@/admin/FireBaseConfig";

// Configurar nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

export async function POST(request: Request) {
    const body = await request.json();
    const { details, envioDatos } = body;
    const {
        id: orderID,
        status,
        payer: {
            emailAddress: payerEmail,
            name: { givenName, surname }
        }
    } = details;

    // Desestructuración base de envioDatos - solo valores usados directamente
    const {
        retiraEnLocal,
        datosComprador: {
            nombreComprador,
            apellidoComprador,
            tel_comprador
        },
        dolar,
        products
    } = envioDatos;

    const imgLogo = 'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-FloreriasArgentinas-dark.png?alt=media&token=c2ed19ee-c8da-4a7e-a86d-ace4c3bcbcc7';

    try {

        let lastCode = 21000;
        const ordersCollection = collection(baseDeDatos, 'ordenes-floreriasargentinas');
        const ordersQuery = query(
            ordersCollection,
            orderBy('order_number', 'desc'),
            limit(1),
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        if (!ordersSnapshot.empty) {
            const lastOrder = ordersSnapshot.docs[0].data();
            lastCode = lastOrder.order_number;
        }

        const newCode = lastCode + 1;

        const formattedDate = format(new Date(), "PPPP 'a las' p", { locale: es });

        const pdfPayload = {
            ...body,
            newCode
        };

        // Generar PDF con manejo de errores específico
        let pdfURL = null;

        try {
            const pdfResponse = await fetch('https://www.floreriasargentinas.com/api/paypal-pdf-generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pdfPayload)
            });

            if (!pdfResponse.ok) {
                console.error('Error al generar el PDF, continuando con el proceso...');
            } else {
                const pdfData = await pdfResponse.json();
                pdfURL = pdfData.pdfURL;
                console.log('PDF generado exitosamente:');
            }
        } catch (pdfError) {
            console.error('Error en la generación del PDF, continuando con el proceso:', pdfError);
        }

        // Crear el contenido del correo para el comprador
        const compradorHtml = `
    <div style="font-family: Arial, sans-serif; color: #2f1a0f; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fcf5f0;">
    <div style="text-align: center;">
        <img src="${imgLogo}" alt="Logo Florerías Argentinas" style="width: 300px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #D4AF37;">¡Felicidades ${nombreComprador}!</h2>
    <p>Has realizado la compra exitosamente a través de PayPal.</p>
    <p style="color: #2f1a0f;">Tu pedido está siendo procesado, tu N° de Orden es el ${newCode}.</p>
    <p>Por favor, revisa los detalles de tu compra a continuación:</p>

    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

    <h3>Detalles de la Transacción PayPal:</h3>
    <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">ID de Orden PayPal:</strong> ${orderID}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Estado:</strong> ${status}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Email PayPal:</strong> ${payerEmail}</li>
    </ul>

    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

    <h3>Detalles de tu compra:</h3>
    <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Nombre:</strong> ${nombreComprador} ${apellidoComprador}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Teléfono:</strong> ${tel_comprador}</li>
    </ul>

    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

    <h3>Productos:</h3>
    <ul style="list-style: none; padding: 0;">
        ${products.map((product: { img: any; name: any; quantity: any; precio: any; promocion: { status: boolean; descuento: any; }; }) => `
            <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <img src="${product.img}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                <div>
                    <p><strong style="color: #D4AF37;">Producto:</strong> ${product.name}</p>
                    <p><strong style="color: #D4AF37;">Cantidad:</strong> ${product.quantity}</p>
                    <p>
                      <strong style="color: #D4AF37;">Precio:</strong> 
                      U$D ${(() => {
                const precioNumerico = Number(product.precio);
                const cotizacionDolar = Number(dolar);

                // Validaciones
                if (isNaN(precioNumerico) || isNaN(cotizacionDolar) || cotizacionDolar === 0) {
                    return '0.00';
                }

                return (precioNumerico / cotizacionDolar).toFixed(2);
            })()}
                    </p>  
                  ${product.promocion && product.promocion?.status === true ? `<p><strong style="color: #D4AF37;">Descuento:</strong> ${product.promocion.descuento}%</p>` : ''}
                </div>
            </li>
        `).join('')}
    </ul>

    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        ${retiraEnLocal ? ` <h3>Retira en local</h3>` : ` <h3>Detalles del envío:</h3>`}

    ${retiraEnLocal ? `
        <div style="background-color: #f9f9f9; color: #2f1a0f; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            <p style="text-align: center;">Seleccionaste retirarlo en el local</p>
                <p style="text-align: center;">Fecha que pasas a retirarlo: ${envioDatos.datosEnvio.fecha || 'No especificada'}</p>
        <p style="text-align: center;">Horario: ${envioDatos.datosEnvio.horario || 'No especificado'}</p>
        <h4 style="color: #D4AF37;">Nuestra ubicación:</h4>
            <p style="text-align: center;">Av. Crámer 1915, CABA</p>    
        <div style="text-align: center; margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #2f1a0f; color: white;">
                <h3 style="color: #D4AF37;">Dedicatoria:</h3>
                <p>${envioDatos.datosEnvio.dedicatoria || 'Sin dedicatoria'}</p>
            </div>
            
        </div>
    ` : `
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0;">
                <li><strong style="color: #D4AF37;">Destinatario:</strong> ${envioDatos.datosEnvio.nombreDestinatario} ${envioDatos.datosEnvio.apellidoDestinatario}</li>
                <li><strong style="color: #D4AF37;">Teléfono:</strong> ${envioDatos.datosEnvio.phoneDestinatario}</li>
                <li><strong style="color: #D4AF37;">Fecha de entrega:</strong> ${envioDatos.datosEnvio.fecha}</li>
                <li><strong style="color: #D4AF37;">Horario:</strong> ${envioDatos.datosEnvio.horario}</li>
                <li><strong style="color: #D4AF37;">Dirección:</strong> ${envioDatos.datosEnvio.calle} ${envioDatos.datosEnvio.altura} ${envioDatos.datosEnvio.piso || ''}</li>
                <li><strong style="color: #D4AF37;">Localidad:</strong> ${envioDatos.datosEnvio.localidad.name}</li>
                <li><strong style="color: #D4AF37;">Costo de envío:</strong> U$D ${envioDatos.datosEnvio.precio_envio}</li>
            </ul>
            <div style="text-align: center; margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #2f1a0f; color: white;">
                <h3 style="color: #D4AF37;">Dedicatoria:</h3>
                <p>${envioDatos.datosEnvio.dedicatoria || 'Sin dedicatoria'}</p>
            </div>
        </div>
    `}

    <h4 style="color: #D4AF37;">Total de la compra: U$D ${envioDatos.datosEnvio.totalPrice}</h4>

    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

    <p>Gracias por confiar en nosotros.</p>
    <p>Si tienes alguna duda o consulta, no dudes en contactarnos.</p>
    <div style="text-align: center; margin-top: 20px;">
        <a href="https://floreriasargentinas.com">            
            <img src="${imgLogo}" alt="Logo Florerías Argentinas" style="width: 150px; margin-bottom: 20px;">
        </a>
    </div>
    <div style="background-color: #f9f9f9; padding: 10px; text-align: center; margin:30px 10px; border-radius: 2px;">
        <p style="margin: 0; color: #D4af37;"><em>Equipo Florerías Argentinas</em></p>
    </div>
</div>
`;



        //         // Crear el contenido del correo para el vendedor
        const vendedorHtml = `
<div style="font-family: Arial, sans-serif; color: #2f1a0f; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fcf5f0;">
    <div style="text-align: center;">
        <img src="${imgLogo}" alt="Logo Florerías Argentinas" style="width: 300px; margin-bottom: 20px;">
    </div>
        <h1 style="color: #D4AF37;">¡Hola Raúl!</h1>

    <h3 style="color: #D4AF37;">¡Has realizado una nueva venta por PayPal!</h3>
    
    <div style="background-color: #2f1a0f; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #D4AF37;">Detalles de PayPal:</h3>
        <ul style="list-style: none; padding: 0;">
            <li><strong>ID de Orden PayPal:</strong> ${orderID}</li>
            <li><strong>Email PayPal:</strong> ${payerEmail}</li>
            <li><strong>Nombre PayPal:</strong> ${givenName} ${surname}</li>
            <li><strong>Estado:</strong> ${status}</li>
            <li><strong>Fecha de Pago:</strong> ${formattedDate}</li>
        </ul>
    </div>

    <hr style="border: 1px solid #d4af37; margin: 20px 0;" />

    <h3>Información del Comprador:</h3>
    <ul style="list-style: none; padding: 0;">
        <li><strong style="color: #D4AF37;">Nombre:</strong> ${nombreComprador} ${apellidoComprador}</li>
        <li><strong style="color: #D4AF37;">Teléfono:</strong> ${tel_comprador}</li>
        <li><strong style="color: #D4AF37;">Monto en USD:</strong> $${envioDatos.datosEnvio.totalPrice}</li>
        <li><strong style="color: #D4AF37;">Cotización ARS:</strong> $${dolar}</li>
    </ul>

    <hr style="border: 1px solid #d4af37; margin: 20px 0;" />

    <h3>Productos:</h3>
    <ul style="list-style: none; padding: 0;">
        ${products.map((product: { img: any; name: any; quantity: any; size: any; }) => `
            <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <img src="${product.img}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                <div>
                    <p><strong style="color: #D4AF37;">Producto:</strong> ${product.name}</p>
                    <p><strong style="color: #D4AF37;">Cantidad:</strong> ${product.quantity}</p>
                    <p><strong style="color: #D4AF37;">Tamaño:</strong> ${product.size}</p>
                </div>
            </li>
        `).join('')}
    </ul>

    <hr style="border: 1px solid #d4af37; margin: 20px 0;" />

    ${!retiraEnLocal ? `
        <h3>Datos de Envío:</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <ul style="list-style: none; padding: 0;">
                <li><strong style="color: #D4AF37;">Destinatario:</strong> ${envioDatos.datosEnvio.nombreDestinatario} ${envioDatos.datosEnvio.apellidoDestinatario}</li>
                <li><strong style="color: #D4AF37;">Teléfono:</strong> ${envioDatos.datosEnvio.phoneDestinatario}</li>
                <li><strong style="color: #D4AF37;">Fecha de entrega:</strong> ${envioDatos.datosEnvio.fecha}</li>
                <li><strong style="color: #D4AF37;">Horario:</strong> ${envioDatos.datosEnvio.horario}</li>
                <li><strong style="color: #D4AF37;">Dirección:</strong> ${envioDatos.datosEnvio.calle} ${envioDatos.datosEnvio.altura} ${envioDatos.datosEnvio.piso || ''}</li>
                <li><strong style="color: #D4AF37;">Localidad:</strong> ${envioDatos.datosEnvio.localidad.name}</li>
                <li><strong style="color: #D4AF37;">Costo de envío:</strong> $${envioDatos.datosEnvio.precio_envio}</li>
            </ul>
        </div>
    ` : `
        <h3 style="color: #D4AF37; text-align: center;">RETIRA EN LOCAL</h3>
        <p style="text-align: center;">Fecha: ${envioDatos.datosEnvio.fecha || 'No especificada'}</p>
        <p style="text-align: center;">Horario: ${envioDatos.datosEnvio.horario || 'No especificado'}</p>
    `}

    <div style="background-color: #2f1a0f; color: white; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h3 style="color: #D4AF37;">Dedicatoria:</h3>
        <p>${envioDatos.datosEnvio.dedicatoria || 'Sin dedicatoria'}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #D4AF37; font-size: 20px;">Total Final: USD $${envioDatos.datosEnvio.totalPrice}</p>
    </div>


        <hr style="border: 1px solid #d4af37; margin: 10px 0;" />


${pdfURL ? `
    <p style="color: #2f1a0f;">Ingresa al Link para descargar el PDF de la compra</p>
    <a href="${pdfURL}" style="background-color: #D4AF37; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Descargar PDF</a>
` : `
    <p style="color: #D4AF37;">Falló al generar el PDF de la compra</p>
`}
                                    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

    
        <p style="color: #2f1a0f;">Por favor, revisa dentro del sitio web en caso de no encontrar la información necesaria.</p>
            <p style="color: #2f1a0f;">¡Que tengas un excelente día!</p>
        <p style="color: #2f1a0f;">Saludos cordiales.</p>

                    <div style="background-color: #f9f9f9; padding: 10px; text-align: center;">
                                <p style="margin: 0; color: #D4af37;"><em>Equipo Florerías Argentinas</em></p>
                            </div>
</div>
`;

        // Enviar correo al comprador
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: `${envioDatos.datosComprador.email}, ${payerEmail}`,
            subject: `Confirmación de compra - Orden ${newCode} - Florerías Argentinas`,
            html: compradorHtml
        });

        // Enviar correo al vendedor
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: `${process.env.GMAIL_USER}, floreriasargentinas@gmail.com`,
            subject: `Nueva compra realizada - Orden ${newCode} - Florerías Argentinas`,
            html: vendedorHtml
        });

        const newOrderData = {
            PayPal: true,
            payment: 'PayPal',
            order_number: newCode,
            createdAt: new Date(),
            products,
            datosComprador: envioDatos.datosComprador,
            datosEnvio: envioDatos.datosEnvio,
            retiraEnLocal,
            details,
            dolar,

        };
        await addDoc(collection(baseDeDatos, 'ordenes-floreriasargentinas'), newOrderData);

        return NextResponse.json({ message: 'Mails enviados' });

    } catch (error) {
        console.log('Hubo un error al procesar la solicitud al finalizar el proceso de compra: ', error);
        return NextResponse.json({ error: error });
    }
}