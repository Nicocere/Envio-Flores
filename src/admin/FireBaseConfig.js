"use client";


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Autenticación
export const storage = getStorage(app); // Imagenes
export const baseDeDatos = getFirestore(app); // Base de datos Firestore

// Verifica si el entorno es compatible con analytics y si estamos en el cliente
let analytics = null;
if (typeof window !== 'undefined') {
  const isAnalyticsSupported = async () => {
    if (await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  };
  
  isAnalyticsSupported().then((result) => {
    analytics = result;
  });
}

export { analytics };