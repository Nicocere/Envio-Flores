import React from 'react';
import type { Metadata } from 'next';
import ProductsComponent from '@/Client/Productos/ProductosPage';

export const metadata: Metadata = {
  title: "Flores y Regalos - Envio Flores",
  description: "Descubre nuestra colección de flores frescas, regalos únicos, chocolates, peluches y más. Envíos a CABA, Gran Buenos Aires y todo Argentina. Opciones para todas las ocasiones especiales.",
  keywords: ["flores frescas", "regalos", "chocolates", "peluches", "ramos de flores", "arreglos florales", "envío de flores", "regalos personalizados", "florería online", "regalos Argentina", "flores a domicilio", "envío de regalos", "envío mismo día", "envío CABA", "envío Gran Buenos Aires", "flores para cumpleaños", "flores para aniversarios", "rosas", "liliums", "gerberas", "regalos corporativos", "canastas de regalo", "bombones", "delivery flores", "flores para enamorados", "flores para eventos"],
  alternates: {
    canonical: 'https://www.envioflores.com/productos',
    languages: {
      'es-AR': 'https://www.envioflores.com/productos',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/productos',
    title: 'Flores y Regalos - Envio Flores',
    description: 'Descubre nuestra colección de flores frescas, regalos únicos, chocolates, peluches y más. Envíos a CABA, Gran Buenos Aires y todo Argentina. Opciones para todas las ocasiones especiales.',
    siteName: 'Envio Flores',
    images: [{
      url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Productos destacados Envio Flores',
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
  authors: [{ name: 'Envio Flores' }],
  other: {
    'geo.region': 'AR',
    'format-detection': 'telephone=no',
    'geo.placename': 'Buenos Aires',
    'distribution': 'global',
    'revisit-after': '7 days',
  }
};

export default function Products() {
  return <ProductsComponent />;
}