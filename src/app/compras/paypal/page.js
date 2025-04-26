"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeSwitchContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import localforage from 'localforage';
import { PulseLoader } from 'react-spinners';
import { FaUser, FaShop, FaTruck } from 'react-icons/fa6';
import { RiFlowerFill, RiCoupon2Fill } from 'react-icons/ri';
import { MdOutlineLocalShipping } from 'react-icons/md';
import LocalFloristRoundedIcon from '@mui/icons-material/LocalFloristRounded';
import { Tooltip, IconButton, Badge, useMediaQuery } from '@mui/material';
import Comentarios from '@/componentes/Comentarios/Comentarios';
import style from './comprasPayPal.module.css';
import ConfettiComponent from '@/componentes/Confetti/Confetti';
import { CheckCircle, LocalFloristRounded, ReceiptLong } from '@mui/icons-material';

const CompraPayPalFinalizada = React.memo(() => {
    const [newEvent, setNewEvent] = useState(null);
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('comprador');
    const imgLogo = 'https://firebasestorage.googleapis.com/v0/b/envio-flores.appspot.com/o/logos%2Flogo-envio-flores.png?alt=media&token=182d6496-4444-4a41-ab34-d8f0e571dc23';
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let initialNewEvent = await localforage.getItem('shoppingCart');

                if (!initialNewEvent) {
                    setNewEvent(null);
                    setIsLoading(false);
                    return;
                }

                setNewEvent({ ...initialNewEvent, title: 'Compra Finalizada' });

                // // Limpiar carrito después de procesar la compra
                // await localforage.removeItem('shoppingCart');
                // localStorage.removeItem('c');

            } catch (error) {
                console.error('Error al procesar la compra:', error);
                setNewEvent(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const calculateTotal = () => {
        if (!newEvent?.products) return 0;
        return newEvent.products.reduce((total, product) => {
            const price = (product.precio / newEvent?.dolar) * product.quantity;
            if (product?.promocion?.status && product?.promocion?.descuento > 0) {
                return total + (price * (1 - product.promocion.descuento / 100));
            }
            return total + price;
        }, 0);
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
                    <h2 className={style.sectionTitle}>Información del Comprador</h2>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Fecha de compra:</p>
                        <p className={style.detailValue}>{newEvent?.createdAt ? format(new Date(newEvent?.createdAt || new Date()), "PPPP 'a las' p", { locale: es }) : null}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Nombre:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.nombreComprador || 'No disponible'} {newEvent.datosComprador?.apellidoComprador || ''}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Email:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.email || 'No disponible'}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Teléfono:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.tel_comprador || 'No disponible'}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Dedicatoria:</p>
                        <p className={style.detailValue}>{newEvent.datosEnvio?.dedicatoria || 'Sin dedicatoria'}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Método de entrega:</p>
                        <p className={`${style.detailValue} ${style.highlightValue}`}>{newEvent?.retiraEnLocal ? 'Retiro en tienda' : 'Envío a domicilio'}</p>
                    </motion.div>

                    <motion.div className={style.detailContainer} variants={itemVariants}>
                        <p className={style.detailLabel}>Método de pago:</p>
                        <p className={`${style.detailValue} ${style.highlightValue}`}>PayPal</p>
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
                        {newEvent.products?.length === 1 ? 'Producto Adquirido' : 'Productos Adquiridos'}
                    </h2>

                    <motion.p variants={itemVariants}>
                        Total de productos: <strong>{newEvent.products?.length || 0}</strong>
                    </motion.p>

                    {newEvent.products?.map((product, index) => (
                        <motion.div
                            key={index}
                            className={style.productCard}
                            variants={itemVariants}
                        >
                            <div className={style.productImageContainer}>
                                <Image
                                    src={product?.img || '/placeholder-image.jpg'}
                                    alt={product?.name || 'Producto'}
                                    className={style.productImage}
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <div className={style.productDetails}>
                                <p className={style.productName}>{product?.name || 'Producto'}</p>
                                <p>
                                    Cantidad: {product?.quantity || 1}
                                    <span className={style.productQuantity}>x{product?.quantity || 1}</span>
                                </p>
                                <p className={style.productPrice}>Precio unitario: USD${(product?.precio / newEvent?.dolar || 0).toFixed(2)}</p>
                                {product?.promocion && product.promocion?.status === true && product?.promocion?.descuento > 0 && (
                                    <>
                                        <p className={style.productDiscount}>
                                            <RiCoupon2Fill style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                            Descuento aplicado: {product?.promocion?.descuento}%
                                        </p>
                                        <p className={style.productSubtotal}>
                                            Subtotal: USD${((product?.precio / newEvent?.dolar) * product?.quantity * (1 - product?.promocion?.descuento / 100)).toFixed(2)}
                                        </p>
                                    </>
                                )}
                                {(!product?.promocion || !product.promocion?.status || product?.promocion?.descuento <= 0) && (
                                    <p className={style.productSubtotal}>
                                        Subtotal: USD${(((product?.precio || 0) / newEvent?.dolar) * (product?.quantity || 1)).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        className={style.totalAmount}
                        variants={itemVariants}
                    >
                        Total de la compra: USD${newEvent.datosEnvio?.totalPrice || calculateTotal().toFixed(2)}
                    </motion.div>
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
                        {newEvent?.retiraEnLocal ? 'Información de Retiro en Tienda' : 'Información de Envío'}
                    </h2>

                    {newEvent?.retiraEnLocal ? (
                        <div className={style.localContainer}>
                            <motion.p variants={itemVariants}>
                                Has seleccionado retirar tu pedido personalmente en nuestra tienda.
                            </motion.p>
                            <motion.p variants={itemVariants}>
                                Te esperamos en Av. Cramer 1915, Belgrano, Ciudad Autónoma de Buenos Aires.
                            </motion.p>
                            <motion.p variants={itemVariants}>
                                Horario de atención: lunes a sábados de 7:00 a 18:00 horas.
                            </motion.p>

                            <motion.strong variants={itemVariants}>
                                <MdOutlineLocalShipping style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                Retiro programado para el día {newEvent.datosEnvio?.fecha || 'No especificado'} en el horario de {newEvent.datosEnvio?.horario || 'No especificado'}
                            </motion.strong>

                            <motion.div
                                className={style.mapContainer}
                                variants={itemVariants}
                            >
                                <iframe
                                    width={'100%'}
                                    height={'300'}
                                    loading="lazy"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar"
                                    title="Ubicación"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </motion.div>
                        </div>
                    ) : (
                        <div className={style.localContainer}>
                            <motion.p variants={itemVariants}>
                                Tu pedido será enviado a la dirección que nos proporcionaste.
                            </motion.p>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Dirección:</p>
                                <p className={style.detailValue}>
                                    {newEvent.datosEnvio?.calle || 'No especificada'} {newEvent.datosEnvio?.altura || ''} {newEvent.datosEnvio?.piso ? `- ${newEvent.datosEnvio.piso}` : ''}
                                </p>
                            </motion.div>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Localidad:</p>
                                <p className={style.detailValue}>{newEvent.datosEnvio?.localidad?.name || 'No especificada'}</p>
                            </motion.div>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Fecha de entrega:</p>
                                <p className={`${style.detailValue} ${style.highlightValue}`}>{newEvent.datosEnvio?.fecha || 'No especificada'}</p>
                            </motion.div>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Servicio Premium:</p>
                                <p className={`${style.detailValue} ${style.highlightValue}`}>{newEvent.datosEnvio?.servicioPremium ? 'Sí' : 'No'}</p>
                            </motion.div>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Horario de entrega:</p>
                                <p className={`${style.detailValue} ${style.highlightValue}`}>{newEvent.datosEnvio?.horario || 'No especificado'}</p>
                            </motion.div>

                            {
                                newEvent.datosEnvio?.servicioPremium && (

                                    <motion.div className={style.detailContainer} variants={itemVariants}>

                                        <p className={style.detailLabel}>Costo adicional:</p>
                                        <p className={`${style.detailValue} ${style.highlightValue}`}>USD$ {((newEvent.datosEnvio?.envioPremium || 0) / newEvent?.dolar).toFixed(2)}</p>

                                    </motion.div>
                                )
                            }

                            <motion.div className={style.detailContainer} variants={itemVariants}>

                                <p className={style.detailLabel}>Costo de envío:</p>
                                <p className={`${style.detailValue} ${style.highlightValue}`}>USD$ {((newEvent.datosEnvio?.precio_envio || 0) / newEvent?.dolar).toFixed(2)}</p>

                            </motion.div>

                            <motion.h3
                                variants={itemVariants}
                                style={{
                                    fontSize: 'var(--font-size-lg)',
                                    color: 'var(--compra-accent)',
                                    marginTop: 'var(--spacing-6)',
                                    marginBottom: 'var(--spacing-4)',
                                    textAlign: 'center'
                                }}
                            >
                                Datos del Destinatario
                            </motion.h3>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Nombre completo:</p>
                                <p className={style.detailValue}>
                                    {newEvent.datosEnvio?.nombreDestinatario || 'No especificado'} {newEvent.datosEnvio?.apellidoDestinatario || ''}
                                </p>
                            </motion.div>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Teléfono:</p>
                                <p className={style.detailValue}>{newEvent.datosEnvio?.phoneDestinatario || 'No especificado'}</p>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            );
        }
    };

    if (isLoading) {
        return (
            <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
                <div className={style.spinnerBox}>
                    <p className={style.infoText}>Procesando tu compra...</p>
                    <PulseLoader color="var(--primary-color)" size={10} margin={6} />
                    <p className={style.infoTextSecondary}>Esto tomará solo unos momentos</p>
                </div>
            </div>
        );
    }

    if (newEvent === null) {
        return (
            <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={style.notFoundContainer || style.spinnerBox}
                >
                    <div className={style.notFoundIcon}>
                        <RiFlowerFill style={{ fontSize: '3rem', color: 'var(--primary-color)', opacity: 0.3 }} />
                    </div>
                    <h2 className={style.notFoundTitle || style.infoText}>Información no disponible</h2>
                    <p className={style.notFoundText || style.infoTextSecondary}>
                        Lo sentimos, los detalles de esta compra ya no están disponibles o han caducado.
                    </p>
                    <p className={style.notFoundText || style.infoTextSecondary}>
                        Por motivos de seguridad, la información de los pedidos se muestra solo una vez.
                    </p>
                    <p className={style.notFoundText || style.infoTextSecondary}>
                        Si has realizado una compra recientemente, revisa tu correo electrónico donde encontrarás todos los detalles.
                    </p>

                    <div className={style.notFoundActions}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href={'/'} className={style.primaryButton || style.logoLink}>
                                Volver a la tienda
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ marginTop: '20px' }}
                        >
                            <Link href={'/ubicacion'} className={style.secondaryButton || style.logoLink}>
                                Contactar soporte
                            </Link>
                        </motion.div>
                    </div>

                    <Link href={'/'} className={style.logoLink}>
                        <Image
                            src={imgLogo}
                            alt="Logo Envío Flores"
                            width={120}
                            height={120}
                            style={{ objectFit: 'contain' }}
                        />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
                <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
                {/* Mantenemos el componente Confetti como solicitado */}
                <ConfettiComponent
                    width={typeof window !== 'undefined' ? window.innerWidth : 300}
                    height={typeof window !== 'undefined' ? window.innerHeight : 200}
                    recycle={false}
                    numberOfPieces={isMobile ? 500 : 850}
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
                    whileHover={{ boxShadow: isDarkMode ? '0 12px 35px rgba(0, 0, 0, 0.4)' : '0 12px 35px rgba(0, 0, 0, 0.15)' }}
                >
                    {/* Banner de éxito con destellos animados */}
                    <div className={style.successBanner}>
                        {/* Destellos decorativos */}
                        <div className={style.sparkle} style={{ top: '20%', left: '15%' }}></div>
                        <div className={style.sparkle} style={{ top: '50%', right: '10%' }}></div>
                        <div className={style.sparkle} style={{ bottom: '25%', left: '30%' }}></div>
                        
                        {/* Elementos decorativos de fondo */}
                        <div className={style.decorCircle} style={{ top: '-50px', right: '-30px', opacity: '0.1' }}></div>
                        <div className={style.decorCircle} style={{ bottom: '-70px', left: '-40px', opacity: '0.15' }}></div>
                        
                        <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                delay: 0.3, 
                                duration: 0.8, 
                                type: "spring", 
                                stiffness: 200 
                            }}
                            className={style.successIcon}
                        >
                            <div className={style.checkmarkWrapper}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
                                        d="M20 6L9 17L4 12"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Contenido de la confirmación */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className={style.contentContainer}
                    >
                        <div className={style.paypalBadgeContainer}>
                            <div className={style.paypalBadge}>
                                <span>PayPal</span>
                                <CheckCircle className={style.verifiedIcon} />
                            </div>
                        </div>
                        
                        <motion.h1 
                            className={style.title}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            ¡Gracias por tu compra, {newEvent.datosComprador?.nombreComprador || 'estimado cliente'}!
                        </motion.h1>
                        
                        <motion.p 
                            className={style.subtitleSmall}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                        >
                            Tu pago mediante <strong>PayPal</strong> ha sido confirmado y tu pedido está en proceso
                        </motion.p>
            
                        <motion.div 
                            className={style.orderNumber}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.3, duration: 0.5, type: "spring" }}
                        >
                            <div className={style.orderNumberContent}>
                                <p className={style.orderNumberLabel}>Número de Pedido</p>
                                <p className={style.orderNumberValue}>#{newEvent?.orderNumber}</p>
                            </div>
                            <ReceiptLong className={style.receiptIcon} />
                        </motion.div>
                    </motion.div>
            
                    {/* Tabs de navegación con íconos mejorados */}
                    <motion.div 
                        className={style.iconContainer}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    >
                        <Tooltip title="Datos del comprador" arrow placement="top">
                            <IconButton
                                className={`${style.iconButton} ${activeSection === 'comprador' ? style.active : ''}`}
                                onClick={() => setActiveSection('comprador')}
                                aria-label="Datos del comprador"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={style.iconButtonInner}
                                >
                                    <FaUser className={style.icon} />
                                </motion.div>
                            </IconButton>
                        </Tooltip>
            
                        <Tooltip title="Productos comprados" arrow placement="top">
                            <IconButton
                                className={`${style.iconButton} ${activeSection === 'producto' ? style.active : ''}`}
                                onClick={() => setActiveSection('producto')}
                                aria-label="Productos comprados"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={style.iconButtonInner}
                                >
                                    <Badge 
                                        badgeContent={newEvent.products?.length || 0} 
                                        color="error"
                                        overlap="circular"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.7rem',
                                                minWidth: '20px',
                                                height: '20px',
                                                padding: '0 6px',
                                            }
                                        }}
                                    >
                                        <LocalFloristRounded className={style.icon} />
                                    </Badge>
                                </motion.div>
                            </IconButton>
                        </Tooltip>
            
                        {newEvent?.retiraEnLocal ? (
                            <Tooltip title="Retiro en tienda" arrow placement="top">
                                <IconButton
                                    className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                    onClick={() => setActiveSection('envio')}
                                    aria-label="Retiro en tienda"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={style.iconButtonInner}
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
                                    aria-label="Detalles del envío"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={style.iconButtonInner}
                                    >
                                        <FaTruck className={style.icon} />
                                    </motion.div>
                                </IconButton>
                            </Tooltip>
                        )}
                    </motion.div>
            
                    {/* Contenido dinámico según la pestaña seleccionada */}
                    <div className={style.sectionContent}>
                        <AnimatePresence mode='wait'>
                            {renderSection()}
                        </AnimatePresence>
                    </div>
            
                    {/* Footer mejorado */}
                    <motion.div
                        className={style.footerContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7, duration: 0.7 }}
                    >
                        <div className={style.footerTextContainer}>
                            <RiFlowerFill className={style.footerIcon} />
                            <p className={style.footerText}>
                                Gracias por confiar en Envío Flores. ¡Esperamos que disfrutes tu compra!
                            </p>
                        </div>
            
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className={style.logoContainer}
                        >
                            <Link href={'/'} className={style.logoLink}>
                                <div className={style.logoWrapper}>
                                    <Image
                                        src={imgLogo}
                                        alt="Logo Envío Flores"
                                        width={isMobile ? 100 : 150}
                                        height={isMobile ? 100 : 150}
                                        className={style.logoImage}
                                        style={{
                                            objectFit: 'contain',
                                            margin: '0 auto'
                                        }}
                                    />
                                    <span className={style.logoCaption}>Volver a la tienda</span>
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            
                <Comentarios datosComprador={newEvent.datosComprador || {}} />
            </div>
    );
});

CompraPayPalFinalizada.displayName = 'CompraPayPalFinalizada';
export default CompraPayPalFinalizada;