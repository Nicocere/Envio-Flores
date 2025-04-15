import ProductsCategoryComponent from '@/Client/Categorias/CategoryComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Productos por Categoría - Envio Flores",
  description: "Explora nuestra amplia selección de productos por categoría. Flores frescas, regalos, chocolates, peluches y más. Envíos a domicilio en CABA, Gran Buenos Aires y todo Argentina.",
  keywords: "categorías productos, flores, ramos de flores, ramos de rosas, arreglos florales, envío de flores, flores a domicilio, regalos, chocolates, peluches, vinos, desayunos, combos regalo, CABA, Gran Buenos Aires, flores para cumpleaños, flores para aniversario, flores para eventos, envíos express, florería online, regalos para enamorados, flores para el día de la madre, flores para todas las ocasiones",
  authors: [{ name: "Envio Flores" }],
  alternates: {
    canonical: 'https://www.envioflores.com/productos/categorias',
    languages: {
      'es': 'https://www.envioflores.com/productos/categorias',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/productos/categorias',
    title: 'Productos por Categoría - Envio Flores',
    description: 'Explora nuestra amplia selección de productos por categoría. Flores frescas, regalos, chocolates, peluches y más. Envíos a domicilio en CABA, Gran Buenos Aires y todo Argentina.',
    siteName: 'Envio Flores',
    images: [{
      url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Categorías de productos - Envio Flores',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
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
    'geo.placename': 'Buenos Aires, CABA, GBA',
  }
};

export default function ProductsCategory() {
  return <ProductsCategoryComponent />
}