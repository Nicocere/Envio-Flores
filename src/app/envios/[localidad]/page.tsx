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
  const siteUrl = `https://www.floreriasargentinas.com/envios/${localidad}`;
  const siteImage = "https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Productos para enviar a ${localidad} - Florerias Argentinas`,
    description: `Compra productos para enviar a ${localidad}. Flores frescas, chocolates, peluches, regalos, comestibles, rosas, ramos, paquetes y más.`,
    keywords: [`flores`, `entrega de flores`, `${localidad}`, `chocolates`, `peluches`, `regalos`, `comestibles`, `rosas`, `ramos`, `paquetes`],
    alternates: {
      canonical: siteUrl,
      languages: {
        'es-AR': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: `Productos para enviar a ${localidad} - Florerias Argentinas`,
      description: `Compra productos para enviar a ${localidad}. Flores frescas, chocolates, peluches, regalos, comestibles, rosas, ramos, paquetes y más.`,
      siteName: 'Florerias Argentinas',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `Productos para enviar a ${localidad} - Florerias Argentinas`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@FloreriasArg',
      creator: '@FloreriasArg',
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
    authors: [{ name: 'Florerias Argentinas' }],
    other: {
      'geo.region': 'AR-C',
      'geo.placename': localidad,
      'language': 'es',
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