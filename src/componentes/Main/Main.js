"use client";

import React, { useEffect, useState, useCallback, memo } from 'react';
import { Button, useMediaQuery } from '@mui/material';
import style from './Main.module.css';
import localforage from 'localforage';

import { useTheme } from '@/context/ThemeSwitchContext';
import styles from './Main.module.css'
import NavBarMobile from '../NavBarMobile/NavBarMobile';
import NavBarTop from '../Nav/NavBar';
import Link from 'next/link';
import { useCookies } from '@/context/CookieContext';

// Componente para el prompt de cookies para evitar re-renders innecesarios
const CookiePrompt = memo(({ language, showCookiePrompt, isMobileScreen, onAccept, onReject, onViewPolicy, onLanguageChange }) => {
  if (!showCookiePrompt) return null;
  
  return (
    <div className={style.cookiePrompt}>
      {language === 'es' ? (
        <>
          <p className={style.cookieText}>
            Utilizamos cookies para brindarte una mejor experiencia. Al continuar navegando, aceptas el uso de cookies.
            Consulta nuestra <Link href="/cookies">Política de Cookies</Link> para más detalles...
          </p>
          <small className={style.cookieTextSmall}>
            Es necesario aceptar las cookies para navegar en el sitio.
          </small>
        </>
      ) : (
        <>
          <p className={style.cookieText}>
            We use cookies to provide you with a better experience. By continuing to browse, you accept our use of cookies.
            Check our <Link href="/cookies">Cookie Policy</Link> for details.
          </p>
          <small className={style.cookieTextSmall}>
            Accepting cookies is required to browse the site.
          </small>
        </>
      )}
      <div className={style.btnsCookies} style={{ flexDirection: isMobileScreen ? 'column' : 'row' }}>
        <div className={style.cookieActions} style={{ margin: isMobileScreen ? '10px 0' : '0 10px' }}>
          {language === 'es' ? (
            <>
              <Button color='error' onClick={onAccept}>Aceptar Cookies</Button>
              <Button color='error' size='small' onClick={onReject}>Rechazar Cookies</Button>
              <Button color='error' size='small' onClick={onViewPolicy}>Ver Política de Cookies</Button>
            </>
          ) : (
            <>
              <Button color='error' onClick={onAccept}>Accept Cookies</Button>
              <Button color='error' size='small' onClick={onReject}>Reject Cookies</Button>
              <Button color='error' size='small' onClick={onViewPolicy}>View Cookie Policy</Button>
            </>
          )}
        </div>
        <Button 
          variant='text' 
          color='error' 
          sx={{ margin: '3px 0', fontSize: 'x-small' }} 
          onClick={() => onLanguageChange(language === 'en' ? 'es' : 'en')}
        >
          {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        </Button>
      </div>
    </div>
  );
});

CookiePrompt.displayName = 'CookiePrompt';

const MainLayout = memo(({ children }) => {
  const { isDarkMode } = useTheme();
  const isMobileScreen = useMediaQuery('(max-width:800px)');
  const [showCookiePrompt, setShowCookiePrompt] = useState(false); // Iniciar en false para evitar flash
  const [language, setLanguage] = useState('es');

  const {acceptCookies, setAcceptedCookies} = useCookies(); // Obtener el contexto de cookies
  
  // Extraer la lógica de cookies a un useEffect dedicado que solo se ejecuta una vez
  useEffect(() => {
    const checkCookieConsent = async () => {
      try {
        const hasAcceptedCookies = await localforage.getItem('acceptedCookies');
        setShowCookiePrompt(!hasAcceptedCookies);
      } catch (error) {
        console.error('Error al verificar estado de cookies:', error);
        setShowCookiePrompt(true);
      }
    };
    
    checkCookieConsent();
  }, []);

  // Memoizar los handlers para evitar recreaciones en cada render
  const handleAcceptCookies = useCallback(async () => {
    try {
      await localforage.setItem('acceptedCookies', true);
      acceptCookies(); // Llamar a la función del contexto para aceptar cookies
      setAcceptedCookies(true); // Actualizar el estado local
      setShowCookiePrompt(false);
    } catch (error) {
      console.error('Error al guardar preferencia de cookies:', error);
    }
  }, []);
  
  const handleRejectCookies = useCallback(async () => {
    try {
      await localforage.removeItem('acceptedCookies');
      setShowCookiePrompt(false);
    } catch (error) {
      console.error('Error al rechazar cookies:', error);
    }
  }, []);

  const handleViewCookiePolicy = useCallback(() => {
    setShowCookiePrompt(false);
    window.location.href = '/cookies';
  }, []);
  
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);

  return (
    <main className={`${styles.mainPage} ${isDarkMode ? '' : styles.darkMode}`}>
      <div className='header'>
        {isMobileScreen ? <NavBarMobile /> : <NavBarTop />}
      </div>
      
      <CookiePrompt 
        language={language}
        showCookiePrompt={showCookiePrompt}
        isMobileScreen={isMobileScreen}
        onAccept={handleAcceptCookies}
        onReject={handleRejectCookies}
        onViewPolicy={handleViewCookiePolicy}
        onLanguageChange={handleLanguageChange}
      />
      
      {children}
    </main>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;