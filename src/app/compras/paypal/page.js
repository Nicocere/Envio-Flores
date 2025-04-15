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

                // Limpiar carrito después de procesar la compra
                await localforage.removeItem('shoppingCart');
                await localforage.removeItem('cart');

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
            const price = product.precio * product.quantity;
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
                                <p className={style.productPrice}>Precio unitario: ${product?.precio || 0}</p>
                                {product?.promocion && product.promocion?.status === true && product?.promocion?.descuento > 0 && (
                                    <>
                                        <p className={style.productDiscount}>
                                            <RiCoupon2Fill style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                            Descuento aplicado: {product?.promocion?.descuento}%
                                        </p>
                                        <p className={style.productSubtotal}>
                                            Subtotal: ${(product?.precio * product?.quantity * (1 - product?.promocion?.descuento / 100)).toFixed(2)}
                                        </p>
                                    </>
                                )}
                                {(!product?.promocion || !product.promocion?.status || product?.promocion?.descuento <= 0) && (
                                    <p className={style.productSubtotal}>
                                        Subtotal: ${((product?.precio || 0) * (product?.quantity || 1)).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        className={style.totalAmount}
                        variants={itemVariants}
                    >
                        Total de la compra: ${newEvent.datosEnvio?.totalPrice || calculateTotal().toFixed(2)}
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
                                <p className={style.detailLabel}>Horario de entrega:</p>
                                <p className={`${style.detailValue} ${style.highlightValue}`}>{newEvent.datosEnvio?.horario || 'No especificado'}</p>
                            </motion.div>

                            <motion.div className={style.detailContainer} variants={itemVariants}>
                                <p className={style.detailLabel}>Costo de envío:</p>
                                <p className={style.detailValue}>${newEvent.datosEnvio?.precio_envio || 0}</p>
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={style.ticketContainer}
            >
                <h1 className={style.title}>¡Compra Finalizada con Éxito!</h1>
                <p className={style.subtitle}>¡Gracias por tu compra, {newEvent.datosComprador?.nombreComprador || 'estimado cliente'}!</p>
                <p className={style.subtitleSmall}>Tu pago mediante PayPal ha sido confirmado y tu pedido está en proceso</p>

                <div className={style.orderNumber}>
                    <p className={style.orderNumberLabel}>Número de Pedido</p>
                    <p className={style.orderNumberValue}>#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                </div>

                <div className={style.iconContainer}>
                    <Tooltip title="Datos del comprador" arrow placement="top">
                        <IconButton
                            className={`${style.iconButton} ${activeSection === 'comprador' ? style.active : ''}`}
                            onClick={() => setActiveSection('comprador')}
                            aria-label="Datos del comprador"
                        >
                            <FaUser className={style.icon} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Productos comprados" arrow placement="top">
                        <IconButton
                            className={`${style.iconButton} ${activeSection === 'producto' ? style.active : ''}`}
                            onClick={() => setActiveSection('producto')}
                            aria-label="Productos comprados"
                        >
                            <Badge badgeContent={newEvent.products?.length || 0} color="error">
                                <LocalFloristRoundedIcon className={style.icon} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {newEvent?.retiraEnLocal ? (
                        <Tooltip title="Retiro en tienda" arrow placement="top">
                            <IconButton
                                className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                onClick={() => setActiveSection('envio')}
                                aria-label="Retiro en tienda"
                            >
                                <FaShop className={style.icon} />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Detalles del envío" arrow placement="top">
                            <IconButton
                                className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                onClick={() => setActiveSection('envio')}
                                aria-label="Detalles del envío"
                            >
                                <FaTruck className={style.icon} />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>

                <AnimatePresence mode='wait'>
                    {renderSection()}
                </AnimatePresence>

                <p className={style.footerText}>
                    {
                        !isMobile && <RiFlowerFill style={{ color: 'var(--compra-accent)', marginRight: '8px' }} />
                    }
                    Gracias por confiar en Envío Flores. ¡Esperamos que disfrutes tu compra!
                </p>

                <Link href={'/'} className={style.logoLink}>
                    <Image
                        src={imgLogo}
                        alt="Logo Envío Flores"
                        width={150}
                        height={40}
                        style={{
                            objectFit: 'contain',
                            margin: '0 auto'
                        }}
                    />
                </Link>
            </motion.div>

            <Comentarios datosComprador={newEvent.datosComprador || {}} />
        </div>
    );
});

CompraPayPalFinalizada.displayName = 'CompraPayPalFinalizada';
export default CompraPayPalFinalizada;