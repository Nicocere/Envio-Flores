import React from 'react';
import type { Metadata } from 'next';
import Contacto from '@/componentes/Contacto/Contacto';

export const metadata: Metadata = {
  title: '📞 Contacto | ENVIO FLORES Argentina | Atención 24/7 | WhatsApp, Teléfono, Email',
  description: 'Comunícate con ENVIO FLORES: WhatsApp 24/7 +5491165421003, teléfono +54 11 4788-9185, email floreriasargentinas@gmail.com. Atención personalizada para pedidos y consultas sobre flores, rosas, ramos, plantas, regalos. Dirección: Av. Crámer 1915, CABA (C1428CTC). Horario: Lun-Sáb 9:00-20:00.',
  alternates: {
    canonical: 'https://www.envioflores.com/contacto',
    languages: {
      'es-AR': 'https://www.envioflores.com/contacto',
    },
  },
  openGraph: {
    type: 'website',
    title: '📞 Contacto - ENVIO FLORES Argentina | Atención personalizada 24/7',
    description: 'Comunícate con nosotros para pedidos y consultas sobre nuestras flores premium. WhatsApp 24/7: +5491165421003, Tel: +54 11 4788-9185, Email: floreriasargentinas@gmail.com. Horario: Lun-Sáb 9:00-20:00. Dirección: Av. Crámer 1915, CABA.',
    url: 'https://www.envioflores.com/contacto',
    siteName: 'ENVIO FLORES Argentina',
    images: [
      {
        url: 'https://www.envioflores.com/assets/imagenes/logo-envio-flores.png',
        width: 1200,
        height: 630,
        alt: 'Tienda ENVIO FLORES Argentina - Atención personalizada',
      },
    ],
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EnvioFlores',
    creator: '@EnvioFlores',
    title: '📞 Contacto - ENVIO FLORES Argentina | Atención 24/7',
    description: 'WhatsApp, teléfono y email para pedidos de flores, rosas y regalos con entrega a domicilio en CABA y GBA. Dirección: Av. Crámer 1915, CABA.',
    images: ['https://www.envioflores.com/assets/imagenes/logo-envio-flores.png',],
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
  keywords: [
    'contacto envio flores', 'teléfono florería', 'whatsapp florería', 
    'email florería', 'dirección florería CABA', 'horario atención florería',
    'enviar flores WhatsApp', 'pedir ramo por teléfono', 'consultas entrega flores',
    'servicio al cliente florería', 'contacto ENVIO FLORES Argentina', 
    'soporte florería online', 'ubicación florería Buenos Aires', 
    'cómo llegar ENVIO FLORES', 'florería Crámer', 'florería Belgrano',
    'atención personalizada flores', 'consulta envío flores', 'reclamos florería',
    'WhatsApp 24/7 flores', 'contactar florista', 'atención florista profesional',
    'consulta precio flores', 'consulta disponibilidad rosas', 'cómo comprar flores'
  ],
  authors: [{ name: 'ENVIO FLORES Argentina' }],
  creator: 'ENVIO FLORES Argentina',
  publisher: 'ENVIO FLORES Argentina',
  category: 'Contacto',
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
  verification: {
    google: 'google-site-verification-code',
    other: {
      'msvalidate.01': 'bing-verification-code',
      'facebook-domain-verification': 'facebook-verification-code'
    },
  },
};

function ContactoPage() {
  return <Contacto />;
}

export default ContactoPage;