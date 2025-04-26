import React from 'react';
// import { Jost, Nunito } from "next/font/google";
import Footer from '@/componentes/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Providers from '@/Providers/providers';
import ClientLayoutComponent from '../Client/LayoutHome';
import { Metadata } from 'next'
import { CookieProvider } from '@/context/CookieContext';
import WhatsAppMobile from '@/componentes/contactoWhatsApp/contactoWhatsAppMobile';
import ScreenLoader from '@/componentes/ScreenLoader/ScreenLoader';

import localFont from 'next/font/local'
import MainLayout from '@/componentes/Main/Main';


const nexa = localFont({
  src: [
    {
      path: '../../public/fonts/nexa/Nexa-ExtraLight.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/nexa/Nexa-Heavy.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
})



export const metadata: Metadata = {
  metadataBase: new URL('https://envioflores.com'),
  title: {
    template: '%s | Envio Flores',
    default: 'Envio Flores - Flores Frescas, Regalos Premium y Desayunos a Domicilio en Buenos Aires',
  },
  description:
    'Envío express de arreglos florales, ramos de rosas premium, plantas exóticas, chocolates gourmet, peluches y regalos personalizados a domicilio en CABA y GBA. Entregas en el día, seguimiento en tiempo real. Especialistas en ramos para cumpleaños, aniversarios y ocasiones especiales con garantía de frescura ✓ Atención 24/7 ✓ Pago seguro con todas las tarjetas.',
  keywords: [
    // Términos principales
    'envío de flores', 'flores a domicilio', 'florería online', 'flores frescas',
    'ramos de flores', 'arreglos florales', 'flores para regalo',
    
    // Tipos de productos específicos
    'ramos de rosas', 'rosas importadas', 'arreglos florales exclusivos',
    'ramos de girasoles', 'liliums', 'gerberas', 'orquídeas', 'tulipanes',
    'flores preservadas', 'terrarios', 'suculentas', 'kokedamas',
    'plantas de interior', 'plantas exóticas', 'macetas decorativas',
    
    // Regalos complementarios
    'desayunos a domicilio', 'box de desayuno', 'desayunos sorpresa',
    'chocolates gourmet', 'chocolates artesanales', 'bombones',
    'peluches', 'tarjetas personalizadas', 'canastas regalo',
    'gift box', 'cajas sorpresa', 'regalos corporativos',
    
    // Ocasiones especiales
    'flores para cumpleaños', 'regalos de aniversario', 'flores para San Valentín',
    'día de la madre', 'día del padre', 'día de la secretaria',
    'ramos para bodas', 'centros de mesa floral', 'ramos de novia',
    'flores para nacimientos', 'arreglos de graduación', 'regalos de jubilación',
    'flores para condolencias', 'coronas fúnebres', 'arreglos para velorios',
    
    // Servicios y características
    'envío express de flores', 'entrega en el día', 'delivery flores premium',
    'envío a hospitales', 'envío a empresas', 'flores a domicilio CABA',
    'florería con tarjeta de crédito', 'flores con mensaje personalizado',
    'suscripción de flores', 'servicio floral para eventos',
    
    // Términos geográficos
    'flores CABA', 'flores Gran Buenos Aires', 'florería Capital Federal',
    'envío flores Palermo', 'envío flores Recoleta', 'envío flores Belgrano',
    'flores a domicilio San Isidro', 'flores Vicente López', 'flores Tigre',
    'florería Argentina', 'envío flores Buenos Aires',
    
    // Búsquedas por temporada
    'flores día de los enamorados', 'flores primavera', 'flores Navidad',
    'arreglos florales fin de año', 'flores para Pascua',
    'centros de mesa eventos', 'decoración floral eventos'
  ],
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': 'https://envioflores.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://envioflores.com',
    siteName: 'Envio Flores - Buenos Aires',
    title: 'Envio Flores - Arreglos Florales Premium, Desayunos y Regalos a Domicilio en Buenos Aires',
    description:
      'Diseños florales exclusivos con garantía de frescura por 7 días. Ramos de rosas premium, liliums, orquídeas y más. Envío express a CABA y GBA, seguimiento en tiempo real y atención personalizada 24/7. Complementá con chocolates gourmet, peluches y desayunos personalizados.',
    images: [
      {
        url: 'https://www.envioflores.com/imagenes/productos/destacados-envio-flores.jpg',
        width: 1200,
        height: 630,
        alt: 'Envio Flores - Colección Premium de Arreglos Florales y Regalos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    title: 'Arreglos Florales Premium y Regalos Personalizados a Domicilio en Buenos Aires',
    description: 'Ramos de flores frescas, desayunos sorpresa y regalos exclusivos. Envío express en CABA y GBA ✓ Entregas en el día ✓',
    images: ['https://www.envioflores.com/imagenes/productos/destacados-envio-flores.jpg'],
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
    'geo.region': 'AR-C',
    'geo.placename': 'Buenos Aires',
    'geo.position': '-34.603722;-58.381592',
    ICBM: '-34.603722, -58.381592',
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
    <html lang="es" className={nexa.className}>
      <head>
      <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="author" content="Envio Flores" />
        <meta name="copyright" content="© 2024 Envio Flores" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </head>
      <body className={nexa.className}>

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