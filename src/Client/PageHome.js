"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeSwitchContext';
import { useMediaQuery } from "@mui/material";

const ClientComponent = ({ children }) => {
  const { isDarkMode } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 650px)');

  return (
    <div style={{ color: isDarkMode ? '#670000' : '#fcf5f0', transition: 'all 0.8s ease' }}>
      {children}
    </div>
  );
};

export default ClientComponent;