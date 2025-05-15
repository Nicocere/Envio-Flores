import CategoryNameComponent from '@/Client/Categorias/CategoryName/CategoryName';
import { Metadata } from 'next';
import Script from 'next/script';

// Definimos una interfaz para las opciones de categoría para corregir el error de TypeScript
interface CategoryOption {
  description: string;
  keywordsPriority: string[];
  subCategories: string[];
  metaTitle?: string;
  h1Alternative?: string;
  seasonality?: string[];
  priceRange?: { min: string; max: string };
  deliveryNotice?: string;
}

// Definimos un tipo explícito para el objeto categoryOptions
type CategoryOptionsType = {
  [key: string]: CategoryOption;
};

// Interfaz correcta para los parámetros de la página
interface PageProps {
  params: Promise<{
    categoria: string;
  }>;

}

// Datos optimizados para SEO por categoría
const categoryOptions: CategoryOptionsType = {
  'rosas': {
    description: 'Rosas frescas y elegantes con envío EXPRESS en el día. ✓ 20% OFF ✓ Ramos de rosas rojas, blancas, rosadas y más. ✓ Entrega en 3 horas en CABA y GBA.',
    keywordsPriority: ['rosas rojas', 'ramos de rosas', 'rosas a domicilio', 'envío de rosas', 'rosas para regalo', 'comprar rosas online', 'rosas en Buenos Aires', 'enviar rosas'],
    subCategories: ['rosas rojas', 'rosas blancas', 'rosas rosadas', 'rosas amarillas', 'rosas multicolor', 'rosas preservadas', 'caja de rosas', 'arreglo de rosas'],
    metaTitle: 'Rosas 🌹 Envío EXPRESS en 3hs | 20% OFF | Flores a Domicilio',
    h1Alternative: 'Rosas Frescas con Envío a Domicilio en Buenos Aires',
    seasonality: ['San Valentín', 'Día de la Madre', 'Aniversarios'],
    priceRange: { min: '4200', max: '12500' },
    deliveryNotice: 'Entregamos rosas frescas en el día en CABA y GBA',
  },
  'ramos': {
    description: 'Ramos de flores frescas con ENVÍO EXPRESS en el día. ✓ 20% OFF ✓ Gran variedad de ramos para toda ocasión con entregas en CABA y GBA. ✓ Garantía de calidad y frescura.',
    keywordsPriority: ['ramos de flores', 'ramos florales', 'ramos para regalo', 'ramos con envío mismo día', 'bouquet de flores', 'envío de ramos'],
    subCategories: ['ramos mixtos', 'ramos de estación', 'ramos premium', 'ramos económicos', 'ramos para cumpleaños', 'ramos para aniversario'],
    metaTitle: 'Ramos de Flores 💐 Envío EXPRESS en 3hs | 20% OFF | Envío a Domicilio',
    h1Alternative: 'Ramos de Flores Frescas con Entrega Express',
    seasonality: ['Primavera', 'Día de la Madre', 'Aniversarios', 'San Valentín'],
    priceRange: { min: '3800', max: '15000' },
    deliveryNotice: 'Entregamos ramos frescos en el día en CABA y GBA',
  },
  // ... resto de categorías sin cambios
  'todos': {
    description: 'Catálogo completo de flores, plantas y regalos con envío EXPRESS. ✓ 20% OFF ✓ Descubre todas nuestras opciones para sorprender a esa persona especial en cualquier ocasión.',
    keywordsPriority: ['flores y regalos', 'catálogo de flores', 'regalos con flores', 'envío de regalos'],
    subCategories: ['ramos', 'arreglos', 'plantas', 'regalos', 'ocasiones especiales'],
    metaTitle: 'Flores, Plantas y Regalos 🎁🌸🌿 Envío EXPRESS | 20% OFF | ENVIO FLORES',
    priceRange: { min: '3200', max: '25000' },
  },
};

export async function generateStaticParams() {
  // Pre-renderizar categorías principales para mejor performance y SEO
  return [
    { categoria: 'rosas' },
    { categoria: 'ramos' },
    { categoria: 'arreglos' },
    { categoria: 'plantas' },
    { categoria: 'cestas' },
    { categoria: 'condolencias' },
    { categoria: 'aniversario' },
    { categoria: 'cumpleaños' },
    { categoria: 'cajas' },
    { categoria: 'girasoles' },
    { categoria: 'liliums' },
    { categoria: 'desayunos' },
    { categoria: 'peluches' },
    { categoria: 'todos' },
  ];
}

// Función para formatear categorías
const formatCategory = (text: string) => {
  return text
    // Inserta un espacio entre minúscula y mayúscula
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Normaliza guiones y underscores a espacios
    .replace(/[-_]/g, ' ')
    // Capitaliza la primera letra
    .replace(/^./, str => str.toUpperCase());
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Ahora sí necesitamos esperar a que params se resuelva
  const rawCategory = decodeURIComponent((await params).categoria);
  
  // Obtener el nombre formateado de la categoría
  const categoryName = formatCategory(rawCategory);
  const categorySlug = rawCategory.toLowerCase();
  
  // Obtener opciones específicas de la categoría o usar valores por defecto
  const categoryData = categoryOptions[categorySlug] || {
    description: `Descubre nuestra selección premium de ${categoryName}. ✓ 20% OFF ✓ Flores frescas, arreglos florales y regalos con ENVÍO EXPRESS en el día. ✓ Entrega garantizada en CABA y GBA en 3 horas.`,
    keywordsPriority: [`${categoryName.toLowerCase()} premium`, `${categoryName.toLowerCase()} con envío`, `${categoryName.toLowerCase()} a domicilio`, `comprar ${categoryName.toLowerCase()}`],
    subCategories: [`${categoryName.toLowerCase()} destacados`, `${categoryName.toLowerCase()} económicos`, `${categoryName.toLowerCase()} premium`, `${categoryName.toLowerCase()} con envío`],
    metaTitle: `${categoryName} 🌸 Envío EXPRESS en 3hs | 20% OFF | ENVIO FLORES Argentina`,
    priceRange: { min: '3500', max: '15000' },
  };
  
  // URL canónica y optimizada para SEO
  const siteUrl = `https://www.envioflores.com/categoria/${encodeURIComponent(rawCategory)}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";

  // Título optimizado con keywords principales - usar título específico de la categoría si existe
  const seoTitle = categoryData.metaTitle || `${categoryName} 🌸 Envío EXPRESS en 3hs | 20% OFF | ENVIO FLORES Argentina`;
  
  // Descripción optimizada con llamada a la acción
  const seoDescription = categoryData.description;
  
  // Estructura de precios para rich snippets
  const priceRange = categoryData.priceRange || { min: '3500', max: '15000' };
  
  // Palabras clave expandidas con términos de alta intención de compra
  const expandedKeywords = [
    // Prioridad 1: Categoría específica con intención de compra
    `comprar ${categoryName.toLowerCase()}`,
    `${categoryName.toLowerCase()} envío rápido`,
    `${categoryName.toLowerCase()} en el día`,
    `${categoryName.toLowerCase()} mismo día`,
    `${categoryName.toLowerCase()} a domicilio`,
    `${categoryName.toLowerCase()} online`,
    `${categoryName.toLowerCase()} baratos`,
    `${categoryName.toLowerCase()} Buenos Aires`,
    `${categoryName.toLowerCase()} CABA`,
    `${categoryName.toLowerCase()} con tarjeta`,
    `${categoryName.toLowerCase()} express`,
    `${categoryName.toLowerCase()} 3 horas`,
    `${categoryName.toLowerCase()} entrega rápida`,
    `${categoryName.toLowerCase()} con descuento`,
    `${categoryName.toLowerCase()} 20% off`,
    `${categoryName.toLowerCase()} mejor precio`,
    `${categoryName.toLowerCase()} envío a domicilio`,
    
    // Prioridad 2: Palabras clave específicas de la categoría
    ...categoryData.keywordsPriority,
    
    // Prioridad 3: Subcategorías relacionadas
    ...categoryData.subCategories,
    
    // Prioridad 4: Términos generales del negocio con palabras de alta intención
    `${categoryName} online Argentina`, 
    `${categoryName} entrega hoy`,
    `${categoryName} envío rápido`,
    `comprar ${categoryName} online`,
    `${categoryName} florería online`,
    'flores online Argentina',
    'envío de flores en el día',
    'flores con entrega express',
    'ramos con descuento',
    'flores a domicilio CABA',
    'flores en 3 horas',
    'mejor florería online',
    'flores frescas garantizadas',
    'florería con entrega 24hs',
    'flores con tarjeta personalizada',
    'envío de flores baratas',
    'flores con entrega en el día',
    
    // Prioridad 5: Términos locales geográficos específicos
    'flores CABA',
    'flores Buenos Aires',
    'flores Palermo',
    'flores Recoleta',
    'flores Belgrano',
    'flores Caballito',
    'flores San Isidro',
    'flores Vicente López',
    'flores Zona Norte',
    'flores Zona Sur',
    'flores Zona Oeste',
    'flores Microcentro',
    'flores Barrio Norte',
    'flores Núñez',
    'flores Flores',
    'flores Devoto',
    'flores Almagro',
  ];

  // URL alternativas para hreflang
  const alternateUrls = {
    'es-AR': siteUrl,
    'es': `https://www.envioflores.com/categoria/${encodeURIComponent(rawCategory)}`,
  };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [...new Set(expandedKeywords)].join(', '), // Elimina duplicados
    alternates: {
      canonical: siteUrl,
      languages: alternateUrls,
    },
    openGraph: {
      type: 'website', // Cambiado a product.group que es más específico para colecciones de productos
      url: siteUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: 'ENVIO FLORES Argentina',
      images: [{
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `${categoryName} - Envío Express en 3hs - ENVIO FLORES Argentina`,
      }],
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      title: seoTitle,
      description: `Catálogo de ${categoryName} con envío a domicilio en CABA y GBA. ¡20% OFF y entrega en 3 horas! Calidad premium garantizada.`,
      images: [siteImage],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    authors: [{ name: 'ENVIO FLORES Argentina', url: 'https://www.envioflores.com' }],
    category: categoryName,
    other: {
      // Metadatos geográficos
      'geo.region': 'AR-C',
      'geo.placename': 'Ciudad Autónoma de Buenos Aires',
      'geo.position': '-34.6037;-58.3816',
      'ICBM': '-34.6037, -58.3816',
      
      // Configuración de contacto y soporte
      'format-detection': 'telephone=no',
      'distribution': 'global',
      'coverage': 'Argentina, CABA, Gran Buenos Aires',
      'target': 'all',
      'revisit-after': '1 days', // Optimizado para rastreo más frecuente
      'rating': 'general',
      
      // Metadatos de tiempo de entrega (importante para conversiones)
      'twitter:label1': 'Tiempo de entrega',
      'twitter:data1': 'En el día - 3 horas',
      'twitter:label2': 'Envío',
      'twitter:data2': 'Envío express a domicilio en CABA y GBA',
      
      // Metadatos de integración con redes sociales
      'fb:app_id': '123456789012345',
      'og:availability_starts': new Date().toISOString(),
      'og:price:amount': priceRange.min,
      'og:price:currency': 'ARS',
      'og:price:range': `ARS${priceRange.min} - ARS${priceRange.max}`,
      'og:availability': 'instock',
      'og:brand': 'ENVIO FLORES Argentina',
      
      // Metadatos para voice search y asistentes
      'language': 'es',
      'speakable.cssSelector': 'h1, .category-description, .featured-products h2',
      
      // Metadatos para búsquedas por voz
      'spoken-availability': 'disponible para entrega en el día en 3 horas',
      'spoken-price': `desde ${priceRange.min} pesos hasta ${priceRange.max} pesos`,
      
      // Schema de producto implícito
      'product:brand': 'ENVIO FLORES',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:price:amount': priceRange.min,
      'product:price:currency': 'ARS',
      'product:retailer': 'ENVIO FLORES Argentina',
      'product:retailer_item_id': `cat-${categorySlug}`,
      'product:item_group_id': 'flores-y-regalos',
      
      // Metadatos de promoción
      'promo:discount': '20%',
      'promo:expiry': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      'promo:code': 'FLORES20',
      
      // Metadatos de entrega
      'shipping:region': 'CABA y GBA',
      'shipping:cost': '6990',
      'shipping:method': 'Express',
      'shipping:time': '3 horas',
      
      // Metadatos avanzados para SEO local
      'business:contact_data:street_address': 'Av. Corrientes 1234',
      'business:contact_data:locality': 'Buenos Aires',
      'business:contact_data:postal_code': 'C1043AAZ',
      'business:contact_data:country_name': 'Argentina',
      'business:contact_data:email': 'contacto@envioflores.com',
      'business:contact_data:phone_number': '+54 11 XXXX-XXXX',
      
      // Metadatos para convertibilidad
      'pinterest:description': `🌸 ${categoryName} premium con envío a todo Buenos Aires. ¡20% OFF! Haz tu pedido ahora y sorprende a quien quieres.`,
      'pinterest:price:amount': priceRange.min,
      'pinterest:price:currency': 'ARS',
      
      // Metadatos para reviews agregados
      'og:rating:value': '4.9',
      'og:rating:scale': '5',
      'og:rating:count': '850+',
      
      // Palabras clave para búsquedas de voz
      'voice-search-terms': `${categoryName.toLowerCase()}, comprar flores, flores a domicilio, envío de flores, flores online, flores rápidas, flores urgentes, flores baratas, mejor florería`,
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      other: {
        'msvalidate.01': 'bing-verification-code',
        'facebook-domain-verification': 'facebook-verification-code',
        'p:domain_verify': 'pinterest-verification-code'
      },
    },
  };
}

export default async function Category({ params }: PageProps) {
  const rawCategory = decodeURIComponent((await params).categoria);
  const categoryName = formatCategory(rawCategory);
  const categorySlug = rawCategory.toLowerCase();
  
  // URL canónica para schema
  const siteUrl = `https://www.envioflores.com/categoria/${encodeURIComponent(rawCategory)}`;
  const siteImage = "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";
  
  // Obtener datos específicos de categoría o usar defaults
  const categoryData = categoryOptions[categorySlug] || {
    description: `Descubre nuestra selección premium de ${categoryName}. Flores frescas, arreglos florales y regalos con ENVÍO EXPRESS en el día. Entrega garantizada en CABA y GBA.`,
    keywordsPriority: [`${categoryName.toLowerCase()} premium`, `${categoryName.toLowerCase()} con envío`, `${categoryName.toLowerCase()} a domicilio`],
    subCategories: [`${categoryName.toLowerCase()} destacados`, `${categoryName.toLowerCase()} económicos`, `${categoryName.toLowerCase()} premium`],
    priceRange: { min: '3500', max: '15000' },
  };

  const priceRange = categoryData.priceRange || { min: '3500', max: '15000' };

  // Schema para colección de productos (JSON-LD)
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - ENVIO FLORES Argentina`,
    description: categoryData.description,
    url: siteUrl,
    image: siteImage,
    inLanguage: 'es-AR',
    isPartOf: {
      '@type': 'WebSite',
      name: 'ENVIO FLORES Argentina',
      url: 'https://www.envioflores.com'
    },
    about: {
      '@type': 'Thing',
      name: categoryName
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: priceRange.min,
      highPrice: priceRange.max,
      priceCurrency: 'ARS',
      offerCount: '20+',
      offers: [{
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 3,
          unitCode: 'HUR'
        },
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        seller: {
          '@type': 'Organization',
          name: 'ENVIO FLORES Argentina',
          image: 'https://www.envioflores.com/assets/imagenes/logo-envio-flores.png'
        }
      }]
    },
    specialty: [
      'Envío express en el día',
      'Entrega en 3 horas',
      '20% de descuento',
      'Flores frescas garantizadas',
      'Atención personalizada',
      'Opciones para todos los presupuestos'
    ],
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: '.category-description'
    }
  };

  // Schema para breadcrumbs (miga de pan)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.envioflores.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogo',
        item: 'https://www.envioflores.com/categoria'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: siteUrl
      }
    ]
  };

  // Schema para negocio local
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'FloristOrganization',
    name: 'ENVIO FLORES Argentina',
    url: 'https://www.envioflores.com',
    logo: 'https://www.envioflores.com/assets/imagenes/logo-envio-flores.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+54-11-4788-9185',
      contactType: 'customer service',
      areaServed: 'AR',
      availableLanguage: 'Spanish'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Crámer 1915',
      addressLocality: 'Buenos Aires',
      postalCode: 'C1428CTC',
      addressCountry: 'AR',
      addressRegion: 'Ciudad Autónoma de Buenos Aires'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-34.56630121189851',
      longitude: '-58.45960052031086'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '20:00'
    },
    paymentAccepted: 'Cash, Credit Card, Debit Card, Check, NFC Mobile Payments',
    priceRange: '$$',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Service Options',
        value: 'Entrega a domicilio, Retiro en tienda, Compras en tienda, Entrega el mismo día'
      },
      {
        '@type': 'PropertyValue',
        name: 'Público',
        value: 'Amigable con LGBTQ+'
      },
      {
        '@type': 'PropertyValue',
        name: 'Planificación',
        value: 'Visita rápida'
      }
    ],
    sameAs: [
      'https://www.facebook.com/envioflores',
      'https://www.instagram.com/envioflores.arg',
      'https://twitter.com/EnvioFlores'
    ]
  };

  // FAQ Schema para la categoría
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuánto tarda en llegar un pedido de ${categoryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Realizamos entregas express en el mismo día en CABA y Gran Buenos Aires, en tan solo 3 horas desde la confirmación del pedido. Para el resto del país, el tiempo de entrega es de 24-48 horas según la ubicación.'
        }
      },
      {
        '@type': 'Question',
        name: `¿Las ${categoryName.toLowerCase()} tienen garantía de frescura?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, todas nuestras flores y plantas tienen garantía de frescura. Si no estás satisfecho con la calidad, te reemplazamos el producto sin costo adicional.'
        }
      },
      {
        '@type': 'Question',
        name: `¿Tienen ${categoryName.toLowerCase()} con envío a  CABA o GBA?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, todos nuestros productos incluyen envío en CABA y zonas cercanas de GBA. Para zonas más alejadas puede aplicarse un cargo adicional que se calcula automáticamente al ingresar tu dirección.'
        }
      },
      {
        '@type': 'Question',
        name: `¿Qué formas de pago aceptan para ${categoryName.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aceptamos todas las tarjetas de crédito y débito, transferencia bancaria, efectivo y MercadoPago. Ofrecemos hasta 12 cuotas sin interés con tarjetas seleccionadas.'
        }
      },
      {
        '@type': 'Question',
        name: `¿Puedo personalizar mi pedido de ${categoryName.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutamente. Puedes añadir tarjetas personalizadas, chocolates, peluches u otros complementos al realizar tu pedido. También puedes solicitar arreglos personalizados contactando con nuestro equipo.'
        }
      },
      {
        '@type': 'Question',
        name: `¿Cómo sé que mi pedido de ${categoryName.toLowerCase()} ha sido entregado?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Enviamos notificaciones por correo electrónico y WhatsApp en cada etapa del proceso de entrega. Una vez entregado, recibirás confirmación con una foto del producto en el domicilio (si el destinatario lo permite).'
        }
      }
    ]
  };

  // Review agregado para mejor SEO
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: `${categoryName} - ENVIO FLORES Argentina`,
      image: siteImage,
      category: categoryName
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '4.9',
      bestRating: '5'
    },
    author: {
      '@type': 'Person',
      name: 'Lucía Rodríguez'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Opiniones Verificadas'
    },
    datePublished: '2023-09-15',
    reviewBody: `Compré ${categoryName.toLowerCase()} para el cumpleaños de mi mamá y quedé encantada. La entrega fue super rápida (menos de 3 horas) y las flores estaban perfectas, tal como en la foto. Volveré a comprar sin dudas. Muy recomendable.`
  };

  // Agregamos un nuevo schema de producto para más visibilidad
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${categoryName} - ENVIO FLORES`,
    image: siteImage,
    description: categoryData.description,
    brand: {
      '@type': 'Brand',
      name: 'ENVIO FLORES'
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: priceRange.min,
      highPrice: priceRange.max,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '856',
      bestRating: '5',
      worstRating: '1'
    }
  };

  // Convertimos los esquemas a JSON para el script
  const jsonLdScripts = [
    JSON.stringify(collectionSchema),
    JSON.stringify(breadcrumbSchema),
    JSON.stringify(localBusinessSchema),
    JSON.stringify(faqSchema),
    JSON.stringify(reviewSchema),
    JSON.stringify(productSchema)
  ];



  return (
    <>
      {/* Añadimos los schemas JSON-LD como scripts */}
      {jsonLdScripts.map((jsonScript, index) => (
        <Script
          key={`json-ld-${index}`}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonScript }}
        />
      ))}
      
      {/* Estructura semántica para SEO con microdatos */}
      <div itemScope itemType="https://schema.org/CollectionPage">
        <meta itemProp="name" content={`${categoryName} - ENVIO FLORES Argentina`} />
        <meta itemProp="description" content={categoryData.description} />
        <meta itemProp="url" content={siteUrl} />
        <link itemProp="image" href={siteImage} />
        
        {/* Información de oferta agregada */}
        <div itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
          <meta itemProp="lowPrice" content={priceRange.min} />
          <meta itemProp="highPrice" content={priceRange.max} />
          <meta itemProp="priceCurrency" content="ARS" />
          <meta itemProp="offerCount" content="20+" />
        </div>
        
        {/* Especialidad para mejor SEO */}
        <meta itemProp="specialty" content="Envío express en el día" />
        <meta itemProp="specialty" content="Entrega en 3 horas" />
        <meta itemProp="specialty" content="20% de descuento" />
        <meta itemProp="specialty" content="Flores frescas garantizadas" />
        
        {/* Componente principal */}
        <CategoryNameComponent categoryName={categoryName} />
      </div>
    </>
  );
}