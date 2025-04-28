import {
  ApiError,
  Client,
  OrdersController,
  Environment,
  LogLevel
} from '@paypal/paypal-server-sdk';
import { NextResponse } from 'next/server';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_APP_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('Missing PayPal client ID or secret in environment variables');
}

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: clientId,
    oAuthClientSecret: clientSecret
  },
  timeout: 0,
  environment: Environment.Production,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true
    },
    logResponse: {
      logHeaders: true
    }
  },
});

const ordersController = new OrdersController(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderID } = body;

    

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const { result } = await ordersController.ordersCapture({
      id: orderID,
      prefer: 'return=representation'
    });

    if (result.status === 'COMPLETED') {
      return NextResponse.json({ ...result  });
    }

    console.log('El pago no se completó:', result);
    return NextResponse.json(
      { error: 'La captura del pago falló', details: result },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error completo:', error);
    
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}