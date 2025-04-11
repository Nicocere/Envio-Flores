
import React, { useContext } from 'react';
import ComoComprarComponent from '@/componentes/ComoComprar/comoComprar';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: '¿Cómo Comprar en Florerias Argentinas? - Venta y envío de arreglos florales',
  description: 'Envío de flores, rosas, ramos, bombones, regalos a domicilio en Argentina. Venta online y telefónica. Pagos en efectivo y con tarjetas de crédito. Entrega inmediata.',
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/como-comprar',
  },
  openGraph: {
    type: 'article',
    title: 'Guía de Compra - Florerias Argentinas',
    description: 'Aprende cómo comprar en Florerias Argentinas. Proceso de compra, formas de pago y políticas de envío.',
    url: 'https://www.floreriasargentinas.com/como-comprar',
    siteName: 'Florerias Argentinas',
    images: [
      {
        url: 'https://www.floreriasargentinas.com/images/guia-compra.jpg',
        width: 800,
        height: 600,
        alt: 'Guía de compra Florerias Argentinas',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: 'comprar flores, envío flores argentina, formas pago florería, envío regalos buenos aires',
  authors: [{ name: 'Florerias Argentinas' }],
  creator: 'Florerias Argentinas',
  publisher: 'Florerias Argentinas',
};


function ComoComprar() {
  const emailPaypal = "paypal@regalosflores.com.ar";


  return <ComoComprarComponent />;
}

export default ComoComprar;