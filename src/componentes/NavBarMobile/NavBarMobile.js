import React, { useEffect, useState } from 'react';
import { SwipeableDrawer, IconButton, Typography, Button, useMediaQuery, AppBar, Toolbar, Paper, Box, Badge } from '@mui/material';
import Link from 'next/link';
import CartWidget from '../CartWidget/CartWidget';
import styled from '@emotion/styled';
import './navMobile.css';
import { motion, AnimatePresence } from "framer-motion";

// Menus
import { HiMenuAlt2 } from "react-icons/hi";
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { onAuthStateChanged } from "@firebase/auth";
import { auth, baseDeDatos } from '../../admin/FireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import SearcherMobile from '../SearcherMobile/SearcherMobile';
import Convertidor from '../Convertidor/Convertidor';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import { useTheme } from '../../context/ThemeSwitchContext';
import { useRouter } from 'next/navigation';

const NavBarMobile = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [openProductsDrawer, setOpenProductsDrawer] = useState(false);
  const [openOcassionsDrawer, setOpenOcassionsDrawer] = useState(false);

  const { isDarkMode } = useTheme();

  const navigate = useRouter();

  // Manejadores de eventos para los drawers
  const handleToggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(open);
  };

  const handleToggleProductsDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenProductsDrawer(open);
  };

  const handleToggleOcassionsDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenOcassionsDrawer(open);
  };

  const closeProfileDrawer = () => {
    setOpenProfileDrawer(false);
  };


  // Función para cerrar el cajón de perfiles
  const handleVolverAtras = () => {
    closeProfileDrawer();
    handleToggleDrawer(!openDrawer)();
  };

  // Estilos personalizados para AppBar y Toolbar
  const CustomizedAppBar = styled(AppBar)(() => ({
    fontSize: '14px',
    padding: 0,
    backgroundColor: isDarkMode ? 'var(--primary-dark)' : 'var(--background-light)',
    background: isDarkMode 
      ? 'linear-gradient(145deg, #2d0000, #670000)' 
      : 'linear-gradient(145deg, #ffffff, #f8f8f8)',
    flexWrap: 'nowrap',
    top: 0,
    height: '95px',
    boxShadow: isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.69)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    zIndex: 1100,
  }));

  const CustomizedToolbar = styled(Toolbar)(() => ({
    width: '100%',
    height: '90px',
    padding: '0 10px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    alignItems: 'center',
    minHeight: '90px',
    justifyContent: 'space-between',
    '&.MuiToolbar-root': {
      padding: '0 10px',
      minHeight: '90px'
    },
  }));

  // Variantes de animación con Framer Motion
  const menuIconVariants = {
    initial: { scale: 1 },
    whileTap: { scale: 0.9 },
    whileHover: { scale: 1.1 }
  };


  useEffect(() => {
    // Observador para el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const fetchData = async () => {
          if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const userDocRef = doc(baseDeDatos, "users", uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setUserData(userDoc.data());
            } else {
              console.error("No se encontró el usuario en Firestore");
            }
          }
        };
        fetchData();
      } else {
        setCurrentUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <div className='navbar-mobile-container'>
      <CustomizedAppBar position="fixed">
        <CustomizedToolbar>
          {/* Sección izquierda - Buscador */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-start', 
              alignItems: 'center',
              padding: '0 5px'
            }}
            className="searcher-section"
          >
            <SearcherMobile onClick={handleToggleDrawer(false)} />
          </Box>
          
          {/* Sección central - Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}
          >
            <motion.div

              className="logo-container"
            >
              <Link href="/">
                <img 
                  className='img-navbar'
                  src={'/assets/imagenes/logo-envio-flores.png'}
                  alt="logo envio flores"
                />
              </Link>
            </motion.div>
          </Box>
          
          {/* Sección derecha - Menú y Carrito */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              gap: '10px'
            }}
          >
  
            
            {/* Botón del menú */}
            <motion.div
              initial="initial"
              whileHover="whileHover"
              whileTap="whileTap"
              variants={menuIconVariants}
              style={{ padding:'0 5px' }}
            >
              <IconButton
                onClick={handleToggleDrawer(!openDrawer)}
                size="medium"
                aria-label="menu"
                sx={{ padding:'0 5px',
                  color: isDarkMode ? 'white' : 'var(--primary-color)',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.9)',
                  }, width: '45px', height: '45px', borderRadius: '50%'
                }}
              >
                <HiMenuAlt2 style={{ fontSize: '24px', fontWeight: 'bold' }} />
              </IconButton>
            </motion.div>
          </Box>
        </CustomizedToolbar>
      </CustomizedAppBar>

      {/* MENU GENERAL - Mantenemos el resto del código existente */}
      <SwipeableDrawer
        anchor="right"
        open={openDrawer}
        onClick={handleToggleDrawer(false)}
        onClose={handleToggleDrawer(false)}
        onOpen={handleToggleDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        <div
          role="presentation"
          onKeyDown={handleToggleDrawer(false)}
          style={{
            width: '300px',
            background: isDarkMode ? 'linear-gradient(to bottom, #a70000, #670000)' : 'white',
            height: '100%',
          }}
        >
          {openDrawer && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              height: '100%', justifyContent: 'space-between', color: '#0000000'
            }}>
              <Paper sx={{
                marginBottom: '10px', 
                backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio20.png")' : 'url("/assets/imagenes/fondosHome/fondo-inicio5.png")',
                backgroundSize: 'cover',
                WebkitBackgroundSize: 'cover', 
                backgroundPosition: 'right'
              }}>
                <Typography variant="subtitle1" sx={{
                  fontSize: '1.25rem',
                  fontWeight: '600', 
                  background: isDarkMode ? '#7d000085' : '#ffffff85', 
                  color: isDarkMode ? 'white' : '#670000',
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  margin: '85px 0 0', 
                  paddingLeft: '10px',
                  justifyContent: 'space-between', 
                  borderBottom: '2px solid darkred', 
                  flex: '0', 
                  backdropFilter: 'blur(5px)'
                }}>
                  Menú
                  <ThemeSwitch />
                  <Convertidor mobile={true} />
                </Typography>
              </Paper>

              <div className='divSeccionMobile'>
                <Link 
                  className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} 
                  href='/' 
                  onClick={handleToggleDrawer(!openDrawer)}
                > 
                  Inicio 
                </Link>

                <div className='' onClick={handleToggleDrawer(!openDrawer)}>
                  <Link 
                    className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} 
                    href="/productos" 
                    onClick={handleToggleProductsDrawer(true)}
                  >
                    Productos
                  </Link>
                </div>

                <div className='' onClick={handleToggleDrawer(!openDrawer)}>
                  <Link 
                    className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} 
                    href="/ocasiones" 
                    onClick={handleToggleOcassionsDrawer(true)}
                  >
                    Ocasiones
                  </Link>
                </div>

                <Link 
                  className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} 
                  href="/ayuda" 
                  onClick={handleToggleDrawer(!openDrawer)}
                >
                  ¿Cómo Comprar?
                </Link>

                <Link 
                  className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} 
                  href="/ubicacion" 
                  onClick={handleToggleDrawer(!openDrawer)}
                >
                  Contacto
                </Link>

                <Link 
                  className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} 
                  href="/envios" 
                  onClick={handleToggleDrawer(!openDrawer)}
                >
                  Zonas de Envio
                </Link>
              </div>
            </div>
          )}
        </div>
      </SwipeableDrawer>

      {/* Mantenemos los SwipeableDrawers existentes de productos y ocasiones */}
      <SwipeableDrawer
        anchor="right"
        open={openProductsDrawer}
        onClick={handleToggleProductsDrawer(false)}
        onClose={handleToggleProductsDrawer(false)}
        onOpen={handleToggleProductsDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        {openProductsDrawer && (
          <div style={{
            width: '300px',
            background: isDarkMode ? 'linear-gradient(to bottom, #a70000, #670000)' : 'white',
            display: 'flex',
            height: '100%',
            flexDirection: 'column'
          }}>
            <Paper sx={{
              marginBottom: '10px', 
              backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio18.png")' : 'url("/assets/imagenes/fondosHome/fondo-inicio15.png")', 
              backgroundSize: 'cover',
              WebkitBackgroundSize: 'cover',
            }}>
              <Typography variant="subtitle1" sx={{
                fontSize: '1.25rem',
                fontWeight: '600', 
                background: isDarkMode ? '#7d000085' : '#ffffff85', 
                color: isDarkMode ? 'white' : '#670000', 
                paddingTop: '14px',
                display: 'flex', 
                alignItems: 'flex-end', 
                margin: '85px 0 0', 
                paddingLeft: '10px',
                justifyContent: 'space-between', 
                borderBottom: '2px solid darkred', 
                flex: '0', 
                backdropFilter: 'blur(5px)'
              }}>
                Categorias
              </Typography>
            </Paper>

            <div style={{ flex: '0' }}>
              <Button
                variant='outlined'
                size='small'
                color='error'
                sx={{
                  color: isDarkMode ? 'white' : 'darkred',
                  margin: '0 14px',
                  fontWeight: '500',
                  fontSize: '10px',
                  flex: '0',
                  borderColor: isDarkMode ? 'white' : 'darkred',
                  width: 'fit-content',
                  zIndex: 1300
                }}
                onClick={handleVolverAtras}
              >
                Volver atrás
              </Button>
            </div>

            <div className="div-prods-SeccionMobile">
              <Link className='list-products' href='/categoria/Rosas'>Rosas</Link>
              <Link className='list-products' href="/categoria/Floreros">Floreros</Link>
              <Link className='list-products' href="/categoria/Arreglos">Arreglos</Link>
              <Link className='list-products' href="/categoria/Especiales">Especiales</Link>
              <Link className='list-products' href="/categoria/Canastas">Canastas</Link>
              <Link className='link-products' href="/categoria/Ramos">Ramos</Link>
              <Link className='list-products' href="/categoria/Plantas">Plantas</Link>
              <Link className='list-products' href="/categoria/Comestibles">Comestibles</Link>
              <Link className='list-products' href="/categoria/Desayunos">Desayunos</Link>
            </div>
          </div>
        )}
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="right"
        open={openOcassionsDrawer}
        onClick={handleToggleOcassionsDrawer(false)}
        onClose={handleToggleOcassionsDrawer(false)}
        onOpen={handleToggleOcassionsDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        {openOcassionsDrawer && (
          <div style={{
            width: '300px',
            background: isDarkMode ? 'linear-gradient(to bottom, #a70000, #670000)' : 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
            <Paper sx={{
              marginBottom: '10px', 
              backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio19.jpg")' : 'url("/assets/imagenes/ocasiones/ocasiones-sanvalentin2.jpeg")', 
              backgroundSize: 'cover',
              WebkitBackgroundSize: 'cover',
            }}>
              <Typography variant="subtitle1" sx={{
                fontSize: '1.25rem',
                fontWeight: '600', 
                background: isDarkMode ? '#7d000085' : '#ffffff85', 
                color: isDarkMode ? 'white' : '#670000', 
                paddingTop: '14px',
                display: 'flex', 
                alignItems: 'flex-end', 
                margin: '85px 0 0', 
                paddingLeft: '10px',
                justifyContent: 'space-between', 
                borderBottom: '2px solid darkred', 
                flex: '0', 
                backdropFilter: 'blur(5px)'
              }}>
                Ocasiones
              </Typography>
            </Paper>

            <Button
              variant='text'
              size='small'
              sx={{
                color: isDarkMode ? 'white' : 'darkred',
                margin: '0 14px',
                fontWeight: '600',
                fontSize: '15px',
                width: 'fit-content',
                flex: '0 ',
                zIndex: 1300
              }}
              onClick={handleVolverAtras}
            >
              Volver atrás
            </Button>

            <div className="div-prods-SeccionMobile">
              <Link className='ocasionesSeccion' href='/ocasiones/Aniversarios'>Aniversarios</Link>
              <Link className='ocasionesSeccion' href="/ocasiones/Casamientos">Casamientos</Link>
              <Link className='ocasionesSeccion' href="/ocasiones/Cumpleaños">Cumpleaños</Link>
              <Link className='ocasionesSeccion' href="/ocasiones/Condolencias">Condolencias</Link>
              <Link className='ocasionesSeccion' href="/ocasiones/Nacimientos">Nacimientos</Link>
              <Link className='ocasionesSeccion' href="/ocasiones/RegalosHombres">Regalos para Ellos</Link>
            </div>
          </div>
        )}
      </SwipeableDrawer>
    </div>
  );
};

export default NavBarMobile;