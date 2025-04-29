"use client"

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import style from './promosBanner.module.css';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeSwitchContext';
import PantallaContador from '@/componentes/PantallaPromocion/PantallaContador';
import Swal from 'sweetalert2';
import localforage from 'localforage';


const PromosHomeBanner = () => {
    const [promociones, setPromociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();
    const [selectedPromo, setSelectedPromo] = useState(null);

    useEffect(() => {
        const fetchPromociones = async () => {
            try {
                const q = query(
                    collection(baseDeDatos, 'pantallasPromocionales'),
                    where('status', '==', true),
                    where('show', '==', true)
                );

                const querySnapshot = await getDocs(q);
                const promos = [];
                querySnapshot.forEach((doc) => {
                    promos.push({ id: doc.id, ...doc.data() });
                });
                setPromociones(promos);
            } catch (error) {
                console.error("Error fetching promociones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromociones();
    }, []);

    const handlePromoClick = async (promo) => {

        const emailPromocion = await localforage.getItem('emailPromocion');

        if (emailPromocion) {
            await Swal.fire({
                icon: 'info',
                title: '¡Promoción activada!',
                text: 'Ya tienes esta promoción disponible',
                confirmButtonColor: '#670000',
                background: isDarkMode ? '#670000' : '#FAF3EB',
                color: isDarkMode ? '#FAF3EB' : '#670000',
                iconColor: '#670000'
            });
            return;
        } else {
            const { value: email } = await Swal.fire({
                title: promo.nombre,
                html: `
        <div style="text-align: left">
          <p><strong>Descripción:</strong> ${promo.descripcion}</p>
          <p><strong>Válido hasta:</strong> ${new Date(promo.validoHasta).toLocaleDateString()}</p>
          <p>Para obtener esta promoción, ingresa tu email:</p>
        </div>
      `,
                input: 'email',
                inputPlaceholder: 'Ingresa tu email',
                showCancelButton: true,
                confirmButtonText: 'Obtener promoción',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#670000',
                background: isDarkMode ? '#670000' : '#FAF3EB',
                color: isDarkMode ? '#FAF3EB' : '#670000',
                customClass: {
                    popup: 'swal-custom-popup',
                    confirmButton: 'swal-custom-confirm',
                    cancelButton: 'swal-custom-cancel'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                preConfirm: (email) => {
                    if (!email) {
                        Swal.showValidationMessage('Por favor ingresa un email válido');
                    }
                    return email;
                }
            });

            if (email) {
                try {
                    await localforage.setItem('emailPromocion', email);


                    await Swal.fire({
                        icon: 'success',
                        title: '¡Promoción guardada!',
                        text: 'La promoción ahora está disponible para ti',
                        confirmButtonColor: '#670000',
                        background: isDarkMode ? '#670000' : '#FAF3EB',
                        color: isDarkMode ? '#FAF3EB' : '#670000'
                    });
                } catch (error) {
                    console.error('Error saving email:', error);
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Hubo un error al guardar tu email',
                        confirmButtonColor: '#670000',
                        background: isDarkMode ? '#670000' : '#FAF3EB',
                        color: isDarkMode ? '#FAF3EB' : '#670000'
                    });
                }
            }
        };
    }
    const whatsappMessage = encodeURIComponent("Hola Envio Flores, me contacto por que quería solicitar información sobre descuentos para eventos especiales...");
    const whatsappUrl = `https://wa.me/5491148961147?text=${whatsappMessage}`;

    return (
        <motion.div
            className={style.promotionsSection} style={{ color: isDarkMode ? '#FAF3EB' : '#670000', }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.h1
                style={{
                    color: '#670000',
                    marginTop: '3rem',
                    background: 'linear-gradient(90deg, #670000 0%, #FFF 50%, #670000 100%)',
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem'
                }}
                animate={{
                    backgroundPosition: ['0% 50%', '200% 50%'],
                    scale: [1, 1.02, 1]
                }}
                transition={{
                    backgroundPosition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                    },
                    scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }
                }}
            >
                Promociones Especiales para Ti
            </motion.h1>

            {loading ? (
                <div>Cargando promociones...</div>
            ) : promociones.length > 0 ? (
                <div className={style.promotionsGrid} style={{ background: !isDarkMode ? '#0c0402' : '#670000' }} >
                    {promociones.map((promo) => (
                        <motion.div
                            key={promo.id}
                            className={style.promoCard}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.5 }}

                        >
                            <div className={style.promoContent}>

                                <h1 className={style.promoTag}>{promo.nombre}</h1>
                                <h3 style={{ color: isDarkMode ? '#FAF3EB' : '#670000' }}>
                                    {promo.descripcion}
                                </h3>
                                <p style={{ color: isDarkMode ? '#FAF3EB' : '#670000' }}>
                                    La promoción termina en:
                                </p>
                                <PantallaContador validoHasta={promo.validoHasta} />
                                <motion.button
                                    className={style.promoButton}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePromoClick(promo)}

                                >
                                    Ver Oferta
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className={style.noPromos}>
                    <h3>Aún no hay promociones disponibles</h3>
                    <p>¡Vuelve pronto para ver nuestras ofertas especiales!</p>
                </div>
            )}

            <motion.div
                className={style.specialOffer}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0
                }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100
                }}
                whileHover={{
                    scale: 1.02,
                    rotateX: 5,
                    boxShadow: "0 20px 30px rgba(0,0,0,0.15)"
                }}
            >
                <motion.h3
                    style={{ color: '#670000' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    ¿Planeas una fecha especial?
                </motion.h3>
                <motion.p
                    style={{ color: isDarkMode ? '#0c0402' : '#FAF3EB' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Contáctanos para descuentos en eventos y celebraciones
                </motion.p>
                <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style.contactButton}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 5px 15px rgba(212, 175, 55, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.7,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 400,
                        damping: 10
                    }}
                >
                    Consultar Descuentos
                </motion.a>
            </motion.div>
        </motion.div>
    );
};

export default PromosHomeBanner;