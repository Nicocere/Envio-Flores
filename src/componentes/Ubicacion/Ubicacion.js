import React from 'react';
import './ubicacion.css'
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp'
import { Helmet } from 'react-helmet';
import { useTheme } from '../../context/ThemeSwitchContext';


function Ubicacion() {

    const {isDarkMode} = useTheme()

    const className = isDarkMode ? 'dark-mode' : '';
    

    return (
        <div className={`divUbicacion ${className}`}>
            <Helmet>
                <title>Ubicación Envio Flores - Venta y envio de arreglos florales, comestibles, chocolates , bebidas y demás
                    a domicilio en el día
                    a Gran Buenos Aires y Capital Federal</title>
                <meta name="robots" content="index, follow" />
                <meta name="description" content="Envio de flores, rosas, ramos, bombones, regalos 
                    a domicilio en Argentina. Venta online y telefónica. Pagos en efectivo y 
                    con tarjetas de crédito. Entrega inmediata. Delivery en el día en Buenos Aires. Envioflores.com" />
            </Helmet>
            <div className={`divText ${className}`} >
                <p>Para contactarse con Envio Flores, usted puede comunicarse
                    telefónicamente <strong className= {`textStrong ${className}`}>(de Lunes a Domingo de 9 hs a 20 hs) </strong> al 54 (11) 4896-1147 / 4788-9185.</p>
                <p>Tambien puede comunicarse via WhatsApp al
                    <a className={`linkWhatsapp ${className}`} href="https://wa.me/1165421003?text=Hola%20EnvioFlores%20,%20quisiera%20hacer%20un%20pedido">
                        <FaWhatsapp className={`iconWP ${className}`}/>
                        +54 9 (11) 6542 1003   </a> </p>

            </div>

            <div style={{ width: '100%', height: '400px' }}>
                <div className={`divText ${className}`}>

                    <p>Puede visitarnos a nuestro local con atención al publico en Av. Cramer 1915 (Belgrano - CABA)</p>
                </div >

                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" title="Ubicación"
                ></iframe>
            </div>
        </div>
    );
}

export default Ubicacion;
