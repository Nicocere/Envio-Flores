import FechasEspecialesComponent from '@/Client/FechasEspeciales/CategoriaFechasEspeciales/FechasEspecialesCategoria';
import { Metadata } from 'next';
import Script from 'next/script';

interface Props {
  params: Promise<{
    categoria: string;
  }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.categoria);

  const formatCategory = (text: string) => {
    return text
      // Inserta un espacio entre minúscula y mayúscula
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitaliza la primera letra
      .replace(/^./, str => str.toUpperCase());
  };

  const category = formatCategory(rawCategory);
  const siteUrl = `https://www.envioflores.com/ocasiones/${category}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Regalos para ${category} - ENVIO FLORES`,
    description: `Encuentra los mejores regalos para ${category}. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a CABA, Gran Buenos Aires y todo Argentina.`,
    keywords: [
      `regalos ${category}`, 
      `flores ${category}`, 
      `arreglos florales ${category}`, 
      `regalos especiales ${category}`, 
      'flores frescas', 
      'chocolates', 
      'peluches', 
      'ramos personalizados', 
      'envío a domicilio', 
      'envío mismo día', 
      'envío flores CABA', 
      'envío flores Gran Buenos Aires', 
      'floristería online', 
      'ramos de rosas', 
      'flores para cumpleaños', 
      'flores para aniversario', 
      'arreglos florales premium',
      'mejor floristería argentina',
      'envíos express de flores'
    ],
    alternates: {
      canonical: siteUrl,
      languages: {
        'es': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: `Regalos para ${category} - ENVIO FLORES`,
      description: `Encuentra los mejores regalos para ${category}. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a CABA, Gran Buenos Aires y todo Argentina.`,
      siteName: 'ENVIO FLORES',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `Regalos para ${category} - ENVIO FLORES`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      images: [siteImage],
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
      'language': 'es',
      'distribution': 'global',
      'coverage': 'Argentina'
    }
  };
}

export default async function Category({ params }: Props) {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.categoria);
  
  const formatCategory = (text: string) => {
    return text
      // Inserta un espacio entre minúscula y mayúscula
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitaliza la primera letra
      .replace(/^./, str => str.toUpperCase());
  };

  const category = formatCategory(rawCategory);

  // Schema FAQ para fechas especiales
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuánto tiempo de anticipación necesito para pedir flores para ${category}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Para fechas especiales como ${category}, recomendamos realizar tu pedido con al menos 48 horas de anticipación para asegurar disponibilidad. Sin embargo, también ofrecemos servicios express para pedidos de último momento.`
        }
      },
      {
        '@type': 'Question',
        name: `¿Qué tipos de arreglos florales son más populares para ${category}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Para ${category}, los arreglos de rosas, liliums y gerberas son muy populares. También ofrecemos opciones combinadas con chocolates, peluches y vinos que son perfectas para esta ocasión especial.`
        }
      },
      {
        '@type': 'Question',
        name: `¿Puedo programar una entrega para una fecha específica de ${category}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, puedes programar tu entrega para la fecha exacta que deseas. Nuestro sistema permite seleccionar día y franja horaria preferida para que tu regalo llegue en el momento perfecto.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Realizan entregas los fines de semana y días festivos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, realizamos entregas todos los días del año, incluyendo fines de semana y días festivos. Entendemos que las fechas especiales no siempre caen en días laborables.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Puedo añadir un mensaje personalizado a mi regalo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutamente. Todos nuestros arreglos incluyen una tarjeta donde puedes escribir un mensaje personalizado que será entregado junto con tu regalo.'
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FechasEspecialesComponent category={category} />
    </>
  );
}