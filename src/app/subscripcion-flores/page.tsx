import React from 'react';
import type { Metadata } from 'next';
import SubscripcionComponent from '@/Client/SubscripcionFlores/SubscripcionFlores';

export const metadata: Metadata = {
  title: "Suscripción de Flores - ENVIO FLORES | Servicio para Empresas y Particulares",
  description: "Renueva tus espacios con flores frescas. Servicio de suscripción semanal o quincenal para empresas y hogares en CABA y Gran Buenos Aires. Diseños exclusivos, instalación, mantenimiento y envío a domicilio incluidos.",
  keywords: [
    "suscripción flores",
    "flores semanales",
    "decoración floral empresas",
    "flores para oficinas",
    "servicio floral semanal",
    "flores por suscripción",
    "decoración floral corporativa",
    "mantenimiento flores",
    "arreglos florales semanales",
    "flores para empresas",
    "envío de flores a domicilio",
    "entrega de flores CABA",
    "flores Gran Buenos Aires",
    "regalos florales",
    "ramos de flores a domicilio",
    "regalo empresarial",
    "delivery de flores",
    "arreglos florales para eventos",
    "flores para regalos",
    "suscripción flores Buenos Aires"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/suscripcion-semanal',
    languages: {
      'es-AR': 'https://www.envioflores.com/suscripcion-semanal',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/suscripcion-semanal',
    title: 'Suscripción de Flores - ENVIO FLORES',
    description: 'Servicio premium de suscripción floral semanal para empresas y particulares. Transforma tus espacios con flores frescas cada semana. Envíos en CABA y Gran Buenos Aires.',
    siteName: 'ENVIO FLORES',
    images: [{
      url: 'https://www.envioflores.com/assets/imagenes/logo-envio-flores.png',
      width: 800,
      height: 600,
      alt: 'Servicio de Suscripción Semanal de Flores',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://www.envioflores.com/assets/imagenes/logo-envio-flores.png'],
    title: 'Suscripción Semanal de Flores para Empresas y Hogares',
    description: 'Renueva tus espacios cada semana con flores frescas. Servicio premium de suscripción floral con envío a domicilio en CABA y GBA.'
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
    'format-detection': 'telephone=no',
    'business.type': 'Florist.SubscriptionService',
    'og:price:amount': 'Desde 15000',
    'og:price:currency': 'ARS',
    'og:locality': 'Buenos Aires',
    'og:region': 'CABA y GBA',
    'og:country-name': 'Argentina',
    'og:available': 'true',
  }
};

export default function SubscripcionSemanal() {
  return <SubscripcionComponent />;
}