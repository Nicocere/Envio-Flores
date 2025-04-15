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
import { IconButton, Tooltip, Badge } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';
import Comentarios from '@/componentes/Comentarios/Comentarios';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import { RiFlowerFill } from 'react-icons/ri';

const CompraFinalizada = React.memo(() => {
    const [newEvent, setNewEvent] = useState(null);
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('comprador');
    const requestSentRef = useRef(false);
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

                    if(initialNewEvent !== null){
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
                                body: JSON.stringify({...initialNewEvent, newCode}),
                            });
                
                            if (!pdfResponse.ok) {
                                throw new Error('Error al generar el PDF');
                            }
            
                            pdfUrl = await pdfResponse.json();
                        } catch (error) {
                            console.error('Error durante la generación del PDF:', error);
                            pdfUrl = { pdfURL: null  };
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
                    // await localforage.removeItem('cart');
                }else{
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
                    
                    <div className={style.orderNumber}>
                        <div className={style.orderNumberLabel}>Número de orden</div>
                        <div className={style.orderNumberValue}>{newEvent.orderNumber || '----'}</div>
                    </div>

                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Fecha de compra:</p>
                        <p className={style.detailValue}>{format(new Date(newEvent?.createdAt), "PPPP 'a las' p", { locale: es })}</p>
                    </div>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Nombre:</p>
                        <p className={style.detailValue}>{newEvent.datosComprador?.nombreComprador} {newEvent.datosComprador?.apellidoComprador}</p>
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
                        <p className={style.detailValue}>{newEvent.datosEnvio.dedicatoria ? newEvent.datosEnvio.dedicatoria : 'Sin dedicatoria'}</p>
                    </div>
                    <div className={style.detailContainer}>
                        <p className={style.detailLabel}>Método de entrega:</p>
                        <p className={style.detailValue}>{newEvent?.retiraEnLocal ? 'Retiro en local' : 'Envío a domicilio'}</p>
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

                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Dirección completa:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio.calle} {newEvent?.datosEnvio.altura}{newEvent.datosEnvio.piso ? `, ${newEvent.datosEnvio.piso}` : ''}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Localidad:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.localidad.name}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Fecha de entrega:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.fecha}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Horario de entrega:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.horario}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Costo de envío:</p>
                                <p className={style.detailValue}>${parseFloat(newEvent?.datosEnvio?.precio_envio).toLocaleString('es-AR')}</p>
                            </div>

                            <h3 className={style.sectionTitle}>Datos del destinatario</h3>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Nombre completo:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.nombreDestinatario} {newEvent.datosEnvio.apellidoDestinatario}</p>
                            </div>
                            <div className={style.detailContainer}>
                                <p className={style.detailLabel}>Teléfono de contacto:</p>
                                <p className={style.detailValue}>{newEvent?.datosEnvio?.phoneDestinatario}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            );
        }
    };

    if (newEvent === null) {
        return (
            <div className={`${style.mainContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
                <div className={style.spinnerBox}>
                    <h3 className={style.infoText}>Lo sentimos, esta página ya no está disponible</h3>
                    <p className={style.infoText}>Vuelve a nuestra página principal para continuar comprando</p>
                    <Link href={'/'} className={style.logoLink}>
                        <Image src={imgLogo} alt="Logo Envío Flores" width={200} height={50} style={{objectFit:'contain'}} />
                    </Link>
                </div>
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={style.ticketContainer}
            >
                <h1 className={style.title}>¡Compra finalizada con éxito!</h1>
                <p className={style.subtitle}>¡Gracias por tu compra, {newEvent.datosComprador?.nombreComprador}!</p>
                <p className={style.subtitleSmall}>Hemos recibido tu pedido y está en proceso</p>
                <p className={style.subtitleSmall}>Pronto recibirás un correo con todos los detalles</p>

                <div className={style.iconContainer}>
                    <Tooltip title="Datos del comprador" arrow placement="top">
                        <IconButton 
                            className={`${style.iconButton} ${activeSection === 'comprador' ? style.active : ''}`}
                            onClick={() => setActiveSection('comprador')}
                        >
                            <FaUser className={style.icon} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Productos comprados" arrow placement="top">
                        <IconButton 
                            className={`${style.iconButton} ${activeSection === 'producto' ? style.active : ''}`}
                            onClick={() => setActiveSection('producto')}
                        >
                            <Badge badgeContent={newEvent.products?.length} color="error">
                                <LocalFloristRoundedIcon className={style.icon} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {newEvent.retiraEnLocal ? (
                        <Tooltip title="Retiro en tienda" arrow placement="top">
                            <IconButton 
                                className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                onClick={() => setActiveSection('envio')}
                            >
                                <FaShop className={style.icon} />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Detalles del envío" arrow placement="top">
                            <IconButton 
                                className={`${style.iconButton} ${activeSection === 'envio' ? style.active : ''}`}
                                onClick={() => setActiveSection('envio')}
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
                    <RiFlowerFill style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    Gracias por confiar en Envío Flores. ¡Esperamos que disfrutes tu compra!
                </p>

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
                    />
                </Link>
            </motion.div>

            <Comentarios datosComprador={newEvent.datosComprador} />
        </div>
    );
});

CompraFinalizada.displayName = 'CompraFinalizada';
export default CompraFinalizada;