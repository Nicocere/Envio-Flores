import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
    const body = await request.json()
    const { retiraEnLocal, datosEnvio, products } = body;

    console.log('Datos recibidos:', body);

    try {
        const envioDatos = body;
        envioDatos.createdAt = new Date();
        const mappedProducts = products.map((product: {
            promocion: any;
            id: any; item: { id: any; }; name: any; quantity: any; precio: any;
        }) => {
            return {
                id: product.id,
                title: product.name,
                quantity: product.quantity,
                unit_price: Number(product.promocion && product.promocion?.status === true ? (product.precio - (product.precio * product.promocion.descuento / 100)).toFixed(2) : product.precio)
            };
        });

        // Obtener el precio total de tu envío
        let shippingCost: number;
        let title: string;

        if (datosEnvio.servicioPremium && retiraEnLocal === false) {
            shippingCost = datosEnvio.precio_envio + datosEnvio.envioPremium; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
            title = 'Costo de Envío + Servicio Premium';
        } else if (!datosEnvio.servicioPremium && datosEnvio.precio_envio && retiraEnLocal === false) {
            title = 'Costo de Envío';
            shippingCost = datosEnvio.precio_envio; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
        } else if (retiraEnLocal === true) {
            title = 'Retira en el LOCAL';
            shippingCost = 0; // Asume que tienes un campo llamado "shippingCost" en datosEnvio
        } else {
            title = 'Opción no válida';
            shippingCost = 0;
        }
        // Añadir el costo de envío como un ítem adicional
        const shippingItem = {
            id: 'ShippingCost', // ID que identifique el costo de envío
            title: title,
            quantity: 1,
            unit_price: Number(shippingCost),
        };

        // Unir los productos mapeados con el ítem de envío
        const itemsForMercadoPago = [...mappedProducts, shippingItem];

        // Add Your credentials
        const accessToken = process.env.MP_EF_ACC_TOK_TEST;
        if (!accessToken) {
            throw new Error('MP_EF_ACC_TOK_TEST is not configured in environment variables');
        }
        
        // Inicializar el cliente de MercadoPago con la nueva API
        const client = new MercadoPagoConfig({ 
            accessToken: accessToken 
        });
        
        // Instanciar el recurso Preference
        const preference = new Preference(client);
        
        // Crear la preferencia con los datos necesarios
        const preferenceData = {
            binary_mode: true,
            purpose: 'wallet_purchase',
            items: itemsForMercadoPago,
            back_urls: {
                success: `http://localhost:3000/compras/mercadopago/exitoso`, 
                failure: 'https://www.floreriasargentinas.com/pago-fallido',
                pending: 'https://www.floreriasargentinas.com/pago-pendiente',
            },
            auto_return: "approved" as "approved" | "all",
        };

        const response = await preference.create({ body: preferenceData });
        const preferenceId = response.id;

        // Verificar que la preferencia se creó correctamente
        if (preferenceId) {
            await preference.get({ preferenceId: preferenceId });
        }

        // Devuelve la preferencia creada al frontend
        return NextResponse.json({ preferenceId });

    } catch (error) {
        console.log('Hubo un error al procesar la solicitud: ', error);
        return NextResponse.json({ error: error })
    }
}