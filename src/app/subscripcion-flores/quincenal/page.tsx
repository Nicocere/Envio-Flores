import React from 'react';
import type { Metadata } from 'next';
import SubscripcionComponent from '@/Client/SubscripcionQuincenal/SubscripcionQuincenal';

export const metadata: Metadata = {
  title: "Suscripción Quincenal de Flores - Florerias Argentinas | Servicio para Empresas y Particulares",
  description: "Renueva tus espacios cada quincena con flores frescas. Servicio de suscripción quincenal para empresas y hogares. Diseños exclusivos, instalación y mantenimiento incluidos. Transforma tu ambiente con flores naturales.",
  keywords: [
    "suscripción flores",
    "flores quincenales",
    "decoración floral empresas",
    "flores para oficinas",
    "servicio floral quincenal",
    "flores por suscripción",
    "decoración floral corporativa",
    "mantenimiento flores",
    "arreglos florales semanales",
    "flores para empresas"
  ],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/suscripcion-quincenal',
    languages: {
      'es-AR': 'https://www.floreriasargentinas.com/suscripcion-quincenal',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.floreriasargentinas.com/suscripcion-quincenal',
    title: 'Suscripción Quincenal de Flores - Florerias Argentinas',
    description: 'Servicio premium de suscripción floral quincenal para empresas y particulares. Transforma tus espacios con flores frescas cada quincena.',
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/subscripcion/flores-semanales-para-empresas.jpg',
      width: 800,
      height: 600,
      alt: 'Servicio de Suscripción Semanal de Flores',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FloreriasArg',
    creator: '@FloreriasArg',
    images: ['https://www.floreriasargentinas.com/imagenes/subscripcion/flores-semanales-para-empresas.jpg'],
    title: 'Suscripción Quincenal de Flores para Empresas y Hogares',
    description: 'Renueva tus espacios cada quincena con flores frescas. Servicio premium de suscripción floral.'
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
    'business.type': 'Florist.SubscriptionService',
    'og:price:amount': 'Desde 15000',
    'og:price:currency': 'ARS',
  }
};

export default function SubscripcionQuincenal() {
  return <SubscripcionComponent />;
}