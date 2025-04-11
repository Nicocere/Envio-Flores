import CartComponent from "@/Client/Cart/CartClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Carrito de Compras 🛒 | Florerias Argentinas",
  description: "Revisa y finaliza tu compra de flores, regalos y más. Envíos seguros a todo Argentina. Medios de pago: Mercado Pago, PayPal, transferencia bancaria y más.",
  keywords: [
    "carrito de compras",
    "comprar flores online",
    "flores a domicilio",
    "regalos Argentina",
    "envío de flores",
    "pago seguro",
    "florería online"
  ],
  alternates: {
    canonical: 'https://www.floreriasargentinas.com/cart',
    languages: {
      'es-AR': 'https://www.floreriasargentinas.com/cart',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.floreriasargentinas.com/cart',
    title: 'Carrito de Compras 🛒 | Florerias Argentinas',
    description: 'Revisa y finaliza tu compra de flores, regalos y más. Envíos seguros a todo Argentina.',
    siteName: 'Florerias Argentinas',
    images: [{
      url: 'https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png',
      width: 800,
      height: 600,
      alt: 'Carrito de Compras - Florerias Argentinas',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FloreriasArg',
    creator: '@FloreriasArg',
    images: ['https://www.floreriasargentinas.com/imagenes/productos/Caja-peluche-vino-rosas.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      'msvalidate.01': 'microsoft-site-verification-code',
    },
  },
  authors: [{ name: 'Florerias Argentinas' }],
  category: 'ecommerce',
  other: {
    'geo.region': 'AR',
    'geo.placename': 'Buenos Aires',
    'geo.position': '-34.603722;-58.381592',
    'ICBM': '-34.603722, -58.381592',
    'format-detection': 'telephone=no'
  }
};

const Cart = () => {
  return <CartComponent />;
};

export default Cart;