// CompraFinalizada.js
"use client";

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import style from './comprasPayPal.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import localforage from 'localforage';
import { FaUser, FaTruck } from 'react-icons/fa';
import { FaShop } from "react-icons/fa6";
import LocalFloristRoundedIcon from '@mui/icons-material/LocalFloristRounded';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme} from '@/context/ThemeSwitchContext';
import Comentarios from '@/componentes/Comentarios/Comentarios';

const CompraPayPalFinalizada = React.memo(() => {
    const [newEvent, setNewEvent] = useState(null);
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('comprador');
    const imgLogo =
        'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-FloreriasArgentinas-dark.png?alt=media&token=c2ed19ee-c8da-4a7e-a86d-ace4c3bcbcc7';

    useEffect(() => {
        const fetchData = async () => {
            let initialNewEvent = await localforage.getItem('shoppingCart');
            setNewEvent(initialNewEvent);
            setIsLoading(true);

                try {

                    setNewEvent({ ...initialNewEvent, title: 'Compra Finalizada' });
                    await localforage.removeItem('shoppingCart');
                    await localforage.removeItem('cart');
                } catch (error) {
                    console.error('Error al generar el pago:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al generar el pago. Por favor, intenta nuevamente.',
                        icon: 'error',
                        customClass: {
                            popup: style.swalPopup,
                            confirmButton: style.swalConfirmButton,
                        },
                        iconColor: '#986c62',
                    });
                }
            
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (newEvent && newEvent.title === 'Compra Finalizada') {
            setIsLoading(false);
        }
    }, [newEvent]);

    const sectionVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.5, ease: "easeIn" } }
    };

    const renderSection = () => {
        if (activeSection === 'comprador') {
            return (
                <motion.div
                    key="comprador"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={sectionVariants}
                    className={style.section}
                >
                    <h2 className={style.sectionTitle}>Datos del Comprador</h2>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Fecha de la compra:</p>
                        <p className={style.detailValue}>{format(new Date(newEvent?.createdAt), "PPPP 'a las' p", { locale: es })}</p>
                    </div>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Email:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.email}</p>
                    </div>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Teléfono:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.tel_comprador}</p>
                    </div>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Dedicatoria:</p>
                        <p className={style.detailValue} style={{ font: '-webkit-small-control', height: 'auto', maxWidth: '65%', }}>{newEvent.datosEnvio?.dedicatoria ? newEvent.datosEnvio?.dedicatoria : 'Sin dedicatoria'}</p>
                    </div>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Retira en local:</p>
                        <p className={style.detailValue}>{newEvent?.retiraEnLocal ? 'Sí' : 'No'}</p>
                    </div>
                </motion.div>
            );
        } else if (activeSection === 'producto') {
            return (
                <motion.div
                    key="producto"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={sectionVariants}
                    className={style.section}
                >

                    <h2>{newEvent.products.length === 1 ? 'Producto' : 'Productos'}</h2>
                    <p>Total de productos: {newEvent.products.length}</p>
                    {newEvent.products.map((product, index) => (
                        <div key={index} className={style.productCard}>
                            <div className={style.productImageContainer}>
                                <Image src={product?.img} alt={product?.name} className={style.productImage} width={100} height={100} />
                            </div>
                            <div className={style.productDetails}>
                                <p className={style.productName}>Nombre: {product?.name}</p>
                                <p>Cantidad: {product?.quantity}</p>
                                <p className={style.productPrice}>Precio Unitario: ${product?.precio}</p>
                                {product?.promocion && product.promocion?.status === true && product?.promocion?.descuento > 0 && (
                                    <>
                                        <p className={style.productDiscount}>Descuento: {product?.promocion?.descuento}%</p>
                                        <p className={style.productSubtotal}>Subtotal: ${product?.precio * product?.quantity * (1 - product?.promocion?.descuento / 100)}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    <h2>Total de la compra: ${newEvent.datosEnvio?.totalPrice}</h2>

                </motion.div>
            );
        } else if (activeSection === 'envio') {
            return (
                <motion.div
                    key="envio"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={sectionVariants}
                    className={style.section}
                >
                    <h2>{newEvent?.retiraEnLocal ? 'Retiro en Local' : 'Envío a domicilio'}</h2>

                    {newEvent?.retiraEnLocal ? (
                        <div className={style.localContainer}>
                            <p>Usted seleccionó que desea retirar el producto por nuestro local.</p>
                            <p>Puede hacerlo de 7hs - 18hs en Av. Cramer 1915 (Belgrano, CABA)</p>
                            <strong>Selecciono que pasara a retirar el día {newEvent.datosEnvio?.fecha} de {newEvent.datosEnvio?.horario}</strong>
                            <iframe
                                width={'100%'}
                                height={'400'}
                                margin={0}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" title="Ubicación"
                            ></iframe>
                        </div>
                    ) : (
                        <div className={style.localContainer}>
                            <p>Usted seleccionó que desea recibir el producto en su domicilio.</p>
                            <p>Los detalles de su envío son los siguientes:</p>

                            <div className={style.detailContainer}>

                                <p className={style.detailLabel}>Dirección:</p>
                                <p className={style.detailValue}>{newEvent.datosEnvio?.calle} {newEvent.datosEnvio?.altura} {newEvent.datosEnvio?.piso}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Localidad:</p>
                                <p className={style.detailValue}>{newEvent.datosEnvio?.localidad.name}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Fecha de entrega:</p>
                                <p className={style.detailValue}>{newEvent.datosEnvio?.fecha}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Horario de entrega:</p>
                                <p className={style.detailValue}>{newEvent.datosEnvio?.horario}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Costo de envío:</p>
                                <p className={style.detailValue}>${newEvent.datosEnvio?.precio_envio}</p>
                            </div>


                            <h2>Datos del destinatario</h2>
                            <div className={style.localContainer}>
                                <div className={style.detailContainer}>
                                    <p className={style.detailLabel}>Nombre:</p>
                                    <p className={style.detailValue}>{newEvent.datosEnvio?.nombreDestinatario} {newEvent.datosEnvio?.apellidoDestinatario}</p>
                                </div>

                                <div className={style.detailContainer}>
                                    <p className={style.detailLabel}>Teléfono:</p>
                                    <p className={style.detailValue}>{newEvent.datosEnvio?.phoneDestinatario}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            );
        }
    };

    if (newEvent === null) {
        return (
            <div className={`${style.mainContainer} ${!isDarkMode ? style.darkMode : style.lightMode}`}>
                {isLoading && (
                    <div className={style.spinnerBox}>
                        <h3 className={style.infoText}>Lo sentimos, esta página ya no existe.</h3>
                        <p className={style.infoText}>Regresa al inicio para continuar.</p>
                        <Link href={'/'}>
                            <Image src={imgLogo} alt="Logo" width={200} height={50} />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    if (newEvent.title === 'Compra Finalizada') {
        return (
            <div className={`${style.mainContainer} ${!isDarkMode ? style.darkMode : style.lightMode}`}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 0.5 }}
                    className={style.ticketContainer}
                >
                    <h1 className={style.title}>¡Compra Finalizada!</h1>
                    <p className={style.subtitle}>¡Felicidades, {newEvent.datosComprador?.nombreComprador}!</p>
                    <p className={style.subtitleSmall}>Tu compra a través de PayPal se realizó con éxito.</p>
                    <p className={style.subtitleSmall}>A continuación, te mostramos los detalles de tu compra:</p>

                    <div className={style.iconContainer}>
                        <Tooltip title="Datos del Comprador" arrow placement="top-start">
                            <IconButton 
                                className={style.icon}
                                onClick={() => setActiveSection('comprador')}
                            >
                                <FaUser />
                            </IconButton>
                        </Tooltip>
                    
                        <Tooltip title="Productos comprados" arrow placement="top-start">
                            <IconButton 
                                className={style.icon}
                                onClick={() => setActiveSection('producto')}
                            >
                                <LocalFloristRoundedIcon />
                            </IconButton>
                        </Tooltip>
                        {
                            newEvent.retiraEnLocal ?
                                <Tooltip title="Retira en el Local" arrow placement="top-start">
                                    <IconButton 
                                        className={style.icon}
                                        onClick={() => setActiveSection('envio')}
                                    >
                                        <FaShop />
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Datos del envío" arrow placement="top-start">
                                    <IconButton 
                                        className={style.icon}
                                        onClick={() => setActiveSection('envio')}
                                    >
                                        <FaTruck />
                                    </IconButton>
                                </Tooltip>
                        }
                    </div>
                    
                    <AnimatePresence mode='wait'>
                        {renderSection()}
                    </AnimatePresence>

                    <p className={style.footerText}>
                        ¡Gracias por tu compra! En breve recibirás un correo con los detalles.
                    </p>
                    <Link href={'/'} className={style.logoLink}>
                        <Image src={imgLogo} alt="Logo" width={300} height={70} />
                    </Link>
                </motion.div>

                <Comentarios datosComprador={newEvent.datosComprador} />
            </div>
        );
    }

    return (
        <div className={`${style.mainContainer} ${!isDarkMode ? style.darkMode : style.lightMode}`}>
            <div className={style.spinnerBox}>
                <p className={style.infoText}>Procesando tu compra...</p>
                <PulseLoader color="#986c62" height={10} loading margin={3} radius={3} width={6} />
            </div>
        </div>
    );
});

CompraPayPalFinalizada.displayName = 'CompraPayPalFinalizada';


export default CompraPayPalFinalizada;