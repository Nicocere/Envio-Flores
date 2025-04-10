import React, { useEffect, useState } from 'react';
import { SwipeableDrawer, IconButton, Box, TextField, Typography, Button, useMediaQuery, Slide, useScrollTrigger, AppBar, Toolbar, Avatar, Paper } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { SubMenuUsers } from '../SubMenuUsers/SubMenuUsers';
import CartWidget from '../CartWidget/CartWidget';
import styled from '@emotion/styled';
import './navMobile.css'

// Menus
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { HiMenuAlt2 } from "react-icons/hi";

import { onAuthStateChanged } from "@firebase/auth";
import { auth, baseDeDatos } from '../../admin/FireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import useLogout from '../../admin/componentes/Login/LogOut/LogOut';
import SearcherMobile from '../SearcherMobile/SearcherMobile';
import Convertidor from '../Convertidor/Convertidor';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import { useTheme } from '../../context/ThemeSwitchContext';

const NavBarMobile = () => {

  const [openDrawer, setOpenDrawer] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:850px)');
  const [currentUser, setCurrentUser] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);

  const { isDarkMode } = useTheme();
  const className = isDarkMode ? 'dark-mode' : '';


  //ABRIR MENU LATERAL
  const handleToggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(open);
  };


  //ABRIR MENU LATERAL PRODUCTOS
  const [openProductsDrawer, setOpenProductsDrawer] = useState(false);

  const handleToggleProductsDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenProductsDrawer(open);
  };

  //ABRIR MENU LATERAL OCASIONES
  const [openOcassionsDrawer, setOpenOcassionsDrawer] = useState(false);

  const handleToggleOcassionsDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenOcassionsDrawer(open);
  };


  const closeProductsDrawer = () => {
    setOpenProductsDrawer(false);
  };

  //ABRIR SUBMENU DE USUARIOS
  const handleToggleProfileDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenProfileDrawer(open);
  };

  const closeProfileDrawer = () => {
    setOpenProfileDrawer(false);
  };
  //USUARIO CONECTADO
  const logout = useLogout()

  const navigate = useNavigate()

  const handleProfileNavigation = () => {
    if (userData.rol === 'administrador') {
      navigate('/administrador');
    } else {
      navigate('/perfil');
    }
  };

  const handleToggleSubMenuDrawer = () => {
    setOpenProfileDrawer(!openProfileDrawer);
  };

  const handleInitSession = () => {
    navigate('/login');
  };


  //NAVEGADOR PERSONALIZADO
  const CustomizedAppBar = styled(AppBar)(({ theme }) => ({
    fontSize: isSmallScreen ? '10px' : '15px',
    paddingLeft: isSmallScreen && 0,
    paddingRight: isSmallScreen && 0,
    backgroundColor: 'none',
    flexWrap: 'wrap',
    top: '-1',
    background: isDarkMode ? '#2d0000' : '#fafafa',
    flexDirection: isSmallScreen ? 'column' : 'row',
  }));

  const CustomizedToolbar = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: isSmallScreen ? '10px' : '15px',
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    // Override the default MuiToolbar styles
    '&.MuiToolbar-root': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  }));

  // Función para cerrar el cajón de perfiles
  const handleVolverAtras = () => {
    // Cierra el cajón de perfiles
    closeProfileDrawer();
    // Abre o cierra el cajón principal según el estado actual
    handleToggleDrawer(!openDrawer)();
  };



  useEffect(() => {
    // Establecer el observador en el estado de autenticación
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
    // Limpiar el observador cuando el componente se desmonte
    return () => unsubscribe();

  }, []);

  return (
    <div className='navbar-mobile-container' >
      <>
        <CustomizedAppBar position="fixed" >

          <CustomizedToolbar >

            <div style={{
              position: 'fixed',
              top: '25px',
              left: '15px', // ajusta el valor según tu diseño
              height: '20px',
              zIndex: 1101,
              color: '#00000',
              borderRadius: ' 50%',
              fontSize: '24px',
              padding: '15px',
              cursor: 'pointer',
              width: '20px',
            }}
            >

              <IconButton
                onClick={handleToggleDrawer(!openDrawer)}
                sx={{
                  position: 'absolute',
                  top: '22px',
                  left: '5px', // ajusta el valor según tu diseño
                  transform: 'translateY(-50%)',
                  color: isDarkMode ? 'white' : 'darkred',
                }}
              >
                <HiMenuAlt2 style={{ fontSize: '28px', fontWeight: '800', color: isDarkMode ? 'white' : '#670000' }} />

              </IconButton>

            </div>

            <NavLink to="/">
              <img className='img-navbar'

                src={'/assets/imagenes/logo-envio-flores.png'}
                alt="logo envio flores"
              />
            </NavLink>

            <div style={{
              position: 'absolute',
              top: '25px',
              right: '90px',
              zIndex: '1101',
              borderRadius: '50%',
              fontSize: '0px',
              padding: '0px',
              cursor: 'pointer',
            }}
            >

              {/* <ThemeSwitch /> */}
            </div>

            <NavLink to="/cart">
              <CartWidget />
            </NavLink>

          </CustomizedToolbar>
        </CustomizedAppBar>
      </>

      {/* MENU GENERAL  */}
      <SwipeableDrawer
        anchor="left"
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
          {/* Contenido adicional o enlaces relacionados con WhatsApp */}
          {openDrawer && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              height: '100%', justifyContent: 'space-between', color: '#0000000'
            }}>

              <Paper sx={{
                marginBottom: '10px', backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio20.png")' : 'url("/assets/imagenes/fondosHome/fondo-inicio5.png")',
                backgroundSize: 'cover',
                WebkitBackgroundSize: 'cover', backgroundPosition: 'left'
              }}>


                <Typography variant="subtitle1" sx={{
                  fontSize: '1.25rem',
                  fontWeight: '600', background: isDarkMode ? '#7d000085' : '#ffffff85', color: isDarkMode ? 'white' : '#670000',
                  display: 'flex', alignItems: 'flex-end', margin: '85px 0 0', paddingLeft: '10px',
                  justifyContent: 'space-between', borderBottom: '2px solid darkred', flex: '0', backdropFilter: 'blur(5px)'
                }}>

                  Menú
                  <ThemeSwitch />

                  <Convertidor mobile={true} />
                </Typography>

              </Paper>

              <div className='divSeccionMobile' >
                <SearcherMobile onClick={handleToggleDrawer(false)} />

                <NavLink className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} to='/' onClick={handleToggleDrawer(!openDrawer)}  > Inicio </NavLink>

                <div className='' onClick={handleToggleDrawer(!openDrawer)}   >
                  <NavLink className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} to="/productos" onClick={handleToggleProductsDrawer(true)}>
                    Productos
                  </NavLink>
                </div>

                <div className='' onClick={handleToggleDrawer(!openDrawer)}   >
                  <NavLink className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} to="/ocasiones" onClick={handleToggleOcassionsDrawer(true)}>
                    Ocasiones
                  </NavLink>
                </div>

                <NavLink className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} to="/ayuda" onClick={handleToggleDrawer(!openDrawer)}  >¿Cómo Comprar?</NavLink>

                <NavLink className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} to="/ubicacion" onClick={handleToggleDrawer(!openDrawer)}  >Contacto</NavLink>

                <NavLink className={`link-products ${isDarkMode ? 'dark-mode' : ''}`} to="/envios" onClick={handleToggleDrawer(!openDrawer)}  >Zonas de Envio</NavLink>

              </div>

            </div>
          )}


        </div>
      </SwipeableDrawer>

      {/* MENU LATERAL DE CATEGORIA PRODUCTOS */}
      <SwipeableDrawer
        anchor="left"
        open={openProductsDrawer}
        onClick={handleToggleProductsDrawer(false)}
        onClose={handleToggleProductsDrawer(false)}
        onOpen={handleToggleProductsDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        {/* Contenido del segundo slide (categorías) */}
        {openProductsDrawer && (
          <div style={{
            width: '300px',
            background: isDarkMode ? 'linear-gradient(to bottom, #a70000, #670000)' : 'white',
            display: 'flex',
            height: '100%',
            flexDirection: 'column'
          }}>


            <Paper sx={{
              marginBottom: '10px', backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio18.png")' : 'url("/assets/imagenes/fondosHome/fondo-inicio15.png")', backgroundSize: 'cover',
              WebkitBackgroundSize: 'cover',
            }}>

              <Typography variant="subtitle1" sx={{
                fontSize: '1.25rem',
                fontWeight: '600', background: isDarkMode ? '#7d000085' : '#ffffff85', color: isDarkMode ? 'white' : '#670000', paddingTop: '14px',
                display: 'flex', alignItems: 'flex-end', margin: '85px 0 0', paddingLeft: '10px',
                justifyContent: 'space-between', borderBottom: '2px solid darkred', flex: '0', backdropFilter: 'blur(5px)'
              }}>

                Categorias
              </Typography>
            </Paper>

            <div style={{ flex: '0' }}>
              <Button
                variant='text'
                size='small'
                sx={{
                  color: isDarkMode ? 'white' : 'darkred',
                  margin: '0 14px',
                  fontWeight: '600',
                  fontSize: '15px',
                  flex: '0',
                  width: 'fit-content',
                  zIndex: 1300
                }}
                onClick={handleVolverAtras} // Cambio aquí
              >
                Volver atrás
              </Button>
            </div>

            <div className="div-prods-SeccionMobile">
              <NavLink className='list-products' to='/categoria/Rosas'>Rosas</NavLink>

              <NavLink className='list-products' to="/categoria/Floreros">Floreros</NavLink>

              <NavLink className='list-products' to="/categoria/Arreglos">Arreglos</NavLink>

              <NavLink className='list-products' to="/categoria/Especiales">Especiales</NavLink>

              <NavLink className='list-products' to="/categoria/Canastas">Canastas</NavLink>

              <NavLink className='link-products' to="/categoria/Ramos">Ramos</NavLink>

              <NavLink className='list-products' to="/categoria/Plantas">Plantas</NavLink>

              <NavLink className='list-products' to="/categoria/Comestibles">Comestibles</NavLink>

              <NavLink className='list-products' to="/categoria/Desayunos">Desayunos</NavLink>
            </div>

          </div>
        )}
      </SwipeableDrawer>

      {/* MENU LATERAL DE CATEGORIA OCASIONES */}
      <SwipeableDrawer
        anchor="left"
        open={openOcassionsDrawer}
        onClick={handleToggleOcassionsDrawer(false)}
        onClose={handleToggleOcassionsDrawer(false)}
        onOpen={handleToggleOcassionsDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        {/* Contenido del segundo slide (categorías) */}
        {openOcassionsDrawer && (
          <div style={{
            width: '300px',
            background: isDarkMode ? 'linear-gradient(to bottom, #a70000, #670000)' : 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>

            <Paper sx={{
              marginBottom: '10px', backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio19.jpg")' : 'url("/assets/imagenes/ocasiones/ocasiones-sanvalentin2.jpeg")', backgroundSize: 'cover',
              WebkitBackgroundSize: 'cover',
            }}>


              <Typography variant="subtitle1" sx={{
                fontSize: '1.25rem',
                fontWeight: '600', background: isDarkMode ? '#7d000085' : '#ffffff85', color: isDarkMode ? 'white' : '#670000', paddingTop: '14px',
                display: 'flex', alignItems: 'flex-end', margin: '85px 0 0', paddingLeft: '10px',
                justifyContent: 'space-between', borderBottom: '2px solid darkred', flex: '0', backdropFilter: 'blur(5px)'
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
              onClick={handleVolverAtras} // Cambio aquí
            >
              Volver atrás
            </Button>

            <div className="div-prods-SeccionMobile">
              <NavLink className='ocasionesSeccion' to='/ocasiones/Aniversarios' >Aniversarios</NavLink>

              <NavLink className='ocasionesSeccion' to="/ocasiones/Casamientos" >Casamientos</NavLink>

              <NavLink className='ocasionesSeccion' to="/ocasiones/Cumpleaños" >Cumpleaños</NavLink>

              <NavLink className='ocasionesSeccion' to="/ocasiones/Condolencias" >Condolencias</NavLink>

              <NavLink className='ocasionesSeccion' to="/ocasiones/Nacimientos" >Nacimientos</NavLink>

              <NavLink className='ocasionesSeccion' to="/ocasiones/RegalosHombres" >Regalos para Ellos</NavLink>
            </div>

          </div>
        )}
      </SwipeableDrawer>


      {/* MENU LATERAL USUARIOS */}
      <SwipeableDrawer
        anchor="left"
        open={openProfileDrawer}
        onClick={handleToggleProfileDrawer(false)}
        onClose={handleToggleProfileDrawer(false)}
        onOpen={handleToggleProfileDrawer(true)}
        disableBackdropTransition={true}
        disableDiscovery={true}
      >
        {openProfileDrawer && (
          <div style={{
            width: '300px', display: 'flex', flexDirection: 'column',
            background: isDarkMode ? 'linear-gradient(to bottom, #a70000, #670000)' : 'white',
            height: '100vh', zIndex: '1000'
          }}>


            <Paper sx={{
              marginBottom: '10px', backgroundImage: isDarkMode ? 'url("/assets/imagenes/fondosHome/fondo-inicio18.png")' : 'url("/assets/imagenes/fondosHome/fondo-inicio7.png")', backgroundSize: 'cover',
              WebkitBackgroundSize: 'cover',
            }}>


              <Typography variant="subtitle1" sx={{
                fontSize: '1.25rem',
                fontWeight: '600', background: isDarkMode ? '#7d000085' : '#ffffff85', color: isDarkMode ? 'white' : '#670000', paddingTop: '14px',
                display: 'flex', alignItems: 'flex-end', margin: '85px 0 0', paddingLeft: '10px',
                justifyContent: 'space-between', borderBottom: '2px solid darkred', flex: '0', backdropFilter: 'blur(5px)'
              }}>
                Menu de Usuario
              </Typography>

            </Paper>

            <Button
              variant='text'
              size='small'
              sx={{
                color: isDarkMode ? 'white' : 'darkred',
                width: '50%',
                margin: 0,
                fontWeight: '600',
                fontSize: '15px',
                position: 'relative',

              }}
              onClick={handleVolverAtras} // Cambio aquí
            >
              Volver atrás
            </Button>
            <div className='div-users' style={{ marginTop: '100px', padding: '0 10px' }}>
              <Button variant='contained' size='small' sx={{
                margin: '10px', padding: '12px 33px', background: 'darkred', transition: 'background .55s ease-in-out',
                '&:hover': { background: 'none', boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 50%), 0px 2px 2px 0px rgb(0 0 0 / 56%), 0px 1px 5px 0px rgb(35 56 4)' }
              }} startIcon={<AccountBoxIcon />} onClick={handleProfileNavigation}>Ir a mi perfil</Button>

              <Button variant='contained' size='small' sx={{
                margin: '10px', padding: '12px 33px', background: 'darkred', transition: 'background .55s ease-in-out',
                '&:hover': { background: 'none', boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 50%), 0px 2px 2px 0px rgb(0 0 0 / 56%), 0px 1px 5px 0px rgb(35 56 4)' }
              }} startIcon={<DisabledByDefaultIcon />} onClick={logout}>Cerrar Sesión</Button>
            </div>
          </div>
        )}
      </SwipeableDrawer>

    </div>
  );
};

export default NavBarMobile;
