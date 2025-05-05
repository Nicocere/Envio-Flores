"use client"

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, useMediaQuery } from '@mui/material';
import style from './registro.module.css';
import Image from 'next/image';
import { EmojiNature, LocalFlorist, Spa, CalendarToday, Notifications, StarBorder } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeSwitchContext';

function RegistroUser() {

    const {isDarkMode} = useTheme();



    return (
        <div className={style.registro}>
            <Container maxWidth="md">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        padding: 4, 
                        textAlign: 'center', 
                        marginTop: 4, 
                        marginBottom: 4,
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                        color: isDarkMode ? '#f0f0f0' : '#333333'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                        <Box sx={{ position: 'relative', width: 200, height: 120, marginBottom: 2 }}>
                            <Image 
                                src="https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23" 
                                alt="Envío Flores Logo" 
                                layout="fill"
                                objectFit="contain"
                                priority
                                onError={(e) => {
                                    e.target.src = '/assets/imagenes/logo-envio-flores.png';
                                }}
                            />
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
                        <LocalFlorist sx={{ color: '#a70000', fontSize: 40 }} />
                        <Spa sx={{ color: '#a70000', fontSize: 40 }} />
                        <EmojiNature sx={{ color: '#a70000', fontSize: 40 }} />
                    </Box>
                    
                    <h1 style={{ color: '#a70000' }} gutterBottom>
                        Registro Temporalmente No Disponible
                    </h1>
                    
                    <p stlye={{ color: isDarkMode ? '#f0f0f0' : '#333333' }}>
                        Estimado cliente, en este momento no es posible realizar nuevos registros en nuestra plataforma.
                    </p>
                    
                    <p stlye={{ color: isDarkMode ? '#f0f0f0' : '#333333' }}>
                        Estamos realizando mejoras significativas en nuestro sistema para ofrecerle una experiencia de compra personalizada y segura.
                    </p>
                    
                    <Box sx={{ 
                        margin: '20px 0', 
                        padding: '20px', 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#fcf5f0',
                        borderRadius: '8px',
                        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e6d7cf'}`
                    }}>
                        <h2 style={{ color: '#a70000' }} gutterBottom>
                            ¡Gracias por su paciencia!
                        </h2>
                        <p style={{ color: isDarkMode ? '#f0f0f0' : '#333333' }}>
                            En Envío Flores nos comprometemos a ofrecerle los arreglos florales más hermosos y frescos para todas sus ocasiones especiales.
                            Pronto podrá registrarse y disfrutar de nuestros servicios personalizados.
                        </p>
                    </Box>

                    <Box sx={{ 
                        margin: '20px 0', 
                        padding: '20px', 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#fcf5f0',
                        borderRadius: '8px',
                        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e6d7cf'}`
                    }}>
                        <h2 style={{ color: '#a70000' }} gutterBottom>
                            Lo que podrá disfrutar muy pronto
                        </h2>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-around', mt: 2 }}>
                            <Box sx={{ flex: 1 ,mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CalendarToday sx={{ color: '#a70000', fontSize: 30, mb: 1 }} />
                                <p style={{ color: isDarkMode ? '#f0f0f0' : '#333333' }}>
                                    Recordatorios de fechas importantes
                                </p>
                            </Box>
                            <Box sx={{ flex: 1 ,mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Notifications sx={{ color: '#a70000', fontSize: 30, mb: 1 }} />
                                <p style={{ color: isDarkMode ? '#f0f0f0' : '#333333' }}>
                                    Notificaciones de ofertas exclusivas
                                </p>
                            </Box>
                            <Box sx={{ flex: 1 ,mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <StarBorder sx={{ color: '#a70000', fontSize: 30, mb: 1 }} />
                                <p style={{ color: isDarkMode ? '#f0f0f0' : '#333333' }}>
                                    Programa de fidelidad
                                </p>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
                        <LocalFlorist sx={{ color: '#a70000', fontSize: 30 }} />
                        <Spa sx={{ color: '#a70000', fontSize: 30 }} />
                        <EmojiNature sx={{ color: '#a70000', fontSize: 30 }} />
                    </Box>

                    <button className={style.registroButton} onClick={() => window.location.href = '/'}>
                        Volver a la Página Principal
                    </button>
                    <p style={{ color: isDarkMode ? '#f0f0f0' : '#333333', marginTop: 2 }}>
                        © 2023 Envío Flores. Todos los derechos reservados.
                    </p>

                </Paper>
            </Container>
        </div>
    );
}

export default RegistroUser;