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
  metadataBase: new URL('https://www.envioflores.com'),
  title: {
    template: '%s | Envio Flores',
    default: 'Envio Flores - Flores Frescas, Ramos y Desayunos a Domicilio 24h en Buenos Aires',
  },
  description:
    'Envío express de arreglos florales, ramos de rosas premium, plantas exóticas, chocolates gourmet y regalos personalizados a domicilio en CABA y GBA. Entregas en el día, seguimiento en tiempo real. Especialistas en ramos para cumpleaños, aniversarios y ocasiones especiales con garantía de frescura por 7 días ✓ Atención 24/7 ✓ Pago seguro con todas las tarjetas.',
  keywords: [
    // Términos principales - búsquedas directas
    'envío de flores', 'flores a domicilio', 'florería online', 'flores frescas',
    'ramos de flores', 'arreglos florales', 'flores para regalo', 'florería buenos aires',
    'flores online', 'florería virtual', 'tienda de flores online', 'delivery de flores',
    'comprar flores online', 'envío de rosas', 'floristería', 'flores baratas',
    'flores hoy', 'ramos bonitos', 'mejores flores', 'florería urgente',
    
    // Formatos de búsqueda natural
    'dónde comprar flores en buenos aires', 'florería que entregue hoy mismo',
    'enviar flores a domicilio', 'hacer pedido de flores online', 'comprar ramo de flores',
    'flores baratas a domicilio', 'flores con entrega rápida', 'entregar flores hoy',
    'flores con envío urgente', 'flores para regalar', 'flores premium',
    'flores por internet', 'florerías abiertas cerca', 'flores con whatsapp',
    'flores con tarjeta personalizada', 'flores especiales',
    
    // Tipos de flores y productos específicos
    'ramos de rosas', 'rosas importadas', 'arreglos florales exclusivos',
    'ramos de girasoles', 'liliums', 'gerberas', 'orquídeas', 'tulipanes', 'astromelias',
    'ramo de rosas rojas', 'caja de rosas', 'rosas eternas', 'lirios', 'jazmines',
    'margaritas', 'rosas azules', 'flores exóticas', 'rosas preservadas', 'bouquet premium',
    'flores preservadas', 'terrarios', 'suculentas', 'kokedamas',
    'plantas de interior', 'plantas exóticas', 'macetas decorativas', 'cactus',
    'bonsái', 'orquídeas en maceta', 'plantas decorativas', 'centros de mesa',
    'flores secas decorativas', 'rosas eternas', 'plantas suculentas', 'flores artificiales',
    
    // Regalos complementarios
    'desayunos a domicilio', 'box de desayuno', 'desayunos sorpresa', 'desayuno romántico',
    'chocolates gourmet', 'chocolates artesanales', 'bombones', 'bombones rellenos', 
    'chocolates de lujo', 'chocolates personalizados', 'caja de chocolates con flores',
    'peluches', 'peluches con flores', 'ositos de peluche', 'muñecos de felpa',
    'tarjetas personalizadas', 'canastas regalo', 'canasta de frutas',
    'gift box', 'cajas sorpresa', 'regalos corporativos', 'cestas gourmet',
    'regalo personalizado', 'gift baskets', 'kit gourmet', 'caja de vinos',
    'regalos exclusivos', 'regalos premium', 'regalos de lujo', 'gift card',
    
    // Ocasiones especiales
    'flores para cumpleaños', 'regalos de aniversario', 'flores para San Valentín',
    'día de la madre', 'día del padre', 'día de la secretaria', 'día de la mujer',
    'flores para egresados', 'regalos para jubilación', 'flores para inauguración',
    'ramos para bodas', 'centros de mesa floral', 'ramos de novia', 'decoración floral matrimonio',
    'flores para nacimientos', 'arreglos de graduación', 'regalos de jubilación', 'flores para recién nacido',
    'flores para condolencias', 'coronas fúnebres', 'arreglos para velorios', 'flores para funeral',
    'flores para pedir perdón', 'flores para reconciliación', 'sorpresa romántica',
    'regalos de cumpleaños', 'flores para amor', 'flores para conquista', 'regalos de boda',
    
    // Servicios y características
    'envío express de flores', 'entrega en el día', 'delivery flores premium', 'flores 24 horas',
    'envío a hospitales', 'envío a empresas', 'flores a domicilio CABA', 'florería abierta domingo',
    'florería con tarjeta de crédito', 'flores con mensaje personalizado', 'flores con dedicatoria',
    'suscripción de flores', 'servicio floral para eventos', 'flores urgentes', 
    'flores envío gratuito', 'flores con descuento', 'flores baratas calidad',
    'servicio a domicilio flores', 'flores para eventos', 'decoración floral',
    'decoración con flores para eventos', 'arreglos florales para iglesias',
    'flores para oficinas', 'flores promoción', 'ofertas flores', 'flores con MercadoPago',
    'flores con tarjeta', 'flores pago en cuotas', 'flores envío rápido',
    
    // Términos geográficos específicos - CABA
    'flores CABA', 'flores Capital Federal', 'florería Capital Federal',
    'envío flores Palermo', 'envío flores Recoleta', 'envío flores Belgrano',
    'envío flores Caballito', 'envío flores Almagro', 'envío flores Barrio Norte',
    'envío flores San Telmo', 'envío flores Puerto Madero', 'envío flores Núñez',
    'envío flores Villa Urquiza', 'envío flores Colegiales', 'envío flores Villa Crespo',
    'envío flores Flores', 'envío flores Saavedra', 'envío flores Boedo',
    'envío flores Chacarita', 'envío flores Villa Devoto', 'envío flores Villa del Parque',
    'envío flores Microcentro', 'envío flores Parque Patricios', 'envío flores Liniers',
    'envío flores Villa Real', 'envío flores Mataderos', 'envío flores Parque Chacabuco',
    'envío flores Villa Ortúzar', 'envío flores Agronomía', 'envío flores Montserrat',
    
    // Términos geográficos específicos - GBA
    'flores Gran Buenos Aires', 'flores GBA', 'florería Gran Buenos Aires',
    'flores a domicilio San Isidro', 'flores Vicente López', 'flores Tigre',
    'flores La Lucila', 'flores Olivos', 'flores Martínez', 'flores Florida',
    'flores Beccar', 'flores Villa Adelina', 'flores Boulogne', 'flores Acassuso',
    'flores San Fernando', 'flores Pilar', 'flores Quilmes', 'flores Avellaneda', 
    'flores Lanús', 'flores La Plata', 'flores Lomas de Zamora', 'flores Adrogué',
    'flores Morón', 'flores Castelar', 'flores Ituzaingó', 'flores Caseros',
    'flores San Martín', 'flores Tres de Febrero', 'flores Ramos Mejía',
    'flores Hurlingham', 'flores Haedo', 'flores Banfield', 'flores Temperley',
    'flores Berazategui', 'flores Florencio Varela', 'flores Monte Grande',
    'flores Ezeiza', 'flores San Miguel', 'flores Moreno', 'flores José C. Paz',
    'flores Malvinas Argentinas', 'flores Bernal', 'flores Don Torcuato',
    'flores El Palomar', 'flores Wilde', 'flores Claypole', 'flores Villa Ballester',
    
    // Búsquedas por temporada y eventos
    'flores día de los enamorados', 'flores San Valentín', 'flores primavera', 'flores Navidad',
    'arreglos florales fin de año', 'flores para Pascua', 'flores día de la primavera',
    'centros de mesa eventos', 'decoración floral eventos', 'flores para graduación',
    'ramo 14 de febrero', 'flores para aniversario', 'flores para pedida de mano',
    'ramo novios', 'flores para 25 aniversario', 'flores para inauguración',
    'arreglos día de la madre', 'flores para día del maestro', 'regalos día del amigo',
    'flores fiestas patrias', 'arreglos florales empresariales fin de año',
    
    // Términos de búsqueda de necesidad/intención
    'flores última hora', 'envío flores urgente', 'flores envío hoy', 'flores envío inmediato',
    'flores a domicilio ya', 'florería entrega rápida', 'flores entrega garantizada',
    'flores para pedir perdón', 'flores para sorprender', 'flores para impresionar',
    'flores con significado', 'mejores flores regalo', 'arreglos florales exclusivos',
    'envío flores mismo día', 'flores frescas garantía', 'florería premium',
    'rosas importadas', 'flores exóticas', 'flores preservadas'
  ],
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': 'https://www.envioflores.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://www.envioflores.com',
    siteName: 'Envio Flores - Buenos Aires',
    title: 'Envio Flores - Arreglos Florales Premium, Desayunos y Regalos a Domicilio en Buenos Aires',
    description:
      'Diseños florales exclusivos con garantía de frescura por 7 días. Ramos de rosas premium, liliums, orquídeas y más. Envío express en 3 horas a CABA y GBA, seguimiento en tiempo real y atención personalizada 24/7. Complementá con chocolates gourmet, peluches y desayunos personalizados.',
    images: [
      {
        url: 'https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas.png',
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
    description: 'Ramos de flores frescas, desayunos sorpresa y regalos exclusivos. Envío express en CABA y GBA ✓ Entregas en el día ✓ Atención 24/7',
    images: ['https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas.png',],
  },
  verification: {
    google: '-DJ_c74GOWVHE0hZFrhDOgoyRixR-gy1Re1MGIBEllQ',
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
    'revisit-after': '7 days',
    'rating': 'general',
    'distribution': 'global',
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