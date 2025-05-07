import React from 'react';
import type { Metadata } from 'next';
import SubscripcionComponent from '@/Client/SubscripcionSemanal/SubscripcionSemanal';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "🌷 Suscripción Semanal de Flores Premium | ENVIO FLORES Buenos Aires - Servicio para Empresas y Particulares",
  description: "✅ Renueva tus espacios cada semana con flores frescas. Servicio exclusivo de suscripción semanal para empresas y hogares en CABA y GBA. Diseños personalizados, instalación profesional, entrega a domicilio y mantenimiento incluidos. Transforma cualquier ambiente con flores naturales de temporada.",
  keywords: [
    "suscripción flores premium",
    "flores frescas semanales",
    "decoración floral empresas",
    "flores para oficinas Buenos Aires",
    "servicio floral semanal",
    "flores por suscripción argentina",
    "decoración floral corporativa",
    "mantenimiento flores oficina",
    "arreglos florales semanales",
    "flores para empresas CABA",
    "envío flores a domicilio",
    "flores CABA",
    "flores Gran Buenos Aires",
    "ramos de flores suscripción",
    "regalos florales corporativos",
    "delivery flores semanal",
    "flores naturales temporada",
    "servicio floral premium",
    "flores para eventos empresariales",
    "bouquets a domicilio Buenos Aires",
    "diseño floral personalizado",
    "flores para recepción",
    "flores para hotel",
    "flores para restaurante",
    "suscripción flores mejor precio",
    "decoración floral semanal",
    "arreglos florales para oficinas",
    "servicio de flores periódico",
    "flores frescas a domicilio",
    "renovación floral semanal"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/subscripcion-flores/semanal',
    languages: {
      'es-AR': 'https://www.envioflores.com/subscripcion-flores/semanal',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/subscripcion-flores/semanal',
    title: 'Suscripción Semanal de Flores Premium - ENVIO FLORES Buenos Aires',
    description: 'Servicio exclusivo de suscripción floral semanal para empresas y particulares en CABA y Gran Buenos Aires. Transforma tus espacios con flores frescas de temporada cada semana. Diseño, entrega e instalación incluidos.',
    siteName: 'ENVIO FLORES',
    images: [
      {
        url: 'https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.png',
        width: 800,
        height: 600,
        alt: 'Servicio de Suscripción Semanal de Flores para Empresas',
      },
      {
        url: 'https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.png',
        width: 800,
        height: 600,
        alt: 'Flores frescas semanales para hogares',
      }
    ],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.png'],
    title: 'Suscripción Semanal de Flores Premium para Empresas y Hogares | CABA y GBA',
    description: 'Renueva tus espacios cada semana con flores frescas de temporada. Servicio premium de suscripción floral con diseño personalizado y entrega a domicilio incluidos.'
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
  authors: [{ name: 'ENVIO FLORES' }],
  category: 'Suscripción Floral',
  other: {
    // Información de contacto real y expandida
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
    
    // Información geográfica
    'geo.region': 'AR-C',
    'geo.position': '-34.56630121189851;-58.45960052031086',
    'ICBM': '-34.56630121189851, -58.45960052031086',
    'geo.placename': 'Buenos Aires, Argentina',
    'geo.country': 'Argentina',
    'place:location:latitude': '-34.56630121189851',
    'place:location:longitude': '-58.45960052031086',
    
    // Opciones de contacto expandidas
    'contact:whatsapp': '+5491165421003',
    'contact:phone': '+54 11 4788-9185',
    'contact:email': 'floreriasargentinas@gmail.com',
    'contact:instagram': '@envioflores',
    'contact:facebook': 'envioflores',
    'contact:twitter': '@EnvioFlores',
    'contact:hours': 'Lun-Sáb 9:00-20:00, WhatsApp 24/7',
    'contact:response_time': 'WhatsApp: inmediato, Email: máximo 2 horas',
    'contact:languages': 'Español, Inglés',
    
    // Metadatos para integraciones de mapas
    'map:provider': 'Google Maps',
    'map:url': 'https://g.page/envio-flores-argentina',
    'map:embed': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.186411672236!2d-58.45960052031086!3d-34.56630121189851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzU4LjciUyA1OMKwMjcnMzQuNiJX!5e0!3m2!1ses!2sar!4v1624371526792!5m2!1ses!2sar',
    'map:directions': 'https://www.google.com/maps/dir//Av.+Cr%C3%A1mer+1915,+C1428CTC+CABA/@-34.56630121189851,-58.45960052031086,17z/',
    
    // Metadatos específicos para producto/servicio
    'product:price:amount': '18000',
    'product:price:currency': 'ARS',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:brand': 'ENVIO FLORES',
    'product:category': 'Suscripción Floral, Servicios de Decoración',
    'product:retailer_item_id': 'SUSS-2023',
    'product:price_type': 'starting',
    'product:target_gender': 'unisex',
    
    // Metadatos para Google Discover
    'pageType': 'servicePage',
    'lastUpdated': new Date().toISOString(),
    'primaryImageOfPage': 'https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.png',
    'speakable': JSON.stringify({
      "@type": "SpeakableSpecification",
      "cssSelector": [".titulo-principal", ".descripcion-servicio", ".preguntas-frecuentes"]
    })
  },
};

const faqData = [
  {
    question: "¿Qué incluye la suscripción semanal de flores?",
    answer: "Nuestra suscripción semanal incluye: diseño personalizado de arreglos florales, flores frescas de temporada renovadas cada semana, entrega a domicilio en CABA y GBA, instalación profesional, mantenimiento continuo y asesoramiento floral especializado."
  },
  {
    question: "¿Cuál es el precio de la suscripción semanal de flores?",
    answer: "Los precios de nuestras suscripciones semanales comienzan desde $18.000 ARS. El costo varía según el tamaño y complejidad de los arreglos florales, la cantidad de locaciones y la duración del contrato de suscripción."
  },
  {
    question: "¿Por qué elegir la suscripción semanal en lugar de otras opciones?",
    answer: "La suscripción semanal es ideal para mantener siempre la máxima frescura y vitalidad en sus arreglos florales. Es perfecta para espacios de alta visibilidad como recepciones corporativas, hoteles, restaurantes exclusivos o eventos continuos donde la imagen es fundamental."
  },
  {
    question: "¿En qué zonas ofrecen el servicio de suscripción floral semanal?",
    answer: "Ofrecemos nuestro servicio en toda la Ciudad Autónoma de Buenos Aires (CABA) y Gran Buenos Aires (GBA). Para otras localidades, contáctenos para verificar disponibilidad."
  },
  {
    question: "¿Puedo elegir qué tipo de flores quiero en mi suscripción semanal?",
    answer: "Sí, trabajamos con cada cliente para entender sus preferencias. Aunque trabajamos principalmente con flores de temporada para garantizar frescura y calidad, podemos adaptarnos a sus gustos específicos en colores, estilos y variedades disponibles."
  },
  {
    question: "¿Cómo funciona el servicio semanal para empresas?",
    answer: "Para empresas, realizamos una evaluación inicial de los espacios, desarrollamos una propuesta personalizada, establecemos un calendario de renovación semanal, y nos encargamos de toda la logística, instalación y mantenimiento. Ofrecemos facturación electrónica y opciones de contrato a medida."
  },
  {
    question: "¿Puedo cancelar o pausar mi suscripción semanal?",
    answer: "Sí, nuestras suscripciones son flexibles. Puede pausar o cancelar con un aviso previo de 5 días. Los contratos tienen un período mínimo inicial de 2 meses para garantizar la mejor tarifa."
  },
  {
    question: "¿Qué día de la semana realizan los cambios de arreglos florales?",
    answer: "El día de renovación puede elegirse según su preferencia. Muchas empresas optan por los lunes para comenzar la semana con flores frescas, mientras que restaurantes y locales gastronómicos suelen preferir jueves o viernes para tener el máximo esplendor durante el fin de semana."
  },
  {
    question: "¿Qué tipos de flores utilizan en los arreglos semanales?",
    answer: "Utilizamos flores frescas de temporada como rosas, liliums, lisianthus, gerberas, peonías (en temporada), fresias, tulipanes, alstroemerias, entre otras. La selección varía según disponibilidad y temporada para garantizar siempre la máxima frescura y durabilidad."
  },
  {
    question: "¿Ofrecen algún descuento por contrato anual de suscripción semanal?",
    answer: "Sí, ofrecemos importantes beneficios para contratos anuales, incluyendo descuentos especiales, arreglos de mayor tamaño, decoraciones especiales para fechas destacadas y servicio prioritario. Contáctenos para recibir una propuesta personalizada."
  }
];

export default function SubscripcionSemanal() {
  return (
    <>
      <Script id="product-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "Suscripción Semanal de Flores",
            "image": [
              "https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.png",
              "https://www.envioflores.com/imagenes/subscripcion/flores-semanales-para-empresas.png"
            ],
            "description": "Servicio premium de suscripción floral semanal para empresas y particulares. Incluye diseño personalizado, flores frescas de temporada, entrega e instalación cada semana.",
            "brand": {
              "@type": "Brand",
              "name": "ENVIO FLORES"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://www.envioflores.com/subscripcion-flores/semanal",
              "priceCurrency": "ARS",
              "price": "18000",
              "priceValidUntil": "${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}",
              "availability": "https://schema.org/InStock",
              "areaServed": "CABA, Gran Buenos Aires",
              "seller": {
                "@type": "Organization",
                "name": "ENVIO FLORES",
                "logo": "https://www.envioflores.com/assets/imagenes/logo-envio-flores.png"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "87"
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
                  "name": "Alejandro Méndez"
                },
                "datePublished": "2023-09-10",
                "reviewBody": "Excelente servicio para nuestra cadena de restaurantes. Cambian las flores puntualmente cada semana y siempre están impecables."
              },
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Laura Giménez"
                },
                "datePublished": "2023-08-05",
                "reviewBody": "Contratamos el servicio semanal para nuestra recepción y salas de reuniones. Ha transformado por completo el ambiente de trabajo y nuestros clientes siempre lo comentan."
              }
            ]
          }
        `}
      </Script>
      <Script id="service-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org/",
            "@type": "Service",
            "serviceType": "Suscripción Floral Semanal",
            "provider": {
              "@type": "LocalBusiness",
              "name": "ENVIO FLORES",
              "image": "https://www.envioflores.com/assets/imagenes/logo-envio-flores.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Crámer 1915",
                "addressLocality": "Ciudad Autónoma de Buenos Aires",
                "addressRegion": "Buenos Aires",
                "postalCode": "C1428CTC",
                "addressCountry": "AR"
              },
              "telephone": "+541147889185",
              "priceRange": "$$$"
            },
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": -34.56630121189851,
                "longitude": -58.45960052031086
              },
              "geoRadius": "50000"
            },
            "serviceOutput": "Arreglos florales frescos semanales para empresas y hogares",
            "offers": {
              "@type": "Offer",
              "price": "18000",
              "priceCurrency": "ARS"
            },
            "termsOfService": "Período mínimo de contratación: 2 meses"
          }
        `}
      </Script>
      <Script id="faq-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              ${faqData.map(item => `{
                "@type": "Question",
                "name": "${item.question}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "${item.answer}"
                }
              }`).join(',')}
            ]
          }
        `}
      </Script>
      
      <SubscripcionComponent />
    
    </>
  );
}