import { Button, Paper, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';

const CookiePolicy = () => {

    const [language, setLanguage] = useState('en');
    const isMobileScreen = useMediaQuery('(max-width:800px)');

    const text = {
        en: {
          title: 'Cookie Usage Policy',
          text: 'Our website uses cookies to improve your experience while browsing. By using our website, you agree to our cookie policy. Below you will find more information about the cookies we use and how to disable them.',
          subtitle1: 'What are cookies?',
            text1: 'Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to remember your actions and preferences (such as login, language, font size, and other display preferences) so you don\'t have to re-enter them each time you return to the site or browse from one page to another.',
            subtitle2: 'How do we use cookies?',
            text2: 'Our website uses cookies to remember your preferences and provide you with the best possible experience. We also use cookies to analyze how users interact with our website and to improve its performance.',
            subtitle3: 'How to disable cookies?',
            text3: 'You can disable cookies by changing your browser settings. Please note that disabling cookies may affect the functionality of our website and other websites you visit. For more information on how to disable cookies, please refer to your browser\'s help section.',
            subtitle4: 'What cookies do we use?',
            text4: 'Our website uses the following cookies:',
            item1: 'CartID: This cookie is essential to remember the products you have added to your shopping cart during your visit. Without it, it would not be possible to maintain your cart between pages.',
            item2: 'UserID: We use this cookie to identify you as a unique user and keep your session active while browsing our site. It is essential to provide a smooth shopping experience.',
            item3: 'p (Products): This cookie stores information about the products you have viewed or selected. It is essential to maintain the list of products in your cart and improve your shopping experience.',
            item4: 'c (Cart): This cookie saves the state of your cart, including selected products, applied discounts, and other adjustments to any settings made, and is essential for the functionality and improvement of your shopping experience.',
          

        },
        es: {
          title: 'Política de uso de cookies',
            text: 'Nuestro sitio web utiliza cookies para mejorar su experiencia mientras navega. Al utilizar nuestro sitio web, acepta nuestra política de cookies. A continuación encontrará más información sobre las cookies que utilizamos y cómo desactivarlas.',
            subtitle1: '¿Qué son las cookies?',
            text1: 'Las cookies son pequeños archivos de texto que se almacenan en su computadora o dispositivo móvil cuando visita un sitio web. Permiten que el sitio web recuerde sus acciones y preferencias (como inicio de sesión, idioma, tamaño de fuente y otras preferencias de visualización) para que no tenga que volver a ingresarlas cada vez que regrese al sitio o navegue de una página a otra.',
            subtitle2: '¿Cómo utilizamos las cookies?',
            text2: 'Nuestro sitio web utiliza cookies para recordar sus preferencias y proporcionarle la mejor experiencia posible. También utilizamos cookies para analizar cómo los usuarios interactúan con nuestro sitio web y para mejorar su rendimiento.',
            subtitle3: '¿Cómo desactivar las cookies?',
            text3: 'Puede desactivar las cookies cambiando la configuración de su navegador. Tenga en cuenta que desactivar las cookies puede afectar la funcionalidad de nuestro sitio web y de otros sitios web que visite. Para obtener más información sobre cómo desactivar las cookies, consulte la sección de ayuda de su navegador.',
            subtitle4: '¿Qué cookies utilizamos?',
            text4: 'Nuestro sitio web utiliza las siguientes cookies:',
            item1: 'CartID: Esta cookie es esencial para recordar los productos que ha agregado a su carrito de compras durante su visita. Sin ella, no sería posible mantener su carrito entre páginas.',
            item2: 'UserID: Utilizamos esta cookie para identificarlo como un usuario único y mantener su sesión activa durante la navegación en nuestro sitio. Es esencial para proporcionar una experiencia de compra fluida.',
            item3: 'p (Productos): Esta cookie almacena información sobre los productos que ha visto o seleccionado. Es esencial para mantener la lista de productos en su carrito y mejorar su experiencia de compra.',
            item4: 'c (Carrito): Esta cookie guarda el estado de su carrito, incluyendo los productos seleccionados, los descuentos aplicados y otros ajustes a cualquier ajuste realizado, y es esencial para la funcionalidad y mejora de su experiencia de compra.',
            
        },
      };

  return (

    <div style={{background: '#670000', padding: isMobileScreen ? '20px' : '20px 50px ', marginBottom:'80px' }}>

    <Paper elevation={24} sx={{margin:isMobileScreen ? 0 : 5, padding: isMobileScreen ? '5px 10px':'5px 40px'}} >
      <Button variant='text' color='error' sx={{margin:'30px 0 '}}  onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}>
        {language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      </Button>
      <h1>{text[language].title}</h1>
        <p>{text[language].text}</p>
        <h2>{text[language].subtitle1}</h2>
        <p>{text[language].text1}</p>
        <h2>{text[language].subtitle2}</h2>
        <p>{text[language].text2}</p>
        <h2>{text[language].subtitle3}</h2>
        <p>{text[language].text3}</p>
        <h2>{text[language].subtitle4}</h2>
        <p>{text[language].text4}</p>
        <ul>
            <li>{text[language].item1}</li>
            <li>{text[language].item2}</li>
            <li>{text[language].item3}</li>
            <li>{text[language].item4}</li>
        </ul>

      
    </Paper>
    </div>

  );
};

export default CookiePolicy;