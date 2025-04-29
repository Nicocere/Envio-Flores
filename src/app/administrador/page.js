"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import style from './adminSession.module.css'
import { useTheme} from '@/context/ThemeSwitchContext';
import useLogout from '../login/logout/page';
import { useAsync } from 'react-use';
import { doc, getDoc } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import { auth } from '@/admin/FireBaseConfig';

function PerfilUser() {
    const logout = useLogout();
    const navigate = useRouter();
    const { isDarkMode } = useTheme();

    const { value: userData, loading, error } = useAsync(async () => {
        if (auth?.currentUser) {
            const uid = auth?.currentUser?.uid;
            const userDocRef = doc(baseDeDatos, "users", uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.error("No se encontró el usuario en Firestore");
                return null;
            }
        }
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error al cargar los datos del usuario</div>;
    }

    const handleNavigateToUpdateProfileAdmin = () => {
        navigate.push('/administrador/modificar-perfil');
    }
    const handleNavigateToAddProds = () => {
        navigate.push('/administrador/add-prods');
    }
    const handleNavigateToAddAdicionals = () => {
        navigate.push('/administrador/adicionales');
    }
    const handleNavigateToCategory = () => {
        navigate.push('/administrador/categorias');
    }
    const handleNavigateToGetCosts = () => {
        navigate.push('/administrador/costos');
    }
    const handleNavigateToBanners = () => {
        navigate.push('/administrador/banners');
    }
    const handleNavigateToGetDirections = () => {
        navigate.push('/administrador/directions');
    }
    const handleNavigateToSeeOrders = () => {
        navigate.push('/administrador/orders');
    }
    const handleNavigateToVerComoVamos = () => {
        navigate.push('/administrador/ventas')
    }
    const handleNavigateToPromotions = () => {
        navigate.push('/administrador/promociones')
    }

    return (
        <div className={`${style.containerPerfil} ${!isDarkMode ? style.light : style.dark}`}>
        
            <div className={style.perfilUsuario}>
                <h1 className={style.welcome}>Bienvenido, <strong className={style.nameUser}>{userData?.nombre} {userData?.apellido}</strong></h1>
                <p className={style.email}>Email: {userData?.email}</p>
                <Button variant='outlined' size='small' sx={{ 
                    margin: '15px', 
                    color: isDarkMode ?  'var(--text-light)' : 'var(--primary-color)' , 
                    borderColor: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', 
                    ':hover': { 
                        borderColor: 'var(--text-light)'
                    } 
                }} onClick={logout}>Cerrar Sesión</Button>
                <Button variant='outlined' size='small' sx={{ 
                    margin: '15px', 
                    color: isDarkMode ? 'var(--text-light)' : 'var(--primary-color)',
                    borderColor: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', 
                    ':hover': { 
                        borderColor: 'var(--text-light)'
                    } 
                }} onClick={handleNavigateToUpdateProfileAdmin}>Editar perfil</Button>
                <h2 style={{ 
                    color: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)' ,
                
                }}>¿ Qué deseas hacer ?</h2>
                <div className={style.infoText}>
                    <h4 >
                    En esta sección, como administrador, puedes realizar diversas acciones para gestionar la tienda en línea:
                    </h4>

                    <ul>
                        <li><strong >Agregar/Editar Productos:</strong> Aquí puedes añadir nuevos productos o modificar los existentes, incluyendo detalles como nombre, descripción, precio, y más.</li>
                        <li><strong >Agregar/Editar Adicionales:</strong> Gestiona los productos adicionales que pueden acompañar a los principales, como accesorios o complementos.</li>
                        <li><strong >Administrar Categorias:</strong> Organiza los productos en diferentes categorías para facilitar la navegación y búsqueda de los clientes.</li>
                        <li><strong >Editar Banners:</strong> Modifica los banners promocionales que se muestran en la página principal para destacar ofertas o productos especiales.</li>
                        <li><strong >Administrar Costos:</strong> Ajusta los costos de envío y otros gastos adicionales que puedan aplicarse a los pedidos.</li>
                        <li><strong >Administrar Direcciones:</strong> Gestiona las direcciones de envío y facturación de los clientes.</li>
                        <li><strong >Ver todas las ordenes:</strong> Revisa y gestiona todas las órdenes de compra realizadas por los clientes.</li>
                        <li><strong >Administrar Promociones:</strong> Crea y gestiona promociones y descuentos para atraer más clientes y aumentar las ventas.</li>
                        <li><strong >¿Cómo vamos este mes?:</strong> Consulta las estadísticas de ventas y rendimiento de la tienda para evaluar el progreso y tomar decisiones informadas.</li>
                    </ul>
                </div>
                <div className={style.divBtns}>
                    <div>
                        <h4>Agregar/Editar Productos</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToAddProds}>Agregar/Editar Productos</Button>
                    </div>
                    <div>
                        <h4>Agregar/Editar Adicionales</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToAddAdicionals}>Agregar/Editar Adicionales</Button>
                    </div>
                    <div>
                        <h4>Administrar Categorias</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToCategory}>Ver Categorias</Button>
                    </div>
                    <div>
                        <h4>Editar Banners</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToBanners}>Administrar Banners</Button>
                    </div>
                    <div>
                        <h4>Administrar Costos</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToGetCosts}>Administrar Costos</Button>
                    </div>
                    <div>
                        <h4>Administrar Direcciones</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToGetDirections}>Administrar Direcciones</Button>
                    </div>
                    <div>
                        <h4>Ver todas las ordenes</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToSeeOrders}>Administrar Ver ordenes</Button>
                    </div>
                    <div>
                        <h4>Administrar Promociones</h4>
                        <Button variant='contained' size='small' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: '1px solid var(--accent-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToPromotions}>Administrar Promociones</Button>
                    </div>
                    <div>
                        <h4>¿Cómo vamos este mes?</h4>
                        <Button variant='contained' size='large' sx={{ 
                            margin: '15px', 
                            background: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)', border: '1px solid transparent',
                            ':hover': { 
                                border: isDarkMode ? '1px solid var(--primary-light)' : '1px solid var(--primary-color)', 
                                background: isDarkMode ? 'var(--primary-light-hover)' : 'var(--primary-color-hover)', 
                                
                            } 
                        }} onClick={handleNavigateToVerComoVamos}>Ver VENTAS</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilUser;