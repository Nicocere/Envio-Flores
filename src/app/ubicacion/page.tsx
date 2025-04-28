import UbicacionPage from '@/Client/Ubicacion/UbicacionPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ubicación y Contacto - Envio Flores | Florería en Belgrano, CABA - Envíos de Flores y Regalos",
  description: "Visita nuestra florería en Av. Cramer 1915, Belgrano. Envíos de flores, ramos, plantas y regalos en CABA y GBA. Atención telefónica y WhatsApp de 9 a 20hs. Arreglos florales personalizados para toda ocasión.",
  keywords: ["envio flores", "floreria argentina", "envios de flores", "envio de flores", "envio de regalos", "flores a domicilio", "arreglos florales", "ramos de flores", "desayunos", "regalos románticos", "envio flores caba", "floreria belgrano", "envio express flores", "whatsapp floreria", "flores para eventos", "flores para cumpleaños", "flores para aniversario", "plantas de interior", "coronas fúnebres", "flores premium"],
  alternates: {
    canonical: 'https://envioflores.com/ubicacion'
  },
  openGraph: {
    type: 'website',  
    url: 'https://envioflores.com/ubicacion',
    title: "Ubicación y Contacto - Envio Flores | Florería en Belgrano, CABA - Envíos de Flores y Regalos",
    description: "Visita nuestra florería en Av. Cramer 1915, Belgrano. Envíos de flores, ramos, plantas y regalos en CABA y GBA. Atención telefónica y WhatsApp de 9 a 20hs. Arreglos florales personalizados para toda ocasión.",
    siteName: 'Envio Flores',
    images: [{
      url: 'https://envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Sitio oficial de Envio Flores',
    }],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'AR-C',
    'geo.placename': 'Belgrano',
    'geo.position': '-34.566349655524135;-58.46220712511634',
    'business:contact_data:street_address': 'Av. Cramer 1915',
    'business:contact_data:locality': 'Belgrano, CABA',
    'business:contact_data:country': 'Argentina',
    'business:contact_data:postal_code': 'C1428',
    'business:contact_data:website': 'https://envioflores.com',
    'business:contact_data:email': 'ventas@aflorar.com.ar',
    'business:contact_data:phone_number': '+5491165421003',
  }
};

export default function Ubicacion() {
  return <UbicacionPage />;
}