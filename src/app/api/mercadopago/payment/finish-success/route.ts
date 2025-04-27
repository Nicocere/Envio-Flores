import { NextResponse } from "next/server";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Importación regular de nodemailer
import nodemailer from 'nodemailer';
import { addDoc, collection } from "firebase/firestore";
import { baseDeDatosServer } from "@/utils/firebaseServer";

// Configurar nodemailer
const createTransporter = async () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });
};

export async function POST(request: Request) {
    const body = await request.json();

    const {
        MercadoPago,
        createdAt,
        products,
        datosComprador,
        retiraEnLocal,
        datosEnvio,
        pdfUrl,
        newCode
    } = body;

    const imgLogo = 'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23';

    try {
        const formattedDate = format(new Date(createdAt), "PPPP 'a las' p", { locale: es });
        
        // Crear el contenido del correo para el comprador
        const compradorHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Compra - Envío Flores</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Cabecera -->
            <div style="background: linear-gradient(135deg, #A70000 0%, #800000 100%); padding: 25px 20px; text-align: center;">
                <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 220px; height: auto;">
                <h1 style="color: #ffffff; margin-top: 15px; font-size: 24px; font-weight: 600;">¡Tu compra ha sido confirmada!</h1>
            </div>

            <!-- Contenido principal -->
            <div style="padding: 30px 25px;">
                <div style="background-color: #f5f5f5; border-left: 4px solid #A70000; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                    <p style="margin: 0; color: #333333; font-size: 16px;">
                        <span style="font-weight: 600;">Orden #${newCode}</span> - ${formattedDate}
                    </p>
                    
                    <p style="margin: 10px 0 0; color: #666666; font-size: 14px;">
                        ID de Pago: ${MercadoPago?.id || 'No disponible'}
                    </p>
                </div>

                <h2 style="color: #A70000; font-size: 20px; margin-top: 0; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">¡Hola, ${datosComprador.nombreComprador}!</h2>
                
                <p style="color: #333333; line-height: 1.6; margin-bottom: 20px;">
                    Queremos agradecerte por tu compra. Tu pedido ha sido confirmado y lo estamos preparando con mucho cariño para entregarlo en la fecha solicitada.
                </p>
                
                <div style="background-color: #e9f7ef; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="background-color: #28a745; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                            <span style="color: white; font-weight: bold; font-size: 14px;">✓</span>
                        </div>
                        <h3 style="margin: 0; color: #28a745; font-size: 16px;">Pago Aprobado</h3>
                    </div>
                    <p style="margin: 0; color: #333333; font-size: 14px;">
                        Tu pago con MercadoPago ha sido procesado y aprobado exitosamente.
                    </p>
                </div>

                <!-- Resumen de la compra -->
                <h3 style="color: #A70000; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    Resumen de tu Compra
                </h3>

                <!-- Productos -->
                <div style="margin-bottom: 25px;">
                    ${products.map((product: any) => `
                        <div style="display: flex; margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                            <img src="${product.img}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
                            <div style="flex-grow: 1;">
                                <h4 style="margin: 0 0 5px; color: #333333; font-size: 16px;">${product.name}</h4>
                                <p style="margin: 0 0 5px; color: #666666; font-size: 14px;">Cantidad: ${product.quantity}</p>
                                <p style="margin: 0; color: #A70000; font-size: 15px; font-weight: 600;">$${product.precio}</p>
                                ${product.promocion && product.promocion.status === true ? 
                                    `<p style="margin: 5px 0 0; color: #28a745; font-size: 13px;">
                                        Descuento: ${product.promocion.descuento}%
                                    </p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Detalles del envío -->
                <h3 style="color: #A70000; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    ${retiraEnLocal ? 'Detalles del Retiro' : 'Detalles del Envío'}
                </h3>

                ${retiraEnLocal ? `
                    <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px dashed #ffcdd2;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span style="display: inline-block; background-color: #A70000; color: white; border-radius: 50px; padding: 8px 20px; font-size: 14px; font-weight: 600;">
                                RETIRO EN TIENDA
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <p style="margin: 0 0 5px; color: #333; font-size: 15px;">
                                <strong>Fecha de retiro:</strong> ${datosEnvio.fecha ? datosEnvio.fecha : 'Sin especificar'}
                            </p>
                            <p style="margin: 0; color: #333; font-size: 15px;">
                                <strong>Horario:</strong> ${datosEnvio.horario ? datosEnvio.horario : 'Sin especificar'}
                            </p>
                        </div>

                        <div style="background-color: #350000; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <h4 style="color: #ff4d4d; margin-top: 0; margin-bottom: 10px; text-align: center; font-size: 16px;">
                                Tu Dedicatoria
                            </h4>
                            <p style="color: white; margin: 0; line-height: 1.5; text-align: center; font-style: italic;">
                                ${datosEnvio.dedicatoria ? `"${datosEnvio.dedicatoria}"` : 'No se incluyó dedicatoria para este pedido.'}
                            </p>
                        </div>

                        <div style="margin-top: 20px;">
                            <h4 style="color: #A70000; text-align: center; margin-top: 0; margin-bottom: 10px; font-size: 16px;">
                                Nuestra Ubicación
                            </h4>
                            <p style="text-align: center; font-weight: 500; margin-bottom: 15px; color: #333;">
                                Av. Crámer 1915, Belgrano, CABA
                            </p>
                            <iframe 
                                width="100%" 
                                height="200" 
                                frameborder="0" 
                                style="border:0; border-radius: 8px;" 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" 
                                allowfullscreen="" 
                                loading="lazy" 
                                referrerpolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                ` : `
                    <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px dashed #ffcdd2;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span style="display: inline-block; background-color: #A70000; color: white; border-radius: 50px; padding: 8px 20px; font-size: 14px; font-weight: 600;">
                                ENTREGA A DOMICILIO
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;">Destinatario:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Teléfono:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        ${datosEnvio.phoneDestinatario}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Fecha de entrega:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        ${datosEnvio.fecha}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Horario:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        ${datosEnvio.horario}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Localidad:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        ${datosEnvio.localidad?.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Dirección:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso || ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Costo de envío:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        $${datosEnvio.precio_envio}
                                    </td>
                                </tr>
                                ${datosEnvio.servicioPremium ? `
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Servicio Premium:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        Incluido (costo: $${datosEnvio.envioPremium})
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                        </div>
                        
                        <div style="background-color: #350000; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                            <h4 style="color: #ff4d4d; margin-top: 0; margin-bottom: 10px; text-align: center; font-size: 16px;">
                                Tu Dedicatoria
                            </h4>
                            <p style="color: white; margin: 0; line-height: 1.5; text-align: center; font-style: italic;">
                                ${datosEnvio.dedicatoria ? `"${datosEnvio.dedicatoria}"` : 'No se incluyó dedicatoria para este pedido.'}
                            </p>
                        </div>
                    </div>
                `}

                <!-- Total -->
                <div style="background-color: #A70000; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <h3 style="color: white; margin: 0; font-size: 18px;">Total pagado: $${datosEnvio.totalPrice}</h3>
                </div>

                <!-- Seguimiento del pedido -->
                <div style="background-color: #FFF9F9; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #ffcaca; text-align: center;">
                    <h3 style="color: #A70000; margin-top: 0; font-size: 20px;">Seguimiento de tu pedido</h3>
                    <p style="text-align: center; margin-bottom: 5px; line-height: 1.6;">Puedes consultar el estado de tu pedido respondiendo a este email o contactándonos vía WhatsApp.</p>
                    <p style="text-align: center; margin-bottom: 15px; line-height: 1.6;">Para cualquier consulta, menciona tu número de orden: <strong style="color: #A70000;">#${newCode}</strong></p>
                    <a href="https://envioflores.com/mi-pedido/${newCode}" style="display: inline-block; background-color: #A70000; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; box-shadow: 0 3px 8px rgba(167, 0, 0, 0.2);">Ver estado de mi pedido</a>
                </div>

                <!-- Información adicional -->
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #A70000; text-align: center; margin-top: 0; margin-bottom: 15px; font-size: 18px;">¿Necesitas ayuda?</h3>
                    <p style="margin: 0 0 10px; color: #555; line-height: 1.6; text-align: center;">
                        Nuestro equipo está disponible para ayudarte en cualquier momento. No dudes en contactarnos si tienes alguna consulta sobre tu pedido.
                    </p>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                        <a href="https://api.whatsapp.com/send?phone=+549XXXXXXXXXX&text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20pedido%20%23${newCode}" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: bold;">Contactar por WhatsApp</a>
                        <a href="mailto:${process.env.GMAIL_USER}" style="display: inline-block; background-color: #D44638; color: white; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: bold;">Enviar Email</a>
                    </div>
                </div>

                <p style="color: #555; font-style: italic; text-align: center; margin-top: 30px; margin-bottom: 5px;">
                    ¡Gracias por confiar en Envío Flores para tus momentos especiales!
                </p>
                <p style="color: #A70000; font-weight: 600; text-align: center; margin-top: 5px; margin-bottom: 20px;">
                    Equipo Envío Flores
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                <a href="https://envioflores.com" style="display: inline-block; margin-bottom: 15px;">
                    <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 150px; height: auto;">
                </a>
                
                <div style="margin-bottom: 15px;">
                    <a href="https://facebook.com/envioflores" style="text-decoration: none; color: #A70000; margin: 0 10px;">Facebook</a>
                    <a href="https://instagram.com/envioflores" style="text-decoration: none; color: #A70000; margin: 0 10px;">Instagram</a>
                    <a href="https://envioflores.com" style="text-decoration: none; color: #A70000; margin: 0 10px;">Sitio web</a>
                </div>
                
                <p style="color: #777; font-size: 12px; margin: 0;">
                    &copy; ${new Date().getFullYear()} Envío Flores. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
`;

        // Crear el contenido del correo para el vendedor
        const vendedorHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Venta - Envío Flores</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Cabecera -->
            <div style="background: linear-gradient(135deg, #A70000 0%, #800000 100%); padding: 25px 20px; text-align: center;">
                <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 220px; height: auto;">
                <h1 style="color: #ffffff; margin-top: 15px; font-size: 24px; font-weight: 600;">¡NUEVA VENTA REALIZADA!</h1>
                <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0;">Orden #${newCode} - ${formattedDate}</p>
            </div>

            <!-- Contenido principal -->
            <div style="padding: 30px 25px;">
                <div style="background-color: #e9f7ef; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: center;">
                    <h2 style="color: #28a745; margin-top: 0; margin-bottom: 10px; font-size: 20px;">
                        ¡Pago Aprobado con MercadoPago!
                    </h2>
                    <p style="margin: 0; color: #333; font-size: 15px;">
                        El pago ha sido procesado exitosamente
                    </p>
                </div>

                <!-- Información del cliente -->
                <h3 style="color: #A70000; font-size: 18px; margin-top: 0; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    Información del Cliente
                </h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;">Nombre:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                            ${datosComprador.nombreComprador} ${datosComprador.apellidoComprador}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                            ${datosComprador.email}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Teléfono:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                            ${datosComprador.tel_comprador}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Fecha de compra:</td>
                        <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                            ${formattedDate}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Método de entrega:</td>
                        <td style="padding: 8px 0; color: #A70000; font-weight: 600; font-size: 14px;">
                            ${retiraEnLocal ? 'RETIRO EN TIENDA' : 'ENVÍO A DOMICILIO'}
                        </td>
                    </tr>
                </table>

                <!-- Detalles del pago -->
                <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #A70000; font-size: 18px; margin-top: 0; margin-bottom: 15px; border-bottom: 1px dashed #ddd; padding-bottom: 10px;">
                        Información del Pago
                    </h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px; width: 40%;">ID de Pago:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                ${MercadoPago?.id || 'No disponible'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Método de pago:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                MercadoPago
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Estado:</td>
                            <td style="padding: 8px 0; color: #28a745; font-weight: 600; font-size: 14px;">
                                APROBADO
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Fecha de aprobación:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                ${formattedDate}
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Resumen de productos -->
                <h3 style="color: #A70000; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    Productos Comprados
                </h3>

                <div style="margin-bottom: 25px;">
                    ${products.map((product: any) => `
                        <div style="display: flex; margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                            <img src="${product.img}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
                            <div style="flex-grow: 1;">
                                <h4 style="margin: 0 0 5px; color: #333333; font-size: 16px;">${product.name}</h4>
                                <p style="margin: 0 0 5px; color: #666666; font-size: 14px;">Cantidad: ${product.quantity}</p>
                                <p style="margin: 0; color: #A70000; font-size: 15px; font-weight: 600;">$${product.precio}</p>
                                ${product.promocion && product.promocion.status === true ? 
                                    `<div style="margin-top: 8px; background-color: #f8f4ff; padding: 8px 12px; border-radius: 5px; display: inline-block;">
                                        <p style="margin: 0; color: #3a7e1a;"><strong>Descuento aplicado:</strong> ${product.promocion.descuento}% ($${(product.precio * product.promocion.descuento / 100)})</p>
                                        <p style="margin: 5px 0 0; font-weight: bold;">Subtotal: $${(product.precio - (product.precio * product.promocion.descuento / 100))}</p>
                                    </div>` 
                                    : `<p style="margin: 5px 0 0; font-weight: bold;">Subtotal: $${product.precio}</p>`}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Detalles de entrega -->
                <h3 style="color: #A70000; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    ${retiraEnLocal ? 'Información del Retiro' : 'Información de Entrega'}
                </h3>

                ${retiraEnLocal ? `
                    <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px dashed #ffcdd2;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span style="display: inline-block; background-color: #A70000; color: white; border-radius: 50px; padding: 8px 20px; font-size: 14px; font-weight: 600;">
                                RETIRO EN TIENDA
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <p style="margin: 0 0 5px; color: #333; font-size: 15px;">
                                <strong>Fecha de retiro:</strong> ${datosEnvio.fecha}
                            </p>
                            <p style="margin: 0; color: #333; font-size: 15px;">
                                <strong>Horario:</strong> ${datosEnvio.horario}
                            </p>
                        </div>

                        <div style="background-color: #350000; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                            <h4 style="color: #ff4d4d; margin-top: 0; margin-bottom: 10px; text-align: center; font-size: 16px;">
                                Dedicatoria Solicitada
                            </h4>
                            <p style="color: white; margin: 0; line-height: 1.5; text-align: center; font-style: italic;">
                                ${datosEnvio.dedicatoria ? `"${datosEnvio.dedicatoria}"` : 'SIN DEDICATORIA'}
                            </p>
                        </div>

                        <div style="background-color: #FEFEFE; padding: 15px; border-radius: 6px; border-left: 3px solid #A70000; margin-top: 15px;">
                            <p style="margin: 0; font-size: 15px;"><strong style="color: #A70000;">Recordatorio:</strong> Asegúrate de tener el pedido listo para la fecha y hora indicadas. El cliente ha sido informado que debe presentar identificación al retirar.</p>
                        </div>
                    </div>
                ` : `
                    <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px dashed #ffcdd2;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span style="display: inline-block; background-color: #A70000; color: white; border-radius: 50px; padding: 8px 20px; font-size: 14px; font-weight: 600;">
                                ENVÍO A DOMICILIO
                            </span>
                        </div>
                        
                        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
                            <div style="flex: 1; min-width: 250px; background-color: #FEFEFE; padding: 15px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                <h5 style="margin: 0 0 10px; color: #A70000; font-size: 16px;">Información personal</h5>
                                <p style="margin: 0 0 8px;"><strong style="color: #777; display: inline-block; width: 90px;">Nombre:</strong> ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}</p>
                                <p style="margin: 0 0 8px;"><strong style="color: #777; display: inline-block; width: 90px;">Teléfono:</strong> ${datosEnvio.phoneDestinatario}</p>
                            </div>
                            
                            <div style="flex: 1; min-width: 250px; background-color: #FEFEFE; padding: 15px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                <h5 style="margin: 0 0 10px; color: #A70000; font-size: 16px;">Información de entrega</h5>
                                <p style="margin: 0 0 8px;"><strong style="color: #777; display: inline-block; width: 90px;">Fecha:</strong> ${datosEnvio.fecha}</p>
                                <p style="margin: 0;"><strong style="color: #777; display: inline-block; width: 90px;">Horario:</strong> ${datosEnvio.horario}</p>
                            </div>
                        </div>
                        
                        <div style="background-color: #FEFEFE; padding: 15px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
                            <h5 style="margin: 0 0 10px; color: #A70000; font-size: 16px;">Dirección de entrega</h5>
                            <p style="margin: 0 0 8px;"><strong style="color: #777; display: inline-block; width: 90px;">Localidad:</strong> ${datosEnvio.localidad?.name}</p>
                            <p style="margin: 0 0 8px;"><strong style="color: #777; display: inline-block; width: 90px;">Dirección:</strong> ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso || ''}</p>
                            <p style="margin: 0;"><strong style="color: #777; display: inline-block; width: 90px;">Referencias:</strong> ${datosEnvio.referencias || 'No especificado'}</p>
                        </div>
                        
                        <div style="background-color: #FEFEFE; padding: 15px; border-radius: 6px; border-left: 3px solid #A70000; margin-bottom: 20px;">
                            <p style="margin: 0 0 8px; font-size: 15px;"><strong style="color: #A70000;">Detalles de envío:</strong></p>
                            <ul style="padding-left: 20px; margin: 0;">
                                <li style="margin-bottom: 8px;">Costo de envío: <strong>$${datosEnvio.precio_envio}</strong></li>
                                ${datosEnvio.servicioPremium ? 
                                    `<li style="margin-bottom: 8px;"><strong style="color: #A70000;">Servicio Premium</strong> contratado - Cargo adicional: <strong>$${datosEnvio.envioPremium}</strong></li>` : ''}
                                <li style="margin-bottom: 8px;">Verificar disponibilidad de repartidores para esta zona y horario.</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #350000; padding: 15px; border-radius: 8px;">
                            <h4 style="color: #ff4d4d; margin-top: 0; margin-bottom: 10px; text-align: center; font-size: 16px;">
                                Dedicatoria Solicitada
                            </h4>
                            <p style="color: white; margin: 0; line-height: 1.5; text-align: center; font-style: italic;">
                                ${datosEnvio.dedicatoria ? `"${datosEnvio.dedicatoria}"` : 'SIN DEDICATORIA'}
                            </p>
                            ${datosEnvio.dedicatoria ? `<p style="margin: 10px 0 0; font-size: 14px; color: white;">No olvides incluir esta tarjeta con el mensaje en el arreglo.</p>` : ''}
                        </div>
                    </div>
                `}

                <!-- Total -->
                <div style="background-color: #A70000; padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0;">
                    <h3 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">TOTAL DE LA VENTA: $${datosEnvio.totalPrice}</h3>
                </div>
                
                <!-- Botón para descargar PDF -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${pdfUrl.pdfURL}" style="display: inline-block; background-color: #A70000; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(167, 0, 0, 0.2);">
                        Descargar PDF de la Orden
                    </a>
                </div>

                <!-- Acciones requeridas -->
                <div style="background-color: #FFF9F9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #A70000;">
                    <h3 style="color: #A70000; margin-top: 0; font-size: 18px;">Acciones Requeridas:</h3>
                    <ol style="padding-left: 20px; margin-bottom: 0;">
                        <li style="margin-bottom: 10px;">Verificar la disponibilidad de todos los productos incluidos en la orden.</li>
                        <li style="margin-bottom: 10px;">Actualizar el estado del pedido a "En preparación" en el panel de administración.</li>
                        <li style="margin-bottom: 10px;">${retiraEnLocal ? 
                            'Preparar el arreglo para que esté listo en la fecha y horario de retiro indicados.' : 
                            'Coordinar con el servicio de entrega para asegurar la puntualidad.'}</li>
                        <li style="margin-bottom: 10px;">Contactar al cliente en caso de cualquier modificación necesaria.</li>
                        <li>Imprimir la orden para tenerla a mano durante la preparación.</li>
                    </ol>
                </div>

                <!-- Botones de gestión -->
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://envioflores.com/admin/orders/edit/${newCode}" style="display: inline-block; background-color: #2E7D32; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold; margin-right: 15px;">Gestionar pedido</a>
                    <a href="https://envioflores.com/admin" style="display: inline-block; background-color: #1976D2; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold;">Panel de administración</a>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                <a href="https://envioflores.com/admin" style="display: inline-block; margin-bottom: 15px;">            
                    <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 150px; height: auto;">
                </a>
                
                <p style="color: #777; font-size: 14px; margin: 0 0 5px;">Este correo fue generado automáticamente por el sistema de ventas de Envio Flores.</p>
                <p style="font-style: italic; color: #777; font-size: 12px; margin: 0;">Por favor no responder a este correo electrónico.</p>
            </div>
        </div>
    </body>
    </html>
`;

        // Crear el transportador
        const transporter = await createTransporter();

        // Enviar correo al comprador
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: `${datosComprador.email}`,
            // to: `${process.env.GMAIL_USER}`,
            subject: `✅ Confirmación de compra - Orden #${newCode} - Envío Flores`,
            html: compradorHtml
        });

        // Enviar correo al vendedor
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: `${process.env.GMAIL_USER}`,
            subject: `🔔 Nueva venta por MercadoPago #${newCode} - Envío Flores`,
            html: vendedorHtml
        });

        // Objeto para almacenar los datos de la orden pero que no se utiliza directamente
        // Lo declaramos como variable para evitar el warning del compilador
        const newOrderData = {
            payment: 'Mercado Pago Cuenta',
            order_number: newCode,
            MercadoPago,
            createdAt,
            products,
            datosComprador,
            retiraEnLocal,
            datosEnvio
        };
        
        await addDoc(collection(baseDeDatosServer, 'ordenes-envio-flores'), newOrderData);

        return NextResponse.json({ message: 'Correos enviados correctamente', success: true });

    } catch (error) {
        console.log('Error al procesar la solicitud o enviar correos:', error);
        return NextResponse.json({ error: 'Ocurrió un error al procesar la solicitud', details: error }, { status: 500 });
    }
}