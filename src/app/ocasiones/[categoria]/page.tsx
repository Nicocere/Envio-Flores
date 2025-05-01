import CategoryProdsComponents from '@/Client/Ocasiones/CategoriaOcasiones/CategoryProdsComponent';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    categoria: string;
  }>;
}

// Definimos categorías y metadatos específicos
const categoryMetadata: {[key: string]: {
  emoji: string;
  titleSuffix: string;
  description: string;
  specificKeywords: string[];
  schema: string;
  specialFeatures: string[];
}} = {
  "agradecimiento": {
    emoji: "🙏",
    titleSuffix: "Demuestra tu Gratitud | Entrega HOY",
    description: "Expresa tu gratitud con regalos memorables. Flores frescas, arreglos elegantes y detalles únicos para decir gracias de forma especial. Entrega express el mismo día en CABA y GBA.",
    specificKeywords: [
      "flores para agradecer", "regalos de agradecimiento", "como agradecer con flores",
      "arreglos florales de gratitud", "regalos para decir gracias", "flores para expresar agradecimiento",
      "detalles de gratitud", "agradecimiento empresarial", "flores para agradecer atención",
      "regalos de gratitud corporativa", "flores para dar las gracias", "cestas de agradecimiento"
    ],
    schema: "Gift",
    specialFeatures: ["Tarjetas personalizadas", "Mensaje de gratitud incluido", "Opciones corporativas"]
  },
  "aniversarios": {
    emoji: "💑",
    titleSuffix: "Celebra tu Amor | Sorprende HOY",
    description: "Celebra tu aniversario con regalos románticos que hablan por sí solos. Rosas premium, arreglos exclusivos y regalos personalizados para conmemorar su historia de amor. Envío express garantizado.",
    specificKeywords: [
      "regalos de aniversario", "flores para aniversario matrimonio", "rosas para aniversario",
      "regalo aniversario pareja", "flores bodas de plata", "arreglos florales aniversario",
      "regalos románticos aniversario", "sorpresas para aniversario", "bodas de oro regalos",
      "flores para celebrar aniversario", "aniversario de novios regalos", "rosas rojas aniversario"
    ],
    schema: "Product",
    specialFeatures: ["Rosas premium importadas", "Opciones para bodas de plata/oro", "Paquetes románticos completos"]
  },
  "casamientos": {
    emoji: "💍",
    titleSuffix: "Decoración Floral & Regalos | Calidad Premium",
    description: "Todo para hacer de tu boda un evento inolvidable. Decoración floral exquisita, centros de mesa elegantes, ramos de novia personalizados y detalles para invitados. Asesoramiento especializado y entrega puntual garantizada.",
    specificKeywords: [
      "flores para boda", "decoración floral casamiento", "ramos de novia", "centros de mesa boda",
      "arreglos florales matrimonio", "bouquet novia", "flores ceremonia casamiento",
      "decoración iglesia boda", "arreglos florales recepción", "flores para civil",
      "coronas de flores para novias", "detalles florales para invitados", "flores para casamiento civil"
    ],
    schema: "Event",
    specialFeatures: ["Consultoría personalizada", "Flores para ceremonia y recepción", "Servicio de decoración completo"]
  },
  "condolencias": {
    emoji: "🕊️",
    titleSuffix: "Coronas y Arreglos Fúnebres | Entrega Inmediata",
    description: "Expresa tus condolencias con respeto y delicadeza. Coronas fúnebres, centros de mesa y arreglos florales especialmente diseñados para acompañar en momentos difíciles. Entrega urgente en velatorios y cementerios de CABA y GBA.",
    specificKeywords: [
      "coronas fúnebres", "arreglos florales para velorio", "flores para condolencias",
      "coronas de flores para difuntos", "arreglos funerarios", "flores para funeral",
      "centros de flores para velatorio", "envío coronas fúnebres", "flores para dar el pésame",
      "arreglos para capilla ardiente", "flores para cementerio", "coronas para funeral"
    ],
    schema: "Product",
    specialFeatures: ["Entrega urgente en velatorios", "Coronas tradicionales y modernas", "Servicio 24/7"]
  },
  "cumpleaños": {
    emoji: "🎂",
    titleSuffix: "Regalos que Sorprenden | Entrega HOY",
    description: "Haz inolvidable ese cumpleaños con nuestros regalos especiales. Ramos coloridos, cajas sorpresa, globos, peluches y más para celebrar a esa persona especial. Envío express en el día para sorpresas de último momento.",
    specificKeywords: [
      "regalos de cumpleaños", "flores para cumpleañeros", "arreglos florales cumpleaños",
      "regalos sorpresa cumpleaños", "envío de flores para cumpleaños", "regalos originales cumpleaños",
      "globos y flores cumpleaños", "regalos para celebrar cumpleaños", "bouquet cumpleaños",
      "regalos para cumple", "arreglos para felicitar cumpleaños", "torta y flores cumpleaños"
    ],
    schema: "Product",
    specialFeatures: ["Globos de helio", "Cajas sorpresa", "Combos con torta"]
  },
  "funerales": {
    emoji: "⚱️",
    titleSuffix: "Coronas y Homenajes Florales | Entrega Urgente",
    description: "Brinde un último adiós con dignidad y respeto. Coronas fúnebres tradicionales y modernas, arreglos para capilla ardiente y homenajes florales personalizados. Servicio de entrega urgente en velatorios y cementerios las 24 horas.",
    specificKeywords: [
      "coronas para funerales", "arreglos fúnebres", "flores para funeral",
      "coronas de flores funerarias", "ofrendas florales", "arreglos para sepultura",
      "flores para velorio", "arreglos para cremación", "cojines florales funerarios",
      "cruces de flores funeral", "envío coronas fúnebres urgente", "flores para homenaje póstumo"
    ],
    schema: "Product",
    specialFeatures: ["Servicio 24 horas", "Entrega en todos los cementerios", "Tarjetas de condolencia incluidas"]
  },
  "nacimientos": {
    emoji: "👶",
    titleSuffix: "Celebra la Nueva Vida | Entrega en Hospital",
    description: "Celebra la llegada del bebé con nuestros arreglos especiales para nacimientos. Flores delicadas, peluches, globos y canastas de regalo para dar la bienvenida al nuevo integrante de la familia. Entrega en hospitales y clínicas de CABA y GBA.",
    specificKeywords: [
      "flores para nacimiento", "arreglos florales nacimiento bebé", "regalos para recién nacidos",
      "flores para maternidad", "canastas para bebés", "arreglos para baby shower",
      "flores hospital nacimiento", "regalo para mamá y bebé", "flores para dar bienvenida bebé",
      "arreglos nacimiento niño", "flores nacimiento niña", "globos y flores para nacimiento"
    ],
    schema: "Product",
    specialFeatures: ["Entrega en hospitales", "Opciones para niño y niña", "Regalos para la mamá incluidos"]
  },
  "recuperacion": {
    emoji: "🌿",
    titleSuffix: "Deseos de Pronta Recuperación | Entrega en Clínicas",
    description: "Envía tus mejores deseos con nuestros arreglos para recuperación. Flores frescas, plantas, frutas y detalles especiales para alegrar a quienes están en proceso de recuperación. Entrega en hospitales, clínicas y domicilios.",
    specificKeywords: [
      "flores para recuperación", "arreglos florales hospital", "regalos para enfermos",
      "flores para desear salud", "canastas de frutas recuperación", "plantas para recuperación",
      "flores para internados", "regalos para convalecientes", "arreglos florales clínica",
      "flores para operados", "detalles para recuperación", "flores que dan energía"
    ],
    schema: "Product",
    specialFeatures: ["Entrega en instituciones médicas", "Plantas purificadoras", "Canastas de frutas saludables"]
  },
  "regalosparahombres": {
    emoji: "🎩",
    titleSuffix: "Ideas Originales para Él | Entrega Garantizada",
    description: "Sorprende a ese hombre especial con regalos pensados exclusivamente para él. Arreglos masculinos, canastas gourmet, vinos premium, plantas y detalles únicos que impresionarán. Envío express en el día en Buenos Aires.",
    specificKeywords: [
      "regalos para hombres", "flores para caballeros", "arreglos florales masculinos",
      "canastas para hombres", "regalos originales para él", "vinos y chocolates para hombres",
      "plantas para regalar a hombres", "regalos ejecutivos hombres", "flores para papá",
      "regalos para esposo", "detalles para novio", "arreglos florales para hombres"
    ],
    schema: "Product",
    specialFeatures: ["Vinos premium", "Opciones para ejecutivos", "Packs cerveceros"]
  },
  // Otras categorías con sus metadatos específicos...
};

// Función para generar metadatos dinámicos basados en la categoría
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.categoria);
  
  const formatCategory = (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  };

  const category = formatCategory(rawCategory);
  const categoryKey = rawCategory.toLowerCase().replace(/\s+/g, '');
  
  // Obtener metadatos específicos para esta categoría o usar valores predeterminados
  const metadata = categoryMetadata[categoryKey] || {
    emoji: "🎁",
    titleSuffix: "Envío Express Garantizado | Flores Premium",
    description: `Encuentra los mejores regalos para ${category}. Flores frescas, arreglos florales, chocolates y peluches con entrega garantizada en el mismo día en CABA y Gran Buenos Aires. ¡Sorprende a tus seres queridos con calidad y puntualidad!`,
    specificKeywords: [
      `mejores regalos para ${category}`, 
      `flores para ${category} especiales`, 
      `arreglos florales para ${category}`,
      `ideas de regalo para ${category}`
    ],
    schema: "Product",
    specialFeatures: ["Entrega en el día", "Productos premium", "Opciones personalizadas"]
  };

  const siteUrl = `https://www.envioflores.com/ocasiones/${encodeURIComponent(rawCategory)}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  // Construir palabras clave combinando generales con específicas
  const generalKeywords = [
    `regalos ${category}`, 
    `flores ${category}`, 
    `arreglos florales ${category}`,
    `regalos especiales ${category}`, 
    'flores frescas Argentina', 
    'chocolates gourmet', 
    'peluches premium', 
    'ramos personalizados',
    'envío de flores a domicilio',
    'envío de regalos CABA',
    'floristería online Buenos Aires',
    'delivery de flores mismo día',
    'flores Gran Buenos Aires',
    'envío express de flores',
    'arreglos florales a domicilio',
    'ramos de rosas para regalo',
    'florería online Argentina',
    'regalo sorpresa a domicilio',
    'mejor florería online',
    'flores de calidad superior',
    'envío flores garantizado',
    'regalos originales Argentina'
  ];
  
  const allKeywords = [...generalKeywords, ...metadata.specificKeywords];

  return {
    title: `${metadata.emoji} Regalos para ${category} | ${metadata.titleSuffix} | Envio Flores Argentina`,
    description: metadata.description,
    keywords: allKeywords,
    alternates: {
      canonical: siteUrl,
      languages: {
        'es-AR': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: `${metadata.emoji} Regalos para ${category} | ${metadata.titleSuffix} | Envio Flores`,
      description: metadata.description,
      siteName: 'Envio Flores Argentina',
      images: [{
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `Regalos y Flores para ${category} - Envio Flores Argentina`,
      }],
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      title: `${metadata.emoji} Regalos para ${category} | Envio Flores`,
      description: metadata.description.substring(0, 200),
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
    authors: [{ name: 'Envio Flores Argentina' }],
    category: `Flores y Regalos para ${category}`,
    other: {
      // Información geográfica
      'geo.region': 'AR-C',
      'geo.position': '-34.603722;-58.381592',
      'ICBM': '-34.603722, -58.381592',
      'geo.placename': 'Buenos Aires, Argentina',
      
      // Configuración de página
      'format-detection': 'telephone=no',
      'language': 'es-AR',
      'distribution': 'global',
      'coverage': 'CABA, Gran Buenos Aires, Argentina',
      'target': 'all',
      
      // Información de negocio
      'revisit-after': '3 days',
      'rating': 'general',
      'copyright': 'Envio Flores Argentina',
      
      // Rich Snippets y datos estructurados
      'product:brand': 'Envio Flores',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'og:availability': 'instock',
      'og:price:standard_amount': '5999.00',
      'og:price:currency': 'ARS',
      
      // Datos de servicio
      'twitter:label1': 'Tiempo de entrega',
      'twitter:data1': 'En el día',
      'twitter:label2': 'Envío',
      'twitter:data2': 'Envios en el dia en CABA y GBA',
      
      // Información específica de categoría
      'occasion:type': category,
      'occasion:features': metadata.specialFeatures.join(', '),
      
      // Palabras clave adicionales
      'news_keywords': `${category.toLowerCase()}, regalos, flores, entrega rápida, envío flores`,
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      other: {
        'msvalidate.01': 'bing-verification-code',
        'p:domain_verify': 'pinterest-verification',
        'facebook-domain-verification': 'facebook-verification-code'
      },
    },
    appLinks: {
      ios: {
        url: 'https://envioflores.com/app/ios',
        app_store_id: 'app-store-id',
      },
      android: {
        package: 'com.envioflores.app',
        app_name: 'Envio Flores',
      },
      web: {
        url: siteUrl,
        should_fallback: true,
      },
    },
  };
}

export default async function Category({ params }: Props) {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.categoria);
  
  const formatCategory = (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  };

  const category = formatCategory(rawCategory);

  return <CategoryProdsComponents category={category} />;
}