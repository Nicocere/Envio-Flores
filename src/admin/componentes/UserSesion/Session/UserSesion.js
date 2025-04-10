import React from 'react';
import { useEffect, useState } from 'react';
import { auth, baseDeDatos } from '../../../FireBaseConfig';
import { doc, getDoc } from "firebase/firestore";
import useLogout from '../../Login/LogOut/LogOut';
import { onAuthStateChanged } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@mui/material';

function UserSession() {
    const logout = useLogout();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);

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
                            setUserData(userDoc.data());
                        } else {
                            console.error("No se encontró el usuario en Firestore");
                        }
                    }
                };
                fetchData();
            } else {
                setCurrentUser(null);
                // Si no hay usuario autenticado, redirigir a /login
                navigate('/login', { replace: true });
            }
        });

        // Limpiar el observador cuando el componente se desmonte
        return () => unsubscribe();
    }, [navigate]);

    const handleNavigateToAddProds = () => {
        navigate('/user/buys');
    }
    const handleNavigateToUserProfile = () => {
        navigate('/user/see/profile');
    }

    return (
        <>

            <Helmet>
                {userData ?
                    <title>Perfil de {userData.username} en Envio Flores</title>
                    :
                    <title>Perfil de Usuario en Envio Flores</title>
                }
            </Helmet>
            {
                userData ? (
                    <div className='perfil-usuario'>
                        <h1>Bienvenido, <strong>{userData.nombre} {userData.apellido}</strong></h1>
                        <p>Ingresaste con el e-mail:  {userData.email}</p>
        
                        <h2>¿Qué deseas hacer?</h2>
                        <Button variant='contained' size='small' color='error' onClick={logout}>Cerrar Sesión</Button>

                        <div className='div-btns'>
                            <div>
                                <h4>Ver mis compras</h4>
                                <Button variant='contained' size='small' color='error' onClick={handleNavigateToAddProds}>
                                    ver compras
                                </Button>
                            </div>

                            <div>
                                <h4>Ver / Modificar mi perfil</h4>
                                <Button variant='contained' size='small' color='error' onClick={handleNavigateToUserProfile}>
                                    Ver mi perfil
                                </Button>
                            </div>


                        </div>
                    </div>
                ) : (
                    <div className='perfil-usuario'>Cargando...</div>
                )
            }
        </>
    );
}

export default UserSession;
