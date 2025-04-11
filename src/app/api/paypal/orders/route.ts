import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  LogLevel,
  OrdersController,
  Environment,
  Configuration
} from '@paypal/paypal-server-sdk';
import { NextResponse } from 'next/server';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_APP_SECRET;

// Validación más estricta de credenciales
if (!clientId || !clientSecret) {
  throw new Error('Missing PayPal client ID or secret');
}

if (clientId.length < 10 || clientSecret.length < 10) {
  throw new Error('PayPal credentials appear to be invalid');
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
    const { price } = body;
    
    if (!price || isNaN(price)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: price.toString(),
            },
          }
        ],
      },
      prefer: 'return=minimal'
    };

    const { result } = await ordersController.ordersCreate(collect);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error completo:', error);
    
    if (error instanceof ApiError) {
      const errorMessage = error.body ? JSON.parse(error.body.toString()).error_description : error.message;
      console.error('Error de API PayPal:', errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: error.statusCode || 500 });
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}