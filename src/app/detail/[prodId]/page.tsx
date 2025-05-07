import ProductDetailComponent from '@/Client/Productos/Detalle/ProductDetail';
import { Metadata } from 'next';
import { fetchProductById, getProductKeywords } from '@/utils/serviciosMetadata';


interface ProductDetails {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  opciones?: Array<{
    precio: string;
    img: string;
  }>;
  ocasiones?: string[];
  precio?: string;
  disponibilidad?: string;
  colores?: string[];
  tamaño?: string;
}

interface Props {
  params: Promise<{
    prodId: string;
  }>;
}


// Esta función es reconocida por Next.js para generar metadatos
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId =  decodeURIComponent((await params).prodId);
  
  // Obtener detalles del producto
  const productDetails = await fetchProductById(productId) as ProductDetails;
  
  // Valores predeterminados para SEO si no hay datos
  const productName = productDetails?.nombre || `Arreglo floral `;
  
  // Aseguramos que productPrice sea string
  let productPrice = productDetails?.opciones?.[0]?.precio || productDetails?.precio || 'desde $5.000';
  if (typeof productPrice !== 'string') {
    productPrice = String(productPrice);
  }
  
  const productImage = productDetails?.opciones?.[0]?.img || `https://www.envioflores.com/imagenes/productos/${productId.replace(/\s+/g, '-')}.jpg`;
  const productCategory = productDetails?.categoria || 'Flores y Regalos';
  const productDescription = productDetails?.descripcion || `Hermoso arreglo floral  para sorprender a esa persona especial. Envío a domicilio en el día.`;
  
  // Palabras clave optimizadas
  const keywordsList = await getProductKeywords(productId);
  const enhancedKeywords = [
    ...keywordsList,
    `comprar ${productName}`,
    `${productName} envío rápido`,
    `${productName} ofertas`,
    `${productName} mismo día`,
    `${productName} envío a todo Capital Federal Y Gran Buenos Aires`,
    `${productName} precio`,
    `${productName} delivery`,
    `${productName} a domicilio en Buenos Aires`,
    `regalar ${productName}`,
    `${productName} para ${productDetails?.ocasiones?.join(' o ') || 'regalo'}`,
    `${productCategory} baratos`,
    `${productCategory} premium`,
    `${productCategory} express`,
    `mejor ${productCategory} en Argentina`,
    `envío de ${productCategory} CABA`,
    `${productCategory} envío en el día`,
    `comprar ${productCategory} online Argentina`
  ];
  
  // URL canónica
  const siteUrl = `https://www.envioflores.com/detail/${encodeURIComponent(productId)}`;
  
  // Título y descripción SEO
  const seoTitle = `${productName} 🌸 Envío de Flores EN EL DÍA | Envíos EXPRESS | ENVIO FLORES Argentina`;
  const seoDescription = `🌸 ¡${productName} con envíos express en el día! ${productDescription.substring(0, 70)}... ⭐ Garantía de frescura ⭐ Entrega en 3hs en CABA y GBA. ¡Haz tu pedido ahora!`;
  
  // Extraer números de precio de forma segura
  const numericPrice = productPrice.replace(/[^\d]/g, '') || '5000';
  const salePrice = (parseInt(numericPrice) * 0.8).toString();
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [...new Set(enhancedKeywords)].join(', '),
    alternates: {
      canonical: siteUrl,
      languages: {
        'es-AR': siteUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: 'ENVIO FLORES Argentina',
      images: [{
        url: productImage,
        width: 1200,
        height: 630,
        alt: `${productName} - Envío Express - ENVIO FLORES Argentina`,
      }],
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      title: `${productName} | Envío EXPRESS | ENVIO FLORES`,
      description: `🌸 ${productName} con 20% OFF y garantía de entrega en el día. La mejor calidad en flores y regalos para sorprender.`,
      images: [productImage],
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
    category: productCategory,
    other: {
      'geo.region': 'AR',
      'geo.placename': 'Buenos Aires',
      'format-detection': 'telephone=no',
      'distribution': 'global',
      'coverage': 'Argentina',
      'target': 'all',
      'revisit-after': '3 days',
      'rating': 'general',
      'og:availability': 'instock',
      'og:price:amount': numericPrice,
      'og:price:currency': 'ARS',
      'product:brand': 'ENVIO FLORES',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:price:amount': numericPrice,
      'product:price:currency': 'ARS',
      'product:sale_price:amount': salePrice,
      'product:sale_price:currency': 'ARS',
      'twitter:label1': 'Tiempo de entrega',
      'twitter:data1': 'En el día - 3 horas',
      'twitter:label2': 'Envío',
      'twitter:data2': 'Envíos en el día a domicilio en CABA y GBA',
      'fb:app_id': '123456789012345',
      'og:sale': 'true',
      'og:sale:discount': '20%',
      'og:availability_starts': new Date().toISOString(),
      'speakable.cssSelector': 'h1, .product-description, .product-details',
      'pinterest:description': `🌸 ${productName} con envío a todo Capital Federal y Gran Buenos Aires. ¡Haz tu pedido ahora!`,
      'pinterest:price:amount': numericPrice,
      'pinterest:price:currency': 'ARS',
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


export default async function DetailProd({ params }: Props) {
  const productId = decodeURIComponent((await params).prodId);
  
  // Obtener detalles del producto
  const productDetails = await fetchProductById(productId) as ProductDetails;
  
  // Extraer datos necesarios
  const productName = productDetails?.nombre || `Arreglo floral `;
  let productPrice = productDetails?.opciones?.[0]?.precio || productDetails?.precio || 'desde $5.000';
  if (typeof productPrice !== 'string') {
    productPrice = String(productPrice);
  }
  const productImage = productDetails?.opciones?.[0]?.img || `https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png`;
  const productDescription = productDetails?.descripcion || `Hermoso arreglo floral para sorprender a esa persona especial. Envío a domicilio en el día.`;
  
  // Corregir inconsistencia de URL en schemas
  const siteUrl = `https://www.envioflores.com/detail/${encodeURIComponent(productId)}`;
  const numericPrice = productPrice.replace(/[^\d]/g, '') || '5000';
  
  // Schema.org para producto
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    image: [productImage],
    description: productDescription,
    sku: `EF-${productId}`,
    mpn: `EF-${productId}`,
    brand: {
      '@type': 'Brand',
      name: 'ENVIO FLORES'
    },
    offers: {
      '@type': 'Offer',
      url: siteUrl,
      priceCurrency: 'ARS',
      price: numericPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ENVIO FLORES Argentina'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'ARS'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'AR',
          addressRegion: 'CABA y GBA'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'HUR'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 3,
            unitCode: 'HUR'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '152'
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: 'Cliente Satisfecho'
      },
      reviewBody: `¡El ${productName} superó mis expectativas! Llegó a tiempo y en perfectas condiciones.`
    }
  };

  // Schema para negocio local (corregido)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',                // Tipo correcto
    'additionalType': 'https://schema.org/Florist', // Especificar que es una floristería
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
    // Resto sin cambios
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

  // Schema FAQ (corregido ortografía)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuánto tarda en llegar el ${productName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Realizamos entregas express en el mismo día en CABA y Gran Buenos Aires, en tan solo 3 horas. Para el resto del país, el tiempo de entrega es de 24-48 horas.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuál es el costo de envío?', // Corregido "Cuál"
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El costo de envío varía según la ubicación, para consultarlo puedes ingresar a la sección de envíos de nuestro sitio web.'
        }
      },
      {
        '@type': 'Question',
        name: `¿Puedo personalizar mi ${productName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutamente. Puedes añadir tarjetas personalizadas, chocolates, peluches u otros complementos al realizar tu pedido.'
        }
      }
    ]
  };

  // SOLUCIÓN CORRECTA PARA NEXT.JS APP ROUTER
  // Con esto garantizamos que el JSON-LD se renderice correctamente en el HTML
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      
      {/* Componente principal sin microdata redundante */}
      <ProductDetailComponent prodId={productId} />
    </>
  );
}