import OcasionesComponent from '@/Client/Ocasiones/OcasionesComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Regalos para Ocasiones Especiales - Florerias Argentinas",
  description: "Encuentra el regalo perfecto para cada ocasión especial. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a todo Argentina.",
  keywords: ["regalos ocasiones especiales", "flores cumpleaños", "ramos aniversario", "regalo San Valentín", "flores evento", "regalos románticos", "arreglos florales", "peluches", "chocolates", "regalos personalizados"],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/productos/ocasiones',
    languages: {
      'es': 'https://www.floreriasargentinas.com/productos/ocasiones',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.floreriasargentinas.com/productos/ocasiones',
    title: 'Regalos para Ocasiones Especiales - Florerias Argentinas',
    description: 'Encuentra el regalo perfecto para cada ocasión especial. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a todo Argentina.',
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Regalos para Ocasiones Especiales - Florerias Argentinas',
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
  authors: [{ name: 'Florerias Argentinas' }],
  other: {
    'geo.region': 'AR',
    'language': 'es',
  }
};

export default function ProductsOcasiones() {
  return <OcasionesComponent />;
}