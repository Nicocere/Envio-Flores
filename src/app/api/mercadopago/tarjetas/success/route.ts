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
        createdAt,
        products,
        datosComprador,
        retiraEnLocal,
        datosEnvio,
        pdfUrl,
        newCode,
        payMethod,
        formData,
        paymentResponse,
        status,
        id
    } = body;

    const imgLogo = 'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23';

    try {
        const formattedDate = format(new Date(createdAt), "PPPP 'a las' p", { locale: es });
        
        // Formatear información de la tarjeta
        const cardInfo = payMethod ? {
            tipo: payMethod.paymentTypeId === 'credit_card' ? 'Crédito' : 'Débito',
            ultimos4: payMethod.lastFourDigits || '****',
            marca: formData?.payment_method_id || '',
            titular: payMethod.cardholderName || '',
            cuotas: formData?.installments || 1
        } : null;
        
        // Formatear fecha de aprobación del pago si está disponible
        const fechaAprobacion = paymentResponse && paymentResponse.date_approved 
            ? format(new Date(paymentResponse.date_approved), "PPPP 'a las' p", { locale: es })
            : formattedDate;

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
                        ID de Pago: ${id || 'No disponible'}
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
                        Tu pago ha sido procesado y aprobado exitosamente.
                    </p>
                </div>

                <!-- Detalles de pago con tarjeta -->
                <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #A70000; font-size: 18px; margin-top: 0; margin-bottom: 15px; border-bottom: 1px dashed #ddd; padding-bottom: 10px;">
                        Detalles del Pago
                    </h3>
                    
                    <div style="display: flex; flex-wrap: wrap; margin-bottom: 15px;">
                        <div style="flex-basis: 50%; margin-bottom: 10px;">
                            <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Método de pago</p>
                            <p style="color: #333; font-size: 15px; font-weight: 500; margin: 0;">
                                Tarjeta ${cardInfo?.marca?.toUpperCase() || 'No disponible'}
                            </p>
                        </div>
                        <div style="flex-basis: 50%; margin-bottom: 10px;">
                            <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Tipo</p>
                            <p style="color: #333; font-size: 15px; font-weight: 500; margin: 0;">
                                ${cardInfo?.tipo || 'No especificado'}
                            </p>
                        </div>
                        <div style="flex-basis: 50%; margin-bottom: 10px;">
                            <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Últimos dígitos</p>
                            <p style="color: #333; font-size: 15px; font-weight: 500; margin: 0;">
                                **** **** **** ${cardInfo?.ultimos4 || '****'}
                            </p>
                        </div>
                        <div style="flex-basis: 50%; margin-bottom: 10px;">
                            <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Titular</p>
                            <p style="color: #333; font-size: 15px; font-weight: 500; margin: 0;">
                                ${cardInfo?.titular || 'No disponible'}
                            </p>
                        </div>
                        <div style="flex-basis: 50%;">
                            <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Cuotas</p>
                            <p style="color: #333; font-size: 15px; font-weight: 500; margin: 0;">
                                ${cardInfo?.cuotas || 1}
                            </p>
                        </div>
                        <div style="flex-basis: 50%;">
                            <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Estado</p>
                            <p style="color: #28a745; font-size: 15px; font-weight: 600; margin: 0;">
                                Aprobado
                            </p>
                        </div>
                    </div>
                    
                    <div style="background-color: #fff; border-radius: 6px; padding: 10px; border: 1px dashed #ddd;">
                        <p style="color: #666; font-size: 13px; margin: 0 0 3px;">Fecha de aprobación</p>
                        <p style="color: #333; font-size: 14px; margin: 0;">${fechaAprobacion}</p>
                    </div>
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
                                <p style="margin: 0; color: #A70000; font-size: 15px; font-weight: 600;">$${product.precio.toLocaleString('es-AR')}</p>
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
                                <strong>Fecha de retiro:</strong> ${datosEnvio.fecha}
                            </p>
                            <p style="margin: 0; color: #333; font-size: 15px;">
                                <strong>Horario:</strong> ${datosEnvio.horario}
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
                                ENVÍO A DOMICILIO
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
                                        ${datosEnvio.calle} ${datosEnvio.altura}${datosEnvio.piso ? `, ${datosEnvio.piso}` : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Costo de envío:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                        $${datosEnvio.precio_envio}
                                    </td>
                                </tr>
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
                    <h3 style="color: white; margin: 0; font-size: 18px;">Total pagado: $${datosEnvio.totalPrice.toLocaleString('es-AR')}</h3>
                </div>

                <!-- Información adicional -->
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #A70000; margin-top: 0; margin-bottom: 15px; font-size: 18px;">¿Necesitas ayuda?</h3>
                    <p style="margin: 0 0 10px; color: #555; line-height: 1.6;">
                        Si tienes alguna pregunta sobre tu compra, no dudes en contactarnos:
                    </p>
                    <ul style="padding-left: 20px; margin-bottom: 0;">
                        <li style="margin-bottom: 8px; color: #555;">WhatsApp: +54 11 3140-8060</li>
                        <li style="margin-bottom: 8px; color: #555;">Email: info@envioflores.com</li>
                        <li style="color: #555;">Horario de atención: Lunes a Sábado de 7:00 a 18:00 hs</li>
                    </ul>
                </div>

                <p style="color: #555; font-style: italic; text-align: center; margin-top: 30px; margin-bottom: 5px;">
                    ¡Gracias por confiar en nosotros para tus momentos especiales!
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
                <h1 style="color: #ffffff; margin-top: 15px; font-size: 24px; font-weight: 600;">¡Nueva venta con tarjeta!</h1>
                <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0;">Orden #${newCode} - ${formattedDate}</p>
            </div>

            <!-- Contenido principal -->
            <div style="padding: 30px 25px;">
                <div style="background-color: #e9f7ef; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: center;">
                    <h2 style="color: #28a745; margin-top: 0; margin-bottom: 10px; font-size: 20px;">
                        ¡Pago Aprobado!
                    </h2>
                    <p style="margin: 0; color: #333; font-size: 15px;">
                        El pago ha sido procesado exitosamente mediante tarjeta ${formData?.payment_method_id?.toUpperCase() || 'No disponible'}
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
                                ${id || 'No disponible'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Tarjeta:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                ${cardInfo?.marca?.toUpperCase() || 'No disponible'} (${cardInfo?.tipo || 'No especificado'})
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Número:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                **** **** **** ${cardInfo?.ultimos4 || '****'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Titular:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                ${cardInfo?.titular || 'No disponible'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 14px;">Cuotas:</td>
                            <td style="padding: 8px 0; color: #333; font-weight: 500; font-size: 14px;">
                                ${cardInfo?.cuotas || 1}
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
                                ${fechaAprobacion}
                            </td>
                        </tr>
                    </table>

                    ${paymentResponse && paymentResponse.transaction_details ? `
                        <div style="background-color: #fff; border-radius: 6px; padding: 12px; border: 1px dashed #ddd;">
                            <h4 style="margin-top: 0; margin-bottom: 10px; color: #A70000; font-size: 15px;">
                                Detalles adicionales
                            </h4>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;">
                                <span style="font-weight: 500;">Monto total pagado:</span> $${paymentResponse.transaction_details.total_paid_amount.toLocaleString('es-AR')}
                            </p>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;">
                                <span style="font-weight: 500;">Monto neto recibido:</span> $${paymentResponse.transaction_details.net_received_amount.toLocaleString('es-AR')}
                            </p>
                            ${paymentResponse.fee_details && paymentResponse.fee_details.length > 0 ? `
                                <p style="margin: 5px 0; color: #333; font-size: 14px;">
                                    <span style="font-weight: 500;">Comisión:</span> $${paymentResponse.fee_details[0].amount.toLocaleString('es-AR')}
                                </p>
                            ` : ''}
                        </div>
                    ` : ''}
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
                                <p style="margin: 0; color: #A70000; font-size: 15px; font-weight: 600;">$${product.precio.toLocaleString('es-AR')}</p>
                                ${product.promocion && product.promocion.status === true ? 
                                    `<p style="margin: 5px 0 0; color: #28a745; font-size: 13px;">
                                        Descuento: ${product.promocion.descuento}%
                                    </p>` : ''}
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
                    </div>
                ` : `
                    <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px dashed #ffcdd2;">
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span style="display: inline-block; background-color: #A70000; color: white; border-radius: 50px; padding: 8px 20px; font-size: 14px; font-weight: 600;">
                                ENVÍO A DOMICILIO
                            </span>
                        </div>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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
                                    ${datosEnvio.calle} ${datosEnvio.altura}${datosEnvio.piso ? `, ${datosEnvio.piso}` : ''}
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
                                        Sí ($${datosEnvio.envioPremium})
                                    </td>
                                </tr>
                            ` : ''}
                        </table>

                        <div style="background-color: #350000; padding: 15px; border-radius: 8px;">
                            <h4 style="color: #ff4d4d; margin-top: 0; margin-bottom: 10px; text-align: center; font-size: 16px;">
                                Dedicatoria Solicitada
                            </h4>
                            <p style="color: white; margin: 0; line-height: 1.5; text-align: center; font-style: italic;">
                                ${datosEnvio.dedicatoria ? `"${datosEnvio.dedicatoria}"` : 'SIN DEDICATORIA'}
                            </p>
                        </div>
                    </div>
                `}

                <!-- Total -->
                <div style="background-color: #A70000; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <h3 style="color: white; margin: 0; font-size: 18px;">Total de la venta: $${datosEnvio.totalPrice.toLocaleString('es-AR')}</h3>
                </div>

                <!-- Botón para descargar PDF -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${pdfUrl.pdfURL}" style="display: inline-block; background-color: #A70000; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(167, 0, 0, 0.2);">
                        Descargar PDF de la Orden
                    </a>
                </div>

                <!-- Información adicional -->
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center;">
                    <h3 style="color: #A70000; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Acciones Requeridas</h3>
                    <p style="margin: 0 0 15px; color: #555; line-height: 1.6;">
                        Por favor, asegúrate de verificar todos los detalles antes de preparar el pedido y actualizar el estado en el sistema cuando esté procesado.
                    </p>
                    <a href="https://envioflores.com/admin" style="display: inline-block; background-color: #333; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: 500; font-size: 14px;">
                        Ir al Panel de Administración
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                <a href="https://envioflores.com" style="display: inline-block; margin-bottom: 15px;">
                    <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 150px; height: auto;">
                </a>
                
                <p style="color: #777; font-size: 12px; margin: 0;">
                    &copy; ${new Date().getFullYear()} Envío Flores. Todos los derechos reservados.
                </p>
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
            subject: `🔔 Nueva venta con tarjeta #${newCode} - Envío Flores`,
            html: vendedorHtml
        });

        // Guardar los datos de la orden en Firebase
        const newOrderData = {
            payment: 'Tarjeta ' + formData?.payment_method_id?.toUpperCase(),
            payment_id: id,
            order_number: newCode,
            cardDetails: {
                type: cardInfo?.tipo,
                last_digits: cardInfo?.ultimos4,
                brand: cardInfo?.marca?.toUpperCase(),
                holder_name: cardInfo?.titular,
                installments: cardInfo?.cuotas
            },
            createdAt,
            products,
            datosComprador,
            retiraEnLocal,
            datosEnvio,
            status: 'approved'
        };
        
        await addDoc(collection(baseDeDatosServer, 'ordenes-envio-flores'), newOrderData);

        return NextResponse.json({ message: 'Correos enviados correctamente', success: true });

    } catch (error) {
        console.log('Error al procesar la solicitud o enviar correos:', error);
        return NextResponse.json({ error: 'Ocurrió un error al procesar la solicitud', details: error }, { status: 500 });
    }
}