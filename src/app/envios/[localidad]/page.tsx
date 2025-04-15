import ZonasDeEnvioComponent from '@/Client/Envios/ZonasDeEnvio/ZonasDeEnvio';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    localidad: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.localidad);

  const formatCategory = (text: string) => {
    return text
      // Inserta un espacio entre minúscula y mayúscula
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitaliza la primera letra
      .replace(/^./, str => str.toUpperCase());
  };

  const localidad = formatCategory(rawCategory);
  const siteUrl = `https://www.envioflores.com/envios/${localidad}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Productos para enviar a ${localidad} - Envio Flores`,
    description: `Compra productos para enviar a ${localidad}. Flores frescas, arreglos florales, chocolates, peluches, regalos personalizados, envíos a domicilio en el día para CABA y Gran Buenos Aires.`,
    keywords: [
      `flores`, `envío de flores`, `flores a domicilio`, `${localidad}`, 
      `envío rápido`, `ramos florales`, `arreglos florales`, 
      `regalos`, `regalos personalizados`, `regalos románticos`, 
      `peluches`, `chocolates`, `vinos`, `delivery de flores`, 
      `envíos a CABA`, `envíos a Gran Buenos Aires`, `florería online`, 
      `flores para cumpleaños`, `flores para aniversarios`, 
      `rosas`, `girasoles`, `liliums`, `gerberas`,
      `canastas de regalo`, `plantas`, `regalos corporativos`
    ],
    alternates: {
      canonical: siteUrl,
      languages: {
        'es-AR': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: `Productos para enviar a ${localidad} - Envio Flores`,
      description: `Compra productos para enviar a ${localidad}. Flores frescas, arreglos florales, chocolates, peluches, regalos personalizados, envíos a domicilio en el día para CABA y Gran Buenos Aires.`,
      siteName: 'Envio Flores',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `Productos para enviar a ${localidad} - Envio Flores`,
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
    authors: [{ name: 'Envio Flores' }],
    other: {
      'geo.region': 'AR-C',
      'geo.placename': localidad,
      'language': 'es',
      'revisit-after': '7 days',
      'distribution': 'global',
      'rating': 'general',
      'category': 'flores, regalos, envíos'
    }
  };
}

export default async function Category({ params }: Props) {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.localidad);

  const formatCategory = (text: string) => {
    return text
      // Inserta un espacio entre minúscula y mayúscula
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Capitaliza la primera letra
      .replace(/^./, str => str.toUpperCase());
  };

  const localidad = formatCategory(rawCategory);

  return <ZonasDeEnvioComponent localidad={localidad} />;
}