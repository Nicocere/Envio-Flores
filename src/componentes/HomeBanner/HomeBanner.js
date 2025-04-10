import React, { useState, useEffect, memo } from 'react';
import { useMediaQuery } from '@mui/material';
import './homeBanner.css';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeSwitchContext';
import { Link } from 'react-router-dom';

const HomeBanner = memo(() => {
    // Estado para la imagen de fondo
    const [backgroundImage, setBackgroundImage] = useState('');
    
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
        setBackgroundImage(getRandomBackgroundImage());
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
        <div className={`home-banner ${isDarkMode ? 'dark-mode' : ''}`}>
            <div 
                className="banner-background"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundAttachment: device === 'ios' ? 'initial' : 'fixed',
                }}
            >
                <div className="banner-overlay"></div>
                
                <div className="banner-content">
                    <h1 className="banner-title">
                        Envío de Flores a Domicilio
                        <span className="banner-subtitle">CABA y Gran Buenos Aires</span>
                    </h1>
                    
                    <div className="banner-tagline">
                        Flores frescas con garantía de satisfacción | Servicio premium con entrega en horario exacto
                    </div>
                    
                    <div className="banner-cta">
                        <Link to="/productos" className="primary-button">
                            Ver Productos
                        </Link>
                        <Link to="/categoria/Ramos" className="secondary-button">
                            Ramos de Flores
                        </Link>
                        <Link to="/envios" className="tertiary-button">
                            Zonas de Envío
                        </Link>
                    </div>
                </div>
                
                <div className="scroll-indicator">
                    <div className="scroll-mouse">
                        <div className="scroll-wheel"></div>
                    </div>
                    <span>Desliza hacia abajo</span>
                </div>
            </div>
        </div>
    );
});

export default HomeBanner;