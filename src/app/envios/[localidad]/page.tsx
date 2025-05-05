import ZonasDeEnvioComponent from '@/Client/Envios/ZonasDeEnvio/ZonasDeEnvio';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    localidad: string;
  }>;
}

// Define información específica para localidades principales
const localidadesInfo: {[key: string]: {
  zonaEntrega: string,
  tiempoEntrega: string,
  costoEnvio: string,
  codigoPostal: string,
  municipio: string,
  keywordEspecial: string[]
}} = {
  "capitalfederal": {
    zonaEntrega: "CABA",
    tiempoEntrega: "2 horas",
    costoEnvio: "Consultar precio",
    codigoPostal: "C1000-C1499",
    municipio: "Ciudad Autónoma de Buenos Aires",
    keywordEspecial: ["flores capital federal", "envío flores Buenos Aires Centro", "florería microcentro"]
  },
  "sanisidro": {
    zonaEntrega: "Zona Norte",
    tiempoEntrega: "2-3 horas",
    costoEnvio: "Consultar precio",
    codigoPostal: "B1609-B1648",
    municipio: "San Isidro",
    keywordEspecial: ["flores San Isidro", "envío flores zona norte", "floristería premium San Isidro"]
  },
  "vicentelopez": {
    zonaEntrega: "Zona Norte",
    tiempoEntrega: "2-3 horas",
    costoEnvio: "Consultar precio",
    codigoPostal: "B1602-B1638",
    municipio: "Vicente López",
    keywordEspecial: ["flores Vicente López", "envío flores zona norte", "florería Olivos"]
  },
  "quilmes": {
    zonaEntrega: "Zona Sur",
    tiempoEntrega: "3-4 horas",
    costoEnvio: "Consultar precio",
    codigoPostal: "B1878-B1889",
    municipio: "Quilmes",
    keywordEspecial: ["flores Quilmes", "envío flores zona sur", "florería Quilmes Centro"]
  },
  "laplata": {
    zonaEntrega: "Zona Sur",
    tiempoEntrega: "3-4 horas",
    costoEnvio: "$899",
    codigoPostal: "B1900-B1999",
    municipio: "La Plata",
    keywordEspecial: ["flores La Plata", "envío flores ciudad universitaria", "florería La Plata Centro"]
  },
  "moron": {
    zonaEntrega: "Zona Oeste",
    tiempoEntrega: "3-4 horas",
    costoEnvio: "Consultar precio",
    codigoPostal: "B1708-B1709",
    municipio: "Morón",
    keywordEspecial: ["flores Morón", "envío flores zona oeste", "florería Morón Centro"]
  },
  "pilar": {
    zonaEntrega: "Zona Norte Extendida",
    tiempoEntrega: "3-5 horas",
    costoEnvio: "$999",
    codigoPostal: "B1629-B1631",
    municipio: "Pilar",
    keywordEspecial: ["flores Pilar", "envío flores countries Pilar", "florería zona norte country"]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCategory = decodeURIComponent(resolvedParams.localidad);
  
  const formatCategory = (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  };

  const localidad = formatCategory(rawCategory);
  
  // Obtener información específica o usar valores predeterminados
  const normalizedKey = rawCategory.toLowerCase().replace(/\s+/g, '');
  const localidadInfo = localidadesInfo[normalizedKey] || {
    zonaEntrega: "Gran Buenos Aires",
    tiempoEntrega: "En el día",
    costoEnvio: "Consultar",
    codigoPostal: "",
    municipio: "",
    keywordEspecial: []
  };
  
  const siteUrl = `https://www.envioflores.com/envios/${encodeURIComponent(rawCategory)}`;
  const siteImage = "https://www.envioflores.com/imagenes/banners/mapa-cobertura-envioflores.jpg";
  
  const areaEspecifica = localidadInfo.zonaEntrega;
  const tiempoEntrega = localidadInfo.tiempoEntrega;
  const costoEnvio = localidadInfo.costoEnvio;
  const codigoPostal = localidadInfo.codigoPostal;
  const municipio = localidadInfo.municipio || localidad;

  // Construir una descripción más rica y específica con detalles locales
  const description = `🚚 Envío de flores y regalos a ${localidad} con entrega garantizada en ${tiempoEntrega}. 🌹 Ramos de rosas, girasoles, liliums y más con envío ${costoEnvio === "Consultar precio" ? "" : "desde "+costoEnvio}. Arreglos florales exclusivos, desayunos sorpresa, chocolates gourmet y peluches con entrega a domicilio en toda la zona de ${localidad} y alrededores. Pago seguro con todas las tarjetas ✓ Garantía de frescura ✓ Envíos express ✓ Seguimiento en tiempo real. ¡Sorprende hoy mismo!`;

  // Palabras clave base para cualquier localidad
  const baseKeywords = [
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
    `servicio de florería premium ${localidad}`, `atención 24 horas ${localidad}`,
    
    // Términos específicos de código postal
    codigoPostal ? `flores envío código postal ${codigoPostal}` : "",
    codigoPostal ? `florería entrega CP ${codigoPostal}` : "",
    codigoPostal ? `enviar flores CP ${codigoPostal}` : "",
    
    // Términos para búsqueda por voz
    `cómo puedo enviar flores a ${localidad} hoy`,
    `cuánto cuesta el envío de flores a ${localidad}`,
    `quiero mandar flores a ${localidad}`,
    `necesito enviar un ramo a ${localidad} urgente`,
    `florería abierta ahora en ${localidad}`
  ];
  
  // Combinar con palabras clave específicas de la localidad
  const allKeywords = [
    ...baseKeywords, 
    ...localidadInfo.keywordEspecial,
    // Añadir términos con municipio si es diferente de la localidad
    municipio !== localidad ? `flores ${municipio}` : "",
    municipio !== localidad ? `envío flores ${municipio}` : "",
    municipio !== localidad ? `florería ${municipio}` : "",
    // Términos de zona específica
    `flores ${areaEspecifica}`,
    `envío flores ${areaEspecifica}`,
    `floristería ${areaEspecifica}`,
    `delivery flores ${areaEspecifica}`
  ].filter(keyword => keyword !== ""); // Eliminar strings vacíos

  const structuredData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Envío de Flores a ${localidad}`,
      "serviceType": "Servicio de entrega de flores y regalos",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Envio Flores Argentina",
        "image": "https://www.envioflores.com/assets/imagenes/logo-envio-flores.png",
        "telephone": "+54-11-4788-9185",
        "email": "floreriasargentinas@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Av. Crámer 1915",
          "addressLocality": "Buenos Aires",
          "postalCode": "C1428CTC",
          "addressRegion": "Ciudad Autónoma de Buenos Aires",
          "addressCountry": "AR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-34.56630121189851",
          "longitude": "-58.45960052031086"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "20:00"
        },
        "paymentAccepted": "Cash, Credit Card, Debit Card, Check, NFC Mobile Payments",
        "priceRange": "$$",
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Service Options",
            "value": "Entrega a domicilio, Retiro en tienda, Compras en tienda, Entrega el mismo día"
          },
          {
            "@type": "PropertyValue",
            "name": "Público",
            "value": "Amigable con LGBTQ+"
          },
          {
            "@type": "PropertyValue",
            "name": "Planificación",
            "value": "Visita rápida"
          }
        ]
      },
      "areaServed": {
        "@type": "City",
        "name": localidad,
        "containedIn": municipio
      },
      "offers": {
        "@type": "Offer",
        "description": `Servicio de envío de flores a ${localidad}`,
        "price": costoEnvio === "Consultar precio" ? "0" : costoEnvio.replace(/[^0-9]/g, ""),
        "priceCurrency": "ARS",
        "availability": "https://schema.org/InStock",
        "deliveryLeadTime": {
          "@type": "QuantitativeValue",
          "value": tiempoEntrega === "En el día" ? "24" : tiempoEntrega.replace(/[^0-9-]/g, "").split("-")[0],
          "unitCode": "HUR"
        }
      }
    };
  return {
    title: `🚚 Envío de Flores a ${localidad} | Entrega en ${tiempoEntrega} | Envío ${costoEnvio === "Consultar precio" ? "" : "desde "+costoEnvio} | Envio Flores Argentina`,
    description: description,
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
      title: `🌹 Flores a Domicilio en ${localidad} | Entrega Garantizada en ${tiempoEntrega} | Envio Flores`,
      description: description,
      siteName: 'Envio Flores Argentina',
      images: [{
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `Envío de Flores y Regalos a ${localidad} - Entrega en ${tiempoEntrega} - Envio Flores Argentina`,
      }],
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@EnvioFlores',
      creator: '@EnvioFlores',
      title: `🌹 Flores a Domicilio en ${localidad} | Entrega en ${tiempoEntrega} | Envio Flores`,
      description: description.substring(0, 200) + "...",
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
    category: 'Flores y Regalos',
    other: {
      // Información geográfica
      'geo.region': 'AR-C',
      'geo.placename': localidad + ', ' + (municipio || 'Buenos Aires'),
      'geo.position': '-34.603722;-58.381592',
      'ICBM': '-34.603722, -58.381592',
      
      // Información específica de la localidad
      'place:location:locality': localidad,
      'place:location:region': municipio || areaEspecifica,
      'place:location:postal_code': codigoPostal,
      
      // Configuración de la página
      'language': 'es-AR',
      'revisit-after': '3 days',
      'distribution': 'global',
      'rating': 'general',
      'coverage': `${localidad}, ${municipio || areaEspecifica}, Buenos Aires, Argentina`,
      
      // Metadatos de redes sociales adicionales
      'og:locale': 'es_AR',
      'og:type': 'website',
      'og:site_name': 'Envio Flores Argentina',
      
      // Información específica del servicio para esta localidad
      'service:area': localidad,
      'service:delivery_time': tiempoEntrega,
      'service:delivery_cost': costoEnvio,
      'service:delivery_availability': '24/7',
      
      // Etiquetas para Twitter Cards
      'twitter:label1': 'Envíos a',
      'twitter:data1': localidad,
      'twitter:label2': 'Tiempo de entrega',
      'twitter:data2': tiempoEntrega,
      'twitter:label3': 'Costo de envío',
      'twitter:data3': costoEnvio,
      
      // Detalles sobre el servicio
      'shopping:shipping_area': localidad,
      'shopping:shipping_rate': costoEnvio,
      'shopping:shipping_time': tiempoEntrega,
      'shopping:payment_methods': 'Tarjetas de crédito/débito, MercadoPago, efectivo',
      
      // Datos estructurados en formato JSON-LD
      'structured-data': JSON.stringify(structuredData),
      
      // Información específica para búsquedas por voz
      'speakable.cssSelector': 'h1, h2, .delivery-info, .price-info',
      
      // Marcado de la página para rastreadores web
      'news_keywords': `flores ${localidad}, entrega flores ${localidad}, florería online ${localidad}, envío rápido flores ${municipio}, flores a domicilio ${areaEspecifica}`,
      
      // Tema visual
      'theme-color': '#670000',
      'msapplication-TileColor': '#ffffff',
      'msapplication-config': '/browserconfig.xml',
      
      // Para rastreadores adicionales
      'alexaVerifyID': 'alexa-verify-id',
      'norton-safeweb-site-verification': 'norton-verification',
      'wot-verification': 'wot-verification-code'
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
  const rawCategory = decodeURIComponent(resolvedParams.localidad);

  const formatCategory = (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  };

  const localidad = formatCategory(rawCategory);

  return <ZonasDeEnvioComponent localidad={localidad} />;
}