import CategoryComponent from '@/Client/Productos/Categorias/ProdCategory';
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
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `${categoryName} - Productos y Regalos | Envio Flores`,
    description: `Encuentra los mejores ${categoryName} en nuestra tienda online. Gran variedad de flores frescas, chocolates, peluches y regalos con envío a domicilio en CABA y todo Gran Buenos Aires.`,
    keywords: [
      `${categoryName}`, 
      'flores', 
      'regalos', 
      'envío de flores', 
      'florería online', 
      'ramos florales', 
      'arreglos florales', 
      'chocolates', 
      'peluches', 
      'regalos personalizados', 
      'envío a domicilio', 
      'flores CABA', 
      'flores Gran Buenos Aires', 
      'delivery flores', 
      'envío mismo día', 
      'regalos corporativos', 
      'flores para cumpleaños', 
      'flores para aniversario',
      'rosas', 
      'tulipanes',
      'lilium',
      'girasoles'
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
      title: `${categoryName} - Productos y Regalos | Envio Flores`,
      description: `Encuentra los mejores ${categoryName} en nuestra tienda online. Gran variedad de flores frescas, chocolates, peluches y regalos con envío a domicilio en CABA y todo Gran Buenos Aires.`,
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
      'format-detection': 'telephone=no',
      'geo.placename': 'Buenos Aires',
      'distribution': 'global',
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

  const categoryName = formatCategory(rawCategory);

  return <CategoryComponent categoryName={categoryName} />;
}