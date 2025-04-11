"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '../admin/FireBaseConfig';
import PantallaPromocion from '../componentes/PantallaPromocion/PantallaPromocion';
import { useTheme } from '@/context/ThemeSwitchContext';

const ClientLayoutComponent = ({ children }) => {
  const [pantallas, setPantallas] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPantallas = async () => {
      const querySnapshot = await getDocs(collection(baseDeDatos, 'pantallasPromocionales'));
      const pantallas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPantallas(pantallas);
    };
    fetchPantallas();
  }, []);

  return (
    <div style={{  transition: 'all 0.8s ease' }}>
      {pantallas.map((pantalla) => (
        <PantallaPromocion
          key={pantalla.id}
          nombre={pantalla.nombre}
          descripcion={pantalla.descripcion}
          validoDesde={pantalla.validoDesde}
          validoHasta={pantalla.validoHasta}
          background={pantalla.background}
          icono={pantalla.icono}
          efecto={pantalla.efecto}
        />
      ))}
      {children}
    </div>
  );
};

export default ClientLayoutComponent;