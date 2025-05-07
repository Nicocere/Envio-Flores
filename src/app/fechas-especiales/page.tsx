import FechasEspecialesComponent from '@/Client/FechasEspeciales/FechasEspecialesComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Regalos para Ocasiones Especiales - ENVIO FLORES",
  description: "Encuentra el regalo perfecto para cada ocasión especial. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos rápidos a CABA y Gran Buenos Aires.",
  keywords: ["regalos ocasiones especiales", "flores cumpleaños", "ramos aniversario", "regalo San Valentín", "flores evento", "regalos románticos", "arreglos florales", "peluches", "chocolates", "regalos personalizados", "envío flores CABA", "delivery flores Buenos Aires", "florería online", "flores a domicilio", "envíos rápidos flores", "floristería Buenos Aires", "ramos de rosas", "flores para aniversarios", "regalos día de la madre", "flores para nacimientos", "arreglos florales corporativos", "flores para condolencias", "regalos empresariales", "envío mismo día", "flores premium"],
  alternates: {
    canonical: 'https://www.envioflores.com/fechas-especiales',
    languages: {
      'es': 'https://www.envioflores.com/fechas-especiales',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/fechas-especiales',
    title: 'Regalos para Ocasiones Especiales - ENVIO FLORES',
    description: 'Encuentra el regalo perfecto para cada ocasión especial. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a CABA y Gran Buenos Aires.',
    siteName: 'ENVIO FLORES',
    images: [{
      url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Regalos para Ocasiones Especiales - ENVIO FLORES',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png'],
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
  authors: [{ name: 'ENVIO FLORES' }],
  other: {
    'geo.region': 'AR',
    'geo.placename': 'Buenos Aires',
    'language': 'es',
    'distribution': 'global',
    'coverage': 'CABA y Gran Buenos Aires',
  }
};

export default function ProductsOcasiones() {
  return <FechasEspecialesComponent />;
}