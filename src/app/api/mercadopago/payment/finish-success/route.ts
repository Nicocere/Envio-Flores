import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import { format } from "date-fns";
import { es } from "date-fns/locale";


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

    const imgLogo = 'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-FloreriasArgentinas-dark.png?alt=media&token=c2ed19ee-c8da-4a7e-a86d-ace4c3bcbcc7';

    try {
        const formattedDate = format(new Date(createdAt), "PPPP 'a las' p", { locale: es });

        // Crear el contenido del correo para el comprador
        const compradorHtml = `
    <div style="font-family: Arial, sans-serif; color: #2f1a0f; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fcf5f0;">
        <div style="text-align: center;">
            <img src="${imgLogo}" alt="Logo Florerías Argentinas" style="width: 300px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #D4AF37;">¡Felicidades ${datosComprador.nombreComprador}!</h2>
        <p>Has realizado la compra exitosamente.</p>
        <p style="color: #2f1a0f;">Tu pedido está siendo procesado y será enviado a la brevedad.</p>
        <p>Por favor, revisa los detalles de tu compra a continuación:</p>

                                    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h3>Detalles de tu compra:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Fecha de compra:</strong> ${formattedDate}</li>
            <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Email:</strong> ${datosComprador.email}</li>
            <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Teléfono para contactarte:</strong> ${datosComprador.tel_comprador}</li>
            </ul>
                                        <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h3>Productos:</h3>
        <ul style="list-style: none; padding: 0;">
            ${products.map((product: { img: any; name: any; quantity: any; precio: number; promocion: {
                status: boolean; descuento: number; 
}; }) => `
                <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                    <img src="${product.img}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                    <div>
                        <p><strong style="color: #D4AF37;">Producto:</strong> ${product.name}</p>
                        <p><strong style="color: #D4AF37;">Cantidad:</strong> ${product.quantity}</p>
                        <p><strong style="color: #D4AF37;">Precio:</strong> $${product.precio}</p>
                        ${product.promocion && product.promocion?.status === true ? `<p><strong style="color: #D4AF37;">Descuento:</strong> ${product.promocion.descuento}%</p><p><strong style="color: #D4AF37;">Subtotal:</strong> $${(product.precio - (product.precio * product.promocion.descuento / 100)).toFixed(2)}</p>` : ''}
                    </div>
                </li>
            `).join('')}
        </ul>

                                    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h3>Detalles del envío:</h3>
        ${retiraEnLocal ? `
            <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            <p style="text-align: center;">Usted seleccionó que desea retirar el producto por nuestro local. 
            </p>
            <p style="text-align: center;">El día : <strong style="color: #D4AF37;">${datosEnvio.fecha}</strong></p>
            <p style="text-align: center;"> Entre las: <strong style="color: #D4AF37;">${datosEnvio.horario}</strong></p>

            <div style="text-align: center; margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #2f1a0f; color: white;">
                <h3 style="color: #D4AF37;">Dedicatoria:</h3>
                ${datosEnvio.dedicatoria ? `<p>${datosEnvio.dedicatoria}</p>` : `<p>SIN DEDICATORIA.</p> `}
            </div>

            <h4 style="color: #D4AF37;">Nuestra ubicación:</h4>
            <p style="text-align: center;">Av. Crámer 1915, CABA</p>
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" title="Ubicación"
            ></iframe>
            </div>
        ` : `
            <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Nombre del destinatario:</strong> ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Teléfono del destinatario:</strong> ${datosEnvio.phoneDestinatario}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Fecha de entrega:</strong> ${datosEnvio.fecha}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Horario de entrega:</strong> ${datosEnvio.horario}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Localidad:</strong> ${datosEnvio.localidad?.name}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Dirección:</strong> ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Precio del envío:</strong> $${datosEnvio.precio_envio}</li>
            </ul>
                <div style="text-align: center; margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #2f1a0f; color: white;">
                        <h3 style="color: #D4AF37;">Dedicatoria:</h3>
                        ${datosEnvio.dedicatoria ? `<p>${datosEnvio.dedicatoria}</p>` : `<p>SIN DEDICATORIA.</p>`}
                </div>
            </div>
        `}
                <h4 style="color: #D4AF37;">Total de la compra: $${datosEnvio.totalPrice}</h4>

                                    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <p>Gracias por confiar en nosotros.</p>
        <p>Si tienes alguna duda o consulta, no dudes en contactarnos.</p>
        <p>¡Que tengas un excelente día!</p>
        <p>Saludos cordiales.</p>
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

        // Crear el contenido del correo para el vendedor
        const vendedorHtml = `
    <div style="font-family: Arial, sans-serif; color: #2f1a0f; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fcf5f0;">
        <div style="text-align: center;">
            <img src="${imgLogo}" alt="Logo Florerías Argentinas" style="width: 300px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #D4AF37;">¡Hola Raúl!</h2>
        <p style="color: #2f1a0f;">Se ha realizado una nueva compra en Florerías Argentinas.</p>
        <p>Por favor, revisa los detalles de la compra a continuación:</p>

                            <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h3>Detalles de la compra:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Fecha que se realizo la compra:</strong> ${formattedDate}</li>
            <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Email del comprador:</strong> ${datosComprador.email}</li>
            <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Teléfono del comprador:</strong> ${datosComprador.tel_comprador}</li>
        </ul>
                            <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h3>Productos:</h3>
        <ul style="list-style: none; padding: 0;">
            ${products.map((product: { img: any; name: any; quantity: any; precio: number; promocion: {
                status: boolean; descuento: number; 
}; }) => `
                <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                    <img src="${product.img}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                    <div>
                        <p><strong style="color: #D4AF37;">Producto:</strong> ${product.name}</p>
                        <p><strong style="color: #D4AF37;">Cantidad:</strong> ${product.quantity}</p>
                        <p><strong style="color: #D4AF37;">Precio:</strong> $${product.precio}</p>
                        ${product.promocion && product?.promocion?.status === true ? `<p><strong style="color: #D4AF37;">Descuento:</strong> ${product.promocion.descuento}%</p><p><strong style="color: #D4AF37;">Subtotal:</strong> $${(product.precio - (product.precio * product.promocion.descuento / 100)).toFixed(2)}</p>` : ''}
                    </div>
                </li>
            `).join('')}
        </ul>
                                    <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h3>Detalles del envío:</h3>
        ${retiraEnLocal ? `
            <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
            <h3 style="color: #D4AF37;">RETIRA EN EL LOCAL.</h3>
            <p style="text-align: center;">El cliente seleccionó que desea retirar el producto por nuestro local.
            <p style="text-align: center;">El día : <strong style="color: #D4AF37;">${datosEnvio.fecha}</strong></p>
                <p style="text-align: center;"> Entre las: <strong style="color: #D4AF37;">${datosEnvio.horario}</strong></p>

                    <div style="text-align: center; margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #2f1a0f; color: white;">
                <h3 style="color: #D4AF37;">Dedicatoria:</h3>
                ${datosEnvio.dedicatoria ? `<p>${datosEnvio.dedicatoria}</p>` : `<p>SIN DEDICATORIA.</p>`}
                </div>
            </div>
        ` : `
        <div style="margin-bottom: 20px;">
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37; margin-bottom: 10px;">Nombre del destinatario:</strong> ${datosEnvio.nombreDestinatario} ${datosEnvio.apellidoDestinatario}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Teléfono del destinatario:</strong> ${datosEnvio.phoneDestinatario}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Fecha de entrega:</strong> ${datosEnvio.fecha}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Horario de entrega:</strong> ${datosEnvio.horario}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Localidad:</strong> ${datosEnvio.localidad?.name}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Dirección:</strong> ${datosEnvio.calle} ${datosEnvio.altura} ${datosEnvio.piso}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #D4AF37;">Precio del envío:</strong> $${datosEnvio.precio_envio}</li>
                </ul>
                
                
                <div style="text-align: center; margin-top: 20px; padding: 20px; border-radius: 8px; background-color: #2f1a0f; color: white;">
                <h3 style="color: #D4AF37;">Dedicatoria:</h3>
                ${datosEnvio.dedicatoria ? `<p>${datosEnvio.dedicatoria}</p>` : `<p>SIN DEDICATORIA.</p>`}
                </div>
        </div>
        `}

        <hr style="border: 1px solid #d4af37; margin: 10px 0;" />

        <h4 style="color: #D4AF37;">Total de la compra: $${datosEnvio.totalPrice}</h4>
            <p style="color: #2f1a0f;">Ingresa al Link para descargar el PDF de la compra</p>
            <a href="${pdfUrl.pdfURL}" style="background-color: #D4AF37; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Descargar PDF</a>
        
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
            to:  `${datosComprador.email}`,
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
            payment: 'Mercado Pago Cuenta',
            order_number: newCode,
            MercadoPago,
            createdAt,
            products,
            datosComprador,
            retiraEnLocal,
            datosEnvio
        };
        // await addDoc(collection(baseDeDatos, 'ordenes-floreriasargentinas'), newOrderData);

        return NextResponse.json({ message: 'Mails enviados' });

    } catch (error) {
        console.log('Hubo un error al procesar la solicitud al finalizar el proceso de compra: ', error);
        return NextResponse.json({ error: error });
    }
}