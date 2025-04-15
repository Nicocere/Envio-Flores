import React from 'react';
import { Jost, Nunito } from "next/font/google";
import MainLayout from '@/componentes/Main/Main';
import NavBarTop from '@/componentes/Nav/NavBar';
import Footer from '@/componentes/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Providers from '@/Providers/providers';
import ClientLayoutComponent from '../Client/LayoutHome';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { Metadata } from 'next'
import { CookieProvider } from '@/context/CookieContext';
import WhatsAppMobile from '@/componentes/contactoWhatsApp/contactoWhatsAppMobile';
import ScreenLoader from '@/componentes/ScreenLoader/ScreenLoader';


const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
});
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
});




export const metadata: Metadata = {
  metadataBase: new URL('https://envioflores.com'),
  title: {
    template: '%s | Envio Flores',
    default: 'Envio Flores - Flores Frescas y Regalos Premium a Domicilio',
  },
  description:
    'Envío express de arreglos florales, rosas premium, plantas exóticas, chocolates gourmet y regalos personalizados a domicilio. Entregas en el día, seguimiento en tiempo real. Pago seguro con todas las tarjetas. Envíos a nivel nacional con garantía de frescura ✓ Atención 24/7.',
  keywords: [
    'flores frescas',
    'envío express flores',
    'florería premium',
    'rosas importadas',
    'ramos personalizados',
    'arreglos florales exclusivos',
    'flores para eventos',
    'plantas exóticas',
    'regalos corporativos',
    'delivery flores premium',
    'flores para cumpleaños',
    'flores para aniversarios',
    'ramos de novia',
    'flores para hospitales',
    'decoración floral',
    'flores para condolencias',
    'flores para ocasiones especiales',
    'suscripción de flores'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://envioflores.com',
    siteName: 'Envio Flores',
    title: 'Envio Flores - Especialistas en Arreglos Florales Premium y Regalos Exclusivos',
    description:
      'Diseños florales exclusivos con garantía de frescura por 7 días. Envío express a todo el país, seguimiento en tiempo real y atención personalizada 24/7.',
    images: [
      {
        url: 'https://www.envioflores.com/imagenes/productos/destacados-envio-flores.jpg',
        width: 1200,
        height: 630,
        alt: 'Envio Flores - Colección Premium de Arreglos Florales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
  },
  verification: {
    google: 'bPFq4uTn-hfAA3MPuYC3rXA0sBZPth8vUKAlqFEKCwI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
  other: {
    'geo.region': 'ES',
    'geo.placename': 'Madrid',
    'geo.position': '40.416775;-3.703790',
    ICBM: '40.416775, -3.703790',
    'theme-color': '#ff5b84',
    'application-name': 'Envio Flores',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Envio Flores',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito:wght@300;400;600;700;800&display=swap');`}
        </style>
        <meta name="author" content="Envio Flores" />
        <meta name="copyright" content="© 2024 Envio Flores" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${jost.variable} ${nunito.variable}`}>
          
        <CookieProvider>
        <Providers>
          <MainLayout>
            <ClientLayoutComponent>
                      <WhatsAppMobile />
                <ScreenLoader />
              {children}
            </ClientLayoutComponent>
          </MainLayout>
          <Footer />
        </Providers>
        </CookieProvider>
      </body>
    </html>
  );
}