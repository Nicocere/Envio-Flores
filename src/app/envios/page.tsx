import LocalidadPageComponent from '@/Client/Envios/EnviosPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Zonas de entrega Envio Flores | Envíos a domicilio en CABA y GBA",
  description: "Envíos de flores, ramos, arreglos florales, chocolates, bebidas, peluches y más a domicilio en el día a Gran Buenos Aires y Capital Federal. Entregas express con seguimiento en vivo.",
  keywords: ["flores", "entrega de flores", "Gran Buenos Aires", "Capital Federal", "chocolates", "peluches", "ramos de flores", "arreglos florales", "regalos", "envíos a domicilio", "florería online", "envío express", "regalos románticos", "entrega en el día", "rosas", "girasoles", "liliums"],
  alternates: {
    canonical: 'https://envioflores.com/envios',
    languages: {
      'es-AR': 'https://envioflores.com/envios',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://envioflores.com/envios',
    title: 'Zonas de entrega Envio Flores | Envíos a domicilio en CABA y GBA',
    description: 'Envíos de flores, ramos, arreglos florales, chocolates, bebidas, peluches y más a domicilio en el día a Gran Buenos Aires y Capital Federal. Entregas express con seguimiento en vivo.',
    siteName: 'Envio Flores',
    images: [{
      url: 'https://envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Zonas de entrega Envio Flores',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    'geo.placename': 'Buenos Aires',
    'geo.position': '-34.603722;-58.381592',
    'ICBM': '-34.603722, -58.381592',
    'revisit-after': '7 days',
    'author': 'Envio Flores',
    'og:locale': 'es_AR',
    'theme-color': '#ff6b6b'
  }
};

export default function EnviosPage() {
  return <LocalidadPageComponent />;
}