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

  // Diccionario de emojis para categorías
  const categoryEmojis: Record<string, string> = {
    'rosas': '🌹',
    'girasoles': '🌻',
    'tulipanes': '🌷',
    'lilium': '⚜️',
    'flores': '💐',
    'ramos': '💐',
    'arreglos': '🎁',
    'cajas': '📦',
    'plantas': '🪴',
    'suculentas': '🌵',
    'peluches': '🧸',
    'chocolates': '🍫',
    'vinos': '🍷',
    'desayunos': '☕',
    'regalos': '🎁',
    'condolencias': '✝️',
    'cumpleaños': '🎂',
    'aniversario': '💝',
    'amor': '❤️',
    'especiales': '✨',
    'premium': '👑',
    'corporativos': '🏢',
    'eventos': '🎊',
    'bodas': '💍',
    'nacimientos': '👶',
    'bebidas': '🥂',
    'cestas': '🧺',
    'canastas': '🧺',
    'globos': '🎈',
    'ferrero-rocher': '🍬',
    'bombones': '🍬',
    'regalos personalizados': '🎁',
    'sorpresas': '🎉',
    'arreglos florales': '💐',
    'arreglos fúnebres': '⚰️',
    'coronas': '💐',
    'flores de condolencias': '💐',
    'flores para funeral': '⚰️',
    'flores para velorio': '⚰️',
    'flores para dar pésame': '💐',
    'flores para expresar condolencias': '💐',

  };

  const getEmoji = (category: string) => {
    // Buscar la palabra clave que coincida con alguna parte del nombre de la categoría
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
    return '🌺'; // Emoji por defecto si no se encuentra coincidencia
  };

  const categoryName = formatCategory(rawCategory);
  const categoryEmoji = getEmoji(categoryName);
  const categorySlug = rawCategory.toLowerCase();
  const siteUrl = `https://www.envioflores.com/productos/${rawCategory}`;
  console.log(" suteUrl", siteUrl);
  
  // Función para generar imágenes relevantes según categoría
  const getCategoryImage = (categoryName: string) => {
    const lowerCategory = categoryName.toLowerCase();
    if (lowerCategory.includes('rosa')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('girasol')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('planta')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('desayuno')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('chocolate') || lowerCategory.includes('bombones')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('vino') || lowerCategory.includes('champagne')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('peluche')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png";
    } else if (lowerCategory.includes('caja') || lowerCategory.includes('box')) {
      return "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";
    }
    // Imagen por defecto
    return "https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png";
  };

  const siteImage = getCategoryImage(categoryName);
  
  // Títulos y descripciones dinámicas optimizadas con emojis
  const titleEmoji = categoryEmoji;
  const titlePrefix = `${titleEmoji} ${categoryName}`;
  
  // Crear título optimizado según categoría
  let seoTitle = `${titlePrefix} Premium - Envío EXPRESS 2hs CABA y MISMO DÍA GBA | Envio Flores Argentina`;
  if (categoryName.toLowerCase().includes('rosa')) {
    seoTitle = `${titlePrefix} Premium Importadas - Envío EXPRESS 2hs CABA | Caja, Ramo o Bouquet | Envio Flores`;
  } else if (categoryName.toLowerCase().includes('planta')) {
    seoTitle = `${titlePrefix} de Interior y Exterior - Macetas Decorativas | Envío Express 2hs | Envio Flores`;
  } else if (categoryName.toLowerCase().includes('regalo') || categoryName.toLowerCase().includes('combo')) {
    seoTitle = `${titlePrefix} Originales para Sorprender | Flores + Chocolates + Vinos | Envío EXPRESS | Envio Flores`;
  } else if (categoryName.toLowerCase().includes('caja') || categoryName.toLowerCase().includes('box')) {
    seoTitle = `${titlePrefix} Elegantes con Flores Premium | Diseños Exclusivos | Envío EXPRESS | Envio Flores`;
  }
  
  // Crear descripción optimizada según categoría
  let seoDescription = `🔝 Los mejores ${categoryName.toLowerCase()} a domicilio en CABA y GBA. Alta calidad garantizada, envío EXPRESS en 2 horas, seguimiento en tiempo real y atención 24/7. Gran variedad de flores frescas, chocolates, peluches y regalos para toda ocasión. ✅ Garantía de satisfacción 7 días.`;
  if (categoryName.toLowerCase().includes('rosa')) {
    seoDescription = `🌹 ${categoryName} Premium importadas de Ecuador y Colombia en todas las variedades y colores: rojas, blancas, azules, rosadas, amarillas, naranjas, multicolor. Elegí presentación: ramo, caja, canasta, o arreglo. ✅ Garantía 7 días ✅ Envío EXPRESS 2hs CABA ✅ Mismo día GBA`;
  } else if (categoryName.toLowerCase().includes('planta')) {
    seoDescription = `🪴 ${categoryName} decorativas para interior y exterior en macetas de diseño. Gran variedad: suculentas, cactus, orquídeas, potus, ficus, sansevierias, helechos, kokedamas y más. Ideales para regalo o decoración. ✅ Guía de cuidados incluida ✅ Envío EXPRESS a CABA y GBA`;
  } else if (categoryName.toLowerCase().includes('chocolate') || categoryName.toLowerCase().includes('bombones')) {
    seoDescription = `🍫 Exclusiva selección de ${categoryName.toLowerCase()} gourmet y bombones artesanales de la mejor calidad. Combiná con flores, peluches o vinos para un regalo inolvidable. ✅ Marcas premium ✅ Presentaciones elegantes ✅ Envío EXPRESS refrigerado ✅ Entrega en 2hs CABA`;
  }
  
  // Palabras clave específicas según categoría
  let categorySpecificKeywords: string[] = [];
  
  if (categoryName.toLowerCase().includes('rosa')) {
    categorySpecificKeywords = [
      'rosas importadas premium', 'rosas ecuatorianas', 'rosas colombianas', 
      'rosas tallo largo', 'rosas rojas', 'rosas blancas', 'rosas azules', 
      'rosas negras', 'rosas arcoíris', 'caja de rosas', 'rosas eternas', 
      'rosas preservadas', 'bouquet de rosas', 'ramo de rosas', 'rosas y chocolates',
      'ramo 12 rosas', 'ramo 24 rosas', 'ramo 50 rosas', 'caja rosas rojas',
      'rosa eterna en cúpula', 'rosa bella y bestia', 'rosas premium delivery',
      'rosas para aniversario', 'rosas para cumpleaños', 'rosas para novia',
      'rosas para declaración amor', 'rosas con sentido', 'significado color rosas'
    ];
  } else if (categoryName.toLowerCase().includes('girasol')) {
    categorySpecificKeywords = [
      'girasoles frescos', 'girasoles gigantes', 'ramo de girasoles', 'caja de girasoles',
      'girasoles con chocolates', 'girasoles para alegrar', 'girasoles y rosas',
      'girasoles con peluches', 'arreglo de girasoles', 'centro de mesa girasoles',
      'girasoles para cumpleaños', 'girasoles para amistad', 'girasoles grandes',
      'girasoles con regalo', 'girasoles decorativos', 'girasoles premium'
    ];
  } else if (categoryName.toLowerCase().includes('planta')) {
    categorySpecificKeywords = [
      'plantas de interior', 'plantas con maceta', 'plantas decorativas', 'plantas suculentas',
      'plantas fácil cuidado', 'plantas purificadoras', 'plantas para oficina', 
      'plantas para regalo', 'plantas con macetas decorativas', 'orquídeas', 
      'cactus decorativos', 'terrarios', 'kokedamas', 'bonsái', 'plantas aromáticas',
      'plantas feng shui', 'plantas que dan suerte', 'plantas para departamento',
      'plantas que no necesitan sol', 'plantas que purifican el aire', 
      'plantas para principiantes', 'sansevieria', 'potus', 'ficus', 'kalanchoe'
    ];
  } else if (categoryName.toLowerCase().includes('caja') || categoryName.toLowerCase().includes('box')) {
    categorySpecificKeywords = [
      'flower box', 'cajas con flores', 'caja de rosas', 'caja sorpresa', 
      'hatbox flores', 'caja de regalo con flores', 'caja con chocolates y flores',
      'caja premium', 'caja elegante', 'gift box', 'cajas sorpresa cumpleaños',
      'cajas para aniversario', 'cajas personalizadas', 'cajas flores preservadas',
      'caja rosas eternas', 'caja flores y vino', 'caja flores y peluche'
    ];
  } else if (categoryName.toLowerCase().includes('regalo') || categoryName.toLowerCase().includes('combo')) {
    categorySpecificKeywords = [
      'regalos originales', 'regalos sorpresa', 'regalos para mujer', 'regalos para hombre',
      'regalos romanticos', 'regalos aniversario', 'regalos cumpleaños', 'regalos día de la madre',
      'regalos san valentín', 'regalos personalizados', 'combos regalo', 'regalos premium',
      'regalos a domicilio', 'regalos express', 'regalos últimos momento', 'regalos creativos',
      'regalos exclusivos', 'regalos corporativos', 'regalos ejecutivos', 'canastas regalo'
    ];
  } else if (categoryName.toLowerCase().includes('chocolate') || categoryName.toLowerCase().includes('bombones')) {
    categorySpecificKeywords = [
      'chocolates gourmet', 'bombones artesanales', 'chocolates belgas', 'trufas chocolates',
      'chocolates finos', 'chocolates y flores', 'chocolate premium', 'caja bombones lujo',
      'bombones rellenos', 'chocolates variados', 'chocolates para regalo', 'bombones importados',
      'chocolate bitter', 'chocolate blanco', 'chocolate con leche', 'chocolates con licor'
    ];
  } else if (categoryName.toLowerCase().includes('vino') || categoryName.toLowerCase().includes('champagne')) {
    categorySpecificKeywords = [
      'vinos premium', 'vinos para regalo', 'vinos con flores', 'vinos finos', 
      'champagne y flores', 'vinos malbec', 'vinos cabernet', 'vinos argentinos', 
      'espumantes para regalo', 'vinos importados', 'cajas vino regalo', 'vino tinto regalo',
      'champagne francés', 'vinos alta gama', 'vinos con chocolates', 'vino personalizado'
    ];
  } else if (categoryName.toLowerCase().includes('condolencia')) {
    categorySpecificKeywords = [
      'coronas fúnebres', 'arreglos para velorio', 'flores para funeral', 'arreglos para condolencias',
      'coronas de flores', 'flores para dar pésame', 'arreglos fúnebres', 'flores blancas condolencias', 
      'envío flores funeraria', 'ofrendas florales', 'centros de flores para funeral', 
      'flores para capilla ardiente', 'coronas para velatorio', 'flores para expresar condolencias'
    ];
  }

  // Combinar palabras clave generales con las específicas de categoría
  const combinedKeywords = [
    categoryName.toLowerCase(),
    `mejores ${categoryName.toLowerCase()}`,
    `${categoryName.toLowerCase()} a domicilio`,
    `${categoryName.toLowerCase()} envío mismo día`,
    `${categoryName.toLowerCase()} express`,
    `${categoryName.toLowerCase()} premium`,
    `${categoryName.toLowerCase()} buenos aires`,
    `${categoryName.toLowerCase()} CABA`,
    `${categoryName.toLowerCase()} GBA`,
    `${categoryName.toLowerCase()} calidad`,
    `${categoryName.toLowerCase()} envio flores`,
    // Palabras clave generales
    'flores', 'regalos', 'envío de flores', 'florería online', 'ramos florales', 
    'arreglos florales', 'chocolates', 'peluches', 'regalos personalizados', 
    'envío a domicilio', 'flores CABA', 'flores Gran Buenos Aires', 'delivery flores', 
    'envío mismo día', 'regalos corporativos', 'flores para cumpleaños', 
    'flores para aniversario', 'rosas', 'tulipanes', 'lilium', 'girasoles',
    'flores express', 'envío flores 2 horas', 'flores premium', 'florería argentina',
    'mejor florería online', 'flores frescas garantía', 'flores con garantía',
    'flores a domicilio hoy', 'flores entrega urgente', 'flores online',
    'comprar flores internet', 'arreglos florales exclusivos', 'flores para regalar',
    'flores con mensaje', 'flores con tarjeta', 'flores para enamorados',
    'flores para perdón', 'flores para recuperación', 'flores con peluche',
    'flores con chocolates', 'flores con vino', 'regalar flores', 'sorprender con flores',
    'flores naturales', 'comprar flores online', 'florería con envío',
    
    // Añadir keywords específicas de categoría
    ...categorySpecificKeywords
  ];

  // Estructura Schema.org para categoría de productos
  const generateCategorySchema = (categoryName: string) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Product",
            "name": `${categoryName} Premium`,
            "description": `${categoryName} de la mejor calidad con envío express a domicilio en CABA y GBA.`,
            "image": siteImage,
            "url": siteUrl,
            "brand": {
              "@type": "Brand",
              "name": "Envio Flores"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "5999",
              "highPrice": "25000",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "offerCount": "15"
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "4.8",
                "bestRating": "5"
              },
              "author": {
                "@type": "Person",
                "name": "Cliente Envio Flores"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "124"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Product",
            "name": `${categoryName} Exclusivos`,
            "description": `${categoryName} diseños exclusivos con entrega el mismo día en Buenos Aires.`,
            "image": siteImage,
            "url": siteUrl,
            "brand": {
              "@type": "Brand",
              "name": "Envio Flores"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "7999",
              "highPrice": "30000",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "offerCount": "10"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Product",
            "name": `${categoryName} con Envío Express`,
            "description": `${categoryName} con envío express en 2 horas en CABA y mismo día en GBA`,
            "image": siteImage,
            "url": siteUrl,
            "brand": {
              "@type": "Brand",
              "name": "Envio Flores"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "8999",
              "highPrice": "35000",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "offerCount": "20"
            }
          }
        }
      ]
    };
    return JSON.stringify(schema);
  };

  // FAQs específicas según categoría
  const generateCategoryFAQs = (categoryName: string) => {
    let faqs = [
      {
        "@type": "Question",
        "name": `¿Cuál es el tiempo de entrega para los ${categoryName.toLowerCase()}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Entregamos ${categoryName.toLowerCase()} con servicio EXPRESS en 2 horas en CABA para pedidos antes de las 18:00hs. Para Gran Buenos Aires garantizamos entrega el MISMO DÍA para pedidos realizados antes de las 15:00hs. También ofrecemos programación de entrega para fecha y hora específica.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Qué garantía tienen los ${categoryName.toLowerCase()}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Todos nuestros ${categoryName.toLowerCase()} cuentan con garantía de calidad y frescura. Las flores tienen garantía de 7 días desde la entrega. Si no estás conforme con la calidad, contáctanos durante las primeras 24 horas con fotos y realizaremos el reemplazo sin costo adicional.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Puedo personalizar mi pedido de ${categoryName.toLowerCase()}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `¡Absolutamente! Ofrecemos personalización completa de nuestros ${categoryName.toLowerCase()}. Puedes elegir colores específicos, tamaño del arreglo y complementos como chocolates, peluches o vinos. También puedes incluir una tarjeta con mensaje personalizado sin costo adicional. Para pedidos totalmente a medida contáctanos por WhatsApp.`
        }
      },
      {
        "@type": "Question",
        "name": `¿Cuáles son las formas de pago aceptadas para comprar ${categoryName.toLowerCase()}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express), pagos con MercadoPago (hasta 12 cuotas), transferencia bancaria y efectivo contra entrega (solo en CABA). Para empresas ofrecemos facturación electrónica y condiciones especiales de pago.`
        }
      }
    ];

    // Agregar preguntas específicas según categoría
    if (categoryName.toLowerCase().includes('rosa')) {
      faqs.push({
        "@type": "Question",
        "name": "¿De dónde provienen sus rosas premium?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nuestras rosas premium son importadas principalmente de Ecuador y Colombia, reconocidas por ser de las mejores del mundo debido a su ubicación geográfica cerca de la línea ecuatorial. Esto permite que nuestras rosas tengan tallos más largos, botones más grandes y mayor duración que las rosas comunes."
        }
      });
      faqs.push({
        "@type": "Question",
        "name": "¿Cuánto tiempo duran las rosas después de recibirlas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nuestras rosas premium tienen una duración aproximada de 7-10 días siguiendo los cuidados recomendados que enviamos con cada arreglo. Para maximizar su duración, recomendamos cambiar el agua cada 2 días, cortar 1cm del tallo en diagonal y mantenerlas lejos de fuentes de calor y luz solar directa."
        }
      });
    } else if (categoryName.toLowerCase().includes('planta')) {
      faqs.push({
        "@type": "Question",
        "name": "¿Las plantas vienen con instrucciones de cuidado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, todas nuestras plantas incluyen una guía detallada de cuidados específica para cada especie. Incluimos información sobre riego, luz ideal, temperatura y consejos de mantenimiento para que tu planta prospere por mucho tiempo. También ofrecemos asesoramiento post-venta por WhatsApp para resolver cualquier duda sobre el cuidado."
        }
      });
      faqs.push({
        "@type": "Question",
        "name": "¿Qué plantas recomiendan para regalar a alguien que no tiene experiencia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Para principiantes recomendamos plantas de bajo mantenimiento como suculentas, potus, sansevierias (lengua de suegra), cactus decorativos o zamioculcas. Estas plantas requieren poco riego, son resistentes a distintas condiciones de luz y perdonan pequeños descuidos en su cuidado, siendo ideales para quienes se inician en el mundo de las plantas."
        }
      });
    }

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs
    });
  };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: combinedKeywords,
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
      siteName: 'Envio Flores Argentina',
      images: [{
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `${categoryName} Premium - Envio Flores Argentina`,
      }],
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      title: seoTitle,
      description: seoDescription,
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
    category: 'Flores, Plantas y Regalos',
    other: {
          // Información geográfica
          'geo.region': 'AR-C',
          'geo.position': '-34.56630121189851;-58.45960052031086',
          'ICBM': '-34.56630121189851, -58.45960052031086',
          'geo.placename': 'Buenos Aires, Argentina',
          'geo.country': 'Argentina',
          'geo.area.served': 'CABA, Gran Buenos Aires, Argentina',
          'place:location:latitude': '-34.56630121189851',
          'place:location:longitude': '-58.45960052031086',
          'distribution.area': 'CABA, Zona Norte, Zona Sur, Zona Oeste',
          'coverage.area': 'Capital Federal, Gran Buenos Aires, Argentina',
          
          // Información de negocio
          'business:contact_data:street_address': 'Av. Crámer 1915',
          'business:contact_data:locality': 'Ciudad Autónoma de Buenos Aires',
          'business:contact_data:region': 'Ciudad Autónoma de Buenos Aires',
          'business:contact_data:postal_code': 'C1428CTC',
          'business:contact_data:country_name': 'Argentina',
          'business:contact_data:email': 'floreriasargentinas@gmail.com',
          'business:contact_data:phone_number': '+54 11 4788-9185',
          'business:contact_data:website': 'https://www.envioflores.com',
          'business:contact_data:whatsapp': '+5491165421003',
          'business:hours': 'mo,tu,we,th,fr,sa 09:00-20:00',
          'business:type': 'Florist.DeliveryService',
          'business:status': 'Open.Online',
          'business:local.rating': '4.8',
          'business:reviews.count': '1250+',
          
          // Configuración de página
          'language': 'es-AR',
          'distribution': 'global',
          'coverage': 'CABA, Gran Buenos Aires, Argentina',
          'target': 'all',
          'rating': 'general',
          'revisit-after': '1 day',
          'apple-mobile-web-app-capable': 'yes',
          'mobile-web-app-capable': 'yes',
          'format-detection': 'telephone=no',
          'HandheldFriendly': 'True',
          'apple-mobile-web-app-title': 'Envio Flores',
          'application-name': 'Envio Flores Argentina',
          
          // Metadatos visuales
          'theme-color': '#670000',
          'msapplication-TileColor': '#670000',
          'msapplication-navbutton-color': '#670000',
          'apple-mobile-web-app-status-bar-style': 'black-translucent',
          
          // Información de producto
          'product:category': categoryName,
          'product:availability': 'in stock',
          'product:condition': 'new',
          'product:retailer': 'Envio Flores Argentina',
          'product:price:amount.min': '5999',
          'product:price:amount.max': '35000',
          'product:price:currency': 'ARS',
          'product:delivery.method': 'Entrega a domicilio, Retiro en tienda, Compras en tienda, Entrega el mismo día',
          'product:delivery.time': '2-24 horas',
          'product:shipping_cost:amount': '0',
          'product:shipping_cost:currency': 'ARS',
          
          // Información de servicio
          'service:delivery_time': 'Express 2 horas en CABA, Mismo día para pedidos antes de las 18:00 en GBA',
          'service:coverage': 'CABA y más de 200 localidades de GBA',
          'service:express': 'Disponible - 2 horas en CABA',
          'service:tracking': 'Tiempo real por WhatsApp y email',
          'service:online_payment': 'Tarjetas de crédito/débito, MercadoPago, Transferencia, Cheques, Pagos móviles mediante NFC',
          'service:customer_support': 'WhatsApp 24/7, teléfono Lun-Vie 9:00-20:00, Sab 9:00-20:00',
          'service:return_policy': 'Garantía de frescura 7 días',
          'service:shipping': 'Envios en el día, tenelo en 2 horas',
          'service:delivery_area': 'CABA, Gran Buenos Aires, Argentina',
          'service:warranty': 'Satisfacción garantizada o reemplazo sin cargo',
          'service:rating': '4.8/5 basado en 1250+ opiniones',
          
          // Palabras clave adicionales para noticias
          'news_keywords': `${categoryName.toLowerCase()}, flores frescas, envío express, flores a domicilio CABA, floristería online Buenos Aires, envío flores mismo día, ${categorySpecificKeywords.slice(0, 3).join(', ')}`,
          
          // Atributos para búsqueda por voz
          'speakable.cssSelector': 'h1, h2, h3, .product-description, .delivery-info, .price-info',
          'speakable.speechType': 'SearchResultsPage',
          
          // Tags adicionales para SEO
          'pinterest-rich-pin': 'true',
          'twitter:label1': 'Tiempo de entrega',
          'twitter:data1': 'CABA: 2 horas | GBA: Mismo día',
          'twitter:label2': 'Garantía',
          'twitter:data2': 'Frescura garantizada 7 días o reemplazo sin cargo',
          
          // Datos estructurados para categoría de productos
          'category-structured-data': generateCategorySchema(categoryName),
          
          // FAQs estructuradas específicas de categoría
          'faq-structured-data': generateCategoryFAQs(categoryName),
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

// Precargar información de categorías más comunes para mejor rendimiento
export async function generateStaticParams() {
  return [
    { categoria: 'rosas' },
    { categoria: 'girasoles' },
    { categoria: 'plantas' },
    { categoria: 'cajas' },
    { categoria: 'desayunos' },
    { categoria: 'combos' },
    { categoria: 'regalos' },
    { categoria: 'condolencias' }
  ];
}