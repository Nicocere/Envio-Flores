"use client";

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import style from './comprasMP.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import localforage from 'localforage';
import { FaUser, FaTruck, FaRegSmile } from 'react-icons/fa';
import { FaShop } from "react-icons/fa6";
import LocalFloristRoundedIcon from '@mui/icons-material/LocalFloristRounded';
import { IconButton, Tooltip, Badge, useMediaQuery } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';
import Comentarios from '@/componentes/Comentarios/Comentarios';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import { RiFlowerFill } from 'react-icons/ri';
import ConfettiComponent from '@/componentes/Confetti/Confetti';
import { useWindowSize } from 'react-use';

const CompraFinalizada = React.memo(() => {
    const [newEvent, setNewEvent] = useState(null);
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('comprador');
    const requestSentRef = useRef(false);
    const isMobileScreen = useMediaQuery('(max-width: 768px)');
    const { width, height } = useWindowSize()
    const imgLogo =
        'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23';

    useEffect(() => {
        const fetchData = async () => {
            let initialNewEvent = await localforage.getItem('shoppingCart');
            setNewEvent(initialNewEvent);
            setIsLoading(true);

            if (!requestSentRef.current) {
                try {
                    requestSentRef.current = true;

                    if (initialNewEvent !== null) {
                        let lastCode = 21000;
                        const ordersCollection = collection(baseDeDatos, 'ordenes-envio-flores');
                        const ordersQuery = query(
                            ordersCollection,
                            orderBy('order_number', 'desc'),
                            limit(1),
                        );
                        const ordersSnapshot = await getDocs(ordersQuery);
                        if (!ordersSnapshot.empty) {
                            const lastOrder = ordersSnapshot.docs[0].data();
                            lastCode = lastOrder.order_number;
                        }

                        const newCode = lastCode + 1;

                        let pdfUrl = { pdfURL: null };

                        try {
                            const pdfResponse = await fetch('/api/pdf-generate', {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ ...initialNewEvent, newCode }),
                            });

                            if (!pdfResponse.ok) {
                                throw new Error('Error al generar el PDF');
                            }

                            pdfUrl = await pdfResponse.json();
                        } catch (error) {
                            console.error('Error durante la generación del PDF:', error);
                            pdfUrl = { pdfURL: null };
                        }


                        await fetch('/api/mercadopago/payment/finish-success', {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ...initialNewEvent, pdfUrl, newCode }),
                        });

                        setNewEvent({ ...initialNewEvent, title: 'Compra Finalizada', orderNumber: newCode });

                        // Mover la eliminación de los items aquí, después de que la solicitud se haya completado correctamente
                        // await localforage.removeItem('shoppingCart');
                        // localStorage.removeItem('c');
                    } else {
                        setNewEvent(null);

                    }
                } catch (error) {
                    console.error('Error al generar el pago:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al procesar tu compra. Por favor, contáctanos para asistencia.',
                        icon: 'error',
                        iconColor: 'var(--primary-color)',
                        confirmButtonColor: 'var(--primary-color)',
                    });
                }
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (newEvent && newEvent?.title === 'Compra Finalizada') {
            setIsLoading(false);
        }
    }, [newEvent]);

    // const sectionVariants = {
    //     hidden: { opacity: 0, x: 50 },
    //     visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    //     exit: { opacity: 0, x: -50, transition: { duration: 0.5, ease: "easeIn" } }
    // };
    const sectionVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
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

                    <div className={style.orderNumber}>
                        <div className={style.orderNumberLabel}>Número de orden</div>
                        <div className={style.orderNumberValue}>{newEvent.orderNumber || '----'}</div>
                    </div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Fecha de compra:</p>
                        <p className={style.detailValue}>{format(new Date(newEvent?.createdAt), "PPPP 'a las' p", { locale: es })}</p>
                    </motion.div>
                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Nombre:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.nombreComprador} {newEvent.datosComprador?.apellidoComprador}</p>
                    </motion.div>
                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Email:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.email}</p>
                    </motion.div>
                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Teléfono:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.tel_comprador}</p>
                    </motion.div>
                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Dedicatoria:</p>
                        <p className={style.detailValue}>{newEvent.datosEnvio.dedicatoria ? newEvent.datosEnvio.dedicatoria : 'Sin dedicatoria'}</p>
                    </motion.div>
                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Método de entrega:</p>
                        <p className={`${style.detailValue} ${style.highlightValue}`}>{newEvent?.retiraEnLocal ? 'Retiro en local' : 'Envío a domicilio'}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Método de pago:</p>
                        <p className={`${style.detailValue} ${style.highlightValue}`}>Mercado Pago </p>
                    </motion.div>
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
                    <h2 className={style.sectionTitle}>
                        {newEvent.products?.length === 1 ? 'Tu producto' : 'Tus productos'}
                    </h2>

                    {newEvent?.products.map((product, index) => (
                        <div key={index} className={style.productCard}>
                            <div className={style.productImageContainer}>
                                <Image src={product?.img} alt={product?.name} className={style.productImage} width={100} height={100} />
                            </div>
                            <div className={style.productDetails}>
                                <p className={style.productName}>
                                    {product?.name}
                                    <span className={style.productQuantity}>x{product?.quantity}</span>
                                </p>
                                <p className={style.productPrice}>Precio unitario: ${product?.precio.toLocaleString('es-AR')}</p>
                                {product?.promocion && product?.promocion?.status === true && product?.promocion?.descuento > 0 && (
                                    <>
                                        <p className={style.productDiscount}>Descuento aplicado: {product?.promocion?.descuento}%</p>
                                        <p className={style.productSubtotal}>
                                            Subtotal: ${(product.precio * product?.quantity * (1 - product?.promocion?.descuento / 100)).toLocaleString('es-AR')}
                                        </p>
                                    </>
                                )}
                                {(!product?.promocion || !product?.promocion?.status) && (
                                    <p className={style.productSubtotal}>
                                        Subtotal: ${(product.precio * product?.quantity).toLocaleString('es-AR')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className={style.totalAmount}>
                        Total: ${parseFloat(newEvent.datosEnvio?.totalPrice).toLocaleString('es-AR')}
                    </div>
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
                    <h2 className={style.sectionTitle}>
                        {newEvent?.retiraEnLocal ? 'Detalles del retiro' : 'Detalles del envío'}
                    </h2>

                    {newEvent?.retiraEnLocal ? (
                        <div className={style.localContainer}>
                            <p>Has elegido retirar tu pedido personalmente en nuestra tienda.</p>
                            <strong>Fecha y hora de retiro seleccionadas:</strong>
                            <p>{newEvent?.datosEnvio?.fecha} en el horario de {newEvent?.datosEnvio.horario}</p>

                            <p>Dirección de nuestro local: Av. Cramer 1915 (Belgrano, CABA)</p>
                            <p>Horario de atención: 7:00 a 18:00 hs</p>

                            <div className={style.mapContainer}>
                                <iframe
                                    width={'100%'}
                                    height={'250'}
                                    style={{ border: 0, display: 'block' }}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar"
                                    title="Ubicación"
                                ></iframe>
                            </div>
                        </div>
                    ) : (
                        <div className={style.localContainer}>
                            <h3 className={style.sectionTitle}>Dirección de entrega</h3>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Dirección completa:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio.calle} {newEvent?.datosEnvio.altura}{newEvent.datosEnvio.piso ? `, ${newEvent.datosEnvio.piso}` : ''}</p>
                            </motion.div>
                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Localidad:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.localidad.name}</p>
                            </motion.div>
                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Fecha de entrega:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.fecha}</p>
                            </motion.div>
                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Horario de entrega:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.horario}</p>
                            </motion.div>
                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Costo de envío:</p>
                                <p className={style.detailValue}>${parseFloat(newEvent?.datosEnvio?.precio_envio).toLocaleString('es-AR')}</p>
                            </motion.div>

                            <h3 className={style.sectionTitle}>Datos del destinatario</h3>
                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Nombre completo:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.nombreDestinatario} {newEvent.datosEnvio.apellidoDestinatario}</p>
                            </motion.div>
                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Teléfono de contacto:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.phoneDestinatario}</p>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            );
        }
    };

    if (newEvent === null) {
        return (
            <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
                <motion.div
                    className={style.notFoundContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={style.notFoundIcon}>
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Círculo base */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut",  }}
                                
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke={isDarkMode ? "#ff6b6b" : "#a70000"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* Ojos tristes */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                                d="M8.5 10C9 8.5 10 8 11 9"
                                stroke={isDarkMode ? "#ff6b6b" : "#a70000"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                                d="M15.5 10C15 8.5 14 8 13 9"
                                stroke={isDarkMode ? "#ff6b6b" : "#a70000"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* Boca triste */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut", delay: 1 }}
                                d="M9 16C10 14.5 14 14.5 15 16"
                                stroke={isDarkMode ? "#ff6b6b" : "#a70000"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* Lágrima izquierda */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2 ,repeat: Infinity , repeatType: "reverse", }}
                                d="M9 11C8.6 12.5 8.4 13.5 9 14.5"
                                stroke={isDarkMode ? "#99ccff" : "#4a99e9"}
                                strokeWidth="1.15"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* Lágrima derecha */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2, repeat: Infinity , repeatType: "reverse",  }}
                                d="M15 11C15.4 12.5 15.6 13.5 15 14.5"
                                stroke={isDarkMode ? "#99ccff" : "#4a99e9"}
                                strokeWidth="1.15"
                                strokeLinecap="round"
                                fill="none"
                            />


                        </svg>
                    </div>

                    <motion.h2
                        className={style.notFoundTitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Esta página ya no está disponible
                    </motion.h2>

                    <motion.p
                        className={style.notFoundMessage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        La información de esta compra ha expirado o ya ha sido procesada.
                    </motion.p>

                    <motion.div
                        className={style.notFoundInfo}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3>¿Qué puede estar pasando?</h3>
                        <ul>
                            <li>Has actualizado una página de confirmación de pedido antiguo</li>
                            <li>La sesión de compra ha expirado</li>
                            <li>El pedido ya fue procesado anteriormente</li>
                            <li>La URL que estás utilizando no es válida</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className={style.notFoundActions}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Link href={'/'} className={style.primaryButton}>
                            Volver a la página principal
                        </Link>
                        <Link href={'/productos'} className={style.secondaryButton}>
                            Ver nuestros productos
                        </Link>
                        <Link href={'/contacto'} className={style.outlineButton}>
                            Contactar con soporte
                        </Link>
                    </motion.div>

                    <div className={style.logoContainer}>
                        <Link href={'/'} className={style.logoLink}>
                            <Image
                                src={imgLogo}
                                alt="Logo Envío Flores"
                                width={100}
                                height={100}
                                style={{ objectFit: 'contain' }}
                                className={style.logoImage}
                            />
                        </Link>
                    </div>
                </motion.div>


            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
                <div className={style.spinnerBox}>
                    <p className={style.infoText}>Estamos procesando tu compra...</p>
                    <PulseLoader color="var(--primary-color)" height={10} loading margin={3} radius={3} width={6} />
                </div>
            </div>
        );
    }

    return (
            <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
            {/* Efecto de confeti para celebrar la compra */}
    
            <ConfettiComponent
    width={width}
    height={height}
        recycle={false}
        numberOfPieces={isMobileScreen ? 500 : 850}
        gravity={0.35}
        colors={['#FFD700', '#FF6B6B', '#4ecdc4', '#8A2BE2', '#FF1493']}
        tweenDuration={8500}
    />
    

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                    duration: 0.8, 
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                }}
                className={style.ticketContainer}
            >
                {/* Banner de éxito en la parte superior */}
                <div className={style.successBanner}>
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            delay: 0.3, 
                            duration: 0.6, 
                            type: "spring", 
                            stiffness: 200 
                        }}
                        className={style.successIcon}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                d="M20 6L9 17L4 12"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.div>
                </div>
        
                <motion.h1 
                    className={style.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    ¡Compra finalizada con éxito!
                </motion.h1>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <p className={style.subtitle}>¡Gracias por tu compra, {newEvent.datosComprador?.nombreComprador}!</p>
                    <div className={style.statusBadge}>
                        <span className={style.statusDot}></span>
                        Pedido en proceso
                    </div>
                    <p className={style.subtitleSmall}>Pronto recibirás un correo con todos los detalles</p>
                </motion.div>
        
                <motion.div 
                    className={style.iconContainer}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Tooltip title="Datos del comprador" arrow placement="top">
                        <IconButton
                            className={`${style.iconButton} ${activeSection === 'comprador' ? style.active : ''}`}
                            onClick={() => setActiveSection('comprador')}
                        >
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaUser className={style.icon} />
                            </motion.div>
                        </IconButton>
                    </Tooltip>
        
                    <Tooltip title="Productos comprados" arrow placement="top">
                        <IconButton
                            className={`${style.iconButton} ${activeSection === 'producto' ? style.active : ''}`}
                            onClick={() => setActiveSection('producto')}
                        >
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Badge 
                                    badgeContent={newEvent.products?.length} 
                                    color="error"
                                    overlap="circular"
                                >
                                    <LocalFloristRoundedIcon className={style.icon} />
                                </Badge>
                            </motion.div>
                        </IconButton>
                    </Tooltip>
        
                    {newEvent.retiraEnLocal ? (
                        <Tooltip title="Retiro en tienda" arrow placement="top">
                            <IconButton
                                className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                onClick={() => setActiveSection('envio')}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaShop className={style.icon} />
                                </motion.div>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Detalles del envío" arrow placement="top">
                            <IconButton
                                className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                onClick={() => setActiveSection('envio')}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaTruck className={style.icon} />
                                </motion.div>
                            </IconButton>
                        </Tooltip>
                    )}
                </motion.div>
        
                <div className={style.contentWrapper}>
                    <AnimatePresence mode='wait'>
                        {renderSection()}
                    </AnimatePresence>
                </div>
        
                <motion.div
                    className={style.footerSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <div className={style.thankYouCard}>
                        <div className={style.flowerIconWrapper}>
                            <RiFlowerFill className={style.flowerIcon} />
                        </div>
                        <p className={style.footerText}>
                            Gracias por confiar en Envío Flores. ¡Esperamos que disfrutes tu compra!
                        </p>
                    </div>
        
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Link href={'/'} className={style.logoLink}>
                            <Image
                                src={imgLogo}
                                alt="Logo Envío Flores"
                                width={150}
                                height={150}
                                style={{
                                    objectFit: 'contain',
                                    margin: '0 auto'
                                }}
                                className={style.logoImage}
                            />
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
            >
                <Comentarios datosComprador={newEvent.datosComprador} />
            </motion.div>
        </div>
    );
});

CompraFinalizada.displayName = 'CompraFinalizada';
export default CompraFinalizada;