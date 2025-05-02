import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { randomUUID } from 'crypto'; 

export async function POST(request: Request) {
    const body = await request.json()
    const { retiraEnLocal, datosEnvio, products } = body;

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
            shippingCost = datosEnvio.precio_envio + datosEnvio.envioPremium;
            title = 'Costo de Envío + Servicio Premium';
        } else if (!datosEnvio.servicioPremium && datosEnvio.precio_envio && retiraEnLocal === false) {
            title = 'Costo de Envío';
            shippingCost = datosEnvio.precio_envio;
        } else if (retiraEnLocal === true) {
            title = 'Retira en el LOCAL';
            shippingCost = 0;
        } else {
            title = 'Opción no válida';
            shippingCost = 0;
        }
        
        const shippingItem = {
            id: 'ShippingCost',
            title: title,
            quantity: 1,
            unit_price: Number(shippingCost),
        };

        const itemsForMercadoPago = [...mappedProducts, shippingItem];

        const accessToken = process.env.MP_EF_ACC_TOK;
        if (!accessToken) {
            throw new Error('MP_EF_ACC_TOK is not configured in environment variables');
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        
        const client = new MercadoPagoConfig({ 
            accessToken: accessToken ,
            options: {
                timeout: 5000,
                idempotencyKey: randomUUID(), 
                },
              
        });
        
        const preference = new Preference(client);
        
        const preferenceData = {
            binary_mode: true,
            payment_methods:{
                excluded_payment_types: [],
                installments: 1,
            },
            statement_descriptor: 'Envio Flores',
            items: itemsForMercadoPago,
            back_urls: {
                success: `${baseUrl}/compras/mercadopago/exitoso`,
                failure: `${baseUrl}/compras/mercadopago/fallido`,
                pending: `${baseUrl}/compras/mercadopago/pendiente`,
            },
            auto_return: "approved",
        };

        const response = await preference.create({ body: preferenceData });
        const preferenceId = response.id;

        // Verificar que la preferencia se creó correctamente
        if (!preferenceId) {
            throw new Error('No se pudo generar el ID de preferencia');
        }


        // Devuelve la preferencia creada al frontend
        return NextResponse.json({ 
            success: true,
            preferenceId,
            init_point: response.init_point
        });

    } catch (error: any) {
        console.error('Error en API de MercadoPago:', error);
        
        // Respuesta de error más detallada
        return NextResponse.json({ 
            success: false,
            error: error.message || 'Error desconocido',
            details: error.cause || error.error || error,
            status: error.status || 500 
        }, { status: error.status || 500 });
    }
}