"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { Button, useMediaQuery } from '@mui/material';
import { useCookies } from '../../context/CookieContext';
import style from './Main.module.css';
import localforage from 'localforage';

import { useTheme } from '@/context/ThemeSwitchContext';
import styles from './Main.module.css'
import NavBarMobile from '../NavBarMobile/NavBarMobile';
import NavBarTop from '../Nav/NavBar';


const MainLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const isMobileScreen = useMediaQuery('(max-width:800px)');

  const { acceptedCokies, setAcceptedCookies, acceptCookies, setShowCookiePrompt, showCookiePrompt } = useCookies();

  useEffect(() => {
    const fetch = async () => {
      const hasAcceptedCookies = await localforage.getItem('acceptedCookies');
      if (!hasAcceptedCookies) {
        setShowCookiePrompt(true);
      }
    }
    fetch();
  }, []);

  const handleAcceptCookies = () => {
    acceptCookies();
    setShowCookiePrompt(false);
  };

  const handleRejectCookies = async () => {
    const aceptedCookies = await localforage.getItem('acceptedCookies', true);
    if (aceptedCookies) {
      await localforage.removeItem('acceptedCookies');
    }
    setShowCookiePrompt(false);
    setAcceptedCookies(false);
  };

  const handleViewCookiePolicy = () => {
    setShowCookiePrompt(false);
    window.location.href = '/cookies';
  }

  const [language, setLanguage] = useState('es');


  return (
    <main className={`${styles.mainPage} ${isDarkMode ? '' : styles.darkMode}`}>

      <div className='header'>
      {
        isMobileScreen ? <NavBarMobile /> : <NavBarTop />
      }
      </div>

      {showCookiePrompt && (
        <div className={style.cookiePrompt}>
          {language === 'es' ? (
            <>
              <p className={style.cookieText}>
                Utilizamos cookies para brindarte una mejor experiencia. Al continuar navegando, aceptas el uso de cookies.
                Consulta nuestra <a href="/cookies">Política de Cookies</a> para más detalles.
              </p>
              <small className={style.cookieTextSmall}>
                Es necesario aceptar las cookies para navegar en el sitio.
              </small>
            </>
          ) : (
            <>
              <p className={style.cookieText}>
                We use cookies to provide you with a better experience. By continuing to browse, you accept our use of cookies.
                Check our <a href="/cookies">Cookie Policy</a> for details.
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
                  <Button color='error' onClick={handleAcceptCookies}>Aceptar Cookies</Button>
                  <Button color='error' size='small' onClick={handleRejectCookies}>Rechazar Cookies</Button>
                  <Button color='error' size='small' onClick={handleViewCookiePolicy}>Ver Política de Cookies</Button>
                </>
              ) : (
                <>
                  <Button color='error' onClick={handleAcceptCookies}>Accept Cookies</Button>
                  <Button color='error' size='small' onClick={handleRejectCookies}>Reject Cookies</Button>
                  <Button color='error' size='small' onClick={handleViewCookiePolicy}>View Cookie Policy</Button>
                </>
              )}
            </div>
            <Button variant='text' color='error' sx={{ margin: '3px 0', fontSize: 'x-small' }} onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
              {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            </Button>
          </div>
        </div>
      )}
      {children}
    </main>
  );
};

export default MainLayout;