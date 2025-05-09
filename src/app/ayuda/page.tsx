import React from 'react';
import ComoComprarComponent from '@/componentes/ComoComprar/comoComprar';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: '¿Cómo Comprar en ENVIO FLORES? - Venta y envío de arreglos florales',
  description: 'Envío de flores, rosas, ramos, bombones, regalos a domicilio en Argentina. Venta online y telefónica. Pagos seguros con múltiples opciones. Entrega inmediata y garantizada.',
  alternates: {
    canonical: 'https://www.envioflores.com/como-comprar',
  },
  openGraph: {
    type: 'article',
    title: 'Guía de Compra - ENVIO FLORES',
    description: 'Aprende cómo comprar en ENVIO FLORES. Proceso sencillo, formas de pago seguras y políticas de envío transparentes. Garantía de satisfacción en cada entrega.',
    url: 'https://www.envioflores.com/como-comprar',
    siteName: 'ENVIO FLORES',
    images: [
      {
        url: 'https://www.envioflores.com/images/guia-compra.jpg',
        width: 800,
        height: 600,
        alt: 'Guía de compra ENVIO FLORES',
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
  keywords: 'comprar flores online, envío flores Argentina, formas pago florería, entrega flores a domicilio, ramos florales, arreglos florales, enviar flores, regalo flores, flores para cumpleaños, flores para aniversarios, flores para eventos, flores premium',
  authors: [{ name: 'ENVIO FLORES' }],
  creator: 'ENVIO FLORES',
  publisher: 'ENVIO FLORES',
};


function ComoComprar() {
  const emailPaypal = "ventas@aflorar.com.ar";


  return <ComoComprarComponent />;
}

export default ComoComprar;