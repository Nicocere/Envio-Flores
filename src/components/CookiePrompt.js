"use client";

import React from 'react';
import { useCookies, CookieContext } from '@/context/CookieContext';

const CookiePrompt = () => {
  const { showCookiePrompt, acceptCookies } = useCookies();

  if (!showCookiePrompt) return null;

  return (
    <div className="cookie-prompt">
      <p>Este sitio utiliza cookies para mejorar tu experiencia. ¿Aceptas el uso de cookies?</p>
      <button onClick={acceptCookies}>Aceptar</button>
    </div>
  );
};

export default CookiePrompt;