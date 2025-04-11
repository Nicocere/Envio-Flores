"use client";
import React from 'react';
import { FiPhoneCall, FiMail, FiMapPin, FiClock, FiHeart } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SiMercadopago, SiVisa, SiMastercard, SiPaypal } from 'react-icons/si';
import './footer.css';
import { useTheme } from '../../context/ThemeSwitchContext';
import Link from 'next/link';

const Footer = () => {
    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`footer-container ${className}`}>
            <div className="footer-content">
                <div className="footer-section about">
                    <h3 className="footer-title">Envio Flores</h3>
                    <p className="footer-description">
                        Envío de flores a domicilio en el día a todo CABA (Capital Federal) y Gran Buenos Aires.
                    </p>
                    <p className="footer-description">
                        Florería en línea especializada en la venta y envío de arreglos florales, ramos, canastas, 
                        desayunos, chocolates, peluches y más.
                    </p>
                    <div className="footer-social">
                        <a href="http://facebook.com/flores.aflorar" className="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                        </a>
                        <a href="http://instagram.com/aflorar.arg" className="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/5491147889185" className="social-icon" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>

                <div className="footer-section contact">
                    <h3 className="footer-title">Contáctanos</h3>
                    <ul className="footer-contact-list">
                        <li className="footer-contact-item">
                            <FiPhoneCall className="contact-icon" />
                            <a href="tel:+5491147889185">+54 9 11 4788 9185</a>
                        </li>
                        <li className="footer-contact-item">
                            <FiMail className="contact-icon" />
                            <a href="mailto:ventas@aflorar.com.ar">ventas@aflorar.com.ar</a>
                        </li>
                        <li className="footer-contact-item">
                            <FiMail className="contact-icon" />
                            <a href="mailto:consultas@regalosflores.com.ar">consultas@regalosflores.com.ar</a>
                        </li>
                        <li className="footer-contact-item">
                            <FiMapPin className="contact-icon" />
                            <span>CABA y Gran Buenos Aires</span>
                        </li>
                        <li className="footer-contact-item">
                            <FiClock className="contact-icon" />
                            <span>Lun - Dom: 8:00 - 20:00</span>
                        </li>
                    </ul>
                </div>

                <div className="footer-section links">
                    <h3 className="footer-title">Enlaces Rápidos</h3>
                    <ul className="footer-links-list">
                        <li><Link href="/">Inicio</Link></li>
                        <li><Link href="/productos">Productos</Link></li>
                        <li><Link href="/categoria/Ramos">Ramos</Link></li>
                        <li><Link href="/categoria/Canastas">Canastas</Link></li>
                        <li><Link href="/categoria/Desayunos">Desayunos</Link></li>
                        <li><Link href="/ayuda">Preguntas frecuentes</Link></li>
                        <li><Link href="/ubicacion">Contacto</Link></li>
                    </ul>
                </div>

                <div className="footer-section payment">
                    <h3 className="footer-title">Medios de Pago</h3>
                    <p className="payment-description">
                        Al finalizar la compra puede pagar con Mercado Pago o PayPal 
                        utilizando la tarjeta que prefiera.
                    </p>
                    <div className="payment-icons">
                        <SiVisa className="payment-icon" title="Visa" />
                        <SiMastercard className="payment-icon" title="Mastercard" />
                        <SiMercadopago className="payment-icon" title="Mercado Pago" />
                        <SiPaypal className="payment-icon" title="PayPal" />
                        <img src="../assets/cabal@2x.png" className="payment-img" alt="Cabal" />
                        <img src="../assets/pagofacil@2x.png" className="payment-img" alt="Pago Fácil" />
                        <img src="../assets/banelco@2x.png" className="payment-img" alt="Banelco" />
                    </div>
                </div>
            </div>

            <div className={`footer-bottom ${className}`}>
                <div className="footer-bottom-content">
                    <div className="developer-info">
                    <p>© {currentYear} Envio Flores. Todos los derechos reservados.</p>
                        <p>Desarrollado por 
                            <a className={`developer-link ${className}`} 
                               href="https://www.spaziodigitalsolutions.com/" 
                               target="_blank" 
                               rel="noopener noreferrer">
                                Spazio Digital Solutions
                            </a>
                        </p>
                        </div>

                        <a href="https://www.spaziodigitalsolutions.com/" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="developer-logo-link">
                            <img 
                                src="https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/spazio%2Fspazio-logo2.png?alt=media&token=be0c49c4-aa79-4ef2-a4a8-41dfde34aeaf"
                                alt="Spazio Digital Solutions Logo"
                                className="developer-logo"
                            />
                        </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;