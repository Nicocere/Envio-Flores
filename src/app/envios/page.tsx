import LocalidadPageComponent from '@/Client/Envios/EnviosPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "🚚 Zonas de Entrega | Envío Express de Flores a CABA y 200+ Localidades de GBA | Envíos en el DIA | Envio Flores Argentina",
  description: "Enviamos flores, ramos, arreglos florales, chocolates y regalos a CAPITAL FEDERAL y más de 200 localidades de GBA ¡MISMO DÍA! ✓ Seguimiento en tiempo real ✓ Entrega express garantizada ✓ Envíos en el día en muchas zonas ✓ Cobertura en San Isidro, Tigre, La Plata, Quilmes, Morón, Pilar y toda la provincia. Consulta tu localidad para envíos urgentes y sorprende hoy mismo.",
  keywords: [
    // Términos de servicio principales
    "envío de flores", "delivery flores", "entrega flores a domicilio", "envío rápido flores",
    "envío express flores", "reparto flores CABA", "envío flores GBA", "servicio entrega flores",
    "delivery flores mismo día", "envío flores urgente", "enviar flores hoy", "envío de flores",
    "seguimiento envío flores", "zonas de reparto flores", "cobertura envío flores",
    
    // Productos principales
    "flores", "ramos de flores", "arreglos florales", "rosas", "girasoles", "liliums", 
    "bouquets", "centros de mesa", "cajas de flores", "regalos", "chocolates", "peluches", 
    "canastas regalo", "vinos", "globos", "tarjetas personalizadas",
    
    // Localidades principales CABA y zona norte
    "envío flores Capital Federal", "envío flores San Isidro", "envío flores Vicente López", 
    "envío flores Tigre", "envío flores Olivos", "envío flores Martínez", "envío flores Nordelta",
    "envío flores San Fernando", "envío flores Pilar", "envío flores Escobar",
    
    // Zona sur
    "envío flores Avellaneda", "envío flores Quilmes", "envío flores Lanús", 
    "envío flores Lomas de Zamora", "envío flores Banfield", "envío flores Temperley",
    "envío flores Adrogué", "envío flores La Plata", "envío flores Berazategui",
    
    // Zona oeste
    "envío flores Morón", "envío flores Castelar", "envío flores Ituzaingó", 
    "envío flores Moreno", "envío flores Merlo", "envío flores San Justo",
    "envío flores Ramos Mejía", "envío flores Hurlingham", "envío flores San Miguel",
    
    // Ocasiones
    "flores para cumpleaños", "ramos para aniversarios", "arreglos para nacimientos",
    "coronas para condolencias", "flores para agradecimiento", "regalos para enamorados",
    "flores para recuperación", "arreglos para eventos", "flores para inauguración",
    
    // Términos de búsqueda competitivos
    "mejor servicio envío flores", "floristería con delivery", "flores frescas a domicilio",
    "envío flores calidad premium", "floristería online cobertura total", "delivery flores garantizado",
    "enviar flores Argentina", "florería con delivery express", "servicio flores 24h"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/envios',
    languages: {
      'es-AR': 'https://www.envioflores.com/envios',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/envios',
    title: '🚚 Zonas de Entrega | Envío de Flores a CABA y más de 200 Localidades | Envio Flores',
    description: 'Enviamos flores, arreglos florales y regalos a CAPITAL FEDERAL y toda la provincia de Buenos Aires ¡MISMO DÍA! Consulta tu localidad y sorprende a quien quieras hoy mismo.',
    siteName: 'Envio Flores Argentina',
    images: [{
      url: 'https://www.envioflores.com/imagenes/banners/mapa-cobertura-envioflores.jpg',
      width: 1200,
      height: 630,
      alt: 'Mapa de cobertura de entrega de Envio Flores en CABA y GBA',
    }],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    title: '🚚 Zonas de Entrega | Envío de Flores a CABA y GBA | Envio Flores',
    description: 'Enviamos flores, arreglos florales y regalos a CAPITAL FEDERAL y toda la provincia de Buenos Aires ¡MISMO DÍA! ✓ Seguimiento en tiempo real ✓ Entrega express garantizada',
    images: ['https://www.envioflores.com/imagenes/banners/mapa-cobertura-envioflores.jpg'],
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
  category: "Servicios de Envío",
  other: {
    // Información geográfica detallada
    'geo.region': 'AR-C',
    'geo.placename': 'Buenos Aires, Argentina',
    'geo.position': '-34.603722;-58.381592',
    'ICBM': '-34.603722, -58.381592',
    
    // Información de negocio local
    'business:contact_data:street_address': 'Av. Corrientes 1234',
    'business:contact_data:locality': 'Ciudad Autónoma de Buenos Aires',
    'business:contact_data:region': 'CABA',
    'business:contact_data:postal_code': '1043',
    'business:contact_data:country_name': 'Argentina',
    'business:contact_data:phone_number': '+54 11 4444-5555',
    
    // Configuración de página
    'revisit-after': '3 days',
    'author': 'Envio Flores Argentina',
    'language': 'es-AR',
    'distribution': 'global',
    'coverage': 'CABA, Gran Buenos Aires, Argentina',
    'target': 'all',
    'og:locale': 'es_AR',
    'theme-color': '#670000',
    
    // Horarios y servicios
    'business:hours': 'mo,tu,we,th,fr,sa,su 00:00-23:59',
    'service:delivery_time': 'Mismo día para pedidos antes de las 18:00',
    'service:coverage': 'CABA y más de 200 localidades de GBA',
    'service:express': 'Disponible',
    'service:tracking': 'Tiempo real',
    'service:online_payment': 'Aceptado',
    
    // Localidades destacadas - para buscadores
    'delivery:main_areas': 'Capital Federal, San Isidro, Vicente López, Tigre, Olivos, Martínez, San Fernando, Pilar, Escobar, Avellaneda, Quilmes, Lanús, Lomas de Zamora, Banfield, Temperley, Adrogué, La Plata, Berazategui, Morón, Castelar, Ituzaingó, Moreno, Merlo, San Justo, Ramos Mejía, Hurlingham, San Miguel',
    
    // Palabras clave adicionales
    'news_keywords': 'envío flores mismo día, envío express de flores, delivery flores urgente, envío rápido flores CABA, zonas entrega flores GBA',
    
    // Atributos para búsquedas de voz
    'speakable.cssSelector': 'h1, h2, .delivery-info',
    
    // Datos estructurados para algoritmos
    'structured-data': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "DeliveryService",
      "name": "Envio Flores Argentina",
      "url": "https://www.envioflores.com",
      "logo": "https://www.envioflores.com/logo.png",
      "description": "Servicio de envío de flores, arreglos florales y regalos a domicilio en CABA y GBA.",
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": -34.603722,
          "longitude": -58.381592
        },
        "geoRadius": "100km"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": -34.603722,
          "longitude": -58.381592
        },
        "geoRadius": "100km"
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://www.envioflores.com",
        "servicePhone": "+54 11 4444-5555",
        "availableLanguage": "Spanish"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios de Envío de Flores",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Envío Express de Flores",
              "description": "Entrega en el mismo día para pedidos realizados antes de las 18:00"
            }
          }
        ]
      },
      "hoursAvailable": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }
      ],
      "paymentAccepted": "Credit Card, Debit Card, Mercado Pago, Transferencia Bancaria",
      "termsOfService": "https://www.envioflores.com/terminos"
    })
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
  authors: [{ name: 'Envio Flores Argentina' }],
};

export default function EnviosPage() {
  return <LocalidadPageComponent />;
}