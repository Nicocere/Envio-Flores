import CategoryProdsComponents from '@/Client/Ocasiones/CategoriaOcasiones/CategoryProdsComponent';
import { Metadata } from 'next';

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

  const siteUrl = `https://www.floreriasargentinas.com/ocasiones/${category}`;
  const siteImage = "https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Regalos para ${category} - Florerias Argentinas`,
    description: `Encuentra los mejores regalos para ${category}. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a todo Argentina.`,
    keywords: [`regalos ${category}`, `flores ${category}`, `arreglos florales ${category}`, `regalos especiales ${category}`, 'flores frescas', 'chocolates', 'peluches', 'ramos personalizados'],
    alternates: {
      canonical: siteUrl,
      languages: {
        'es': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: `Regalos para ${category} - Florerias Argentinas`,
      description: `Encuentra los mejores regalos para ${category}. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a todo Argentina.`,
      siteName: 'Florerias Argentinas',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `Regalos para ${category} - Florerias Argentinas`,
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
      'geo.region': 'AR',
      'format-detection': 'telephone=no',
      'language': 'es',
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

  return <CategoryProdsComponents category={category} />;
}