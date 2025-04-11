"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import style from './adminSession.module.css';
import { FaUser, FaEnvelope, FaClock, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useAsync } from 'react-use';
import { doc, getDoc } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/admin/FireBaseConfig'; // Asegúrate de importar auth correctamente
import useLogout from '../login/logout/page';
import { useThemeContext } from '@/context/ThemeSwitchContext';

export default function RootLayout({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const logout = useLogout();
    const { isDarkMode } = useThemeContext();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const fetchData = async () => {
                    if (auth.currentUser) {
                        const uid = auth.currentUser.uid;
                        const userDocRef = doc(baseDeDatos, "users", uid);
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            setUserData(userDoc.data());
                        } else {
                            console.error("No se encontró el usuario en Firestore");
                        }
                    }
                };
                fetchData();
                setLoading(false);
            } else {
                // Si no hay usuario autenticado, redirigir a /login
                router.push('/login');
            }
        });

        // Limpiar el observador cuando el componente se desmonte
        return () => unsubscribe();
    }, [router]);

    const { value: authUser, loading: authLoading } = useAsync(async () => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (auth.currentUser !== undefined) {
                    clearInterval(interval);
                    resolve(auth.currentUser);
                }
            }, 100);
        });
    }, [auth.currentUser]);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/login');
        } else if (authUser) {
            setLoading(false);
        }
    }, [authLoading, authUser, router]);

    if (loading || authLoading) {
        return (
            <div className={style.loaderContainer}>
                <ClipLoader size={50} color={"#d4af37"} loading={loading || authLoading} />
                <p>Cargando sus datos, aguarde...</p>
            </div>
        );
    }

    const handleSignOut = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <main className={`${style.mainAdmin} ${isDarkMode ? style.dark : style.light}`}>
            {authUser && (
                <div className={style.userInfoContainer}>
                    <div className={style.userHeader}>
                        <div className={style.userAvatar}>
                            <FaUser className={style.userIcon} />
                            <h2>Perfil del Administrador</h2>
                        </div>
                        <button onClick={handleSignOut} className={style.signOutButton}>
                            <FaSignOutAlt className={style.signOutIcon} />
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className={style.userDetails}>
                        <div className={style.infoItem}>
                            <FaEnvelope className={style.icon} />
                            <div>
                                <span className={style.label}>Email:</span>
                                <span className={style.value}>{authUser.email}</span>
                            </div>
                        </div>

                        <div className={style.infoItem}>
                            <FaClock className={style.icon} />
                            <div>
                                <span className={style.label}>Último acceso:</span>
                                <span className={style.value}>
                                    {new Date(authUser.metadata.lastSignInTime).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className={style.infoItem}>
                            <FaCheckCircle className={style.icon} />
                            <div>
                                <span className={style.label}>Estado:</span>
                                <span className={style.value} style={{ textTransform: 'uppercase' }}>{userData?.rol || 'No definido'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {children}
        </main>
    );
}