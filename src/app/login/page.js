"use client"

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { auth, baseDeDatos } from '../../admin/FireBaseConfig';
import Swal from 'sweetalert2';
import { doc, getDoc } from 'firebase/firestore';
import style from './login.module.css'
import { Button, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PulseLoader } from 'react-spinners';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme} from '@/context/ThemeSwitchContext';

function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const { isDarkMode } = useTheme();
    const navigate = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(baseDeDatos, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ ...currentUser, ...userDoc.data() });
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        const fieldsFilled = watch('email') && watch('password');
        if (fieldsFilled) {
            setIsLoading(true);
            signInWithEmailAndPassword(auth, data.email, data.password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    const userDoc = await getDoc(doc(baseDeDatos, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().rol === "administrador") {
                        navigate.push('/administrador');
                    } else {
                        navigate.push('/usuario/mi-perfil');
                    }
                })
                .catch(() => {
                    setIsLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuario No encontrado',
                        text: 'Su E-mail o contraseña son incorrectos.',
                    });
                });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Datos Faltantes',
                text: 'Ingrese su E-mail y contraseña.',
            });
        }
    };

    return (
        <div className={style.divLogin}>
            <div className={`${style.divLoginForm} ${isDarkMode ? style.dark : style.light}`}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', fontSize: 'xx-large' }}>
                        <p>Iniciando sesión, aguarde....</p>
                        <PulseLoader color="#d4af37" />
                    </div>
                ) : user ? (
                    <>
                        <h3>Bienvenido de Nuevo, {user.nombre}</h3>
                        <Button size='large' variant='text' className={style.btnRegistro} onClick={() => navigate.push(user.rol === "administrador" ? '/administrador' : '/usuario/mi-perfil')}>
                            Ir a mi Perfil
                        </Button>
                    </>
                ) : (
                    <>
                        <h3>Inicia Sesión</h3>
                        <p>Si deseas ver y tener organizados tus pedidos, inicia sesión aquí.</p>
                        <form className={style.formLogin} onSubmit={handleSubmit(onSubmit)}>
                            <div className={style.inputGroup}>
                                <label>Email</label>
                                <input
                                    {...register("email", { required: true })}
                                    type="text"
                                    placeholder="Ingrese su email..."
                                    name="email"
                                    className={style.inputEmail}
                                    autoComplete="email"
                                />
                                {errors.email && <p className='message-error'>El E-mail es requerido</p>}
                            </div>
                            <div className={style.inputGroup}>
                                <label>Contraseña</label>
                                <div className={style.passwordInputContainer}>
                                    <input
                                        {...register("password", { required: true })}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ingrese la contraseña..."
                                        className={style.inputPassword}
                                        name="password"
                                        autoComplete="current-password"
                                    />
                                    <div className={style.passwordInputWrapper}>
                                        <IconButton onClick={togglePasswordVisibility} className={style.togglePasswordButton} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </div>
                                </div>
                                {errors.password && <p className='message-error'>La contraseña es requerida</p>}
                            </div>
                            <Button size='large' variant='text' className={style.btnRegistro} type="submit">
                                Iniciar Sesión
                            </Button>
                        </form>
                        <p style={{ marginTop: '40px' }}>No estás registrado? <Link href={'/login/registro'}>Regístrate aquí</Link></p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;