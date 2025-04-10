import React from 'react';
import estilos from './Contacto.module.css'
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram'
import { ImFacebook2 } from '@react-icons/all-files/im/ImFacebook2'
import { HiOutlineMail } from '@react-icons/all-files/hi/HiOutlineMail'
import { FiPhoneCall } from '@react-icons/all-files/fi/FiPhoneCall'
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';

const Contacto = () => {

    return (
        <>
            <div className={estilos.navTop}>

                {/* <div className={estilos.divContacto}>


                    <div className={estilos.contactoMail}>

                        <a href="mailto:regalosflores25@gmail.com" className={estilos.contacto} > <HiOutlineMail /> Regalosflores25@gmail.com </a>

                    </div>

                    <div className={estilos.direc} >
                        <a href='https://g.page/floresexpres?share' className={estilos.dir} >Av.Cramer 1915</a>

                    </div>

                </div> */}

                <div className={estilos.divContactoIconsRedes}>
                    
                    <div className={estilos.redesSociales}>
                        <a href="tel:+54 9 11 4788 9185" className={estilos.icons} ><FiPhoneCall /></a>

                    </div>
                    <div className={estilos.redesSociales}>

                        <a className={estilos.icons} href="https://wa.me/+5491165421003?text=Hola%20EnvioFlores%20,%20Quisiera%20hacer%20un%20pedido!">
                            
                            <FaWhatsapp  />
                        </a>
                    </div>

                    <div className={estilos.redesSociales}>
                        <a href="http://instagram.com/aflorar.arg" className={estilos.icons} > <SiInstagram /></a>

                    </div>

                    <div className={estilos.redesSociales}>
                        <a href="http://facebook.com/flores.aflorar" className={estilos.icons} >  <ImFacebook2 /> </a>

                    </div>
                </div>

            </div>

        </>
    );
};

export default Contacto;