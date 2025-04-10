import React, { useState } from 'react';
import { SwipeableDrawer, IconButton, Box, TextField, Typography, Button, useMediaQuery } from '@mui/material';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';
import './WhatsAppMobile.css'; // Asegúrate de importar el archivo CSS donde definas tus estilos
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '../../context/ThemeSwitchContext';

const WhatsAppMobile = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:850px)');
  const { isDarkMode } = useTheme();

    const handleToggleDrawer = (open) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setOpenDrawer(open);
    };
  
    const handleInputChange = (event) => {
      setWhatsappMessage(event.target.value);
    };
  
    const handleTextFieldKeyDown = (event) => {
      // Prevenir la propagación del evento para evitar el cierre del SwipeableDrawer
      event.stopPropagation();
    };
  
    const generateWhatsAppLink = () => {
      const encodedMessage = encodeURIComponent(`Hola EnvioFlores, te escribo desde el sitio web
      y queria decirte: ${whatsappMessage}`);
      return `https://wa.me/+5491165421003?text=${encodedMessage}`;
    };

    const handleSendMessage = () => {
    
        // Aquí puedes redirigir al enlace de WhatsApp
        window.location.href = generateWhatsAppLink();
      };

  return (
    <div className='whatsapp-mobile-container' >
     <SwipeableDrawer
        anchor="right"
        open={openDrawer}
        onClick={handleToggleDrawer(!openDrawer)}
        onClose={handleToggleDrawer(false)}
        onOpen={handleToggleDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        <div
          role="presentation"
          onKeyDown={handleToggleDrawer(false)}
          style={{
            width: '250px',
            background: isDarkMode ? 'linear-gradient(to top, #005d00 0%, #012703 31%)' : 'linear-gradient(to top, #007300 0%, #ffffff 31%)',
            height: '100vh',
          }}
        >
          {/* Contenido adicional o enlaces relacionados con WhatsApp */}
          {openDrawer && (
            <div style={{ padding: '10px', position: 'relative', top: '30%', color: '#000' }}>
              <Typography variant="subtitle1" sx={{ marginBottom: 1, fontWeight: '600', color:isDarkMode && 'white' }}>
               ¡Hola! 
              </Typography>
              <Typography variant="subtitle2" sx={{ marginBottom: 3, fontWeight: '600', color:isDarkMode && 'white' }}>
              Escríbenos por WhatsApp y dinos qué es lo que estás necesitando !

              </Typography>
              <TextField
                label="Escribe tu mensaje..."
                color='success'
                variant="filled"
                fullWidth
                multiline
                rows={4}
                value={whatsappMessage}
                onChange={handleInputChange}
                onKeyDown={handleTextFieldKeyDown}
                onClick={handleTextFieldKeyDown}
                InputProps={{
                  style: {
                    color: isDarkMode ? 'white' : 'black', // Cambia el color de la letra basado en isDarkMode
                  }
                }}
                InputLabelProps={{
                  style: {
                      color: isDarkMode ? 'white' : 'black', // Cambia el color del placeholder basado en isDarkMode
                  }
              }}

              />
              {/* Botón para guardar y enviar el mensaje */}
              <Button
                variant="contained"
                color="success"
                onClick={(e)=>{handleSendMessage(); e.stopPropagation();}}
                style={{ marginTop: '10px' }}
                endIcon={<SendIcon />}
              >
               Enviar a WhatsApp
              </Button>
            </div>
          )}
        </div>
      </SwipeableDrawer>


      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: openDrawer ? '20px' : '9px', // ajusta el valor según tu diseño
          width: '42px', // ajusta el valor según tu diseño
          height: '42px',
          backgroundColor: '#25d366',
          transition: 'width 0.3s ease, right 0.3s ease',
          zIndex: 1200,
          color: '#fff',
          borderRadius:' 50%',
          fontSize: '24px',
          padding: '15px',
          cursor: 'pointer',
          border: '1px solid white',
          
        }}
      >
        <IconButton
          onClick={handleToggleDrawer(!openDrawer)}
          sx={{
            position: 'absolute',
            top: '50%',
            right: '0px', // ajusta el valor según tu diseño
            transform: 'translateY(-50%)',
            color: '#fff',
          }}
        >
              <FaWhatsapp style={{ fontSize: '24px', color: '#fff' }} />

        </IconButton>
      </div>
    </div>
  );
};

export default WhatsAppMobile;
