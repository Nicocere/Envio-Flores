import React from 'react';
import type { Metadata } from 'next';
import SubscripcionComponent from '@/Client/SubscripcionSemanal/SubscripcionSemanal';

export const metadata: Metadata = {
  title: "Suscripción Semanal de Flores - Envio Flores | Servicio para Empresas y Particulares",
  description: "Renueva tus espacios cada semana con flores frescas. Servicio de suscripción semanal para empresas y hogares. Diseños exclusivos, instalación y mantenimiento incluidos. Envío a domicilio en CABA y Gran Buenos Aires.",
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
    "envío flores a domicilio",
    "flores CABA",
    "flores Gran Buenos Aires",
    "regalos florales",
    "bouquets semanales",
    "ramos corporativos",
    "entrega flores premium",
    "abono flores semanal",
    "flores frescas a domicilio",
    "servicio floral Buenos Aires"
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
    title: 'Suscripción Semanal de Flores - Envio Flores',
    description: 'Servicio premium de suscripción floral semanal para empresas y particulares. Envío a domicilio en CABA y Gran Buenos Aires. Transforma tus espacios con flores frescas cada semana.',
    siteName: 'Envio Flores',
    images: [{
      url: 'https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.jpg',
      width: 800,
      height: 600,
      alt: 'Servicio de Suscripción Semanal de Flores',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.jpg'],
    title: 'Suscripción Semanal de Flores para Empresas y Hogares - Envío a domicilio',
    description: 'Renueva tus espacios cada semana con flores frescas. Servicio premium de suscripción floral con entrega en CABA y Gran Buenos Aires.'
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
    'geo.placename': 'Buenos Aires',
    'format-detection': 'telephone=no',
    'business.type': 'Florist.SubscriptionService',
    'og:price:amount': 'Desde 15000',
    'og:price:currency': 'ARS',
    'og:locality': 'CABA, Gran Buenos Aires',
    'og:availability': 'instock'
  }
};

export default function SubscripcionSemanal() {
  return <SubscripcionComponent />;
}