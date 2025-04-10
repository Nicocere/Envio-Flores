import React, { useEffect, useState } from 'react';
import { Typography, Container, useMediaQuery } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaLeaf, FaHeart, FaBirthdayCake, FaSmile, FaBaby, FaPray } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import styles from './homeOcasiones.module.css';
import { useTheme } from '../../context/ThemeSwitchContext';

export default function HomeOcasiones() {
  // Detectar tema y dispositivo
  const { isDarkMode } = useTheme();
  const isMediumScreen = useMediaQuery('(max-width:900px)');
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  
  // Detectar dispositivo para optimizaciones específicas
  const [device, setDevice] = useState('PC');
  
  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
      setDevice('Android');
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setDevice('iOS');
    } else {
      setDevice('PC');
    }
  }, []);

  // Configuración para animaciones de entrada
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0] 
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0] 
      }
    }
  };

  // Función para obtener icono según ID
  const getOcasionIcon = (id) => {
    switch (id) {
      case 1: return <BsStars />;
      case 2: return <FaSmile />;
      case 3: return <FaHeart />;
      case 4: return <FaBirthdayCake />;
      case 5: return <FaBaby />;
      case 6: return <FaPray />;
      default: return <FaLeaf />;
    }
  };

  // Datos de ocasiones con mayor estructuración
  const ocasiones = [
    {
      id: 1,
      imagen: '/assets/imagenes/ocasiones/ocasiones_15anos.jpg',
      nombre: 'Celebraciones',
      descripcion: 'Arreglos florales para momentos especiales',
      ruta: '/ocasiones/Celebraciones',
      color: '#ff6a6add'
    },
    {
      id: 2,
      imagen: '/assets/imagenes/ocasiones/ocasiones_agradecimiento.jpg',
      nombre: 'Agradecimientos',
      descripcion: 'Expresa tu gratitud con flores',
      ruta: '/ocasiones/Agradecimientos',
      color: '#ff9800dd'
    },
    {
      id: 3,
      imagen: '/assets/imagenes/ocasiones/ocasiones_aniversario.webp',
      nombre: 'Aniversarios',
      descripcion: 'Celebra un año más juntos',
      ruta: '/ocasiones/Aniversarios',
      color: '#e91e63dd'
    },
    {
      id: 4,
      imagen: '/assets/imagenes/ocasiones/ocasiones_cumpleanos.jpg',
      nombre: 'Cumpleaños',
      descripcion: 'Sorprende en su día especial',
      ruta: '/ocasiones/Cumpleanos',
      color: '#9c27b0dd'
    },
    {
      id: 5,
      imagen: '/assets/imagenes/ocasiones/ocasiones_maternidad.jpg',
      nombre: 'Nacimientos',
      descripcion: 'Celebra la llegada de una nueva vida',
      ruta: '/ocasiones/Nacimientos',
      color: '#2196f3dd'
    },
    {
      id: 6,
      imagen: '/assets/imagenes/ocasiones/ocasiones_condolencias.jpg',
      nombre: 'Condolencias',
      descripcion: 'Transmite tu apoyo en momentos difíciles',
      ruta: '/ocasiones/Condolencias',
      color: '#263238dd'
    }
  ];

  // Obtener el número adecuado de columnas según el tamaño de pantalla
  const getGridTemplateColumns = () => {
    if (isSmallScreen) return '1fr';
    if (isMediumScreen) return 'repeat(2, 1fr)';
    return 'repeat(3, 1fr)';
  };

  return (
    <Container 
      maxWidth="xl" 
      className={`${styles.occasionsContainer} ${isDarkMode ? styles.darkMode : ''}`}
    >
      <div className={styles.sectionHeader}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className={styles.titleContainer}
        >
          <Typography variant="h2" component="h2" className={styles.sectionTitle}>
            Flores para cada Ocasión
          </Typography>
          
          <div className={styles.titleDecoration}>
            <span className={styles.line}></span>
            <FaLeaf className={styles.leafIcon} />
            <span className={styles.line}></span>
          </div>
          
          <Typography variant="subtitle1" className={styles.sectionSubtitle}>
            Descubre nuestros arreglos florales diseñados para expresar tus sentimientos en todo momento
          </Typography>
        </motion.div>
      </div>
      
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className={styles.occasionsGrid}
        style={{ gridTemplateColumns: getGridTemplateColumns() }}
      >
        {ocasiones.map((ocasion) => (
          <motion.div 
            key={ocasion.id}
            variants={itemVariants}
            className={styles.occasionItem}
            style={{
              backgroundImage: `url(${ocasion.imagen})`,
              backgroundAttachment: device === 'iOS' ? 'initial' : 'scroll'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div 
              className={styles.overlay}
              style={{ 
                background: `linear-gradient(to top, ${ocasion.color} 30%, transparent 100%)` 
              }}
            ></div>
            
            <NavLink to={ocasion.ruta} className={styles.occasionLink} aria-label={`Ver productos para ${ocasion.nombre}`}>
              <div className={styles.contentWrapper}>
                <div className={styles.iconContainer}>
                  {getOcasionIcon(ocasion.id)}
                </div>
                <h3 className={styles.occasionTitle}>{ocasion.nombre}</h3>
                <p className={styles.occasionDescription}>{ocasion.descripcion}</p>
                <div className={styles.viewButton}>
                  <span>Explorar</span>
                  <svg className={styles.arrow} viewBox="0 0 24 24">
                    <path d="M5,12H19M19,12L13,6M19,12L13,18" />
                  </svg>
                </div>
              </div>
            </NavLink>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className={styles.sectionFooter}
      >
        <NavLink to="/productos" className={styles.viewAllButton}>
          <span>Ver todas las colecciones</span>
          <svg className={styles.arrowLong} viewBox="0 0 24 24">
            <path d="M5,12H19M19,12L13,6M19,12L13,18" />
          </svg>
        </NavLink>
      </motion.div>
    </Container>
  );
}