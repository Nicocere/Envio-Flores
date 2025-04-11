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
  const siteUrl = `https://www.floreriasargentinas.com/productos/${categoryName}`;
  const siteImage = "https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  return {
    title: `Productos y Regalos | Florerias Argentinas`,
    description: `Encuentra los mejores ${categoryName} en nuestra tienda online. Gran variedad de flores frescas, chocolates, peluches y regalos con envío a todo Argentina.`,
    keywords: [`${categoryName}`, 'flores', 'regalos', 'envío de flores', 'florería online', 'ramos florales', 'arreglos florales', 'chocolates', 'peluches', 'regalos Argentina'],
    alternates: {
      canonical: siteUrl,
      languages: {
        'es-AR': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: `Productos y Regalos | Florerias Argentinas`,
      description: `Encuentra los mejores ${categoryName} en nuestra tienda online. Gran variedad de flores frescas, chocolates, peluches y regalos con envío a todo Argentina.`,
      siteName: 'Florerias Argentinas',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `${categoryName} - Florerias Argentinas`,
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
    }
  };
}

export default async function DetailProd({ params }: Props) {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.prodId);
    
  return <ProductDetailComponent prodId={rawCategory} />;
}