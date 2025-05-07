"use client"
import React from 'react';
import style from '@/app/ubicacion/ubicacion.module.css';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeSwitchContext';
import LocalidadPageComponent from '../Envios/EnviosPage';

function UbicacionPage() {
    const {isDarkMode} = useTheme();
    return (
        <div className={`${style.divUbicacion} ${isDarkMode ? style.dark : style.light}`}>
            <div className={style.container}>
                <h1 className={style.titulo}>Ubicación y Contacto</h1>
                
                <div className={style.contactGrid}>
                    <div className={style.contactInfo}>
                        <div className={style.infoCard}>
                            <h2 className={style.infoTitle}>Sobre ENVIO FLORES</h2>
                            <p className={style.description}>
                                Somos una florería especializada en arreglos florales personalizados y envíos a domicilio. Con más de 15 años de experiencia, 
                                nos destacamos por la frescura de nuestras flores y la puntualidad en nuestras entregas.
                            </p>
                            
                            <div className={style.contactItem}>
                                <FaPhone className={style.icon} />
                                <div>
                                    <h3>Teléfonos</h3>
                                    <p>Atención <strong className={style.textStrong}>(Lunes a Domingo de 9 a 20 hs)</strong></p>
                                    <p className={style.contactDetail}>54 (11) 6542-1003 / 4788-9185</p>
                                </div>
                            </div>
                            
                            <div className={style.contactItem}>
                                <FaWhatsapp className={style.icon} />
                                <div>
                                    <h3>WhatsApp</h3>
                                    <p>Consultas y pedidos</p>
                                    <a className={style.linkWhatsapp} href="https://wa.me/1165421003?text=Hola%20EnvioFlores%20,%20quisiera%20hacer%20un%20pedido">
                                        +54 9 (11) 6542 1003
                                    </a>
                                </div>
                            </div>
                            
                            <div className={style.contactItem}>
                                <FaEnvelope className={style.icon} />
                                <div>
                                    <h3>Email</h3>
                                    <a className={style.linkEmail} href="mailto:ventas@aflorar.com.ar">
                                    ventas@aflorar.com.ar
                                    </a>
                                </div>
                            </div>
                            
                            <div className={style.contactItem}>
                                <FaClock className={style.icon} />
                                <div>
                                    <h3>Horarios de atención</h3>
                                    <p className={style.contactDetail}>Lunes a Domingo: 9:00 - 20:00 hs</p>
                                </div>
                            </div>
                            
                            <div className={style.contactItem}>
                                <FaMapMarkerAlt className={style.icon} />
                                <div>
                                    <h3>Dirección</h3>
                                    <p className={style.contactDetail}>
                                        <strong className={style.textStrong}>Av. Cramer 1915, Belgrano - CABA</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={style.socialLinks}>
                            <h3>Síguenos en redes sociales</h3>
                            <div className={style.socialButtons}>
                                <a href="https://instagram.com/aflorar.arg" className={style.socialButton}>Instagram</a>
                                <a href="https://facebook.com/aflorar.arg" className={style.socialButton}>Facebook</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className={style.mapContainer}>
                        <div className={style.mapOverlay}>
                            <h2>Visítanos</h2>
                            <p>Te esperamos en nuestra tienda</p>
                        </div>
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar"
                            title="Ubicación de ENVIO FLORES"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className={style.map}
                        />
                    </div>
                </div>
                
                <div className={style.deliveryInfo}>
                    
                    <h2 className={style.deliveryTitle}>Envíos a Domicilio</h2>
                    <p>Realizamos envíos a domicilio en toda la Ciudad Autónoma de Buenos Aires y Gran Buenos Aires en el día o programado.</p>
                    <p>Contamos con servicio de entrega express en el día para pedidos realizados antes de las 16:00 hs.</p>
                    <p>Consulta por disponibilidad para entregas express en el día.</p>
                    <a 
                        href="https://wa.me/1165421003?text=Hola%20EnvioFlores%20,%20quisiera%20consultar%20por%20entregas"
                        className={style.deliveryButton}
                    >
                        <FaWhatsapp className={style.buttonIcon} />
                        Consultar por WhatsApp
                    </a>
                    
                    <div className={style.featureIcons}>
                        <div className={style.featureItem}>
                            <FaMapMarkerAlt className={style.featureIcon} />
                            <h3 className={style.featureTitle}>Envío Express</h3>
                            <p className={style.featureText}>Entrega rápida y segura de tus arreglos florales en el día.</p>
                        </div>
                        
                        <div className={style.featureItem}>
                            <FaEnvelope className={style.featureIcon} />
                            <h3 className={style.featureTitle}>Regalos que Emocionan</h3>
                            <p className={style.featureText}>Cada envío está pensado para transmitir felicidad y emociones.</p>
                        </div>
                        
                        <div className={style.featureItem}>
                            <FaClock className={style.featureIcon} />
                            <h3 className={style.featureTitle}>Compromiso y Confianza</h3>
                            <p className={style.featureText}>Más de 15 años brindando un servicio de calidad y puntualidad.</p>
                        </div>
                    </div>

                    <LocalidadPageComponent />
                </div>
            </div>
        </div>
    );
}

export default UbicacionPage;