import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { onAuthStateChanged } from '@firebase/auth';
import { Button, TextField, Typography, } from '@mui/material';
import './modificarAdmin.css'
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, } from 'firebase/firestore';
import { auth, baseDeDatos } from '../../../FireBaseConfig';

function ModificarPerfilAdministrador() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const navigate = useRouter();

    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [modifyPassword, setModifyPassword] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const fetchData = async () => {
                    if (auth.currentUser) {
                        const uid = auth.currentUser.uid;
                        const userDocRef = doc(baseDeDatos, 'users', uid);
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            setUserData(userDoc.data());
                            setValue('username', userDoc.data().username);
                            setValue('nombreUser', userDoc.data().nombre);
                            setValue('apellidoUser', userDoc.data().apellido);
                            setValue('telUser', userDoc.data().tel || '');
                            setValue('email', userDoc.data().email);
                        } else {
                            console.error('No se encontró el usuario en Firestore');
                        }
                    }
                };
                fetchData();
            } else {
                setCurrentUser(null);
                navigate('/login', { replace: true });
            }
        });

        return () => unsubscribe();
    }, [navigate, setValue]);

    const onSubmit = async (data) => {
        try {
            if (data.email !== currentUser.email) {
                await updateEmail(currentUser, data.email);
            }

            if (data.password && modifyPassword) {
                await updatePassword(currentUser, data.password);
            }

            const userDocRef = doc(baseDeDatos, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                username: data.username,
                nombre: data.nombreUser,
                apellido: data.apellidoUser,
                tel: data.telUser || null,
            });

            Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado',
                text: 'Tu perfil ha sido actualizado con éxito.',
            });

            navigate('/usuario/mi-perfil');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un problema actualizando el perfil: ${error.message}`,
            });
        }
    };

    return (
        <>
            <div className='perfil-usuario-btns'>
                <Button color='error' variant='contained' size='small' onClick={() => navigate.back()}>Volver atrás</Button>

            </div>

            <div className="updateProfile-div">
            
                <h2>Modifica tu cuenta</h2>

                {
                    (userData && userData.rol === 'administrador') && <Typography variant='h5'> Eres el Administrador </Typography>
                }

                <form onSubmit={handleSubmit(onSubmit)} className="form-registro">
                    <Typography sx={{ textAlign: 'left', marginTop: '15px', fontWeight: '700' }}>
                        Nombre de Usuario:
                        <TextField
                            {...register('username', { required: true })}
                            type="text"
                            name="username"
                            variant="filled"
                            className="input-username"
                            fullWidth
                            sx={{ background: 'rgba(255, 255, 255, 0.5)' }}
                        />
                    </Typography>
                    {errors.username && <p className="message-error"> Su nombre de usuario es requerido</p>}

                    <Typography sx={{ textAlign: 'left', marginTop: '15px', fontWeight: '700' }}>
                        Nombre:
                        <TextField
                            {...register('nombreUser', { required: true })}
                            type="text"
                            name="nombreUser"
                            variant="filled"
                            className="input-nombreUser"
                            fullWidth
                            sx={{}}
                        />
                    </Typography>
                    {errors.nombreUser && <p className="message-error"> Su nombre es requerido</p>}

                    <Typography sx={{ textAlign: 'left', marginTop: '15px', fontWeight: '700' }}>
                        Apellido:
                        <TextField
                            {...register('apellidoUser', { required: true })}
                            type="text"
                            name="apellidoUser"
                            variant="filled"
                            className="input-apellidoUser"
                            fullWidth
                            sx={{}}
                        />
                    </Typography>
                    {errors.apellidoUser && <p className="message-error">Su apellido es requerido</p>}

                    <Typography sx={{ textAlign: 'left', marginTop: '15px', fontWeight: '700' }}>
                        Teléfono (Opcional):
                        <TextField
                            {...register('telUser')}
                            type="text"
                            name="telUser"
                            variant="filled"
                            className="input-telUser"
                            fullWidth
                            sx={{}}
                        />
                    </Typography>

                    <Typography sx={{ textAlign: 'left', marginTop: '15px', fontWeight: '700' }}>
                        Tu E-mail:
                        <TextField
                            {...register('email', { required: true })}
                            type="text"
                            name="email"
                            variant="filled"
                            className="input-email"
                            fullWidth
                            sx={{}}
                        />
                    </Typography>
                    {errors.email && <p className="message-error">El email es requerido</p>}

                    {modifyPassword &&
                        <>
                            <Typography sx={{ textAlign: 'left', marginTop: '15px', fontWeight: '700' }}>
                                Contraseña: (Minimo 6 digitos)
                                <TextField
                                    {...register('password')}
                                    type="password"
                                    variant="filled"
                                    placeholder="Deja en blanco si no deseas cambiar"
                                    className="input-password"
                                    name="password"
                                    label="Contraseña"
                                    fullWidth
                                    sx={{}}
                                    disabled={!modifyPassword}
                                />
                            </Typography>
                            {errors.password && <p className="message-error">La contraseña es requerida</p>}

                            <Typography sx={{ textAlign: 'left', marginTop: '15px' }}>
                                Repetir contraseña:
                                <TextField
                                    {...register('validatePassword')}
                                    type="password"
                                    variant="filled"
                                    placeholder="Repite tu contraseña..."
                                    name="validatePassword"
                                    label="Repetir Contraseña"
                                    className="input-password"
                                    fullWidth
                                    sx={{}}
                                    disabled={!modifyPassword}
                                />
                            </Typography>
                            {watch('validatePassword') !== watch('password') && modifyPassword && (
                                <p className="message-error">Las contraseñas no coinciden</p>
                            )}
                        </>
                    }
                    {
                        modifyPassword ? <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{ margin: '6px', fontSize: '14px', marginTop: '20px' }}
                            onClick={() => setModifyPassword(!modifyPassword)}
                        >
                            Cerrar
                        </Button> :

                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ margin: '6px', fontSize: '14px', marginTop: '20px' }}
                                onClick={() => setModifyPassword(!modifyPassword)}
                            >
                                Modificar Contraseña
                            </Button>

                    }
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ margin: '10px', fontSize: '14px', marginTop: '25px' }}
                        className="btn-registro"
                        type="submit"
                    >
                        Modificar
                    </Button>
                </form>
            </div>
        </>
    );
}

export default ModificarPerfilAdministrador;
