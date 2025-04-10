"use client";

import React, { createContext, useState, useContext } from 'react';

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