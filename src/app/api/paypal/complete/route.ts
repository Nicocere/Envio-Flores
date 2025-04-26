import { NextResponse } from "next/server";

import nodemailer from 'nodemailer';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { baseDeDatosServer } from "@/utils/firebaseServer";

// Configurar nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

export async function POST(request: Request) {
    const body = await request.json();
    const { details, envioDatos } = body;
    const {
        id: orderID = "No disponible",
        status = "Procesado",
        payer: {
            emailAddress: payerEmail = "No disponible",
            name: { givenName = "Cliente", surname = "" } = {}
        } = {}
    } = details || {};

    // Desestructuración base de envioDatos - solo valores usados directamente
    const {
        retiraEnLocal = false,
        datosComprador: {
            nombreComprador = "Cliente",
            apellidoComprador = "",
            tel_comprador = "No disponible",
            email: emailComprador = "No disponible"
        } = {},
        dolar = 1,
        products = []
    } = envioDatos || {};

    const imgLogo = 'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23';

    try {
        // Generar nuevo código de orden
        let lastCode = 21000;
        const ordersCollection = collection(baseDeDatosServer, 'ordenes-envio-flores');
        const ordersQuery = query(
            ordersCollection,
            orderBy('order_number', 'desc'),
            limit(1),
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        if (!ordersSnapshot.empty) {
            const lastOrder = ordersSnapshot.docs[0].data();
            lastCode = lastOrder.order_number || lastCode;
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
            // En producción usar una URL pública
            // const pdfResponse = await fetch('https://www.envioflores.com/api/paypal-pdf-generate', {
            const pdfResponse = await fetch('http://localhost:3000/api/paypal-pdf-generate', {
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
                console.log('PDF generado exitosamente');
            }
        } catch (pdfError) {
            console.error('Error en la generación del PDF, continuando con el proceso:', pdfError);
        }

        // Validar datos del envío
        const datosEnvio = envioDatos?.datosEnvio || {};
        const {
            fecha = "No especificada",
            horario = "No especificado",
            dedicatoria = "Sin dedicatoria",
            nombreDestinatario = "No especificado",
            apellidoDestinatario = "",
            phoneDestinatario = "No disponible",
            calle = "No especificada",
            altura = "",
            piso = "",
            localidad = { name: "No especificada" },
            precio_envio = 0,
            totalPrice = 0,
            servicioPremium = false,
            envioPremium = 0
        } = datosEnvio;

        // Crear el contenido del correo para el comprador
        const compradorHtml = `
    <div style="font-family: "Nexa", sans-serif; color: #333333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E0E0E0; border-radius: 12px; background-color: #FFFFFF;">
    <div style="text-align: center;">
        <img src="${imgLogo}" alt="Logo Envío Flores" style="width: 300px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #A70000; text-align: center; font-family: "Nexa", sans-serif;">¡Felicidades ${nombreComprador || 'estimado cliente'}!</h2>
    <p style="color: #333333; text-align: center;">Tu compra a través de PayPal ha sido procesada exitosamente.</p>
    <p style="color: #333333; text-align: center; font-weight: 600;">Tu pedido está en preparación, número de orden: <span style="color: #A70000; font-weight: 700;">${newCode}</span></p>
    <p style="color: #333333; text-align: center;">A continuación encontrarás todos los detalles de tu compra:</p>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <h3 style="color: #A70000; font-family: "Nexa", sans-serif;">Detalles de la Transacción PayPal:</h3>
    <ul style="list-style: none; padding: 0; background-color: #FFF5F5; padding: 15px; border-radius: 8px;">
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">ID de Orden PayPal:</strong> ${orderID}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Estado:</strong> ${status}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Email PayPal:</strong> ${payerEmail}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Fecha de compra:</strong> ${formattedDate}</li>
    </ul>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <h3 style="color: #A70000; font-family: "Nexa", sans-serif;">Tus datos:</h3>
    <ul style="list-style: none; padding: 0; background-color: #FFF5F5; padding: 15px; border-radius: 8px;">
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Nombre completo:</strong> ${nombreComprador} ${apellidoComprador || ''}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Teléfono:</strong> ${tel_comprador}</li>
        <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Email:</strong> ${emailComprador || payerEmail}</li>
    </ul>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <h3 style="color: #A70000; font-family: "Nexa", sans-serif;">Productos adquiridos:</h3>
    <div style="background-color: #FFF5F5; padding: 15px; border-radius: 8px;">
        ${products.length === 0 ? 
            '<p style="text-align: center; color: #333333;">No hay productos registrados</p>' : 
            products.map((product: any) => {
                // Validar producto
                const {
                    img = "https://via.placeholder.com/50",
                    name = "Producto",
                    quantity = 1,
                    precio = 0,
                    promocion = null
                } = product || {};
                
                // Calcular precio en USD
                const precioNumerico = Number(precio);
                const cotizacionDolar = Number(dolar);
                const precioUSD = (!isNaN(precioNumerico) && !isNaN(cotizacionDolar) && cotizacionDolar !== 0) 
                    ? (precioNumerico / cotizacionDolar).toFixed(2) 
                    : '0.00';
                
                // Verificar descuento
                const tieneDescuento = promocion && promocion.status === true && promocion.descuento > 0;
                
                return `
                <div style="border-bottom: 1px solid #E0E0E0; padding: 15px 0; display: flex; align-items: center;">
                    <img src="${img}" alt="${name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-right: 15px; border: 1px solid #E0E0E0;">
                    <div>
                        <p style="font-weight: 600; color: #A70000; margin: 0 0 5px 0;">${name}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Cantidad:</strong> ${quantity}</p>
                        <p style="margin: 0 0 5px 0;">
                            <strong>Precio unitario:</strong> 
                            U$D ${precioUSD}
                        </p>  
                        ${tieneDescuento ? 
                            `<p style="margin: 0 0 5px 0; color: #00C853;"><strong>Descuento aplicado:</strong> ${promocion.descuento}%</p>` : 
                            ''}
                    </div>
                </div>
                `;
            }).join('')
        }
    </div>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <h3 style="color: #A70000; font-family: "Nexa", sans-serif; text-align: center;">
        ${retiraEnLocal ? 'Información para retiro en tienda' : 'Detalles del envío'}
    </h3>

    ${retiraEnLocal ? `
        <div style="background-color: #FFF5F5; color: #333333; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <p><strong>Has elegido retirar tu pedido personalmente en nuestra tienda</strong></p>
            <p><strong>Fecha de retiro:</strong> ${fecha}</p>
            <p><strong>Horario:</strong> ${horario}</p>
            
            <div style="margin: 20px 0; padding: 15px; border: 1px dashed #A70000; border-radius: 8px;">
                <h4 style="color: #A70000; margin-top: 0;">Dirección de nuestra tienda</h4>
                <p>Av. Crámer 1915, Belgrano - Ciudad Autónoma de Buenos Aires</p>
                <p>Te esperamos con tu pedido listo en la fecha y horario seleccionados</p>
            </div>
            
            <div style="margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #F8F8F8; text-align: left;">
                <h4 style="color: #A70000; margin-top: 0;">Dedicatoria:</h4>
                <p style="font-style: italic; background-color: white; padding: 10px; border-radius: 8px; border-left: 3px solid #A70000;">${dedicatoria}</p>
            </div>
        </div>
    ` : `
        <div style="background-color: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="text-align: center; margin-bottom: 15px;">Tu pedido será entregado en la siguiente dirección:</p>
            
            <div style="padding: 15px; background-color: white; border-radius: 8px; margin-bottom: 15px;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Destinatario:</strong> ${nombreDestinatario} ${apellidoDestinatario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Teléfono:</strong> ${phoneDestinatario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Dirección completa:</strong> ${calle} ${altura} ${piso ? `- ${piso}` : ''}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Localidad:</strong> ${localidad.name}</li>
                </ul>
            </div>
            
            <div style="padding: 15px; background-color: white; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #A70000;">
                <p><strong style="color: #A70000;">Fecha de entrega:</strong> ${fecha}</p>
                <p><strong style="color: #A70000;">SERVICIO PREMIUM:</strong> ${servicioPremium ? 'SI' : 'NO'}</p>
                ${servicioPremium ? `<p><strong style="color: #A70000;">Costo adicional:</strong> U$D ${typeof envioPremium === 'number' && typeof dolar === 'number' && dolar !== 0 ? (envioPremium / dolar).toFixed(2) : envioPremium}</p>` : ''}
                
                <p><strong style="color: #A70000;">Horario:</strong> ${horario}</p>
                <p><strong style="color: #A70000;">Costo de envío:</strong> U$D ${typeof precio_envio === 'number' && typeof dolar === 'number' && dolar !== 0 ? (precio_envio / dolar).toFixed(2) : precio_envio}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #F8F8F8;">
                <h4 style="color: #A70000; margin-top: 0;">Dedicatoria:</h4>
                <p style="font-style: italic; background-color: white; padding: 10px; border-radius: 8px; border-left: 3px solid #A70000;">${dedicatoria}</p>
            </div>
        </div>
    `}

    <div style="text-align: center; background-color: #A70000; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: white;">Total de la compra: U$D ${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice}</h3>
    </div>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <div style="text-align: center; padding: 20px; background-color: #FFF5F5; border-radius: 8px;">
        <h4 style="color: #A70000; margin-top: 0;">¡Gracias por confiar en Envío Flores!</h4>
        <p>Nos esforzamos por entregar la mejor calidad y servicio en cada pedido.</p>
        <p>Si tienes alguna duda o consulta, no dudes en contactarnos por WhatsApp o email.</p>
        <p><strong style="color: #A70000;">¡Esperamos que disfrutes tu compra!</strong></p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
        <a href="https://envioflores.com" style="text-decoration: none;">            
            <img src="${imgLogo}" alt="Logo Envío Flores" style="width: 150px; margin-bottom: 10px;">
        </a>
    </div>
    
    <div style="background-color: #FFF5F5; padding: 10px; text-align: center; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0; color: #A70000;"><em>Equipo Envío Flores</em></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666666;">Av. Crámer 1915, Belgrano - CABA</p>
    </div>
</div>
`;

        // Crear el contenido del correo para el vendedor
        const vendedorHtml = `
<div style="font-family: "Nexa", sans-serif; color: #333333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E0E0E0; border-radius: 12px; background-color: #FFFFFF;">
    <div style="text-align: center;">
        <img src="${imgLogo}" alt="Logo Envío Flores" style="width: 250px; margin-bottom: 20px;">
    </div>
    
    <div style="background-color: #A70000; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; color: white;">
        <h2 style="color: white; font-family: "Nexa", sans-serif; margin: 0; font-size: 24px;">¡Nueva venta por PayPal!</h2>
        <p style="margin: 10px 0 0 0;">Orden #${newCode} - ${formattedDate}</p>
    </div>

    <div style="background-color: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #A70000; font-family: "Nexa", sans-serif; margin-top: 0;">Detalles de PayPal:</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong>ID de Orden PayPal:</strong> ${orderID}</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong>Email PayPal:</strong> ${payerEmail}</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong>Nombre PayPal:</strong> ${givenName} ${surname}</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong>Estado:</strong> ${status}</li>
            <li style="padding: 8px 0;"><strong>Fecha de Pago:</strong> ${formattedDate}</li>
        </ul>
    </div>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <h3 style="color: #A70000; font-family: "Nexa", sans-serif;">Información del Comprador:</h3>
    <div style="background-color: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Nombre:</strong> ${nombreComprador} ${apellidoComprador || ''}</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Email:</strong> ${emailComprador || payerEmail}</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Teléfono:</strong> ${tel_comprador}</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Monto en USD:</strong> $${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice}</li>
            <li style="padding: 8px 0;"><strong style="color: #A70000;">Cotización ARS:</strong> $${dolar}</li>
        </ul>
    </div>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    <h3 style="color: #A70000; font-family: "Nexa", sans-serif;">Productos:</h3>
    <div style="background-color: #FFF5F5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        ${products.length === 0 ? 
            '<p style="text-align: center;">No hay productos registrados</p>' : 
            products.map((product: any) => {
                // Validar producto
                const {
                    img = "https://via.placeholder.com/50",
                    name = "Producto",
                    quantity = 1,
                    size = "No especificado"
                } = product || {};
                
                return `
                <div style="border-bottom: 1px solid #E0E0E0; padding: 15px 0; display: flex; align-items: center;">
                    <img src="${img}" alt="${name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-right: 15px; border: 1px solid #E0E0E0;">
                    <div>
                        <p style="font-weight: 600; color: #A70000; margin: 0 0 5px 0;">${name}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Cantidad:</strong> ${quantity}</p>
                        <p style="margin: 0;"><strong>Tamaño:</strong> ${size}</p>
                    </div>
                </div>
                `;
            }).join('')
        }
    </div>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    ${retiraEnLocal ? `
        <div style="text-align: center; background-color: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #A70000; font-family: "Nexa", sans-serif; margin-top: 0;">RETIRA EN LOCAL</h3>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Horario:</strong> ${horario}</p>

        </div>
    ` : `
        <h3 style="color: #A70000; font-family: "Nexa", sans-serif;">Datos de Envío:</h3>
        <div style="background-color: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Destinatario:</strong> ${nombreDestinatario} ${apellidoDestinatario}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Teléfono:</strong> ${phoneDestinatario}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Fecha de entrega:</strong> ${fecha}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">SERVICIO PREMIUM:</strong> ${servicioPremium ? 'SI' : 'NO'}</li>
                ${servicioPremium ? `<li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Costo adicional:</strong> $${typeof envioPremium === 'number' && typeof dolar === 'number' && dolar !== 0 ? (envioPremium / dolar).toFixed(2) : envioPremium}</li>` : ''}
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Horario:</strong> ${horario}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Dirección:</strong> ${calle} ${altura} ${piso ? `- ${piso}` : ''}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #E0E0E0;"><strong style="color: #A70000;">Localidad:</strong> ${localidad.name}</li>
                <li style="padding: 8px 0;"><strong style="color: #A70000;">Costo de envío:</strong> $${typeof precio_envio === 'number' && typeof dolar === 'number' && dolar !== 0 ? (precio_envio / dolar).toFixed(2) : precio_envio}</li>
            </ul>
        </div>
    `}

    <div style="background-color: #FFF5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #A70000; font-family: "Nexa", sans-serif; margin-top: 0;">Dedicatoria:</h3>
        <p style="font-style: italic; background-color: white; padding: 15px; border-radius: 8px; border-left: 3px solid #A70000;">${dedicatoria}</p>
    </div>

    <div style="text-align: center; background-color: #A70000; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: white;">Total Final: USD $${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice}</h3>
        <p style="margin: 10px 0 0 0;">Monto en ARS: $${typeof totalPrice === 'number' && typeof dolar === 'number' ? (totalPrice * dolar).toFixed(2) : 'No calculado'}</p>
    </div>

    <hr style="border: 1px solid #FFF5F5; margin: 20px 0;" />

    ${pdfURL ? `
        <div style="text-align: center; margin: 20px 0;">
            <p style="color: #333333; margin-bottom: 15px;">Puedes descargar el PDF con los detalles de la compra:</p>
            <a href="${pdfURL}" style="display: inline-block; background-color: #A70000; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Descargar PDF</a>
        </div>
    ` : `
        <p style="text-align: center; color: #FF1744;">No se pudo generar el PDF de la compra</p>
    `}

    <div style="background-color: #FFF5F5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0; color: #A70000;"><em>Equipo Envío Flores</em></p>
    </div>
</div>
`;

        // Enviar correo al comprador
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: `${emailComprador}, ${process.env.GMAIL_USER}`,
            subject: `✅ Confirmación de compra - Orden #${newCode} - Envío Flores`,
            html: compradorHtml
        });

        // Enviar correo al vendedor
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER ,
            subject: `🔔 Nueva venta por PayPal - Orden #${newCode} - Envío Flores`,
            html: vendedorHtml
        });

        // Guardar en base de datos
        const newOrderData = {
            PayPal: true,
            payment: 'PayPal',
            order_number: newCode,
            createdAt: new Date(),
            products,
            datosComprador: envioDatos.datosComprador || {},
            datosEnvio: envioDatos.datosEnvio || {},
            retiraEnLocal,
            details,
            dolar,
        };
        
        await addDoc(collection(baseDeDatosServer, 'ordenes-envio-flores'), newOrderData);

        return NextResponse.json({ 
            success: true, 
            message: 'Emails enviados correctamente',
            orderNumber: newCode
        });

    } catch (error) {
        console.error('Error al procesar la solicitud al finalizar el proceso de compra:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Ocurrió un error al procesar la solicitud. Por favor, contacta al soporte.' 
        }, { status: 500 });
    }
}