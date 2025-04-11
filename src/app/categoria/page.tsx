import ProductsCategoryComponent from '@/Client/Categorias/CategoryComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Productos por Categoría - Florerias Argentinas",
  description: "Explora nuestra amplia selección de productos por categoría. Flores frescas, regalos, chocolates, peluches y más. Envíos a todo Argentina.",
  keywords: "categorías productos, flores, regalos, chocolates, peluches, ramos, arreglos florales, envíos, florería online",
  authors: [{ name: "Florerias Argentinas" }],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/productos/categorias',
    languages: {
      'es': 'https://www.floreriasargentinas.com/productos/categorias',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.floreriasargentinas.com/productos/categorias',
    title: 'Productos por Categoría - Florerias Argentinas',
    description: 'Explora nuestra amplia selección de productos por categoría. Flores frescas, regalos, chocolates, peluches y más. Envíos a todo Argentina.',
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Categorías de productos - Florerias Argentinas',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FloreriasArg',
    creator: '@FloreriasArg',
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
    'geo.region': 'AR',
    'language': 'es',
  }
};

export default function ProductsCategory() {
  return <ProductsCategoryComponent />
}