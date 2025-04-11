"use client"
import React from 'react';
import style from '@/app/ubicacion/ubicacion.module.css';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp'
import { useTheme } from '@/context/ThemeSwitchContext';

function UbicacionPage() {
    const {isDarkMode} = useTheme();
    return (
        <div className={`${style.divUbicacion} ${!isDarkMode ? style.dark : style.light}`}>

            <h1 className={style.titulo}>Ubicación y Contacto </h1>

            <div className={style.divText}>
                <p>Para contactarse con Florerias Argentinas, usted puede comunicarse
                    telefónicamente <strong className={style.textStrong}>(de Lunes a Domingo de 9 hs a 20 hs) </strong> al 54 (11) 4896-1147 / 4788-9185.</p>
                <p>Tambien puede comunicarse via WhatsApp al
                    <a className={style.linkWhatsapp} href="https://wa.me/1165421003?text=Hola%20EnvioFlores%20,%20quisiera%20hacer%20un%20pedido">
                        <FaWhatsapp className={style.iconWP} />
                        +54 9 (11) 6542 1003   </a> </p>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
                <div className={style.divText}>
                    <p>Puede visitarnos a nuestro local con atención al publico en <strong className={style.textStrong}>
                        Av. Cramer 1915 (Belgrano - CABA)
                        </strong>
                    </p>
                </div>

                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar"
                    title="Ubicación"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
}

export default UbicacionPage;