import React from 'react';
import Header from './componentes/Header/Header';
import Main from './componentes/Main/Main';
import Footer from './componentes/Footer/Footer';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, useMediaQuery } from '@mui/material';
import { useCookies, CookieContext } from './context/CookieContext';
import { ThemeProvider } from './context/ThemeSwitchContext';
import ScreenLoader from './componentes/ScreenLoader/ScreenLoader';

function App() {

  const isMobileScreen = useMediaQuery('(max-width:800px)');
  const { setAcceptedCookies, acceptCookies, setShowCookiePrompt, showCookiePrompt } = useCookies();

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('acceptedCookies');
    if (!hasAcceptedCookies) {
      setShowCookiePrompt(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    acceptCookies();
    setShowCookiePrompt(false);
  };

  const handleRejectCookies = () => {
    localStorage.removeItem('CartID');
    localStorage.removeItem('UserID');
    const aceptedCookies = localStorage.getItem('acceptedCookies', 'true');
    if (aceptedCookies) {
      localStorage.removeItem('acceptedCookies');
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
    <BrowserRouter>
      {showCookiePrompt && (
        <div className="cookie-prompt">
          {language === 'es' ? (
            <p style={{color: 'black'}}>
              Este sitio web utiliza cookies para mejorar su experiencia. Al aceptar cookies, usted acepta nuestro uso de cookies.
              Por favor revise nuestra <a href="/cookies">Política de Cookies</a> para obtener más información.
            </p>
          ) : (
            <p style={{color: 'black'}}>
              This website uses cookies to enhance your experience. By accepting cookies, you agree to our use of cookies.
              Please review our <a href="/cookies">Cookie Policy</a> for more information.
            </p>
          )
          }
          <div className='btns-cookies' style={{flexDirection: isMobileScreen && 'column'}}>

            <div className="cookie-actions" style={{margin: isMobileScreen && '10px 0'}}>
            {language === 'es' ? (
              <>
              <Button  color='success' onClick={handleAcceptCookies}>Aceptar Cookies</Button>
              <Button  color='error' onClick={handleRejectCookies}>Rechazar Cookies</Button>
              <Button  color='success' onClick={handleViewCookiePolicy}>Ver Política de Cookies</Button>
              </>
            ) : (
              <>
              <Button  color='success' onClick={handleAcceptCookies}>Accept Cookies</Button>
              <Button  color='error' onClick={handleRejectCookies}>Reject Cookies</Button>
              <Button  color='success' onClick={handleViewCookiePolicy}>View Cookie Policy</Button>
              </>
            )}
            </div>

            <Button variant='text' color='error' sx={{ margin: '3px 0', fontSize:'x-small' }} onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
              {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            </Button>
          </div>
        </div>
      )}

      <ScreenLoader />

      <ThemeProvider>

      <div className="cuerpo">
        <Header />
        <Main />
        <Footer />
      </div>

      </ThemeProvider>

    </BrowserRouter>
  );


}

export default App;
