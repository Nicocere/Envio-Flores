import OcasionesComponent from '@/Client/Ocasiones/OcasionesComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Regalos para Ocasiones Especiales 🌹 | Envío EXPRESS Garantizado | Flores, Peluches y Chocolates | ENVIO FLORES Argentina",
  description: "🎁 Regalos perfectos para cada momento especial: cumpleaños, aniversarios, San Valentín, Día de la Madre, nacimientos y más. Flores frescas, arreglos premium, chocolates gourmet, peluches y regalos personalizados con entrega EXPRESS en el día en CABA y Gran Buenos Aires. ¡Sorprende a tus seres queridos con calidad y puntualidad garantizada! Pedidos online 24/7.",
  keywords: [
    // Términos principales de ocasiones
    "regalos para ocasiones especiales", "flores para eventos", "arreglos florales para celebraciones",
    "florería eventos importantes", "regalos personalizados argentina",
    
    // Ocasiones específicas
    "flores para cumpleaños", "ramos de aniversario", "arreglos para San Valentín",
    "flores día de la madre", "regalos día del padre", "flores para nacimientos",
    "arreglos fúnebres", "coronas de condolencia", "regalos para graduación",
    "flores para bodas", "arreglos para compromiso", "flores para pedida de mano",
    "regalos para jubilación", "flores para despedida", "regalos para recién nacidos",
    "arreglos florales primavera", "ramos para enamorados", "flores para declaración amor",
    "regalos para reconciliación", "flores para agradecimiento", "arreglos para inauguración",
    "regalos corporativos", "flores para eventos empresariales", "arreglos para conferencias",
    
    // Tipos de productos
    "rosas premium", "ramos de gerberas", "arreglos de liliums", "girasoles frescos",
    "tulipanes importados", "orquídeas exóticas", "cajas de rosas", "canastas florales",
    "peluches personalizados", "chocolates gourmet", "vinos premium", "cajas regalo",
    "bouquets de temporada", "plantas ornamentales", "suculentas decorativas", "bonsáis",
    "globos personalizados", "tarjetas dedicadas", "cestas gourmet", "kits románticos",
    
    // Servicios y beneficios
    "envío express de flores", "entrega en el día", "envío flores a CABA y GBA en el día",
    "floristería online", "comprar flores online", "regalos a domicilio",
    "floristería a domicilio", "envío flores urgentes", "entrega rápida de flores",
    "floristería con entrega inmediata", "arreglos florales a medida", "seguimiento de pedidos",
    "florería online 24/7", "regalos urgentes mismo día", "envíos rápidos zona norte",
    "delivery flores zona sur", "floristería zona oeste", "envíos zona este",
    "flores a domicilio Argentina", "seguimiento de pedidos flores", "pago seguro online",
    "floristas profesionales", "garantía de frescura", "arreglos personalizados",
    "atención personalizada", "centro de atención al cliente", "garantía de satisfacción",
    
    // Localidades específicas
    "envío flores Capital Federal", "florería Palermo", "flores Recoleta", "envíos Belgrano", 
    "florería San Isidro", "flores Vicente López", "envíos La Plata", "florería Avellaneda",
    "flores Quilmes", "envíos Morón", "florería San Justo", "flores San Martín",
    
    // Términos de búsqueda competitivos
    "mejor florería online", "floristería premium", "envío flores garantizado",
    "flores más frescas", "arreglos florales exclusivos", "flores de calidad superior",
    "regalos originales", "sorpresas memorables", "ramos florales diseñador",
    "florería recomendada", "mejores regalos para ocasiones", "flores que duran más"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/ocasiones',
    languages: {
      'es-AR': 'https://www.envioflores.com/ocasiones',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/ocasiones',
    title: 'Regalos para Ocasiones Especiales 🌹 | Envío Garantizado | ENVIO FLORES',
    description: '🎁 Encuentra el regalo perfecto para cada momento especial. Flores frescas, arreglos premium, chocolates y peluches con entrega EXPRESS en CABA y Gran Buenos Aires. ¡Sorprende a tus seres queridos con calidad y puntualidad!',
    siteName: 'ENVIO FLORES Argentina',
    images: [{
      url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 1200,
      height: 630,
      alt: 'Regalos y Flores para Ocasiones Especiales - ENVIO FLORES Argentina',
    }],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    title: 'Regalos para Ocasiones Especiales 🌹 | Envío Express | ENVIO FLORES',
    description: '🎁 Encuentra el regalo perfecto para cada momento especial. Flores frescas, arreglos premium y más con entrega garantizada en CABA y GBA.',
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
  authors: [{ name: 'ENVIO FLORES Argentina' }],
  category: 'Flores y Regalos',
  other: {
    // Información geográfica
    'geo.region': 'AR-C',
    'geo.position': '-34.603722;-58.381592',
    'ICBM': '-34.603722, -58.381592',
    'geo.placename': 'Buenos Aires, Argentina',
    
    // Información de negocio local
    'business:contact_data:street_address': 'Av. Corrientes 1234',
    'business:contact_data:locality': 'Ciudad Autónoma de Buenos Aires',
    'business:contact_data:region': 'CABA',
    'business:contact_data:postal_code': '1043',
    'business:contact_data:country_name': 'Argentina',
    
    // Configuración de página
    'language': 'es-AR',
    'format-detection': 'telephone=no',
    'distribution': 'global',
    'coverage': 'CABA, Gran Buenos Aires, Argentina',
    'target': 'all',
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'application-name': 'ENVIO FLORES',
    'msapplication-TileColor': '#670000',
    'theme-color': '#670000',
    
    // Información de negocio
    'revisit-after': '3 days',
    'rating': 'general',
    'copyright': 'ENVIO FLORES Argentina',
    'og:site_name': 'ENVIO FLORES Argentina',
    'og:type': 'website',
    'og:locale': 'es_AR',
    
    // Rich Snippets y datos estructurados
    'product:brand': 'ENVIO FLORES',
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
    
    // Datos adicionales para eventos
    'event:location': 'Buenos Aires, Argentina',
    'event:availability': 'Entregas todos los días',
    'event:start_time': 'Inmediata',
    
    // Palabras clave adicionales
    'news_keywords': 'flores entrega rápida, regalos para ocasiones especiales, arreglos florales premium, envío flores mismo día, flores frescas CABA',
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
      url: 'https://www.envioflores.com/ocasiones',
      should_fallback: true,
    },
  },
};

export default function ProductsOcasiones() {
  return <OcasionesComponent />;
}