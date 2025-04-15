"use client"
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import useLogout from '../../login/logout/page';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { baseDeDatos, auth } from '@/admin/FireBaseConfig';
import { PulseLoader } from 'react-spinners';
import { FaShoppingCart, FaHeart, FaGift, FaCreditCard, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import style from './pageUsuarios.module.css';
import Swal from 'sweetalert2';

function PerfilUser() {
    const [userData, setUserData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [hasMissingInfo, setHasMissingInfo] = useState(false);

    const logout = useLogout();
    const navigate = useRouter();

    const checkMissingInformation = (data) => {
        const requiredFields = {
            nombre: 'Nombre',
            apellido: 'Apellido',
            email: 'Email',
            tel: 'Teléfono',
        };

        const missingFields = [];
        Object.entries(requiredFields).forEach(([key, label]) => {
            if (!data[key] || data[key].trim() === '') {
                missingFields.push(label);
            }
        });

        return missingFields;
    };

    const showMissingInfoAlert = (missingFields) => {
        Swal.fire({
            title: 'Información Incompleta',
            html: `
                <div style="text-align: left;">
                    <p>Para poder agendar sesiones, necesitamos que completes la siguiente información:</p>
                    <ul style="list-style-type: none; padding-left: 0;">
                        ${missingFields.map(field => `<li>• ${field}</li>`).join('')}
                    </ul>
                    <p>Esta información es importante para brindarte el mejor servicio posible.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Completar información',
            cancelButtonText: 'Más tarde',
            confirmButtonColor: '#6d1919',
            cancelButtonColor: '#986c62',
            customClass: {
                popup: style.swalPopup,
                confirmButton: style.swalConfirmButton,
            }
        }).then((result) => {
            if (result.isConfirmed) {
                navigate.push(`/usuario/mi-perfil/${currentUser.uid}`);
            }
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const fetchData = async () => {
                    if (auth.currentUser) {
                        const uid = auth.currentUser.uid;
                        const userDocRef = doc(baseDeDatos, "users", uid);
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            setUserData(data);
                            const missingFields = checkMissingInformation(data);
                            if (missingFields.length > 0) {
                                setHasMissingInfo(true);
                                showMissingInfoAlert(missingFields);
                            }
                        } else {
                            console.error("No se encontró el usuario en Firestore");
                        }
                    }
                };
                fetchData();
            } else {
                setCurrentUser(null);
                navigate.push('/login', { replace: true });
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleNavigation = (path) => {
        navigate.push(path);
    };

    return (
        <div className={style.perfil}>
            <h2 className={style.title}>Perfil de Usuario</h2>

            <div className={style.container}>
                {
                    userData ? (
                        <div className={style.perfilUsuario}>
                            <h1 className={style.textoh1}>Bienvenido, <strong>{userData.nombre} {userData.apellido}</strong></h1>
                            <p style={{ textTransform: 'uppercase' }}>{userData.rol}</p>

                            {hasMissingInfo && (
                                <div className={style.warningBanner}>
                                    <p>⚠️ Hay información importante pendiente en tu perfil</p>
                                    <Button
                                        onClick={() => navigate.push(`/usuario/mi-perfil/${currentUser.uid}`)}
                                        sx={{
                                            color: '#6d1919',
                                            '&:hover': {
                                                backgroundColor: 'rgba(109, 25, 25, 0.1)'
                                            }
                                        }}
                                    >
                                        Completar información
                                    </Button>
                                </div>
                            )}

                            <Button onClick={logout} color='error' sx={{ color: '#6d1919', margin: '20px' }}>Cerrar Sesión</Button>

                            <h1 className={style.textoh1}>¿Qué deseas hacer?</h1>

                            <div className={style.divBtns}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={style.section}
                                    onClick={() => handleNavigation('/usuario/gestion-pedidos')}
                                >
                                    <FaShoppingCart className={style.icon} />
                                    <h3>Tus Compras</h3>
                                    <p>Historial de compras, estado del pedido, repetir pedido.</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={style.section}
                                    onClick={() => handleNavigation('/usuario/personalizacion-experiencia')}
                                >
                                    <FaHeart className={style.icon} />
                                    <h3>Lista de Deseos</h3>
                                    <p>Lista de deseos, recomendaciones, recordatorios, programa de fidelización.</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={style.section}
                                    onClick={() => handleNavigation('/usuario/gestion-regalos')}
                                >
                                    <FaGift className={style.icon} />
                                    <h3>Gestión de Regalos</h3>
                                    <p>Agenda de fechas especiales, personalización, direcciones guardadas.</p>
                                </motion.div>

                                {/* <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={style.section}
                                    onClick={() => handleNavigation('/usuario/pagos-beneficios')}
                                >
                                    <FaCreditCard className={style.icon} />
                                    <h3>Pagos y Beneficios</h3>
                                    <p>Métodos de pago guardados, cupones, facturación y comprobantes.</p>
                                </motion.div> */}

                                {/* <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={style.section}
                                    onClick={() => handleNavigation('/usuario/soporte-configuracion')}
                                >
                                    <FaCog className={style.icon} />
                                    <h3>Soporte y Configuración</h3>
                                    <p>Centro de ayuda, gestión de datos personales.</p>
                                </motion.div> */}
                            </div>
                        </div>
                    ) : (
                        <div className={style.perfilUsuario} style={{ minHeight: '50vh' }}>
                            <p className={style.textCargando} >
                                Cargando, aguarde...
                            </p>
                            <PulseLoader color="#986c62" cssOverride={{}}
                                height={50}
                                loading
                                margin={3}
                                radius={3}
                                width={8} />
                        </div>
                    )
                }
            </div>
        
        </div>
    );
}

export default PerfilUser;