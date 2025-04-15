import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: Request) {
    const body = await request.json();

    try {
        // Extraer solo los datos necesarios
        const { datosComprador, datosEnvio, products, mp_data } = body;

        // Datos que obtuve del envio
        const envioDatos = body;
        if (envioDatos.retiraEnLocal) {
            envioDatos.retiraEnLocal = true;
        }

        envioDatos.createdAt = new Date();
        let lastCode: number = 0;  // Inicializar con valor predeterminado

        const newOrder = lastCode + 1;
        envioDatos.order_number = newOrder;
        envioDatos.paginaCompra = 'Florerias Argentinas';

        // Mapeo de productos
        const mappedProducts = products.map((product: { id: any; name: any; quantity: any; precio: any; }) => {
            return {
                id: product.id,
                title: product.name,
                quantity: product.quantity,
                unit_price: Number(product.precio),
            };
        });

        // Obtener el precio total del envío
        let shippingCost: any;
        let title: string;

        if (datosEnvio.servicioPremium) {
            shippingCost = datosEnvio.precio_envio + datosEnvio.envioPremium;
            title = 'Costo de Envío + Servicio Premium';
        } else if (datosEnvio.precio_envio) {
            title = 'Costo de Envío';
            shippingCost = datosEnvio.precio_envio;
        } else {
            title = 'Retira en el LOCAL';
            shippingCost = 0;
        }

        // Añadir el costo de envío como un ítem adicional
        const shippingItem = {
            id: 'ShippingCost',
            title: title,
            quantity: 1,
            unit_price: Number(shippingCost),
        };

        // Verificar token de acceso
        const accessToken = process.env.MP_EF_ACC_TOK;
        if (!accessToken) {
            throw new Error('MP_EF_ACC_TOK is not defined');
        }

        // Inicializar el cliente de MercadoPago con la nueva API
        const client = new MercadoPagoConfig({ 
            accessToken: accessToken 
        });
        
        // Crear instancia del recurso Payment
        const payment = new Payment(client);
        
        // Procesar el pago con la nueva API
        const paymentResponse = await payment.create({
            body: mp_data.data
        });

        // Manejar diferentes estados de pago
        const { status, status_detail, id } = paymentResponse;

        if (status === 'approved') {
            console.log('Pago aprobado');
            return NextResponse.json({ status, status_detail, id });
        } else if (status === 'in_process') {
            console.log('Pago en proceso');
            return NextResponse.json({ 
                status, 
                status_detail, 
                message: 'El pago está en proceso. Por favor, espere a que se complete la revisión.' 
            });
        } else {
            console.log('Pago no aprobado');
            return NextResponse.json({ 
                status, 
                status_detail, 
                message: 'El pago no fue aprobado. Por favor, intente nuevamente.' 
            });
        }
    } catch (error) {
        console.error('Hubo un error al procesar la solicitud:', error);
        return NextResponse.json({ 
            error: 'Hubo un error al procesar la solicitud.' 
        });
    }
}