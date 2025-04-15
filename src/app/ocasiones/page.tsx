import OcasionesComponent from '@/Client/Ocasiones/OcasionesComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Regalos para Ocasiones Especiales - Envio Flores",
  description: "Encuentra el regalo perfecto para cada ocasión especial. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos rápidos a CABA y Gran Buenos Aires.",
  keywords: ["regalos ocasiones especiales", "flores cumpleaños", "ramos aniversario", "regalo San Valentín", "flores evento", "regalos románticos", "arreglos florales", "peluches", "chocolates", "regalos personalizados", "envío flores a domicilio", "envío rápido CABA", "floristería Gran Buenos Aires", "delivery flores", "ramos para enamorados", "arreglos florales empresas", "flores para eventos", "bouquet premium", "flores online Argentina", "envíos mismo día", "flores fúnebres", "regalos para nacimiento", "flores para graduación", "ramos para madres", "regalos corporativos"],
  alternates: {
    canonical: 'https://www.envioflores.com/productos/ocasiones',
    languages: {
      'es': 'https://www.envioflores.com/productos/ocasiones',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/productos/ocasiones',
    title: 'Regalos para Ocasiones Especiales - Envio Flores',
    description: 'Encuentra el regalo perfecto para cada ocasión especial. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos rápidos a CABA y Gran Buenos Aires.',
    siteName: 'Envio Flores',
    images: [{
      url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Regalos para Ocasiones Especiales - Envio Flores',
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
    'language': 'es',
    'geo.placename': 'Buenos Aires',
    'distribution': 'global',
    'coverage': 'CABA, Gran Buenos Aires, Argentina',
    'revisit-after': '7 days'
  }
};

export default function ProductsOcasiones() {
  return <OcasionesComponent />;
}