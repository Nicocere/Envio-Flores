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
    <div style="font-family: "Nexa", sans-serif; color: #333333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E0E0E0; border-radius: 12px; background-color: #FCFCFC;">
        <div style="text-align: center;">
            <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 300px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #A70000;">¡Felicidades ${datosComprador.nombreComprador}!</h2>
        <p>Tu compra ha sido realizada con éxito.</p>
        <p style="color: #333333;">Estamos preparando tu pedido con mucho cariño para entregarlo en la fecha solicitada.</p>
        <p>A continuación encontrarás los detalles de tu compra:</p>

        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <h3 style="color: #A70000;">Detalles de tu compra:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Fecha de compra:</strong> ${formattedDate}</li>
            <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Email:</strong> ${datosComprador.email}</li>
            <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Teléfono para contactarte:</strong> ${datosComprador.tel_comprador}</li>
        </ul>
        
        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <h3 style="color: #A70000;">Productos:</h3>
        <ul style="list-style: none; padding: 0;">
            ${products.map((product: {
            img: any; name: any; quantity: any; precio: number; promocion: {
                status: boolean; descuento: number;
            };
        }) => `
                <li style="border-bottom: 1px solid #E0E0E0; padding: 10px 0; display: flex; align-items: center;">
                    <img src="${product.img}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div>
                        <p><strong style="color: #A70000;">Producto:</strong> ${product.name}</p>
                        <p><strong style="color: #A70000;">Cantidad:</strong> ${product.quantity}</p>
                        <p><strong style="color: #A70000;">Precio:</strong> $${product.precio}</p>
                        ${product.promocion && product.promocion?.status === true ? `<p><strong style="color: #00C853;">Descuento:</strong> ${product.promocion.descuento}%</p><p><strong style="color: #A70000;">Subtotal:</strong> $${(product.precio - (product.precio * product.promocion.descuento / 100)).toFixed(2)}</p>` : ''}
                    </div>
                </li>
            `).join('')}
        </ul>

        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <h3 style="color: #A70000;">Detalles del envío:</h3>
        ${retiraEnLocal ? `
            <div style="background-color: #FFF5F5; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffcaca;">
                <p style="text-align: center; font-weight: bold; color: #333333;">Has seleccionado retirar tu pedido en nuestra tienda</p>
                <p style="text-align: center; margin-bottom: 5px;">Fecha de retiro: <strong style="color: #A70000;">${datosEnvio.fecha}</strong></p>
                <p style="text-align: center; margin-bottom: 20px;">Horario: <strong style="color: #A70000;">${datosEnvio.horario}</strong></p>

                <div style="text-align: center; margin: 20px 0; padding: 20px; border-radius: 8px; background-color: #350000; color: #FFFFFF;">
                    <h3 style="color: #ff4d4d;">Tu dedicatoria:</h3>
                    ${datosEnvio.dedicatoria ? `<p style="line-height: 1.5;">${datosEnvio.dedicatoria}</p>` : `<p>No se incluyó dedicatoria para este pedido.</p>`}
                </div>

                <h4 style="color: #A70000; text-align: center; margin-top: 20px;">Nuestra ubicación:</h4>
                <p style="text-align: center; font-weight: 500;">Av. Crámer 1915, CABA</p>
                <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" 
                    title="Ubicación"
                    style="border-radius: 8px; margin-top: 10px; border: 1px solid #E0E0E0;"
                ></iframe>
            </div>
        ` : `
            <div style="background-color: #FFF5F5; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffcaca;">
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Destinatario:</strong> ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Teléfono de contacto:</strong> ${datosEnvio.phoneDestinatario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Fecha de entrega:</strong> ${datosEnvio.fecha}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Horario de entrega:</strong> ${datosEnvio.horario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Localidad:</strong> ${datosEnvio.localidad?.name}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Dirección completa:</strong> ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Costo de envío:</strong> $${datosEnvio.precio_envio}</li>
                </ul>
                
                <div style="text-align: center; margin: 20px 0; padding: 20px; border-radius: 8px; background-color: #350000; color: #FFFFFF;">
                    <h3 style="color: #ff4d4d;">Tu dedicatoria:</h3>
                    ${datosEnvio.dedicatoria ? `<p style="line-height: 1.5;">${datosEnvio.dedicatoria}</p>` : `<p>No se incluyó dedicatoria para este pedido.</p>`}
                </div>
            </div>
        `}
        
        <h4 style="color: #A70000; font-size: 1.25rem; text-align: center; margin: 20px 0; padding: 10px; background-color: #FFF5F5; border-radius: 8px;">Total de tu compra: $${datosEnvio.totalPrice}</h4>

        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <div style="background-color: #FFF5F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #A70000; text-align: center; margin-bottom: 10px;">¿Tienes alguna pregunta?</h3>
            <p style="text-align: center; margin-bottom: 5px;">Estamos disponibles para ayudarte en cualquier momento.</p>
            <p style="text-align: center; margin-bottom: 0;">Puedes contactarnos por WhatsApp o respondiendo a este email.</p>
        </div>

        <p style="margin-top: 20px;">¡Gracias por confiar en <strong style="color: #A70000;">Envio Flores</strong> para tus momentos especiales!</p>
        <p>Te deseamos un excelente día.</p>
        <p>Saludos cordiales,</p>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://envioflores.com" style="display: inline-block;">            
                <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 150px; margin-bottom: 10px;">
            </a>
        </div>
        
        <div style="background-color: #FFF5F5; padding: 10px; text-align: center; margin: 30px 0 0; border-radius: 8px;">
            <p style="margin: 0; color: #A70000;"><em>Equipo Envio Flores</em></p>
        </div>
    </div>
`;

        // Crear el contenido del correo para el vendedor
        const vendedorHtml = `
    <div style="font-family: "Nexa", sans-serif; color: #333333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E0E0E0; border-radius: 12px; background-color: #FCFCFC;">
        <div style="text-align: center;">
            <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 300px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #A70000;">¡Nueva venta realizada!</h2>
        <p style="color: #333333; font-weight: 500; font-size: 1.1em;">Se ha recibido un nuevo pedido en Envio Flores.</p>
        <p>A continuación encontrarás todos los detalles del pedido:</p>

        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <h3 style="color: #A70000;">Información de la compra:</h3>
        <div style="background-color: #FFF5F5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Fecha de compra:</strong> ${formattedDate}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Número de orden:</strong> #${newCode}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Email del cliente:</strong> ${datosComprador.email}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Teléfono del cliente:</strong> ${datosComprador.tel_comprador}</li>
                <li style="margin-bottom: 0;"><strong style="color: #A70000;">Nombre del comprador:</strong> ${datosComprador.nombreComprador} ${datosComprador.apellidoComprador}</li>
            </ul>
        </div>
        
        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <h3 style="color: #A70000;">Detalle de productos:</h3>
        <ul style="list-style: none; padding: 0;">
            ${products.map((product: {
            img: any; name: any; quantity: any; precio: number; promocion: {
                status: boolean; descuento: number;
            };
        }) => `
                <li style="border-bottom: 1px solid #E0E0E0; padding: 12px 0; display: flex; align-items: center;">
                    <img src="${product.img}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div style="flex-grow: 1;">
                        <p style="margin: 0 0 5px;"><strong style="color: #A70000;">Producto:</strong> ${product.name}</p>
                        <p style="margin: 0 0 5px;"><strong style="color: #A70000;">Cantidad:</strong> ${product.quantity}</p>
                        <p style="margin: 0 0 5px;"><strong style="color: #A70000;">Precio unitario:</strong> $${product.precio}</p>
                        ${product.promocion && product?.promocion?.status === true ? 
                            `<p style="margin: 0 0 5px;"><strong style="color: #00C853;">Descuento aplicado:</strong> ${product.promocion.descuento}%</p>
                             <p style="margin: 0;"><strong style="color: #A70000;">Subtotal:</strong> $${(product.precio - (product.precio * product.promocion.descuento / 100)).toFixed(2)}</p>` 
                             : ''}
                    </div>
                </li>
            `).join('')}
        </ul>
        
        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <h3 style="color: #A70000;">Información de entrega:</h3>
        ${retiraEnLocal ? `
            <div style="background-color: #FFF5F5; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffcaca;">
                <h3 style="color: #A70000; text-align: center; margin-top: 0;">RETIRO EN TIENDA</h3>
                <p style="text-align: center; margin-bottom: 5px;">El cliente retirará su pedido personalmente.</p>
                <p style="text-align: center; margin-bottom: 5px;"><strong style="color: #A70000;">Fecha de retiro:</strong> ${datosEnvio.fecha}</p>
                <p style="text-align: center; margin-bottom: 15px;"><strong style="color: #A70000;">Horario:</strong> ${datosEnvio.horario}</p>
                
                <div style="text-align: center; margin: 20px 0; padding: 20px; border-radius: 8px; background-color: #350000; color: #FFFFFF;">
                    <h3 style="color: #ff4d4d; margin-top: 0;">Dedicatoria solicitada:</h3>
                    ${datosEnvio.dedicatoria ? `<p style="line-height: 1.5;">${datosEnvio.dedicatoria}</p>` : `<p>SIN DEDICATORIA</p>`}
                </div>
            </div>
        ` : `
            <div style="background-color: #FFF5F5; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffcaca;">
                <h3 style="color: #A70000; text-align: center; margin-top: 0;">ENVÍO A DOMICILIO</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Destinatario:</strong> ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Teléfono de contacto:</strong> ${datosEnvio.phoneDestinatario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Fecha de entrega:</strong> ${datosEnvio.fecha}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Horario de entrega:</strong> ${datosEnvio.horario}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Localidad:</strong> ${datosEnvio.localidad?.name}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Dirección completa:</strong> ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso}</li>
                    <li style="margin-bottom: 10px;"><strong style="color: #A70000;">Costo de envío:</strong> $${datosEnvio.precio_envio}</li>
                    ${datosEnvio.servicioPremium ? 
                        `<li style="margin-bottom: 10px;"><strong style="color: #A70000;">Servicio Premium:</strong> Sí (costo adicional: $${datosEnvio.envioPremium})</li>` : ''}
                </ul>
                
                <div style="text-align: center; margin: 20px 0; padding: 20px; border-radius: 8px; background-color: #350000; color: #FFFFFF;">
                    <h3 style="color: #ff4d4d; margin-top: 0;">Dedicatoria solicitada:</h3>
                    ${datosEnvio.dedicatoria ? `<p style="line-height: 1.5;">${datosEnvio.dedicatoria}</p>` : `<p>SIN DEDICATORIA</p>`}
                </div>
            </div>
        `}

        <h4 style="color: #FFFFFF; font-size: 1.25rem; text-align: center; margin: 20px 0; padding: 15px; background-color: #A70000; border-radius: 8px;">Total de la venta: $${datosEnvio.totalPrice}</h4>
        
        <div style="text-align: center; margin: 25px 0;">
            <a href="${pdfUrl.pdfURL}" style="display: inline-block; background-color: #A70000; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 12px rgba(167, 0, 0, 0.2);">Descargar PDF de la orden</a>
        </div>
        
        <hr style="border: 1px solid #ff4d4d; margin: 16px 0;" />

        <p style="margin-top: 20px;">Recuerda verificar todos los detalles antes de preparar el pedido.</p>
        <p>Si necesitas más información, puedes revisar el panel de administración.</p>
        
        <div style="background-color: #FFF5F5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: 500;">No olvides actualizar el estado del pedido en el sistema una vez procesado.</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://envioflores.com/admin" style="display: inline-block;">            
                <img src="${imgLogo}" alt="Logo Envio Flores" style="width: 150px; margin-bottom: 10px;">
            </a>
        </div>
        
        <div style="background-color: #FFF5F5; padding: 10px; text-align: center; margin: 30px 0 0; border-radius: 8px;">
            <p style="margin: 0; color: #A70000;"><em>Equipo Envio Flores</em></p>
        </div>
    </div>
`;

        // Crear el transportador
        const transporter = await createTransporter();

        // Enviar correo al comprador
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            // to: `${datosComprador.email}`,
            to: `${process.env.GMAIL_USER}`,
            subject: `✅ Confirmación de compra  - Orden #${newCode} - Envio Flores`,
            html: compradorHtml
        });

        // Enviar correo al vendedor
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: `${process.env.GMAIL_USER}`,
            subject: `🔔 Nueva venta por MercadoPago #${newCode} - Envio Flores`,
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