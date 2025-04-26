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
  const siteUrl = `https://www.envioflores.com/envios/${encodeURIComponent(rawCategory)}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  // Construir una descripción más rica y específica
  const description = `Servicio de envío de flores a ${localidad} ✓ Entrega en el día ✓ Ramos de rosas, girasoles, liliums y más. Arreglos florales exclusivos, desayunos sorpresa, chocolates gourmet y peluches con envío a domicilio en ${localidad}. Pago seguro con todas las tarjetas. Garantía de frescura por 7 días.`;

  return {
    title: `Envío de Flores a ${localidad} - Entrega en el Día | Envio Flores`,
    description: description,
    keywords: [
      // Términos específicos de localidad
      `flores ${localidad}`, `envío de flores ${localidad}`, `florería ${localidad}`,
      `flores a domicilio ${localidad}`, `enviar flores a ${localidad}`,
      `entrega de flores en ${localidad}`, `delivery flores ${localidad}`,
      `ramos a domicilio ${localidad}`, `floristería online ${localidad}`,
      
      // Términos de productos específicos
      `rosas a domicilio ${localidad}`, `girasoles para entrega en ${localidad}`,
      `liliums ${localidad}`, `gerberas ${localidad}`, `orquídeas ${localidad}`,
      `arreglos florales ${localidad}`, `ramos de flores ${localidad}`,
      `canastas de flores ${localidad}`, `bouquets ${localidad}`,
      
      // Búsquedas de intención
      `comprar flores ${localidad}`, `envío rápido flores ${localidad}`,
      `flores mismo día ${localidad}`, `flores urgentes ${localidad}`,
      `flores entrega inmediata ${localidad}`, `flores baratas ${localidad}`,
      `mejores flores ${localidad}`, `florería confiable ${localidad}`,
      `entrega garantizada flores ${localidad}`,
      
      // Términos por ocasión
      `flores cumpleaños ${localidad}`, `flores aniversario ${localidad}`,
      `flores día de la madre ${localidad}`, `flores San Valentín ${localidad}`,
      `flores para regalo ${localidad}`, `flores para condolencias ${localidad}`,
      `flores para enamorados ${localidad}`, `flores sorpresa ${localidad}`,
      `flores para hospitales ${localidad}`, `flores graduación ${localidad}`,
      
      // Regalos complementarios
      `desayunos sorpresa ${localidad}`, `chocolates con flores ${localidad}`,
      `peluches y flores ${localidad}`, `regalos románticos ${localidad}`,
      `cajas de regalo ${localidad}`, `gift box ${localidad}`,
      `vino con flores ${localidad}`, `canastas regalo ${localidad}`,
      `regalos personalizados ${localidad}`, `regalos a domicilio ${localidad}`,
      
      // Términos naturales de búsqueda
      `dónde comprar flores en ${localidad}`, `florería que entregue hoy en ${localidad}`,
      `mejores floristerías ${localidad}`, `envío de flores express ${localidad}`,
      `flores con tarjeta personalizada ${localidad}`, `flores con mensaje ${localidad}`,
      `florería abierta domingo ${localidad}`, `florería con whatsapp ${localidad}`,
      
      // Términos de pago y servicio
      `flores pago con tarjeta ${localidad}`, `flores con MercadoPago ${localidad}`,
      `flores en cuotas ${localidad}`, `flores con garantía ${localidad}`,
      `servicio de florería premium ${localidad}`, `atención 24 horas ${localidad}`
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
      title: `Envío de Flores a ${localidad} - Ramos y Regalos a Domicilio | Envio Flores`,
      description: description,
      siteName: 'Envio Flores',
      images: [{
        url: siteImage,
        width: 800,
        height: 600,
        alt: `Flores y Regalos con Entrega en ${localidad} - Envio Flores`,
      }],
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      title: `Flores a Domicilio en ${localidad} - Entrega en el Día | Envio Flores`,
      description: description,
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
      'category': 'flores, regalos, envíos, florería, ramos, arreglos florales',
      'og:locale': 'es_AR',
      'og:type': 'website',
      'og:site_name': 'Envio Flores',
      'twitter:label1': 'Envíos a',
      'twitter:data1': localidad,
      'twitter:label2': 'Tiempo de entrega',
      'twitter:data2': 'En el día',
      'msapplication-TileColor': '#ffffff',
      'msapplication-config': '/browserconfig.xml',
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