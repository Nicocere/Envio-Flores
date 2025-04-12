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
        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const userDocRef = doc(baseDeDatos, "users", uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.error("No se encontró el usuario en Firestore");
                return null;
            }
        }
    }, [auth.currentUser]);

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
        <div className={`${style.containerPerfil} ${isDarkMode ? style.light : style.dark}`}>
        
            <div className={style.perfilUsuario}>
                <h1>Bienvenido, <strong>{userData?.nombre} {userData?.apellido}</strong></h1>
                <p>Email: {userData?.email}</p>
                <Button variant='outlined' size='small' sx={{ margin: '15px', color: '#fcf5f0', borderColor: '#d4af37', ':hover': { borderColor: '#ffff' } }} onClick={logout}>Cerrar Sesión</Button>
                <Button variant='outlined' size='small' sx={{ margin: '15px', color: '#fcf5f0', borderColor: '#d4af37', ':hover': { borderColor: '#ffff' } }} onClick={handleNavigateToUpdateProfileAdmin}>Editar perfil</Button>
                <h2 style={{ color: '#D4AF37', ':hover': { borderColor: '#ffff', color: isDarkMode ? '#2f1a0f' : '#fff' } }}>¿ Qué deseas hacer ?</h2>
                <div className={style.infoText}>
                    <h4 style={{ color: '#D4AF37' }}>
                    En esta sección, como administrador, puedes realizar diversas acciones para gestionar la tienda en línea:
                    </h4>

                    <ul>
                        <li><strong style={{ color: '#D4AF37' }}>Agregar/Editar Productos:</strong> Aquí puedes añadir nuevos productos o modificar los existentes, incluyendo detalles como nombre, descripción, precio, y más.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Agregar/Editar Adicionales:</strong> Gestiona los productos adicionales que pueden acompañar a los principales, como accesorios o complementos.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Administrar Categorias:</strong> Organiza los productos en diferentes categorías para facilitar la navegación y búsqueda de los clientes.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Editar Banners:</strong> Modifica los banners promocionales que se muestran en la página principal para destacar ofertas o productos especiales.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Administrar Costos:</strong> Ajusta los costos de envío y otros gastos adicionales que puedan aplicarse a los pedidos.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Administrar Direcciones:</strong> Gestiona las direcciones de envío y facturación de los clientes.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Ver todas las ordenes:</strong> Revisa y gestiona todas las órdenes de compra realizadas por los clientes.</li>
                        <li><strong style={{ color: '#D4AF37' }}>Administrar Promociones:</strong> Crea y gestiona promociones y descuentos para atraer más clientes y aumentar las ventas.</li>
                        <li><strong style={{ color: '#D4AF37' }}>¿Cómo vamos este mes?:</strong> Consulta las estadísticas de ventas y rendimiento de la tienda para evaluar el progreso y tomar decisiones informadas.</li>
                    </ul>
                </div>
                <div className={style.divBtns}>
                    <div>
                        <h4>Agregar/Editar Productos</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToAddProds}>Agregar/Editar Productos</Button>
                    </div>
                    <div>
                        <h4>Agregar/Editar Adicionales</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToAddAdicionals}>Agregar/Editar Adicionales</Button>
                    </div>
                    <div>
                        <h4>Administrar Categorias</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToCategory}>Ver Categorias</Button>
                    </div>
                    <div>
                        <h4>Editar Banners</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToBanners}>Administrar Banners</Button>
                    </div>
                    <div>
                        <h4>Administrar Costos</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToGetCosts}>Administrar Costos</Button>
                    </div>
                    <div>
                        <h4>Administrar Direcciones</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToGetDirections}>Administrar Direcciones</Button>
                    </div>
                    <div>
                        <h4>Ver todas las ordenes</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToSeeOrders}>Administrar Ver ordenes</Button>
                    </div>
                    <div>
                        <h4>Administrar Promociones</h4>
                        <Button variant='contained' size='small' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#fff' } }} onClick={handleNavigateToPromotions}>Administrar Promociones</Button>
                    </div>
                    <div>
                        <h4>¿Cómo vamos este mes?</h4>
                        <Button variant='contained' size='large' sx={{ margin: '15px', background: '#D4AF37', ':hover': { border: '1px solid #d4af37', background: isDarkMode ? '#fff' : '#2f1a0f', color: isDarkMode ? '#D4AF37' : '#D4AF37' } }} onClick={handleNavigateToVerComoVamos}>Ver VENTAS</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilUser;