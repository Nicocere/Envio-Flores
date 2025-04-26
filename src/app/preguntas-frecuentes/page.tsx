
import React from 'react';
import { Metadata } from 'next';
import PreguntasFrecuentes from '@/Client/PreguntasFrecuentes/PreguntasFrecuentes';



// Metadata para SEO
export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Envío Flores',
  description: 'Encuentra respuestas a las preguntas más comunes sobre envío de flores, pagos, productos, cuidados y entregas.',
  keywords: 'envío flores, preguntas frecuentes, FAQ, entrega flores, envío ramos, cuidado flores',
  openGraph: {
    title: 'Preguntas Frecuentes | Envío Flores',
    description: 'Resuelve tus dudas sobre nuestros servicios de envío de flores, tiempos de entrega, pagos y más.',
    url: 'https://envioflores.com/preguntas-frecuentes',
    siteName: 'Envío Flores',
    images: [
      {
        url: 'https://envioflores.com/images/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'Preguntas Frecuentes - Envío Flores',
      }
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preguntas Frecuentes | Envío Flores',
    description: 'Resuelve tus dudas sobre nuestros servicios de envío de flores, tiempos de entrega, pagos y más.',
    images: ['https://envioflores.com/images/twitter-faq.jpg'],
    creator: '@envioflores',
    site: '@envioflores',
  },
  alternates: {
    canonical: 'https://envioflores.com/preguntas-frecuentes',
    languages: {
      'es-AR': 'https://envioflores.com/preguntas-frecuentes',
    },
  },
};


// Componente principal de Preguntas Frecuentes
const PreguntasFrecuentesPage: React.FC = () => {

  return (
    
    <PreguntasFrecuentes />
  );
};

export default PreguntasFrecuentesPage;