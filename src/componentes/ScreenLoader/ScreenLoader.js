"use client"

import React, { useEffect, useState } from 'react';
import './screenLoader.css';
import { useTheme } from '@/context/ThemeSwitchContext';

const ScreenLoader = ({ minDuration = 2000 }) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    // Garantizar un tiempo mínimo de carga para evitar parpadeos
    const minLoadingTimeout = setTimeout(() => {
      setFadeOut(true);
      
      // Después de la animación de fadeOut, ocultar completamente
      const hideTimeout = setTimeout(() => {
        setLoading(false);
        
        // Desbloquear scroll cuando termine la carga
        document.body.style.overflow = 'auto';
      }, 800); // Duración de la animación de salida
      
      return () => clearTimeout(hideTimeout);
    }, minDuration);
    
    // Bloquear scroll mientras carga
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearTimeout(minLoadingTimeout);
      document.body.style.overflow = 'auto';
    };
  }, [minDuration]);
  
  if (!loading) return null;
  
  return (
    <div className={`screen-loader ${fadeOut ? 'fade-out' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="loader-content">
        <div className="logo-animation">
          <img
            src={'/assets/imagenes/logo-envio-flores.png'}
            alt="Envío Flores"
            className="loader-logo"
          />
        </div>
        
        <div className="loader-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="loader-text">Preparando tu nueva experiencia floral</p>
        </div>
      </div>
    </div>
  );
};

export default ScreenLoader;