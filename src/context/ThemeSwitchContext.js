"use client";

import React, { createContext, useState, useContext } from 'react';
import Swal from 'sweetalert2';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    const h2Tags = document.querySelectorAll('h2');
    h2Tags.forEach((p) => {
      p.classList.toggle('dark-mode');
    });

    Swal.fire({
      title: isDarkMode ? 'Modo Claro Activado' : 'Modo Oscuro Activado',
      icon: 'success',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      showDenyButton: false,
      
      toast: true,
      position: 'bottom-end',
      timer: 1000,
      timerProgressBar: true,
      customClass: {
        popup: isDarkMode ? 'dark-mode-swal' : 'light-mode-swal'
      },
      background: !isDarkMode ? '#670000' : '#fff',
      color: !isDarkMode ? '#fff' : '#670000',
      iconColor: !isDarkMode ? '#fff' : '#670000',

    });
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      handleThemeChange,
      setIsDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);