import React from 'react';
import type { Metadata } from 'next';
import ProductsComponent from '@/Client/Productos/ProductosPage';

export const metadata: Metadata = {
  title: "🌹 Flores, Ramos, Regalos y Plantas a Domicilio | Entrega EXPRESS 2hs en CABA | Envío MISMO DÍA GBA | ENVIO FLORES Argentina",
  description: "🔝 Amplio catálogo de flores frescas, rosas premium (rojas, blancas, azules, preservadas), girasoles, liliums, gerberas y orquídeas. Arreglos florales exclusivos, cajas de rosas, bouquets de temporada, plantas ornamentales y suculentas. 🎁 Combina con chocolates gourmet, peluches, vinos, desayunos sorpresa y gift boxes. ✓ Garantía de frescura 7 días ✓ Envío EXPRESS 2 horas en CABA ✓ Entrega el MISMO DÍA en +200 localidades GBA ✓ Seguimiento en tiempo real ✓ Atención personalizada 24/7 ✓ Flores para toda ocasión: cumpleaños, aniversarios, amor, condolencias, nacimientos, graduaciones. ¡Sorprende con calidad y puntualidad garantizada! Descuentos en tu primera compra.",
  keywords: [
    // Categorías principales de productos (expandidas)
    "flores frescas", "ramos de flores", "arreglos florales", "cajas de flores", 
    "bouquets premium", "flower box", "arreglos florales exclusivos", "bouquets de temporada",
    "regalos con flores", "chocolates y flores", "peluches y flores", "vinos con flores", 
    "desayunos sorpresa", "combos regalo", "canastas regalo", "flores para eventos",
    "plantas de interior", "plantas ornamentales", "suculentas", "terrarios", "kokedamas",
    "rosas preservadas", "flores eternas", "ramos artificiales de calidad", "bonsái",
    "gift boxes", "cajas sorpresa", "regalos empresariales", "detalles corporativos",
    
    // Tipos específicos de flores (expandido)
    "rosas premium", "rosas importadas", "rosas de ecuador", "rosas colombianas",
    "rosas rojas", "rosas blancas", "rosas rosadas", "rosas azules", "rosas amarillas",
    "rosas multicolor", "rosas vintage", "rosas naranjas", "rosas moradas", "rosas negras",
    "girasoles frescos", "girasoles gigantes", "ramos de girasoles",
    "liliums", "liliums asiáticos", "liliums orientales", "liliums perfumados",
    "gerberas", "gerberas multicolor", "mini gerberas", "gerberas dobles",
    "tulipanes", "tulipanes importados", "tulipanes holandeses", "tulipanes de temporada",
    "orquídeas", "orquídeas phalaenopsis", "orquídeas cymbidium", "orquídeas dendrobium",
    "margaritas", "astromelias", "claveles", "fresias", "lisianthus", "alstroemerias",
    "rosas preservadas", "flores estabilizadas", "flores liofilizadas", "flores secas decorativas",
    "nomeolvides", "hortensias", "calas", "iris", "lirios", "jazmines", "peonías",
    
    // Estilos y presentaciones de flores
    "ramos redondos", "ramos cascada", "ramos vintage", "ramos rústicos", "ramos minimalistas",
    "ramos horizontal", "bouquet de novia", "bouquet damas de honor", "tocados florales",
    "coronas de flores", "guirnaldas florales", "corsages", "boutonnières", "centros de mesa",
    "arreglos para iglesias", "decoración floral eventos", "flores para altares",
    "cajas de madera con flores", "cajas acrílicas con flores", "sombreros con flores",
    "arreglos florales verticales", "arreglos florales horizontales", "composiciones florales",
    
    // Ocasiones específicas (expandido)
    "flores para cumpleaños", "flores para aniversario", "flores para San Valentín", 
    "flores día de la madre", "flores para enamorados", "regalos para graduación", 
    "flores para condolencias", "arreglos para nacimientos", "regalos de agradecimiento", 
    "flores para recuperación", "arreglos para eventos corporativos",
    "flores para pedir perdón", "flores para reconciliación", "flores para bienvenida",
    "flores para inauguración", "flores para jubilación", "flores para promoción",
    "flores para conquista", "flores para declaración amor", "flores primer cita",
    "coronas fúnebres", "flores para velorios", "arreglos para capilla ardiente",
    "flores para bodas", "flores para casamientos civiles", "flores para compromiso",
    "flores para novia", "ramos para damas de honor", "flores para ceremonia religiosa",
    "flores para 15 años", "flores para baby shower", "flores para gender reveal",
    "flores día del padre", "flores día de la secretaria", "flores día del maestro",
    "flores día de los enamorados", "flores pascuas", "flores navidad", "flores año nuevo",
    
    // Términos de entrega y servicio (expandido)
    "envío de flores mismo día", "entrega de flores express", "flores a domicilio", 
    "delivery flores 24 horas", "envío flores CABA", "envío flores GBA", 
    "envío express flores", "seguimiento pedido flores", "pago seguro online", 
    "garantía de frescura", "mejor precio en flores", "envío flores Argentina",
    "entrega flores en 2 horas", "envío flores urgente", "delivery flores inmediato",
    "entrega flores en hospitales", "entrega flores en clínicas", "entrega flores en empresas",
    "entrega flores en universidades", "entrega flores en hoteles", "flores con seguimiento",
    "flores con tarjeta mensaje gratis", "delivery flores las 24 horas", "envío flores hoy",
    "entrega de flores garantizada", "flores frescas con garantía", "envío flores domingo",
    "envío flores sábado", "envío flores feriados", "whatsapp flores", "asistencia compra flores",
    "compra flores por teléfono", "pago en cuotas flores", "pago transferencia flores",
    "pago efectivo flores", "promociones flores", "flores precio mayorista", "envío flores interior",
    
    // Términos geográficos (expandido)
    "flores Capital Federal", "florería Buenos Aires", "envío flores provincia Buenos Aires", 
    "flores Zona Norte", "flores Zona Sur", "flores Zona Oeste", "flores San Isidro", 
    "flores La Plata", "flores Pilar", "flores Vicente López", "flores Quilmes", 
    "flores Morón", "flores Tigre", "flores Nordelta", "flores Olivos",
    "florería Recoleta", "flores Palermo", "flores Belgrano", "florería Caballito", 
    "flores Almagro", "flores Núñez", "flores Villa Urquiza", "florería Barrio Norte",
    "flores Puerto Madero", "flores San Telmo", "flores Microcentro", "florería Devoto",
    "flores Avellaneda", "flores Lanús", "flores Lomas de Zamora", "flores Banfield",
    "florería Adrogué", "flores Temperley", "flores Monte Grande", "flores Ezeiza",
    "flores Merlo", "flores Moreno", "flores Hurlingham", "flores Ituzaingó",
    "flores Caseros", "flores San Martín", "flores San Miguel", "flores José C. Paz",
    "florería Escobar", "flores Martínez", "flores Acassuso", "flores Beccar",
    "flores Boulogne", "flores Carapachay", "flores Flores", "flores Liniers",
    "flores Parque Patricios", "flores Villa Crespo", "flores Villa del Parque",
    
    // Términos de búsqueda naturales (expandido)
    "dónde comprar flores frescas", "mejores arreglos florales", "enviar flores a domicilio", 
    "regalos florales originales", "mejor florería online", "sorprender con flores", 
    "flores calidad premium", "floristería con entrega rápida", "enviar rosas hoy mismo", 
    "entrega urgente flores", "florería con WhatsApp", "pedir flores online",
    "florería abierta ahora", "florería abierta domingo", "comprar flores tarde",
    "mejor precio en ramos", "flores baratas buena calidad", "florerías con buenas reseñas",
    "comprar flores para sorprender", "flores para impresionar", "cómo elegir flores regalo",
    "florerías confiables Buenos Aires", "arreglos florales originales", "enviar flores anónimas",
    "florerías que entreguen hoy", "ramos para conquistar", "mejores flores para regalar",
    "qué flores duran más tiempo", "flores para alérgicos", "alternativas a las rosas",
    "flores económicas bonitas", "flores que signifiquen amor", "flores para decir lo siento",
    "cómo enviar flores a distancia", "comprar flores sin tarjeta de crédito", "florería MercadoPago",
    "envío de flores último momento", "florerías abiertas 24 horas", "florerías que entreguen hoy",
    
    // Términos de producto específicos (expandido)
    "box de flores", "flores en caja", "rosas eternas", "ramos de novia", "centros de mesa", 
    "flores para empresas", "arreglos florales corporativos", "bombones premium", 
    "peluches grandes", "vinos finos", "champagne y flores", "plantas de interior",
    "cactus decorativos", "suculentas pequeñas", "macetas decorativas", "jardines miniatura",
    "kokedamas artesanales", "bonsáis para regalo", "orquídeas en maceta", "plantas purificadoras",
    "terrarios de cristal", "jardines zen", "plantas colgantes", "helechos decorativos",
    "arreglos con frutas", "canastas gourmet", "cestas desayuno", "desayunos personalizados",
    "cajas de bombones artesanales", "chocolates belgas", "trufas gourmet", "alfajores premium",
    "vinos Malbec", "vinos Cabernet", "champagne importado", "espumantes nacionales",
    "licores premium", "whisky single malt", "gin premium", "destilados selectos",
    "ositos de peluche", "peluches tamaño gigante", "peluches personalizados", "muñecos coleccionables",
    "globos helio", "globos metalizados", "arreglos con globos", "globos LED",
    "tarjetas personalizadas", "mensajes caligrafía", "cartas personalizadas", "dedicatorias especiales",
    
    // Términos comerciales y promocionales (expandido)
    "ofertas flores", "promociones flores", "descuentos arreglos florales", 
    "flores precio económico", "flores premium", "ramos exclusivos", 
    "flores con tarjeta personalizada", "compra segura flores", "florería recomendada", 
    "florería con mejores reseñas", "delivery flores confiable", "flores frescas garantizadas",
    "descuento primera compra", "programa fidelidad flores", "suscripción flores mensual",
    "flores empresas descuento", "mayorista flores", "flores eventos corporativos",
    "flores pago en cuotas", "flores sin interés", "envío flores de flores con tarjeta dedicatoria gratis", "flores promoción del día",
    "flores oferta relámpago", "liquidación arreglos florales", "flores outlet", "arreglos de temporada",
    "lanzamiento nuevos arreglos", "edición limitada flores", "colección exclusiva rosas",
    "ramos de autor", "diseños florales exclusivos", "arreglos florales de lujo",
    "florería sustentable", "arreglos ecológicos", "flores comercio justo", "ramos sin plástico",
    "flores orgánicas", "florería artesanal", "flores de cultivo local", "flores de estación",
    
    // Términos específicos de plantas (expansión nueva)
    "plantas para regalo", "plantas de interior fácil cuidado", "plantas para oficina",
    "plantas para departamento", "plantas que purifican el aire", "plantas de sombra",
    "plantas resistentes", "plantas para principiantes", "plantas feng shui",
    "plantas suculentas", "cactus decorativos", "plantas crasas", "terrarios",
    "macetas decorativas", "macetas de diseño", "macetas artesanales", "macetas cemento",
    "kokedamas", "bonsái para regalo", "bonsái pequeño", "mini jardines", "jardines zen",
    "plantas aromáticas", "hierbas culinarias", "plantas medicinales", "huerto urbano",
    "orquídeas phalaenopsis", "orquídeas cymbidium", "bromelias", "tillandsias",
    "plantas colgantes", "helechos", "potus", "sansevierias", "plantas bambú",
    "palmeras interior", "ficus", "plantas tropicales", "calatheas", "monstera",
    
    // Términos específicos de rosas (expansión nueva)
    "significado rosas rojas", "significado rosas blancas", "significado rosas amarillas",
    "significado rosas rosadas", "significado rosas azules", "significado rosas naranjas",
    "significado rosas negras", "significado rosas verdes", "significado rosas moradas",
    "rosas premium importadas", "rosas de ecuador", "rosas colombianas", "rosas de invernadero",
    "rosas tallo largo", "rosas tallo extra largo", "rosas garden", "rosas spray",
    "rosas david austin", "rosas inglesas", "rosas preservadas", "rosas eternas",
    "rosas en caja", "caja de rosas", "arreglo circular rosas", "corazón de rosas",
    "letra de rosas", "número de rosas", "rosas con luces", "rosas con peluche",
    "rosas con chocolates", "rosas con vino", "rosas con desayuno", "rosas con dedicatoria",
    
    // Términos de búsqueda específicos por voz (expansión nueva)
    "ok google enviar flores hoy", "alexa comprar flores", "cómo enviar flores urgentes",
    "dónde comprar flores cerca de mí", "cuánto cuesta un ramo de flores",
    "mejor florería para enviar flores a Buenos Aires", "florería abierta cerca de mi ubicación",
    "necesito enviar flores para hoy mismo", "quiero mandar flores a mi novia",
    "cómo sorprender con flores", "ideas de regalo con flores", "quiero flores a domicilio",
    "cuáles son las mejores flores para regalar", "florerías abiertas domingo",
    "qué flores regalar según ocasión", "florerías con envío de flores a tu casa",
    "florerías con tarjeta de crédito", "cómo pedir flores por internet"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/productos',
    languages: {
      'es-AR': 'https://www.envioflores.com/productos',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/productos',
    title: '🌹 Flores y Regalos a Domicilio | Rosas, Plantas, Arreglos Premium | Entrega EXPRESS 2hs | ENVIO FLORES Argentina',
    description: 'Descubre nuestra colección exclusiva de flores frescas, rosas importadas, plantas, regalos, chocolates, peluches y más. ✓ Garantía de frescura 7 días ✓ Entrega en 2hs CABA ✓ Mismo día GBA ✓ Atención 24/7 ✓ ¡Sorprende hoy mismo!',
    siteName: 'ENVIO FLORES Argentina',
    images: [
      {
        url: 'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
        width: 1200,
        height: 630,
        alt: 'Flores, Ramos Premium y Plantas - Envío Express a CABA y GBA - ENVIO FLORES Argentina',
      },
      {
        url: 'https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png',
        width: 1200,
        height: 630,
        alt: 'Ramo de Rosas Rojas Premium - Envío a Domicilio - ENVIO FLORES Argentina',
      },
      {
        url: 'https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png',
        width: 1200,
        height: 630,
        alt: 'Plantas de Interior en Macetas de Diseño - ENVIO FLORES Argentina',
      }
    ],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    title: '🌹 Flores, Ramos, Plantas y Regalos a Domicilio | Envío EXPRESS 2hs | ENVIO FLORES Argentina',
    description: 'La mayor variedad de flores frescas, rosas importadas, arreglos exclusivos, plantas, regalos y complementos con envío MISMO DÍA en CABA y GBA. Calidad premium garantizada y entrega puntual.',
    images: [
      'https://www.envioflores.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      'https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png',
    ],
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
  category: 'Flores, Plantas y Regalos',
  other: {
      // Información geográfica (expandida)
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
      
      // Información de negocio (expandida)
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
      
      // Configuración de página (expandida)
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
      'apple-mobile-web-app-title': 'ENVIO FLORES',
      'application-name': 'ENVIO FLORES Argentina',
      
      // Metadatos visuales (expandidos)
      'theme-color': '#670000',
      'msapplication-TileColor': '#670000',
      'msapplication-navbutton-color': '#670000',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-square70x70logo': '/logo-70x70.png',
      'msapplication-square150x150logo': '/logo-150x150.png',
      'msapplication-wide310x150logo': '/logo-310x150.png',
      'msapplication-square310x310logo': '/logo-310x310.png',
      
      // Información de producto (expandida)
      'product:brand': 'ENVIO FLORES',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:category': 'Flores, Plantas, Regalos',
      'product:retailer': 'ENVIO FLORES Argentina',
      'product:retailer_item_id': 'RAM-ROS-12R',
      'product:price:amount.min': '5999',
      'product:price:amount.max': '35000',
      'product:price:currency': 'ARS',
      'product:sale_price:amount': '8999',
      'product:sale_price:currency': 'ARS',
      'product:delivery.method': 'Entrega a domicilio, Retiro en tienda, Compras en tienda, Entrega el mismo día',
      'product:delivery.time': '2-24 horas',
      'product:shipping_cost:amount': '0',
      'product:shipping_cost:currency': 'ARS',
      'product:weight:value': '1.5',
      'product:weight:units': 'kg',
      'product:color': 'Rojo, Blanco, Rosa, Azul, Amarillo, Naranja',
      'product:target_gender': 'unisex',
      'product:size': 'S, M, L, XL',
      'product:material': 'Flores naturales, Papel premium, Caja diseño',
      
      // Información Open Graph (expandida)
      'og:availability': 'instock',
      'og:price:currency': 'ARS',
      'og:price:amount.min': '5999',
      'og:price:amount.max': '35000',
      'og:locale': 'es_AR',
      'og:site_name': 'ENVIO FLORES Argentina',
      'og:brand': 'ENVIO FLORES',
      'og:product:category': 'Flores y Regalos',
      'og:video': 'https://www.envioflores.com/videos/catalogo-productos.mp4',
      'og:see_also': 'https://www.instagram.com/envioflores.arg',
      
      // Información del servicio (expandida)
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
      'service:quality': 'Flores premium seleccionadas diariamente',
      
      // Información de negocio extendida
      'business:founder': 'Equipo ENVIO FLORES',
      'business:founding_date': '2015',
      'business:opening_hours': 'Lun-Vie 9:00-20:00, Sab 9:00-20:00, Online 24/7',
      'business:employees': '25+',
      'business:payment_accepted': 'Visa, Mastercard, American Express, MercadoPago, Transferencia, Cheques, Pagos móviles mediante NFC',
      
      // Palabras clave adicionales para noticias (expandidas)
      'news_keywords': 'flores frescas, rosas premium, arreglos florales exclusivos, plantas decorativas, envío flores mismo día, rosas preservadas, flores a domicilio CABA, flores premium Gran Buenos Aires, florería online Argentina, mejor servicio entrega flores',
      
      // Atributos para búsqueda por voz (expandidos)
      'speakable.cssSelector': 'h1, h2, h3, .product-description, .delivery-info, .price-info, .product-features',
      'speakable.speechType': 'SearchResultsPage',
      
      // Tags adicionales para SEO
      'pinterest-rich-pin': 'true',
      'twitter:label1': 'Tiempo de entrega',
      'twitter:data1': 'CABA: 2 horas | GBA: Mismo día',
      'twitter:label2': 'Productos destacados',
      'twitter:data2': 'Rosas premium, Girasoles, Plantas decorativas, Gift boxes',
      'twitter:label3': 'Garantía',
      'twitter:data3': 'Frescura garantizada 7 días o reemplazo sin cargo',
      
      // FAQs estructuradas para posicionar en featured snippets
      'faq-structured-data': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuál es el tiempo de entrega de los productos florales?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En CABA realizamos entregas EXPRESS en 2 horas para pedidos antes de las 18:00. Para Gran Buenos Aires garantizamos entrega el MISMO DÍA para pedidos realizados antes de las 15:00. El horario de entrega es de 9:00 a 21:00. También contamos con opción de entrega programada para fecha y horario específico."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué garantía tienen las flores y plantas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Todas nuestras flores y plantas cuentan con garantía de frescura por 7 días desde la entrega, con los cuidados adecuados que indicamos en cada producto. Si no estás conforme con la calidad de nuestros productos, contáctanos durante las primeras 24 horas con fotos y realizaremos el reemplazo sin costo adicional."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo personalizar mi pedido de flores?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "¡Sí! Ofrecemos personalización completa de nuestros arreglos. Puedes elegir colores específicos, tipos de flores, tamaño del arreglo y complementos como chocolates, peluches o vinos. También puedes incluir una tarjeta con mensaje personalizado sin costo adicional. Para pedidos totalmente a medida contáctanos por WhatsApp."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuáles son las formas de pago aceptadas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express), pagos con MercadoPago (hasta 12 cuotas), transferencia bancaria, cheques, pagos móviles mediante NFC y efectivo contra entrega (solo en CABA). Para empresas ofrecemos facturación electrónica y condiciones especiales de pago."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué incluye el servicio de envío?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nuestro servicio de envío incluye: entrega a domicilio en la dirección indicada, seguimiento en tiempo real por WhatsApp con foto del arreglo antes de la entrega, confirmación de recepción, tarjeta con mensaje personalizado (opcional sin costo), empaque premium para proteger las flores, e instrucciones de cuidado para maximizar la duración de las flores."
            }
          },
          {
            "@type": "Question",
            "name": "¿Realizan envíos a todo el país?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, realizamos envíos a todo el país. Para CABA y más de 200 localidades de GBA contamos con flota propia y garantizamos entrega en el día. Para el resto del país trabajamos con una red de floristas asociados de primera calidad, con tiempos de entrega de 24-48 horas dependiendo de la localidad."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué flores son más duraderas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Las flores más duraderas en nuestro catálogo son los liliums (10-14 días), los crisantemos (10-12 días), las alstroemerias (8-12 días), los girasoles (7-10 días) y las gerberas (7-10 días). Las rosas premium tienen una duración aproximada de 7-8 días con los cuidados adecuados. También ofrecemos rosas preservadas que duran hasta 1 año."
            }
          }
        ]
      }),
      
      // Datos estructurados para comercio electrónico (expandidos)
      'structured-data': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "ENVIO FLORES Argentina",
        "image": "https://www.envioflores.com/assets/imagenes/logo-envio-flores.png",
        "description": "Florería online especializada en rosas premium, arreglos florales exclusivos, plantas decorativas y regalos con entrega a domicilio en CABA y Gran Buenos Aires. Servicio Express en 2 horas, atención 24/7 y garantía de frescura de 7 días.",
        "url": "https://www.envioflores.com",
        "telephone": "+54 11 4788-9185",
        "email": "floreriasargentinas@gmail.com",
        "currenciesAccepted": "ARS",
        "paymentAccepted": "Tarjetas de crédito, débito, MercadoPago, transferencia, efectivo, Cheques, Pagos móviles mediante NFC",
        "priceRange": "$$",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.envioflores.com/assets/imagenes/logo-envio-flores.png"
        },
        "foundingDate": "2015",
        "foundingLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Buenos Aires",
            "addressRegion": "Ciudad Autónoma de Buenos Aires",
            "addressCountry": "AR"
          }
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Av. Crámer 1915",
          "addressLocality": "Ciudad Autónoma de Buenos Aires",
          "addressRegion": "Ciudad Autónoma de Buenos Aires",
          "postalCode": "C1428CTC",
          "addressCountry": "AR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -34.56630121189851,
          "longitude": -58.45960052031086
        },
        "hasMap": "https://g.page/envioflores",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ],
          "opens": "09:00",
          "closes": "20:00"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+54 11 4788-9185",
            "contactType": "customer service",
            "availableLanguage": ["Spanish"],
            "hoursAvailable": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
              ],
              "opens": "09:00",
              "closes": "20:00"
            }
          },
          {
            "@type": "ContactPoint",
            "telephone": "+5491165421003",
            "contactType": "WhatsApp support",
            "availableLanguage": ["Spanish"],
            "hoursAvailable": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            }
          }
        ],
        "sameAs": [
          "https://www.facebook.com/envioflores",
          "https://www.instagram.com/envioflores.arg",
          "https://twitter.com/EnvioFlores",
          "https://www.youtube.com/channel/envioflores",
          "https://ar.pinterest.com/envioflores/",
          "https://www.linkedin.com/company/envio-flores"
        ],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.envioflores.com/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": -34.56630121189851,
            "longitude": -58.45960052031086
          },
          "geoRadius": "100km",
          "description": "CABA y Gran Buenos Aires"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1257",
          "reviewCount": "985"
        },
        "award": [
          "Mejor florería online Buenos Aires 2022",
          "Premio a la excelencia en servicio al cliente 2023"
        ],
        "slogan": "Flores frescas, entrega express",
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "5999",
          "highPrice": "35000",
          "priceCurrency": "ARS",
          "offerCount": "300+",
          "offers": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Ramo de 12 Rosas Rojas Premium",
                "description": "Elegante ramo de 12 rosas rojas premium importadas con follaje seleccionado y papel de regalo premium. Las rosas tienen garantía de frescura por 7 días. Incluye tarjeta con mensaje personalizado.",
                "image": "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png",
                "sku": "RAM-ROS-12R",
                "brand": {
                  "@type": "Brand",
                  "name": "ENVIO FLORES"
                },
                "gtin13": "7798123456789",
                "category": "Ramos > Rosas > Premium",
                "color": "Rojo",
                "material": "Rosas Premium, Follaje Seleccionado, Papel Premium",
                "hasMeasurement": {
                  "@type": "QuantitativeValue",
                  "value": "50",
                  "unitCode": "CMT",
                  "unitText": "centímetros de altura"
                },
                "additionalProperty": [
                  {
                    "@type": "PropertyValue",
                    "name": "Duración",
                    "value": "7 días garantizados"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Origen de las rosas",
                    "value": "Ecuador"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Incluye",
                    "value": "Tarjeta dedicatoria, Instructivo de cuidado, Conservante floral"
                  }
                ],
                "offers": {
                  "@type": "Offer",
                  "price": "10999",
                  "priceCurrency": "ARS",
                  "availability": "https://schema.org/InStock",
                  "itemCondition": "https://schema.org/NewCondition",
                  "priceValidUntil": "2024-12-31",
                  "url": "https://www.envioflores.com/productos/ramo-12-rosas-rojas",
                  "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                    "merchantReturnDays": 1,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn"
                  }
                },
                "review": [
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "María L."
                    },
                    "datePublished": "2023-09-12",
                    "reviewBody": "Excelente calidad de rosas, muy frescas y duraron más de 10 días. La entrega fue puntual y el arreglo era exactamente como en la foto. Muy recomendable."
                  }
                ]
              },
              "price": "10999",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "url": "https://www.envioflores.com/productos/ramo-12-rosas-rojas",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              },
              "deliveryLeadTime": {
                "@type": "QuantitativeValue",
                "minValue": "2",
                "maxValue": "24",
                "unitCode": "HUR"
              },
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "ARS"
                },
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "AR",
                  "addressRegion": ["CABA", "GBA"]
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "value": "1",
                    "unitCode": "HUR"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": "1",
                    "maxValue": "24",
                    "unitCode": "HUR"
                  }
                }
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Box de Girasoles y Chocolates Gourmet",
                "description": "Elegante caja con 6 girasoles frescos de temporada y selección de chocolates gourmet belgas. Diseño exclusivo en caja premium con lazo de raso. Ideal para alegrar y sorprender en cualquier ocasión.",
                "image": "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png",
                "sku": "BOX-GIR-CHO",
                "brand": {
                  "@type": "Brand",
                  "name": "ENVIO FLORES"
                },
                "gtin13": "7798123456790",
                "category": "Arreglos > Cajas > Girasoles",
                "material": "Girasoles, Chocolates Belgas, Caja Diseño",
                "hasMeasurement": {
                  "@type": "QuantitativeValue",
                  "value": "25x25x15",
                  "unitCode": "CMT",
                  "unitText": "centímetros"
                },
                "additionalProperty": [
                  {
                    "@type": "PropertyValue",
                    "name": "Duración girasoles",
                    "value": "7-10 días garantizados"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Chocolates",
                    "value": "250g surtidos belgas premium"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Incluye",
                    "value": "Tarjeta dedicatoria, Conservante floral, Instructivo de cuidado"
                  }
                ],
                "review": [
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "Carlos M."
                    },
                    "datePublished": "2023-10-05",
                    "reviewBody": "Increíble combinación. Los girasoles estaban perfectos y los chocolates deliciosos. La presentación en caja es muy elegante, perfecta para regalo."
                  }
                ]
              },
              "price": "15999",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "url": "https://www.envioflores.com/productos/box-girasoles-chocolates",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              },
              "deliveryLeadTime": {
                "@type": "QuantitativeValue",
                "minValue": "2",
                "maxValue": "24",
                "unitCode": "HUR"
              },
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "ARS"
                },
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "AR",
                  "addressRegion": ["CABA", "GBA"]
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "value": "1",
                    "unitCode": "HUR"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": "1",
                    "maxValue": "24",
                    "unitCode": "HUR"
                  }
                }
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Colección de Plantas de Interior en Macetas Decorativas",
                "description": "Set de 3 plantas de interior seleccionadas (Potus, Sansevieria y Suculenta) en macetas decorativas de diseño. Ideales para purificar el aire, fácil cuidado y larga duración.",
                "image": "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png",
                "sku": "PLA-INT-SET3",
                "brand": {
                  "@type": "Brand",
                  "name": "ENVIO FLORES"
                },
                "category": "Plantas > Interior > Sets",
                "material": "Plantas Vivas, Macetas Cerámica",
                "additionalProperty": [
                  {
                    "@type": "PropertyValue",
                    "name": "Tipo de plantas",
                    "value": "Bajo mantenimiento, Purificadoras de aire"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "Incluye",
                    "value": "3 plantas, 3 macetas decorativas, Guía de cuidados"
                  }
                ]
              },
              "price": "14999",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "url": "https://www.envioflores.com/productos/plantas-interior-set",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              },
              "deliveryLeadTime": {
                "@type": "QuantitativeValue",
                "minValue": "2",
                "maxValue": "24",
                "unitCode": "HUR"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Rosa Eterna en Cúpula de Cristal",
                "description": "Rosa preservada tamaño XL en cúpula de cristal con base iluminada LED. Dura hasta 3 años sin mantenimiento. Inspirada en 'La Bella y la Bestia'.",
                "image": "https://www.envioflores.com/imagenes/productos/Caja-ferrero-rocher-rosas-rojas.png",
                "sku": "ROS-PRE-CUP",
                "brand": {
                  "@type": "Brand",
                  "name": "ENVIO FLORES"
                },
                "category": "Rosas > Preservadas > Premium"
              },
              "price": "18999",
              "priceCurrency": "ARS",
              "availability": "https://schema.org/InStock",
              "url": "https://www.envioflores.com/productos/Rosas",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES Argentina"
              }
            }
          ]
        }
      })
    },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'msvalidate.01': 'bing-verification-code',
      'p:domain_verify': 'pinterest-verification',
      'facebook-domain-verification': 'facebook-verification-code',
      'google-site-verification': 'google-verification-code-alt',
      'norton-safeweb-site-verification': 'norton-verification-code',
      'f-droid': 'fdroid-verification-code'
    },
  },
  appLinks: {

    android: {
      package: 'com.envioflores.app',
      app_name: 'ENVIO FLORES',
    },
    web: {
      url: 'https://www.envioflores.com/productos',
      should_fallback: true,
    },
  
  },
};

export default function Products() {
  return <ProductsComponent />;
}