// Autenticacion.js

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, baseDeDatos } from '../../FireBaseConfig';
import { useRouter } from 'next/navigation';

const Autenticacion = ({ children }) => {
  const navigate = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const fetchData = async () => {
          const uid = user.uid;
          const userDocRef = doc(baseDeDatos, "users", uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            // Si tienes datos adicionales del usuario, puedes manejarlos aquí
          } else {
            console.error("No se encontró el usuario en Firestore");
          }
        };
        fetchData();
      } else {
        setCurrentUser(null);
        // Si no hay usuario autenticado, redirigir a /login
        navigate('/login', { replace: true });
      }
    });

    // Limpiar el observador cuando el componente se desmonte
    return () => unsubscribe();
  }, [navigate]);

  return <>{currentUser ? children : null}</>;
};

export default Autenticacion;
