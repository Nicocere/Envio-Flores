
import mercadopago from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json()


    //    return NextResponse.json({ message: 'hola'});

    const { item, datosComprador, datosEnvio, CartID, products, mp_data, retiraEnLocal, MercadoPago } = body;

    // let usuarioRegistrado;
    const UserID = datosComprador.UserID;

    try {
        // Datos que obtuve del envio
        const envioDatos = body;
        if (envioDatos.retiraEnLocal) {
            envioDatos.retiraEnLocal = true
        }

        envioDatos.createdAt = new Date();
        let lastCode: number = 0;  // Initialize with a default value

        const newOrder = lastCode + 1;
        envioDatos.order_number = newOrder;
        envioDatos.paginaCompra = 'Florerias Argentinas'

        const mappedProducts = products.map((product: { id: any; name: any; quantity: any; precio: any; }) => {
            return {
                id: product.id,
                title: product.name,
                quantity: product.quantity,
                unit_price: Number(product.precio),
            };
        });

        // Obtener el precio total de tu envío
        let shippingCost: any;
        let title: string;

        if (datosEnvio.servicioPremium) {
            shippingCost = datosEnvio.precio_envio + datosEnvio.envioPremium; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
            title = 'Costo de Envío + Servicio Premium';
        } else if (datosEnvio.precio_envio) {
            title = 'Costo de Envío ';
            shippingCost = datosEnvio.precio_envio; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
        } else {
            title = 'Retira en el LOCAL ';
            shippingCost = 0; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
        }

        // Añadir el costo de envío como un ítem adicional
        const shippingItem = {
            id: 'ShippingCost',
            title: title,
            quantity: 1,
            unit_price: Number(shippingCost),
        };

        // Unir los productos mapeados con el ítem de envío
        const itemsForMercadoPago = [...mappedProducts, shippingItem];
        // Realiza el pago en Mercado Pago
        if (!process.env.MERCADOPAGO_EF_ACCESS_TOKEN) {
            throw new Error('MERCADOPAGO_EF_ACCESS_TOKEN is not defined');
        }
        mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_EF_ACCESS_TOKEN);

        const paymentResponse = await mercadopago.payment.save(mp_data.data);

        // Manejar diferentes estados de pago
        const { status, status_detail, id } = paymentResponse.body;

        if (status === 'approved') {
            // Pago aprobado
            console.log('Pago aprobado');
            return NextResponse.json({ status, status_detail, id });
        } else if (status === 'in_process') {
            // Pago en proceso
            console.log('Pago en proceso');
            return NextResponse.json({ status, status_detail, message: 'El pago está en proceso. Por favor, espere a que se complete la revisión.' });
        } else {
            // Otros estados de pago
            console.log('Pago no aprobado');
            return NextResponse.json({ status, status_detail, message: 'El pago no fue aprobado. Por favor, intente nuevamente.' });
        }
    } catch (error) {
        console.log('Hubo un error al procesar la solicitud: ', error);
        return NextResponse.json({ error: 'Hubo un error al procesar la solicitud.' });
    }
}