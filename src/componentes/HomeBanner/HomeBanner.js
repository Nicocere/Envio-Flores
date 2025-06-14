import React, { useState, useEffect, memo } from 'react';
import styles from './homeBanner.module.css'
import { useTheme } from '../../context/ThemeSwitchContext';
import Link from 'next/link';
import Skeleton from '@mui/material/Skeleton';

const defaultBg = '/assets/imagenes/fondosHome/fondo-inicio.png';

const HomeBanner = memo(() => {
    // Estado para la imagen de fondo
    const [backgroundImage, setBackgroundImage] = useState(defaultBg);
    const [isBgLoaded, setIsBgLoaded] = useState(true);
    
    // DarkMode
    const { isDarkMode } = useTheme();
    
    // Detectar dispositivo
    const [device, setDevice] = useState('desktop');
    
    // Arrays de imágenes de fondo
    const lightBackgroundImages = [
        '/assets/imagenes/fondosHome/fondo-inicio.png',
        '/assets/imagenes/fondosHome/fondo-inicio2.png',
        '/assets/imagenes/fondosHome/fondo-inicio3.png',
        '/assets/imagenes/fondosHome/fondo-inicio4.png',
        '/assets/imagenes/fondosHome/fondo-inicio5.png',
    ];
    
    const darkBackgroundImages = [
        '/assets/imagenes/fondosHome/fondo-inicio17.png',
        '/assets/imagenes/fondosHome/fondo-inicio18.png',
        '/assets/imagenes/fondosHome/fondo-inicio20.png',
        '/assets/imagenes/fondosHome/fondo-inicio19.png',
        '/assets/imagenes/fondosHome/fondo-inicio16.png',
    ];
    
    // Función para obtener una imagen de fondo aleatoria
    const getRandomBackgroundImage = () => {
        const images = isDarkMode ? darkBackgroundImages : lightBackgroundImages;
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    };
    
    // Efecto para cambiar la imagen de fondo cuando cambia el tema
    useEffect(() => {
        const img = new window.Image();
        const newBg = getRandomBackgroundImage();
        setIsBgLoaded(false);
        img.src = newBg;
        img.onload = () => {
            setBackgroundImage(newBg);
            setIsBgLoaded(true);
        };
    }, [isDarkMode]);
    
    // Detectar dispositivo
    useEffect(() => {
        const userAgent = navigator.userAgent;
        if (/Android/i.test(userAgent)) {
            setDevice('android');
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            setDevice('ios');
        } else {
            setDevice('desktop');
        }
    }, []);
    
    return (
        <div className={`${styles.homeBanner} ${isDarkMode ? styles.darkMode : ''}`}>
            <div 
                className={styles.bannerBackground}
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundAttachment: device === 'ios' ? 'initial' : 'fixed',
                }}
            >
                {!isBgLoaded && (
                    <Skeleton variant="rectangular" width="100%" height="100%" className={styles.bgLoader} />
                )}
                
                <div className={styles.bannerOverlay}></div>
                
                <div className={styles.bannerContent}>
                    <h1 className={styles.bannerTitle}>
                        Envío de Flores a Domicilio
                    </h1>
                        <span className={styles.bannerTagline}>Flores frescas con garantía de satisfacción | Servicio premium con entrega en horario exacto        </span>
                    
                    <div className={styles.bannerSubtitle}>
                            CABA y Gran Buenos Aires
                        
                    </div>
                    
                    <div className={styles.bannerCta}>
                        <Link href="/productos" className={styles.primaryButton}>
                            Ver Productos
                        </Link>
                        <Link href="/categoria/Ramos" className={styles.secondaryButton}>
                            Ramos de Flores
                        </Link>
                        <Link href="/envios" className={styles.tertiaryButton}>
                            Zonas de Envío
                        </Link>
                    </div>
                </div>
                
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollMouse}>
                        <div className={styles.scrollWheel}></div>
                    </div>
                    <span>Desliza hacia abajo</span>
                </div>

                <div className={styles.floralWaveDecoration}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path className={styles.floralWavePath1} d="M0,48C120,32,240,16,360,16C480,16,600,32,720,37.3C840,43,960,37,1080,37.3C1200,37,1320,43,1380,46.7L1440,50L1440,120L0,120Z" opacity={1}></path>
                        <path className={styles.floralWavePath2} d="M0,70C48,74,96,78,240,78C384,78,432,74,576,70C720,66,768,62,912,62C1056,62,1104,66,1248,69.3C1392,73,1416,75.7,1440,77L1440,120L0,120Z"></path>
                        <path className={styles.floralWavePath3} d="M0,96C120,96,240,96,360,96C480,96,600,96,720,96C840,96,960,96,1080,96C1200,96,1320,96,1380,96L1440,96L1440,120L0,120Z"></path>
                        <path className={styles.floralWavePath4} d="M0,96C120,96,240,96,360,96C480,96,600,96,720,96C840,96,960,96,1080,96C1200,96,1320,96,1380,96L1440,96L1440,120L0,120Z" opacity={1}></path>

                    </svg>
                </div>
            </div>
        </div>
    );
});

export default HomeBanner;