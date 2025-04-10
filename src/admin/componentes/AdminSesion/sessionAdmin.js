import React from 'react';
import { useEffect, useState } from 'react';
import { auth, baseDeDatos } from '../../FireBaseConfig';
import { doc, getDoc } from "firebase/firestore";
import useLogout from '../Login/LogOut/LogOut';
import { onAuthStateChanged } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';
import './adminSession.css';
import { Helmet } from 'react-helmet';
import { Button, Typography, useMediaQuery } from '@mui/material';

function PerfilUser() {
    const [userData, setUserData] = useState(null);
    const logout = useLogout();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const isSmallScreen = useMediaQuery('(max-width:855px)');

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


    const handleNavigateToUpdateProfileAdmin = () => {
        navigate('/administrador/modificar-perfil');
    } 
    const handleNavigateToAddProds = () => {
        navigate('/administrador/addProds');
    }
    const handleNavigateToAddAdicionals = () => {
        navigate('/administrador/adicionales');
    }
    const handleNavigateToCategory = () => {
        navigate('/administrador/categories');
    }
    const handleNavigateToGetCosts = () => {
        navigate('/administrador/costs');
    }
    const handleNavigateToBanners = () => {
        navigate('/administrador/banners');
    }
    const handleNavigateToGetDirections = () => {
        navigate('/administrador/directions');
    }
    const handleNavigateToSeeOrders = () => {
        navigate('/administrador/orders');
    }

    const handleNavigateToVerComoVamos = () => {
        navigate('/administrador/ventas')
    }

    return (
        <>

            <Helmet>
                <title>Administrador de Envio Flores</title>
            </Helmet>
            {
                userData ? (
                    <div className='perfil-usuario'>
                        <h1>Bienvenido, <strong>{userData.nombre} {userData.apellido}</strong></h1>
                        <p>Email: {userData.email}</p>
                        <p>Estas en tu perfil de:  <strong style={{textTransform:'uppercase', color:'white'}}>
                            {userData.rol}
                            </strong>
                            </p>

                        {/* ... otros detalles del usuario ... */}

                        <Button variant='contained' size='small'  sx={{margin:'15px', background:'white',color:'#670000', borderColor:'red', '&:hover': {color:'white', background: '#a70000' }}}  onClick={logout}>Cerrar Sesión</Button>
                        <Button variant='contained' size='small' color='success'  sx={{margin:'15px'}} onClick={handleNavigateToUpdateProfileAdmin}>Editar perfil</Button>

                        <Typography variant={isSmallScreen ? 'h5' : 'h2'} sx={{color:'white', fontFamily:'Jost, sans-serif', margin:'20px 0'}}>¿ Qué deseas hacer ?</Typography>

                        <div className='div-btns'>
                            <div>
                                <h4>Agregar/Editar Productos</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToAddProds}>Agregar/Editar Productos</Button>
                            </div>

                            <div>
                                <h4>Agregar/Editar Adicionales</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToAddAdicionals}>Agregar/Editar Adicionales</Button>
                            </div>

                            <div>
                                <h4>Administrar Categorias</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToCategory}>Ver Categorias</Button>
                            </div>

                            <div>
                                <h4>Editar Banners</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToBanners}>Administrar Banners</Button>
                            </div>
                            <div>
                                <h4>Administrar Costos</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToGetCosts}>Administrar Costos</Button>
                            </div>

                            <div>
                                <h4>Administrar Direcciones</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToGetDirections}>Administrar Direcciones</Button>
                            </div>

                            <div>
                                <h4>Ver todas las ordenes</h4>
                                <Button variant='contained' size='small' sx={{background:'#670000', '&:hover': { background: '#a70000' }}} onClick={handleNavigateToSeeOrders}>Administrar Ver ordenes</Button>
                            </div>


                            <div>
                                <h4>¿Cómo vamos este mes?</h4>
                                <Button variant='contained' size='medium' color='success' onClick={handleNavigateToVerComoVamos}>Ver VENTAS</Button>
                            </div>

                        </div>
                        {/* <button>Cambiar / Crear Promociones </button> */}
                    </div>
                ) : (
                    <div className='perfil-usuario'>Cargando...</div>
                )
            }
        </>
    );
}

export default PerfilUser;
