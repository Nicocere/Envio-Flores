import React from 'react';
import type { Metadata } from 'next';
import ProductsComponent from '@/Client/Productos/ProductosPage';

export const metadata: Metadata = {
  title: "Productos y Regalos - Florerias Argentinas",
  description: "Descubre nuestra colección de flores frescas, regalos únicos, chocolates, peluches y más. Envíos a todo Argentina y opciones para todas las ocasiones especiales.",
  keywords: ["flores frescas", "regalos", "chocolates", "peluches", "ramos de flores", "arreglos florales", "envío de flores", "regalos personalizados", "florería online", "regalos Argentina"],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/productos',
    languages: {
      'es-AR': 'https://www.floreriasargentinas.com/productos',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.floreriasargentinas.com/productos',
    title: 'Productos y Regalos - Florerias Argentinas',
    description: 'Descubre nuestra colección de flores frescas, regalos únicos, chocolates, peluches y más. Envíos a todo Argentina y opciones para todas las ocasiones especiales.',
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Productos destacados Florerias Argentinas',
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
    'format-detection': 'telephone=no',
  }
};

export default function Products() {
  return <ProductsComponent />;
}