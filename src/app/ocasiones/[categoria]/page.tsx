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

  const siteUrl = `https://www.envioflores.com/ocasiones/${category}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Regalos para ${category} - Envio Flores`,
    description: `Encuentra los mejores regalos para ${category}. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a CABA, Gran Buenos Aires y todo Argentina el mismo día.`,
    keywords: [
      `regalos ${category}`, 
      `flores ${category}`, 
      `arreglos florales ${category}`,
      `regalos especiales ${category}`, 
      'flores frescas', 
      'chocolates', 
      'peluches', 
      'ramos personalizados',
      'envío de flores a domicilio',
      'envío de regalos CABA',
      'floristería online Buenos Aires',
      'delivery de flores',
      'flores Gran Buenos Aires',
      'envío express de flores',
      'arreglos florales a domicilio',
      'ramos de rosas para regalo',
      'florería online',
      'regalo sorpresa a domicilio'
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
      title: `Regalos para ${category} - Envio Flores`,
      description: `Encuentra los mejores regalos para ${category}. Flores frescas, chocolates, peluches, ramos personalizados y más. Envíos a CABA, Gran Buenos Aires y todo Argentina el mismo día.`,
      siteName: 'Envio Flores',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `Regalos para ${category} - Envio Flores`,
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
      'geo.region': 'AR',
      'geo.placename': 'Buenos Aires',
      'format-detection': 'telephone=no',
      'language': 'es',
      'distribution': 'global',
      'coverage': 'Argentina',
      'revisit-after': '7 days'
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