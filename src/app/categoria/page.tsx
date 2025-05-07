import ProductsCategoryComponent from '@/Client/Categorias/CategoryComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "🌹 Todas las Categorías de Flores y Regalos | Ramos, Arreglos, Chocolates, Peluches | Envío EXPRESS | ENVIO FLORES Argentina",
  description: "Explora nuestra amplia selección de productos: rosas premium, girasoles, liliums, gerberas, ramos combinados, arreglos exclusivos, peluches, chocolates gourmet, vinos, desayunos sorpresa y combos regalo para toda ocasión. ✓ Envío EXPRESS garantizado ✓ Entrega MISMO DÍA en CABA y GBA ✓ Servicio 24/7 ✓ Flores frescas con garantía ✓ Pago seguro online. ¡Haz tu pedido ahora y sorprende a quien más quieres!",
  keywords: [
    // Categorías principales
    "categorías flores", "ramos de flores", "arreglos florales", "regalos con flores", 
    "peluches y flores", "chocolates con flores", "combos regalo", "cajas de regalo",
    "desayunos sorpresa", "vinos con flores", "plantas ornamentales", "globos con flores",
    
    // Tipos de flores
    "ramos de rosas", "rosas premium", "girasoles", "liliums", "gerberas", "tulipanes", 
    "orquídeas", "margaritas", "fresias", "astromelias", "rosas eternas", "flores preservadas",
    "rosas rojas", "rosas blancas", "rosas azules", "rosas rosadas", "ramos multicolor",
    
    // Productos específicos
    "cajas de rosas", "arreglos de girasoles", "bouquet de flores", "canastas florales",
    "centros de mesa", "terrarios", "plantas suculentas", "orquídeas premium", "bonsái",
    "flores artificiales", "rosas preservadas", "arreglos temáticos", "corona fúnebre",
    
    // Ocasiones
    "flores para cumpleaños", "regalos para aniversario", "flores para día de la madre",
    "regalos San Valentín", "arreglos para condolencias", "flores para graduación",
    "regalos para nacimientos", "flores para recuperación", "regalos de agradecimiento",
    "arreglos para eventos corporativos", "decoración floral para bodas", "regalos para jubilación",
    
    // Términos de entrega y servicio
    "envío de flores express", "entrega de flores en el día", "flores a domicilio", 
    "florería online 24 horas", "envío flores CABA", "delivery flores GBA", "envío a domicilio flores",
    "florería con seguimiento de pedido", "pago seguro flores", "flores con garantía de frescura",
    "mejor precio en flores", "envío flores Argentina", "comprar flores online",
    
    // Términos geográficos
    "flores Capital Federal", "florería Buenos Aires", "envío flores provincia Buenos Aires",
    "entrega flores Zona Norte", "delivery flores Zona Sur", "flores Zona Oeste", 
    "envío flores San Isidro", "delivery flores La Plata", "envío flores Pilar",
    "entrega flores Vicente López", "delivery flores Quilmes", "envío flores Morón",
    
    // Términos de búsqueda naturales
    "dónde comprar flores frescas", "mejores arreglos florales", "cómo enviar flores a domicilio",
    "regalos florales originales", "mejor florería online", "flores de calidad premium",
    "flores para sorprender", "regalos originales con flores", "ideas regalo con flores",
    "cuánto cuesta enviar flores", "como elegir un ramo de flores", "flores que duran más tiempo"
  ],
  authors: [{ name: "ENVIO FLORES Argentina" }],
  alternates: {
    canonical: 'https://www.envioflores.com/categoria',
    languages: {
      'es-AR': 'https://www.envioflores.com/categoria',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/categoria',
    title: '🌹 Flores y Regalos por Categorías | Envío Express Garantizado | ENVIO FLORES',
    description: 'Descubre nuestro catálogo completo de flores frescas, arreglos exclusivos, regalos, chocolates, peluches y más. Envío EXPRESS mismo día en CABA y GBA. ¡Sorprende ahora!',
    siteName: 'ENVIO FLORES Argentina',
    images: [{
      url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 1200,
      height: 630,
      alt: 'Categorías de productos - Ramos, Arreglos, Regalos y más - ENVIO FLORES Argentina',
    }],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    title: '🌹 Categorías de Flores y Regalos | Envío Express | ENVIO FLORES',
    description: 'Explora nuestro catálogo: flores frescas, arreglos exclusivos, peluches, chocolates y más con envío garantizado mismo día en CABA y GBA.',
    images: ['https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png'],
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
  category: 'Flores y Regalos',
  other: {
    // Información geográfica
    'geo.region': 'AR-C',
    'geo.position': '-34.603722;-58.381592',
    'ICBM': '-34.603722, -58.381592',
    'geo.placename': 'Buenos Aires, Argentina',
    
    // Información de negocio
    'business:contact_data:street_address': 'Av. Corrientes 1234',
    'business:contact_data:locality': 'Ciudad Autónoma de Buenos Aires',
    'business:contact_data:region': 'CABA',
    'business:contact_data:postal_code': '1043',
    'business:contact_data:country_name': 'Argentina',
    'business:contact_data:email': 'floreriasargentinas@gmail.com',
    'business:contact_data:phone_number': '+54 11 4444-5555',
    'business:hours': 'mo,tu,we,th,fr,sa,su 00:00-23:59',
    
    // Configuración de página
    'language': 'es-AR',
    'distribution': 'global',
    'coverage': 'CABA, Gran Buenos Aires, Argentina',
    'target': 'all',
    'rating': 'general',
    'revisit-after': '3 days',
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
    
    // Metadatos adicionales
    'theme-color': '#670000',
    'msapplication-TileColor': '#670000',
    'msapplication-config': '/browserconfig.xml',
    'application-name': 'ENVIO FLORES',
    
    // Información comercial
    'product:brand': 'ENVIO FLORES',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'og:availability': 'instock',
    'og:price:currency': 'ARS',
    'og:locale': 'es_AR',
    'og:site_name': 'ENVIO FLORES Argentina',
    
    // Detalles del servicio
    'service:delivery_time': 'Mismo día para pedidos antes de las 18:00',
    'service:coverage': 'CABA y más de 200 localidades de GBA',
    'service:express': 'Disponible',
    'service:tracking': 'Tiempo real',
    'service:online_payment': 'Aceptado',
    
    // Palabras clave adicionales
    'news_keywords': 'flores frescas, arreglos florales premium, envío flores mismo día, flores CABA, flores GBA, regalos florales, florería online Argentina',
    
    // Datos estructurados
    'structured-data': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Product",
            "name": "Ramos de Flores",
            "description": "Ramos de flores frescas con entrega a domicilio en Buenos Aires",
            "url": "https://www.envioflores.com/categoria/ramos",
            "image": "https://www.envioflores.com/imagenes/categorias/ramos.jpg",
            "brand": {
              "@type": "Brand",
              "name": "ENVIO FLORES"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "5999",
              "highPrice": "25000",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              }
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Product",
            "name": "Arreglos Florales",
            "description": "Arreglos florales exclusivos para toda ocasión",
            "url": "https://www.envioflores.com/categoria/arreglos",
            "image": "https://www.envioflores.com/imagenes/categorias/arreglos.jpg",
            "brand": {
              "@type": "Brand",
              "name": "ENVIO FLORES"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "6999",
              "highPrice": "30000",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              }
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Product",
            "name": "Combos Regalo",
            "description": "Combos que incluyen flores, chocolates, peluches y más",
            "url": "https://www.envioflores.com/categoria/combos",
            "image": "https://www.envioflores.com/imagenes/categorias/combos.jpg",
            "brand": {
              "@type": "Brand",
              "name": "ENVIO FLORES"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "8999",
              "highPrice": "35000",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              }
            }
          }
        }
      ]
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
  appLinks: {
 
    android: {
      package: 'com.envioflores.app',
      app_name: 'ENVIO FLORES',
    },
    web: {
      url: 'https://www.envioflores.com/categoria',
      should_fallback: true,
    },
  },
};

export default function ProductsCategory() {
  return <ProductsCategoryComponent />
}