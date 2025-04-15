import React from 'react';
import type { Metadata } from 'next';
import SubscripcionComponent from '@/Client/SubscripcionQuincenal/SubscripcionQuincenal';

export const metadata: Metadata = {
  title: "Suscripción Quincenal de Flores - Envio Flores | Servicio para Empresas y Particulares",
  description: "Renueva tus espacios cada quincena con flores frescas. Servicio de suscripción quincenal para empresas y hogares en CABA y Gran Buenos Aires. Diseños exclusivos, instalación, entrega a domicilio y mantenimiento incluidos. Transforma tu ambiente con flores naturales.",
  keywords: [
    "suscripción flores",
    "flores quincenales",
    "decoración floral empresas",
    "flores para oficinas",
    "servicio floral quincenal",
    "flores por suscripción",
    "decoración floral corporativa",
    "mantenimiento flores",
    "arreglos florales quincenales",
    "flores para empresas",
    "envío flores a domicilio",
    "flores CABA",
    "flores Gran Buenos Aires",
    "ramos de flores",
    "regalos florales",
    "delivery flores",
    "flores naturales",
    "servicio floral premium",
    "flores para eventos",
    "bouquets a domicilio"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/suscripcion-quincenal',
    languages: {
      'es-AR': 'https://www.envioflores.com/suscripcion-quincenal',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/suscripcion-quincenal',
    title: 'Suscripción Quincenal de Flores - Envio Flores',
    description: 'Servicio premium de suscripción floral quincenal para empresas y particulares en CABA y Gran Buenos Aires. Transforma tus espacios con flores frescas cada quincena.',
    siteName: 'Envio Flores',
    images: [{
      url: 'https://www.envioflores.com/imagenes/subscripcion/flores-quincenales-para-empresas.jpg',
      width: 800,
      height: 600,
      alt: 'Servicio de Suscripción Quincenal de Flores',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://www.envioflores.com/imagenes/subscripcion/flores-quincenales-para-empresas.jpg'],
    title: 'Suscripción Quincenal de Flores para Empresas y Hogares en CABA y GBA',
    description: 'Renueva tus espacios cada quincena con flores frescas. Servicio premium de suscripción floral con entrega a domicilio.'
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
    'og:availability': 'in stock',
    'og:locality': 'CABA, Gran Buenos Aires',
    'article:modified_time': new Date().toISOString(),
  }
};

export default function SubscripcionQuincenal() {
  return <SubscripcionComponent />;
}