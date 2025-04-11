"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import  Link  from 'next/link';
import { PulseLoader } from 'react-spinners';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { useTheme } from '../../context/ThemeSwitchContext';

// Importaciones de Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Estilos propios
import './carousel.css';

const CarouselComponent = ({ banners = [], loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);
  const { isDarkMode } = useTheme();
  const swiperRef = useRef(null);
  const progressRef = useRef(null);
  const progressTimeout = useRef(null);
  
  // Usar IntersectionObserver para detectar visibilidad
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  // Manejar autoplay basado en visibilidad
  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    
    if (swiperInstance) {
      if (inView) {
        swiperInstance.autoplay.start();
      } else {
        swiperInstance.autoplay.stop();
      }
    }
  }, [inView]);
  
  // Detector de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Barra de progreso personalizada
  useEffect(() => {
    return () => {
      if (progressTimeout.current) {
        clearTimeout(progressTimeout.current);
      }
    };
  }, []);
  
  // Actualizar la barra de progreso
  const updateProgressBar = () => {
    if (progressRef.current && swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper;
      const barWidth = ((swiper.realIndex + 1) / banners.length) * 100;
      progressRef.current.style.width = `${barWidth}%`;
    }
  };
  
  // Manejador de cambio de slide
  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.realIndex);
    updateProgressBar();
    
    // Iniciar animación de la barra de progreso
    if (progressRef.current) {
      // Restablecer cualquier transición anterior
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = `${((swiper.realIndex + 1) / banners.length) * 100}%`;
      
      // Forzar un reflow
      void progressRef.current.offsetWidth;
      
      // Aplicar la transición
      progressRef.current.style.transition = 'width 3000ms linear';
      
      if (progressTimeout.current) {
        clearTimeout(progressTimeout.current);
      }
      
      // Preparar el siguiente avance automático
      progressTimeout.current = setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.width = `${((swiper.realIndex + 2) / banners.length) * 100}%`;
        }
      }, 50);
    }
  };
  
  // Manejador de reintentos
  const handleRetry = () => {
    setError(null);
  };
  
  // Obtener clases basadas en el tema
  const getContainerClass = () => `carousel-container ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isMobile ? 'mobile' : ''} ${isSmallMobile ? 'small-mobile' : ''}`;
  
  // Renderizado condicional para errores
  if (error) {
    return (
      <Paper elevation={3} className={`carousel-box ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="carousel-error">
          <div className="error-icon">!</div>
          <Typography variant="h5" className="error-message">
            {error}
          </Typography>
          <button 
            className="retry-button"
            onClick={handleRetry}
          >
            Reintentar
          </button>
        </div>
      </Paper>
    );
  }

  return (
    <Paper elevation={4} className={`carousel-box ${isDarkMode ? 'dark-mode' : 'light-mode'}`} ref={ref}>
      <div className={getContainerClass()}>
        {loading ? (
          <div className="carousel-loading">
            <PulseLoader 
              color={isDarkMode ? "#ff9999" : "#a70000"} 
              size={15}
              speedMultiplier={0.8}
            />
            <Typography className="loading-text">
              Cargando presentación...
            </Typography>
          </div>
        ) : banners.length === 0 ? (
          <div className="carousel-empty">
            <div className="empty-icon">🌸</div>
            <Typography className="empty-message">
              No hay promociones disponibles en este momento.
            </Typography>
          </div>
        ) : (
          <>
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, EffectFade, Pagination, Navigation]}
              effect="fade"
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{
                delay: 40000000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{
                clickable: true,
                dynamicBullets: isMobile
              }}
              navigation={!isMobile}
              fadeEffect={{ crossFade: true }}
              onSlideChange={handleSlideChange}
              className="swiper-carousel"
              
              loop={true}
              watchSlidesProgress={true}
              speed={800}
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={banner.id || index} className="swiper-slide-custom">
                  <Link 
                    className="carousel-link" 
                    href={banner.ruta || '/productos'}
                    aria-label={`Ver ${banner.nombre || 'colección'}`}
                  >
                    <div className="image-container">
                      <img
                        src={banner.imagen || '/assets/imagenes/placeholder-banner.jpg'}
                        alt={banner.nombre || 'Banner promocional'}
                        className="carousel-image"
                      />
                      <div className="image-overlay"></div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {currentIndex === index && (
                        <motion.div 
                          className="carousel-banner-content"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className={`text-content ${isSmallMobile ? 'mobile-text' : ''}`}>
                            <motion.h2 
                              className="banner-title"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                            >
                              {banner.nombre || 'Promoción Especial'}
                            </motion.h2>
                            
                            {banner.descripcion && (
                              <motion.p 
                                className="banner-description"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                              >
                                {isSmallMobile && banner.descripcion.length > 60 
                                  ? `${banner.descripcion.substring(0, 60)}...` 
                                  : banner.descripcion
                                }
                              </motion.p>
                            )}
                            
                            <motion.div 
                              className="banner-button"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                            >
                              {isSmallMobile ? 'Ver' : 'Ver colección'}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Barra de progreso personalizada */}
            <div className="carousel-progress">
              <div 
                ref={progressRef} 
                className="progress-bar"
              ></div>
            </div>
            
            {/* Indicador móvil de deslizamiento */}
            {isMobile && (
              <div className="swipe-indicator">
                <span className="swipe-text">Desliza para ver más</span>
              </div>
            )}
          </>
        )}
      </div>
    </Paper>
  );
};

export default CarouselComponent;