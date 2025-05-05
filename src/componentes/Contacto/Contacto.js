"use client";
import React, { useState, useEffect } from 'react';
import estilos from './Contacto.module.css';
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram';
import { ImFacebook2 } from '@react-icons/all-files/im/ImFacebook2';
import { FiPhoneCall } from '@react-icons/all-files/fi/FiPhoneCall';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';
import { HiOutlineMail } from '@react-icons/all-files/hi/HiOutlineMail';
import { IoMdSend } from '@react-icons/all-files/io/IoMdSend';
import { IoLocationSharp } from '@react-icons/all-files/io5/IoLocationSharp';
import { CgDarkMode } from '@react-icons/all-files/cg/CgDarkMode';
import { useTheme } from '@/context/ThemeSwitchContext';

const Contacto = () => {
    // Estado para el tema (claro/oscuro)
    const {isDarkMode } = useTheme();

    console.log(isDarkMode);
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    
    // Estado para mensajes de validación
    const [validacion, setValidacion] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    
    // Estado para manejo de envío
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState('');




    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Limpiar validación al cambiar
        setValidacion({
            ...validacion,
            [name]: ''
        });
    };

    // Validar formulario
    const validarFormulario = () => {
        let esValido = true;
        const nuevaValidacion = {
            nombre: '',
            email: '',
            telefono: '',
            mensaje: ''
        };

        // Validar nombre
        if (!formData.nombre.trim()) {
            nuevaValidacion.nombre = 'El nombre es obligatorio';
            esValido = false;
        }

        // Validar email
        if (!formData.email.trim()) {
            nuevaValidacion.email = 'El email es obligatorio';
            esValido = false;
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            nuevaValidacion.email = 'Ingresa un email válido';
            esValido = false;
        }

        // Validar teléfono (opcional pero con formato correcto)
        if (formData.telefono && !/^[0-9+ -]{8,15}$/.test(formData.telefono)) {
            nuevaValidacion.telefono = 'Ingresa un número de teléfono válido';
            esValido = false;
        }

        // Validar mensaje
        if (!formData.mensaje.trim()) {
            nuevaValidacion.mensaje = 'El mensaje es obligatorio';
            esValido = false;
        } else if (formData.mensaje.length < 10) {
            nuevaValidacion.mensaje = 'El mensaje debe tener al menos 10 caracteres';
            esValido = false;
        }

        setValidacion(nuevaValidacion);
        return esValido;
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }
        
        setEnviando(true);
        setError('');
        
        try {
            const response = await fetch('/api/contacto/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error('Hubo un problema al enviar el formulario');
            }
            
            setEnviado(true);
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                mensaje: ''
            });
            
            // Resetear el estado de enviado después de 5 segundos
            setTimeout(() => {
                setEnviado(false);
            }, 5000);
            
        } catch (error) {
            setError(error.message || 'Error al enviar el formulario');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className={`${estilos.contactoContainer} ${isDarkMode ? estilos.darkMode : ''}`}>
            {/* Barra superior con botón de tema e iconos de contacto */}
            <div className={estilos.navTop}>
        
                
                <div className={estilos.divContactoIconsRedes}>
                    <div className={estilos.redesSociales}>
                        <a 
                            href="tel:+5491147889185" 
                            className={estilos.icons}
                            aria-label="Llamar por teléfono"
                        >
                            <FiPhoneCall />
                            <span className={estilos.iconLabel}>+54 11 4788-9185</span>
                        </a>
                    </div>
                    
                    <div className={estilos.redesSociales}>
                        <a 
                            className={estilos.icons} 
                            href="https://wa.me/+5491165421003?text=Hola%20EnvioFlores%20,%20Quisiera%20hacer%20un%20pedido!"
                            aria-label="Contactar por WhatsApp"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp />
                            <span className={estilos.iconLabel}>WhatsApp</span>
                        </a>
                    </div>
                    
                    <div className={estilos.redesSociales}>
                        <a 
                            href="mailto:floreriasargentinas@gmail.com"
                            className={estilos.icons}
                            aria-label="Enviar email"
                        >
                            <HiOutlineMail />
                            <span className={estilos.iconLabel}>Email</span>
                        </a>
                    </div>

                    <div className={estilos.redesSociales}>
                        <a 
                            href="http://instagram.com/envioflores.arg" 
                            className={estilos.icons}
                            aria-label="Visitar Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SiInstagram />
                            <span className={estilos.iconLabel}>Instagram</span>
                        </a>
                    </div>

                    <div className={estilos.redesSociales}>
                        <a 
                            href="http://facebook.com/envioflores" 
                            className={estilos.icons}
                            aria-label="Visitar Facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ImFacebook2 />
                            <span className={estilos.iconLabel}>Facebook</span>
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Contenido principal de contacto */}
            <div className={estilos.mainContent}>
                {/* Información de contacto */}
                <div className={estilos.contactInfo}>
                    <h2 className={estilos.contactTitle}>Contacto</h2>
                    <p className={estilos.contactDesc}>
                        Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios:
                    </p>
                    
                    <div className={estilos.infoCard}>
                        <div className={estilos.infoItem}>
                            <FiPhoneCall className={estilos.infoIcon} />
                            <div>
                                <h3>Teléfono</h3>
                                <p>+54 11 4788-9185</p>
                                <span className={estilos.infoDetail}>Lun-Sáb: 9:00-20:00</span>
                            </div>
                        </div>
                        
                        <div className={estilos.infoItem}>
                            <FaWhatsapp className={estilos.infoIcon} />
                            <div>
                                <h3>WhatsApp</h3>
                                <p>+5491165421003</p>
                                <span className={estilos.infoDetail}>Atención 24/7</span>
                            </div>
                        </div>
                        
                        <div className={estilos.infoItem}>
                            <HiOutlineMail className={estilos.infoIcon} />
                            <div>
                                <h3>Email</h3>
                                <p>floreriasargentinas@gmail.com</p>
                                <span className={estilos.infoDetail}>Respuesta en 2 horas</span>
                            </div>
                        </div>
                        
                        <div className={estilos.infoItem}>
                            <IoLocationSharp className={estilos.infoIcon} />
                            <div>
                                <h3>Dirección</h3>
                                <p>Av. Crámer 1915, CABA</p>
                                <span className={estilos.infoDetail}>C1428CTC, Buenos Aires</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mapa de ubicación */}
                    <div className={estilos.mapContainer}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.186411672236!2d-58.45960052031086!3d-34.56630121189851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMzJzU4LjciUyA1OMKwMjcnMzQuNiJX!5e0!3m2!1ses!2sar!4v1624371526792!5m2!1ses!2sar"
                            title="Ubicación de Envio Flores"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className={estilos.map}
                        ></iframe>
                    </div>
                </div>
                
                {/* Formulario de contacto */}
                <div className={estilos.contactForm}>
                    <h2 className={estilos.formTitle}>Envíanos un mensaje</h2>
                    <p className={estilos.formDesc}>
                        Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                    </p>
                    
                    {enviado ? (
                        <div className={estilos.formSuccess}>
                            <svg className={estilos.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className={estilos.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                                <path className={estilos.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                            <p>¡Mensaje enviado correctamente!</p>
                            <p>Te responderemos a la brevedad.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={estilos.form}>
                            <div className={estilos.formGroup}>
                                <label htmlFor="nombre">Nombre Completo *</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ingresa tu nombre"
                                    className={validacion.nombre ? estilos.inputError : ''}
                                />
                                {validacion.nombre && <span className={estilos.errorText}>{validacion.nombre}</span>}
                            </div>
                            
                            <div className={estilos.formRow}>
                                <div className={estilos.formGroup}>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="tucorreo@ejemplo.com"
                                        className={validacion.email ? estilos.inputError : ''}
                                    />
                                    {validacion.email && <span className={estilos.errorText}>{validacion.email}</span>}
                                </div>
                                
                                <div className={estilos.formGroup}>
                                    <label htmlFor="telefono">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        placeholder="+54 11 xxxx xxxx"
                                        className={validacion.telefono ? estilos.inputError : ''}
                                    />
                                    {validacion.telefono && <span className={estilos.errorText}>{validacion.telefono}</span>}
                                </div>
                            </div>
                            
                            <div className={estilos.formGroup}>
                                <label htmlFor="mensaje">Mensaje *</label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    placeholder="¿En qué podemos ayudarte?"
                                    rows="5"
                                    className={validacion.mensaje ? estilos.inputError : ''}
                                ></textarea>
                                {validacion.mensaje && <span className={estilos.errorText}>{validacion.mensaje}</span>}
                            </div>
                            
                            {error && <div className={estilos.formError}>{error}</div>}
                            
                            <button 
                                type="submit" 
                                className={estilos.submitBtn}
                                disabled={enviando}
                            >
                                {enviando ? 'Enviando...' : 'Enviar mensaje'} 
                                {!enviando && <IoMdSend className={estilos.sendIcon} />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            {/* Horarios de atención */}
            <div className={estilos.scheduleSection}>
                <h3>Horarios de atención</h3>
                <div className={estilos.scheduleGrid}>
                    <div className={estilos.scheduleItem}>
                        <span className={estilos.scheduleDay}>Lunes a Viernes</span>
                        <span className={estilos.scheduleHours}>9:00 - 20:00</span>
                    </div>
                    <div className={estilos.scheduleItem}>
                        <span className={estilos.scheduleDay}>Sábados</span>
                        <span className={estilos.scheduleHours}>9:00 - 20:00</span>
                    </div>
                    <div className={estilos.scheduleItem}>
                        <span className={estilos.scheduleDay}>Domingos</span>
                        <span className={estilos.scheduleHours}>Cerrado (WhatsApp disponible)</span>
                    </div>
                    <div className={estilos.scheduleItem}>
                        <span className={estilos.scheduleDay}>WhatsApp</span>
                        <span className={estilos.scheduleHours}>24/7</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacto;