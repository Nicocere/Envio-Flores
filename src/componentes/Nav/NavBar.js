"use client"

import CartWidget from '../CartWidget/CartWidget'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import NavSeccions from '../NavSeccions/NavSeccions';
import { onAuthStateChanged } from "@firebase/auth";
import { auth, baseDeDatos } from '../../admin/FireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { SubMenuUsers } from '../SubMenuUsers/SubMenuUsers'
import { AppBar, Toolbar, useMediaQuery, Typography, Button, SwipeableDrawer, Avatar, Grid, Paper, } from '@mui/material';
import styled from '@emotion/styled';
import SearcherNavBar from '../SearcherNavBar/SearcherNavBar';
import './nav.css'
import Convertidor from '../Convertidor/Convertidor';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import { useTheme } from '../../context/ThemeSwitchContext';
import Image from 'next/image';


const NavBarTop = () => {

  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:900px)');
  const isMobileScreen = useMediaQuery('(max-width:800px)');

  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const { isDarkMode } = useTheme();

  const className = isDarkMode ? 'dark-mode' : '';

  const CustomizedToolbar = styled(Toolbar)(() => ({
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: isSmallScreen ? '10px' : '15px',
    flexDirection: isSmallScreen ? 'column' : 'column',

    justifyContent: 'space-between',
    // Override the default MuiToolbar styles
    '&.MuiToolbar-root': {
      paddingLeft: 0,
      paddingRight: 0,
      position: 'static'
    },
  }));

  const handleToggleProfileDrawer = (open) => (event) => {
    event.stopPropagation();

    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift' || event.key === 'Esc') || (event.type === 'click' && event.target.tagName === 'A' )) {
      return;
    }
    setOpenProfileDrawer(open);
    
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
  
      <AppBar id="navBarTop" className={className} position="fixed" >

        <CustomizedToolbar >
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>

            <Paper elevation={3} sx={{display:'flex',  zIndex: '1', flexDirection:'row', width:'-webkit-fill-available', alignItems:'center', height:'105px',
                background:'transparent'}}>

              {/* Imagen */}
              <Grid item xs={2} md={2}>
                <Link className='linkImg' href="/" style={{ alignSelf: 'flex-start', gridArea: '1 / 1 / span 1 / span 1' , marginTop:'10px'}}>
                  <Image width={100} height={100} className='imgNavBar' src={'/assets/imagenes/logo-envio-flores.png'} alt="logo envio flores" />
                </Link>
              </Grid>

              {/* Buscador */}
              <Grid item xs={isMobileScreen ? 6 : 7} md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SearcherNavBar navBar={true} />
              </Grid>

              {/* Sesion usuario / Moneda / Carrito / DarkMode*/}
              <Grid item xs={isMobileScreen ? 4 : 3} md={5} style={{ textAlign: 'right', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
               <ThemeSwitch mobile={isMobileScreen} responsive={isSmallScreen}/> 

                {
                  userData && currentUser && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt={userData.name}
                        src={userData.photoURL}
                        sx={{ width: 30, height: 30, marginRight: '5px', cursor: 'pointer' }}
                        onClick={handleToggleProfileDrawer(true)}
                      />
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px', cursor: 'pointer' }} onClick={handleToggleProfileDrawer(true)}>
                        {userData.name}
                      </Typography>
                    </div>
                  )
                }
                <Convertidor />
                <Link href="/cart" style={{ marginLeft: '10px' }}>
                  <CartWidget />
                </Link>
              </Grid>
            </Paper>

            {/* Secciones */}
            <Grid item xs={12} style={{paddingTop:0}}>
              <NavSeccions />
            </Grid>

          </Grid>

          {/* Drawer */}
          <SwipeableDrawer
            anchor="right"
            open={openProfileDrawer}
            onClick={handleToggleProfileDrawer(false)}
            onClose={handleToggleProfileDrawer(false)}
            onOpen={handleToggleProfileDrawer(true)}
            disableBackdropTransition={true}
            disableDiscovery={true}
          >
            {openProfileDrawer && (
              <div style={{
                width: '280px', display: 'flex', flexDirection: 'column',
                background: 'linear-gradient(to right, red , darkred)',
                height: '100%', padding: '0 14px 0',
              }}>
          
                {openProfileDrawer &&
                  <>
                    <Button endIcon={<ArrowBackIosNewIcon sx={{transform:'rotateY(180deg)'}}/>} sx={{
                      margin: 0, fontWeight: '600', color:'white', cursor:'pointer',marginBottom:'150px', 
                      position: 'relative', marginTop:'70px', borderBottom: '1px solid silver'
                    }}>

                      Menu de Usuario

                    </Button>
                    <SubMenuUsers userData={userData} />
                  </>
                }
              </div>
            )}
          </SwipeableDrawer>
        </CustomizedToolbar>
      </AppBar>
    

  );
};

export default NavBarTop;