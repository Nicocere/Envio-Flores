import UbicacionPage from '@/Client/Ubicacion/UbicacionPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ubicación y Contacto - Florerias Argentinas | Florería en Belgrano, CABA - Envíos de Flores y Regalos",
  description: "Visita nuestra florería en Av. Cramer 1915, Belgrano. Envíos de flores, regalos y más en CABA y GBA. Atención telefónica y WhatsApp de 9 a 20hs. Arreglos florales, ramos de flores y decoración floral personalizada.",
  keywords: ["floreria argentina", "florerias en argentina", "florerias", "envios de flores", "envio de flores", "envio de regalos", "flores", "desayunos", "meriendas", "chocolates", "envio flores caba", "floreria cramer", "envio regalos belgrano", "floreria argentina contacto", "whatsapp floreria"],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/ubicacion'
  },
  openGraph: {
    type: 'website',  
    url: 'https://www.floreriasargentinas.com/ubicacion',
    title: "Ubicación y Contacto - Florerias Argentinas | Florería en Belgrano, CABA - Envíos de Flores y Regalos",
    description: "Visita nuestra florería en Av. Cramer 1915, Belgrano. Envíos de flores, regalos y más en CABA y GBA. Atención telefónica y WhatsApp de 9 a 20hs. Arreglos florales, ramos de flores y decoración floral personalizada.",
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Sitio oficial de Florerias Argentinas',
    }],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FloreriasArg',
    creator: '@FloreriasArg',
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'geo.region': 'AR-C',
    'geo.placename': 'Belgrano',
    'geo.position': '-34.566349655524135;-58.46220712511634',
  }
};

export default function Ubicacion() {
  return <UbicacionPage />;
}