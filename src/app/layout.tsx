"use client";

import Head from 'next/head';
import React from 'react';
import { Lora } from "next/font/google";

// import { Metadata } from 'next'

import '../index.css';
import { CookieProvider } from '../context/CookieContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import SearchProvider from '../context/SearchContext';
import CartProvider from '../context/CartContext';
import { ThemeProvider } from 'react-bootstrap';
import TextStyleGlobal from '../global/TextGlobal';

const inter = Lora({ subsets: ["latin"], weight: '400', style: 'normal' });

// export const metadata: Metadata = {
//     metadataBase: new URL('https://floreriasargentinas.com'),
//     title: {
//         template: '%s | Envio Flores',
//         default: 'Envio Flores - Envío de Flores y Regalos a Domicilio',
//     },
//     description:
//         'Envío de flores, rosas, chocolates, peluches y regalos a domicilio en Argentina. Entregas en el día, pagos con tarjeta. Envíos a CABA, GBA y todo el país. ✓ Garantía de Satisfacción',
//     keywords: [
//         'flores Argentina',
//         'envío flores',
//         'floreria online',
//         'rosas',
//         'ramos',
//         'arreglos florales',
//         'peluches',
//         'chocolates',
//         'regalos',
//         'delivery flores',
//         'envio regalos',
//         'flores a domicilio',
//         'floristeria CABA',
//         'regalos Buenos Aires',
//     ],
//     alternates: {
//         canonical: '/',
//     },
//     openGraph: {
//         type: 'website',
//         locale: 'es_AR',
//         url: 'https://floreriasargentinas.com',
//         siteName: 'Envio Flores',
//         title: 'Envio Flores - Venta y envío de arreglos florales',
//         description:
//             'Envío de flores, rosas, chocolates, peluches y regalos a domicilio en Argentina',
//         images: [
//             {
//                 url: 'https://www.floreriasargentinas.com/imagenes/productos/destacados-florerias-argentinas.jpg',
//                 width: 800,
//                 height: 600,
//                 alt: 'Envio Flores - Productos Destacados',
//             },
//         ],
//     },
//     twitter: {
//         card: 'summary_large_image',
//         site: '@FloreriasArg',
//         creator: '@FloreriasArg',
//     },
//     verification: {
//         google: 'bPFq4uTn-hfAA3MPuYC3rXA0sBZPth8vUKAlqFEKCwI',
//     },
//     robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//             index: true,
//             follow: true,
//             'max-snippet': -1,
//             'max-image-preview': 'large',
//             'max-video-preview': -1,

//         },
//     },
//     icons: {
//         icon: '/favicon.ico',
//     },
//     other: {
//         'geo.region': 'AR',
//         'geo.placename': 'Buenos Aires',
//         'geo.position': '-34.603722;-58.381592',
//         ICBM: '-34.603722, -58.381592',
//         'theme-color': '#D4AF37',
//     },
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">


            <body id="body-index">
                <CookieProvider>
                    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }} >
                        {/* <FilterProvider> */}
                        <SearchProvider>
                            <CartProvider>
                                <ThemeProvider theme={TextStyleGlobal}>
                                    <div id="root">
                                        {children}
                                    </div>
                                </ThemeProvider>
                            </CartProvider>
                        </SearchProvider>
                    </PayPalScriptProvider>
                </CookieProvider>
            </body>

        </html>
    );
}