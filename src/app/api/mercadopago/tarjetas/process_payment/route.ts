import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { randomUUID } from 'crypto'; // en Next.js (Node.js 18+)

export async function POST(request: Request) {
    const body = await request.json();

    try {
        // Extraer solo los datos necesarios
        const { datosEnvio, products, payMethod, formData } = body;

        console.log('BODY:', body);
        console.log('formData:', formData);
        console.log('payMethod:', payMethod);
        
        // Validar que los datos necesarios estén presentes
        if (!formData || !formData.token || !payMethod) {
            console.error('Datos de pago incompletos');
            return NextResponse.json({
                error: 'Datos de pago incompletos',
                message: 'Faltan datos necesarios para procesar el pago'
            }, { status: 400 });
        }

        // Datos que obtuve del envio
        const envioDatos = body;
        if (envioDatos.retiraEnLocal) {
            envioDatos.retiraEnLocal = true;
        }

        envioDatos.createdAt = new Date();
        let lastCode: number = 0;  // Inicializar con valor predeterminado

        const newOrder = lastCode + 1;
        envioDatos.order_number = newOrder;
        envioDatos.paginaCompra = 'Envio Flores';

        // Obtener el precio total del envío
        let shippingCost: number = 0;
        let title: string = 'Compra en Envio Flores';

        if (datosEnvio) {
            if (datosEnvio.servicioPremium) {
                shippingCost = Number(datosEnvio.precio_envio || 0) + Number(datosEnvio.envioPremium || 0);
                title = 'Costo de Envío + Servicio Premium';
            } else if (datosEnvio.precio_envio) {
                title = 'Costo de Envío';
                shippingCost = Number(datosEnvio.precio_envio);
            } else {
                title = 'Retira en el LOCAL';
            }
        }

        // Verificar token de acceso
        const accessToken = process.env.MP_EF_ACC_TOK;
        if (!accessToken) {
            console.error('Token de acceso no configurado');
            throw new Error('MP_EF_ACC_TOK is not defined');
        }

        // Inicializar el cliente de MercadoPago con la nueva API
        const client = new MercadoPagoConfig({
            accessToken: accessToken,
        });

        // Crear instancia del recurso Payment
        const payment = new Payment(client);

        // Construir el objeto de pago según la documentación actualizada
        const paymentData: any = {
            transaction_amount: Number(formData.transaction_amount),
            token: formData.token,
            description: title,
            installments: Number(formData.installments || 1),
            payment_method_id: formData.payment_method_id,
            payer: {
                email: formData.payer?.email || '',
            }
        };

        // Agregar identificación del pagador si está presente
        if (formData.payer?.identification) {
            paymentData.payer.identification = {
                type: formData.payer.identification.type,
                number: formData.payer.identification.number
            };
        }

        // Agregar issuer_id solo si está presente y es necesario
        if (formData.issuer_id) {
            paymentData.issuer_id = formData.issuer_id;
        }

        console.log('Enviando datos a MercadoPago:', JSON.stringify(paymentData, null, 2));

        try {
            // Procesar el pago con la nueva API - usando async/await en lugar de promesas
            const paymentResponse = await payment.create({
                body: paymentData
            });
            
            console.log('Respuesta de MercadoPago:', paymentResponse);
            
            // Manejar diferentes estados de pago
            const { status, status_detail, id } = paymentResponse;

            if (status === 'approved') {
                console.log('Pago aprobado');
                return NextResponse.json({ paymentResponse, status, id,  });
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
        } catch (paymentError: any) {
            console.error('Error específico de MercadoPago:', paymentError);
            
            // Extraer información detallada del error para el cliente
            const errorDetail = paymentError.cause ? 
                paymentError.cause[0]?.description : 
                'Error desconocido al procesar el pago';
                
            return NextResponse.json({
                error: 'Error al procesar el pago',
                message: errorDetail,
                details: paymentError
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Error general al procesar la solicitud:', error);
        return NextResponse.json({
            error: 'Hubo un error al procesar la solicitud',
            message: error.message || 'Error interno del servidor',
        }, { status: 500 });
    }
}