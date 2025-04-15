import ProductDetailComponent from '@/Client/Productos/Detalle/ProductDetail';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    prodId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.prodId);

  const categoryName = rawCategory;
  const siteUrl = `https://www.envioflores.com/productos/${categoryName}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Productos y Regalos | Envio Flores`,
    description: `Encuentra los mejores ${categoryName} en nuestra tienda online. Gran variedad de flores frescas, chocolates, peluches y regalos con envío a todo CABA y Gran Buenos Aires.`,
    keywords: [
      `${categoryName}`, 'flores', 'regalos', 'envío de flores', 
      'florería online', 'ramos florales', 'arreglos florales', 
      'chocolates', 'peluches', 'regalos personalizados', 
      'envío a domicilio', 'flores CABA', 'envío Gran Buenos Aires',
      'florería Capital Federal', 'envío mismo día', 'rosas', 'tulipanes', 
      'lirios', 'girasoles', 'regalos corporativos', 'ocasiones especiales',
      'cumpleaños', 'aniversario', 'bodas', 'condolencias', 'nacimientos'
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
      title: `Productos y Regalos | Envio Flores`,
      description: `Encuentra los mejores ${categoryName} en nuestra tienda online. Gran variedad de flores frescas, chocolates, peluches y regalos con envío a todo CABA y Gran Buenos Aires.`,
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
      'format-detection': 'telephone=no',
      'distribution': 'global',
      'coverage': 'Argentina',
      'target': 'all'
    }
  };
}

export default async function DetailProd({ params }: Props) {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.prodId);
    
  return <ProductDetailComponent prodId={rawCategory} />;
}