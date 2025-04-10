import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CartProvider from './context/CartContext';
import SearchProvider from './context/SearchContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { initMercadoPago } from '@mercadopago/sdk-react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from '@mui/material/styles';
import TextStyleGlobal from './global/TextGlobal';
import { CookieProvider } from './context/CookieContext';
import "@fontsource/jost/300.css"; // Light
import "@fontsource/jost/400.css"; // Regular
import "@fontsource/jost/500.css"; // Medium
import "@fontsource/jost/600.css"; // SemiBold
import "@fontsource/jost/700.css"; // Bold

initMercadoPago(process.env.REACT_APP_MERCADOPAGO_EF_PUBLIC_KEY, {
    locale: 'es-AR'
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookieProvider>
        <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }} >
            <SearchProvider>
                <CartProvider>
                    <ThemeProvider theme={TextStyleGlobal}>
                        <App />
                    </ThemeProvider>
                </CartProvider>
            </SearchProvider>
        </PayPalScriptProvider>
    </CookieProvider>
);

