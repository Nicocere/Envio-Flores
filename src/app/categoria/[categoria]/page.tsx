import CategoryNameComponent from '@/Client/Categorias/CategoryName/CategoryName';
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

  const categoryName = formatCategory(rawCategory);
  const siteUrl = `https://www.envioflores.com/productos/${categoryName}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/destacados-envio-flores.jpg";

  return {
    title: `${categoryName} - Productos | Envio Flores`,
    description: `Descubre nuestra selección de ${categoryName}. Flores frescas, ramos, arreglos florales, regalos y más con envío a CABA, Gran Buenos Aires y todo Argentina. Productos de calidad y entrega garantizada en el día.`,
    keywords: [
      `${categoryName}`, 
      'flores', 
      'ramos de flores', 
      'arreglos florales', 
      'regalos', 
      'envío de flores', 
      'florería online', 
      'flores a domicilio', 
      'envío mismo día', 
      'entrega de flores CABA', 
      'envío flores Gran Buenos Aires',
      `${categoryName.toLowerCase()}`, 
      `productos ${categoryName.toLowerCase()}`,
      'regalos personalizados',
      'flores para cumpleaños',
      'flores para aniversario',
      'flores para condolencias',
      'servicio floristería',
      'mejor florería online'
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
      title: `${categoryName} - Productos | Envio Flores`,
      description: `Descubre nuestra selección de ${categoryName}. Flores frescas, ramos, arreglos florales, regalos y más con envío a CABA, Gran Buenos Aires y todo Argentina. Productos de calidad y entrega garantizada en el día.`,
      siteName: 'Envio Flores',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `${categoryName} - Envio Flores`,
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
      'language': 'es',
      'distribution': 'global',
      'coverage': 'Argentina, CABA, Gran Buenos Aires'
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

  const categoryName = formatCategory(rawCategory);

  return <CategoryNameComponent categoryName={categoryName} />
}