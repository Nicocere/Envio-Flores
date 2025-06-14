import React, { useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import './middlemenu.css';
import { useTheme } from '../../context/ThemeSwitchContext';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';

// Importación de iconos
import { 
  GiFlowerPot, 
  GiRose, 
  GiDaisy, 
  GiFlowerStar
} from 'react-icons/gi';

import { 
  FaBirthdayCake, 
  FaHeart,
  FaArrowRight
} from 'react-icons/fa';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { RiFlowerFill } from 'react-icons/ri';

export default function MiddleMenu({banners, loading}) {

  const { isDarkMode } = useTheme();
  
  // Detectar cuando el componente está en viewport
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Animaciones del header
  const headerAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });


  // Palabras clave para mapear iconos
  const iconMap = useMemo(() => ({
    "rosa": FaHeart,
    "rosas": FaHeart,
    "amor": FaHeart,
    "romántico": FaHeart,
    "cumpleaños": FaBirthdayCake,
    "aniversario": FaBirthdayCake,
    "tulipan": GiDaisy,
    "tulipanes": GiDaisy,
    "primavera": GiDaisy,
    "plantas": GiFlowerPot,
    "planta": GiFlowerPot,
    "exótica": GiFlowerStar,
    "exotica": GiFlowerStar
  }), []);
  
  // Función para obtener el icono apropiado
  const getIconForBanner = (banner) => {
    if (!banner || !banner.nombre) {
      return GiRose;
    }
    
    const bannerName = banner.nombre.toLowerCase();
    
    for (const [keyword, Icon] of Object.entries(iconMap)) {
      if (bannerName.includes(keyword)) {
        return Icon;
      }
    }
    
    return GiRose;
  };

  return (
    <animated.div 
      ref={ref}
      className={`simple-collections ${isDarkMode ? 'dark-mode' : ''}`}
      style={headerAnimation}
    >
      <div className="simple-container">
                    <div className="top-items-header">
                    <h2 className="simple-title">Nuestras Colecciones</h2>
                    <p className="simple-subtitle">Encuentra el arreglo floral perfecto para cada ocasión</p>
                    <div className="top-items-decoration">
                            <span className="decoration-line"></span>
                            <span className="decoration-icon"><RiFlowerFill /></span>
                            <span className="decoration-line"></span>
                        </div>
                    </div>
      
        {loading ? (
          <div className="simple-loading">
            <div className="simple-spinner"></div>
            <p>Cargando colecciones...</p>
          </div>
        ) : (
          <div className="simple-grid">
            {banners.map((banner, index) => {
              const Icon = getIconForBanner(banner);
              
                return (
                <Link 
                  href={banner.ruta || '/productos'} 
                  className="simple-card" 
                  key={banner.id || index}
                >
                  <div className="simple-card-image">
                  <LazyLoadImage 
                    src={banner.imagen || '/assets/imagenes/placeholder-banner.jpg'}
                    alt={banner.nombre || 'Colección floral'}
                    effect="blur"
                    threshold={100}
                  />
                  <div className="simple-overlay">
                    <span className="simple-explore">Explorar</span>
                  </div>
                  </div>
                  <div className="simple-card-content">
                  <div className="simple-icon">
                    <Icon />
                  </div>
                  <h3 className="simple-card-title">{banner.nombre || 'Colección Especial'}</h3>
                  <p className="simple-card-description">
                    {banner.descripcion || `Descubre nuestra coleccion de ${banner.nombre || 'flores'}`}
                  </p>
                  </div>
                </Link>
                );
            })}
          </div>
        )}
        
        <div className="simple-footer">
          <Link href="/productos" className="simple-all-button">
            <span>Ver todas las colecciones</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </animated.div>
  );
}