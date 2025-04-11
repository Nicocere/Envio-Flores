import LocalidadPageComponent from '@/Client/Envios/EnviosPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Zonas de entrega Florerias Argentinas | Envíos a domicilio en CABA y GBA",
  description: "Envíos de flores, chocolates, bebidas, peluches y más a domicilio en el día a Gran Buenos Aires y Capital Federal. ¡Sorprende a tus seres queridos!",
  keywords: ["flores", "entrega de flores", "Gran Buenos Aires", "Capital Federal", "chocolates", "peluches", "regalos", "envíos a domicilio", "florería online"],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/envios',
    languages: {
      'es-AR': 'https://www.floreriasargentinas.com/envios',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.floreriasargentinas.com/envios',
    title: 'Zonas de entrega Florerias Argentinas | Envíos a domicilio en CABA y GBA',
    description: 'Envíos de flores, chocolates, bebidas, peluches y más a domicilio en el día a Gran Buenos Aires y Capital Federal. ¡Sorprende a tus seres queridos!',
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Zonas de entrega Florerias Argentinas',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FloreriasArg',
    creator: '@FloreriasArg',
    images: ['https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png'],
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
  }
};

export default function EnviosPage() {
  return <LocalidadPageComponent />;
}