"use client";

import React, { useEffect, useState } from 'react';
import CarouselComponent from "../Carousel/Carousel";
import ItemListContainer from "../ItemListContainer/ItemListContainer"
import MiddleMenu from '../MiddleMenu/MiddleMenu';
import { ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import { grey } from '@mui/material/colors';
import HomeBanner from '../HomeBanner/HomeBanner';
import TopItems from '../ItemsTopSelling/TopItems';
import Informacion from '../Informacion/Informacion';
import HomeOcasiones from '../HomeOcasiones/HomeOcasiones';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { RiFlowerFill } from 'react-icons/ri';
import './home.css';
import CartHome from '@/Client/CartHome/CartHome';

const Home = () => {

  const theme = createTheme();
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  theme.typography.h2 = {
    color: theme.palette.getContrastText(grey[900]),
    padding: 20,
    fontFamily: 'Carattere, sans-serif',
    fontSize: isSmallScreen ? '2.2rem' : '1.2rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
  };

  const [refTheme, inViewTheme] = useInView({
    threshold: 0.1,
  });

  const animationTheme = useSpring({
    opacity: inViewTheme ? 1 : 0,
    transform: inViewTheme ? 'translateY(0)' : 'translateY(100px)',
  });

  const [refTopItems, inViewTopItems] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const animationTopItems = useSpring({
    from: {
      opacity: 0,
      transform: 'translateY(50px)',
    },
    to: {
      opacity: inViewTopItems ? 1 : 0,
      transform: inViewTopItems ? 'translateY(0)' : 'translateY(50px)',
    },
    config: { duration: 500, },

  });


  const [refTheme2, inViewTheme2] = useInView({
    threshold: 0.2,
  });

  const animationTheme2 = useSpring({
    opacity: inViewTheme2 ? 1 : 0,
    transform: inViewTheme2 ? 'translateY(0)' : 'translateY(50px)',
  });

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función mejorada para cargar banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const bannersCollection = collection(baseDeDatos, 'banners');
      const bannerSnapshot = await getDocs(bannersCollection);

      if (bannerSnapshot.empty) {
        setBanners([]);
        return;
      }

      const bannerList = bannerSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      setBanners(bannerList);
    } catch (err) {
      console.error('Error al cargar los banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    return () => {
      // Cleanup para evitar memory leaks
    };
  }, []);

  return (
    <>
    <CartHome />
      <HomeBanner />

      <animated.div ref={refTopItems} style={animationTopItems}>
        <TopItems />
      </animated.div>

      <CarouselComponent banners={banners} loading={loading} />

      <MiddleMenu banners={banners} loading={loading} />

      <Informacion />

      <HomeOcasiones />

      <ThemeProvider theme={theme}>
        <div className="top-items-header">
          <h2 className="simple-title">Nuestros Productos</h2>
          <p className="simple-subtitle">Descubre el regalo perfecto para vos</p>
          <div className="top-items-decoration">
            <span className="decoration-line"></span>
            <span className="decoration-icon"><RiFlowerFill /></span>
            <span className="decoration-line"></span>
          </div>
        </div>
        <ItemListContainer />
      </ThemeProvider>


    </>
  );
};

export default Home;