import React from 'react';
import type { Metadata } from 'next';
import SubscripcionComponent from '@/Client/SubscripcionQuincenal/SubscripcionQuincenal';
import Script from 'next/script';

// Importamos un componente de FAQ (deberás crearlo)

export const metadata: Metadata = {
  title: "🌹 Suscripción Quincenal de Flores Premium | ENVIO FLORES Buenos Aires - Servicio para Empresas y Particulares",
  description: "✅ Renueva tus espacios cada 15 días con flores frescas. Servicio exclusivo de suscripción quincenal para empresas y hogares en CABA y GBA. Diseños personalizados, instalación profesional, entrega a domicilio y mantenimiento incluidos. Transforma cualquier ambiente con flores naturales de temporada.",
  keywords: [
    "suscripción flores premium",
    "flores frescas quincenales",
    "decoración floral empresas",
    "flores para oficinas Buenos Aires",
    "servicio floral quincenal",
    "flores por suscripción argentina",
    "decoración floral corporativa",
    "mantenimiento flores oficina",
    "arreglos florales quincenales",
    "flores para empresas CABA",
    "envío flores a domicilio",
    "flores CABA",
    "flores Gran Buenos Aires",
    "ramos de flores suscripción",
    "regalos florales corporativos",
    "delivery flores quincenal",
    "flores naturales temporada",
    "servicio floral premium",
    "flores para eventos empresariales",
    "bouquets a domicilio Buenos Aires",
    "diseño floral personalizado",
    "flores para recepción",
    "flores para hotel",
    "flores para restaurante",
    "suscripción flores mejor precio",
    "decoración floral quincenal",
    "arreglos florales para oficinas",
    "servicio de flores periódico",
    "flores frescas a domicilio",
    "renovación floral quincenal"
  ],
  alternates: {
    canonical: 'https://www.envioflores.com/subscripcion-flores/quincenal',
    languages: {
      'es-AR': 'https://www.envioflores.com/subscripcion-flores/quincenal',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.envioflores.com/subscripcion-flores/quincenal',
    title: 'Suscripción Quincenal de Flores Premium - ENVIO FLORES Buenos Aires',
    description: 'Servicio exclusivo de suscripción floral quincenal para empresas y particulares en CABA y Gran Buenos Aires. Transforma tus espacios con flores frescas de temporada cada 15 días. Diseño, entrega e instalación incluidos.',
    siteName: 'ENVIO FLORES',
    images: [
      {
        url: 'https://www.envioflores.com/imagenes/subscripcion/flores-quincenal-para-empresas.png',
        width: 800,
        height: 600,
        alt: 'Servicio de Suscripción Quincenal de Flores para Empresas',
      },
      {
        url: 'https://www.envioflores.com/imagenes/subscripcion/flores-quincenal-para-empresas.png',
        width: 800,
        height: 600,
        alt: 'Flores frescas quincenales para hogares',
      }
    ],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    images: ['https://www.envioflores.com/imagenes/subscripcion/flores-quincenal-para-empresas.png'],
    title: 'Suscripción Quincenal de Flores Premium para Empresas y Hogares | CABA y GBA',
    description: 'Renueva tus espacios cada 15 días con flores frescas de temporada. Servicio premium de suscripción floral con diseño personalizado y entrega a domicilio incluidos.'
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
    'product:price:amount': '15000',
    'product:price:currency': 'ARS',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:brand': 'ENVIO FLORES',
    'product:category': 'Suscripción Floral, Servicios de Decoración',
    'product:retailer_item_id': 'SUSQ-2023',
    'product:price_type': 'starting',
    'product:target_gender': 'unisex',
    
    // Metadatos para Google Discover
    'pageType': 'servicePage',
    'lastUpdated': new Date().toISOString(),
    'primaryImageOfPage': 'https://www.envioflores.com/imagenes/subscripcion/flores-quincenal-para-empresas.png',
    'speakable': JSON.stringify({
      "@type": "SpeakableSpecification",
      "cssSelector": [".titulo-principal", ".descripcion-servicio", ".preguntas-frecuentes"]
    }),
    
    // Datos estructurados para página de contacto
    'structured-data': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contacto - ENVIO FLORES Argentina",
      "description": "Página de contacto oficial de ENVIO FLORES Argentina. Atención personalizada para pedidos y consultas sobre flores, rosas, ramos, plantas y regalos con entrega a domicilio.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.envioflores.com/contacto"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ENVIO FLORES Argentina",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.envioflores.com/assets/imagenes/logo-envio-flores.png"
        }
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+54-11-4788-9185",
          "contactType": "customer service",
          "areaServed": "AR",
          "availableLanguage": ["Spanish", "English"],
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
          "areaServed": "AR",
          "availableLanguage": ["Spanish", "English"],
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
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Crámer 1915",
        "addressLocality": "Ciudad Autónoma de Buenos Aires",
        "addressRegion": "Ciudad Autónoma de Buenos Aires",
        "postalCode": "C1428CTC",
        "addressCountry": "AR"
      },
      "location": {
        "@type": "Place",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -34.56630121189851,
          "longitude": -58.45960052031086
        },
        "hasMap": "https://g.page/envioflores"
      }
    }),
    
    // FAQs para la página de contacto
    'faq-structured-data': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuáles son los horarios de atención de ENVIO FLORES?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nuestro horario de atención telefónica y tienda física es de lunes a sábado de 9:00 a 20:00 horas. Para consultas por WhatsApp estamos disponibles 24/7, todos los días del año, con respuesta inmediata durante horario comercial y hasta 2 horas fuera de horario."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo puedo realizar un seguimiento de mi pedido?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Puedes realizar seguimiento de tu pedido a través de WhatsApp al +5491165421003, mencionando tu número de pedido. También puedes llamarnos al +54 11 4788-9185 en horario comercial. Para todos los pedidos enviamos actualizaciones por WhatsApp incluyendo foto del arreglo antes de la entrega."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo modificar mi pedido después de realizarlo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, puedes modificar tu pedido contactándonos lo antes posible por WhatsApp o teléfono. Las modificaciones están sujetas al estado de preparación del pedido. Si el arreglo ya está en proceso de elaboración, podríamos tener limitaciones en los cambios posibles, pero siempre intentaremos adaptarnos a tus necesidades."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo puedo consultar sobre disponibilidad de flores específicas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Para consultar sobre disponibilidad de flores específicas, puedes contactarnos por WhatsApp al +5491165421003 o llamarnos al +54 11 4788-9185. Nuestro inventario se actualiza diariamente y trabajamos con las flores más frescas del mercado. Para flores exóticas o pedidos especiales, recomendamos consultar con al menos 48 horas de anticipación."
          }
        }
      ]
    })
  },
};

const faqData = [
  {
    question: "¿Qué incluye la suscripción quincenal de flores?",
    answer: "Nuestra suscripción quincenal incluye: diseño personalizado de arreglos florales, flores frescas de temporada, entrega a domicilio en CABA y GBA, instalación profesional, mantenimiento y asesoramiento floral continuo."
  },
  {
    question: "¿Cuál es el precio de la suscripción quincenal de flores?",
    answer: "Los precios de nuestras suscripciones quincenales comienzan desde $15.000 ARS. El costo varía según el tamaño y complejidad de los arreglos florales, la cantidad de locaciones y la duración del contrato de suscripción."
  },
  {
    question: "¿En qué zonas ofrecen el servicio de suscripción floral?",
    answer: "Ofrecemos nuestro servicio en toda la Ciudad Autónoma de Buenos Aires (CABA) y Gran Buenos Aires (GBA). Para otras localidades, contáctenos para verificar disponibilidad."
  },
  {
    question: "¿Puedo elegir qué tipo de flores quiero en mi suscripción?",
    answer: "Sí, trabajamos con cada cliente para entender sus preferencias. Aunque trabajamos principalmente con flores de temporada para garantizar frescura y calidad, podemos adaptarnos a sus gustos específicos en colores, estilos y variedades disponibles."
  },
  {
    question: "¿Cómo funciona el servicio para empresas?",
    answer: "Para empresas, realizamos una evaluación inicial de los espacios, desarrollamos una propuesta personalizada, establecemos un calendario de renovación quincenal, y nos encargamos de toda la logística, instalación y mantenimiento. Ofrecemos facturación electrónica y opciones de contrato a medida."
  },
  {
    question: "¿Puedo cancelar o pausar mi suscripción?",
    answer: "Sí, nuestras suscripciones son flexibles. Puede pausar o cancelar con un aviso previo de 7 días. Los contratos tienen un período mínimo inicial de 3 meses para garantizar la mejor tarifa."
  },
  {
    question: "¿Qué sucede si no estoy cuando entregan las flores?",
    answer: "Coordinamos previamente día y horario de entrega. Si surge algún imprevisto, puede designar a una persona autorizada para recibir las flores o reprogramar la entrega sin costo adicional con 24 horas de anticipación."
  },
  {
    question: "¿Ofrecen servicios adicionales con la suscripción?",
    answer: "Sí, ofrecemos servicios complementarios como decoración especial para eventos corporativos, cambios de diseño según temporadas o festividades y asesoramiento en decoración botánica para sus espacios."
  },
  {
    question: "¿Qué tipos de flores utilizan en los arreglos quincenales?",
    answer: "Utilizamos flores frescas de temporada como rosas, liliums, lisianthus, gerberas, peonías (en temporada), fresias, tulipanes, alstroemerias, entre otras. La selección varía según disponibilidad y temporada para garantizar siempre la máxima frescura y durabilidad."
  },
  {
    question: "¿Cómo se realiza el mantenimiento de las flores durante los 15 días?",
    answer: "Nuestros arreglos están diseñados para mantenerse frescos durante el período quincenal. Además, proporcionamos instrucciones de cuidado específicas para cada composición y ofrecemos seguimiento periódico. Si alguna flor se deteriora antes de tiempo, realizamos reposiciones sin cargo adicional."
  }
];

export default function SubscripcionQuincenal() {
  return (
    <>
      <Script id="product-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "Suscripción Quincenal de Flores",
            "image": [
              "https://www.envioflores.com/imagenes/subscripcion/flores-quincenal-para-empresas.png",
              "https://www.envioflores.com/imagenes/subscripcion/flores-quincenal-para-empresas.png"
            ],
            "description": "Servicio premium de suscripción floral quincenal para empresas y particulares. Incluye diseño personalizado, flores frescas de temporada, entrega e instalación.",
            "brand": {
              "@type": "Brand",
              "name": "ENVIO FLORES"
            },
            "offers": {
              "@type": "Offer",
              "url": "https://www.envioflores.com/subscripcion-flores/quincenal",
              "priceCurrency": "ARS",
              "price": "15000",
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
              "ratingValue": "4.8",
              "reviewCount": "124"
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
                  "name": "María Fernández"
                },
                "datePublished": "2023-08-15",
                "reviewBody": "Excelente servicio. Las flores siempre llegan perfectas y duran todo el periodo quincenal."
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
                  "name": "Juan Carlos Ramírez"
                },
                "datePublished": "2023-07-20",
                "reviewBody": "Contratamos el servicio para nuestra empresa y ha sido una excelente inversión. Nuestros clientes siempre comentan lo hermosas que son las flores."
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
            "serviceType": "Suscripción Floral Quincenal",
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
              "priceRange": "$$"
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
            "serviceOutput": "Arreglos florales frescos para empresas y hogares",
            "offers": {
              "@type": "Offer",
              "price": "15000",
              "priceCurrency": "ARS"
            },
            "termsOfService": "Período mínimo de contratación: 3 meses"
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