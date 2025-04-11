"use client"

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { baseDeDatos, auth } from '@/admin/FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Grid, Card, CardContent, CardMedia, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Favorite, FavoriteBorder, AddShoppingCart, NotificationsActive } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import localforage from 'localforage';
import { useCartContext } from '@/context/CartContext';
import { usePageContext } from '@/context/Context';
import style from './personalizacionExperiencia.module.css';
import Swal from 'sweetalert2';
import ItemCount from '@/componentes/ItemCount/ItemCount';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useThemeContext } from '@/context/ThemeSwitchContext';

function PersonalizacionExperiencia() {
    const [favoritos, setFavoritos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [recordatorios, setRecordatorios] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {isDarkMode} = useThemeContext();
    const { cart, setCart } = useCartContext();
    const { CartID, UserID } = usePageContext();
    const navigate = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                await cargarFavoritos(user.uid);
                await cargarProductos();
                await cargarRecordatorios(user.uid);
            } else {
                navigate.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const cargarFavoritos = async (uid) => {
        try {
            const userDoc = await getDoc(doc(baseDeDatos, 'users', uid));
            if (userDoc.exists()) {
                setFavoritos(userDoc.data().favoritos || []);
            }
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    };

    const cargarProductos = async () => {
        try {
            const productosData = await localforage.getItem('productos');
            const filteredProductos = (productosData || []).filter(producto =>
                !producto.nombre.includes('Corona') &&
                !producto.nombre.includes('Coronas') &&
                !producto.categorias?.includes('Coronas') &&
                !producto.ocasiones?.includes('Funerales') &&
                !producto.ocasiones?.includes('Condolencias')
            );

            setProductos(filteredProductos || []);
            generarRecomendaciones(filteredProductos || []);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const cargarRecordatorios = async (uid) => {
        try {
            const userDoc = await getDoc(doc(baseDeDatos, 'users', uid));
            if (userDoc.exists()) {
                setRecordatorios(userDoc.data().recordatorios || []);
            }
        } catch (error) {
            console.error('Error al cargar recordatorios:', error);
        }
    };

    const toggleFavorito = async (producto) => {
        try {
            const userRef = doc(baseDeDatos, 'users', currentUser.uid);
            const esFavorito = favoritos.some(fav => fav.id === producto.id);

            if (esFavorito) {
                await updateDoc(userRef, {
                    favoritos: arrayRemove(producto)
                });
                setFavoritos(prev => prev.filter(fav => fav.id !== producto.id));
            } else {
                await updateDoc(userRef, {
                    favoritos: arrayUnion(producto)
                });
                setFavoritos(prev => [...prev, producto]);
            }

            Swal.fire({
                icon: esFavorito ? 'info' : 'success',
                title: esFavorito ? 'Eliminado de favoritos' : 'Añadido a favoritos',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error al actualizar favoritos:', error);
        }
    };

    const toggleRecordatorio = async (id) => {
        try {
            const userRef = doc(baseDeDatos, 'users', currentUser.uid);
            const recordatorio = recordatorios.find(r => r.id === id);

            await updateDoc(userRef, {
                recordatorios: arrayUnion({
                    ...recordatorio,
                    activo: !recordatorio.activo
                })
            });

            setRecordatorios(prev => prev.map(r => r.id === id ? { ...r, activo: !r.activo } : r));
        } catch (error) {
            console.error('Error al actualizar recordatorio:', error);
        }
    };



    const agregarAlCarrito = async (producto) => {
        try {
            const cartData = await localforage.getItem('cart') || [];
            const newProduct = {
                ...producto.opciones[0],
                ...producto.name,
                quantity: 1,
                CartID: await CartID,
                UserID: await UserID
            };

            const existingProductIndex = cartData.findIndex(
                item => item.id === producto.id && item.size === producto.size
            );

            if (existingProductIndex !== -1) {
                cartData[existingProductIndex].quantity += 1;
            } else {
                cartData.push(newProduct);
            }

            await localforage.setItem('cart', cartData);
            setCart(cartData);

            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    const generarRecomendaciones = (productos) => {
        if (favoritos.length > 0) {
            // Lógica para generar recomendaciones basadas en favoritos
            const recomendados = productos.filter(producto =>
                !favoritos.some(fav => fav.id === producto.id) &&
                favoritos.some(fav => fav.categoria === producto.categoria)
            ).slice(0, 4);
            setRecomendaciones(recomendados);
        } else {
            // Recomendaciones aleatorias si no hay favoritos
            const recomendados = [...productos]
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);
            setRecomendaciones(recomendados);
        }
    };


    // Añadir el helper de formato
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        // Si es Timestamp de Firestore
        if (fecha?.toDate) {
            return format(fecha.toDate(), "d 'de' MMMM 'de' yyyy", { locale: es });
        }
        // Si es Date normal
        if (fecha instanceof Date) {
            return format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es });
        }
        // Si es timestamp object
        if (fecha.seconds) {
            return format(new Date(fecha.seconds * 1000), "d 'de' MMMM 'de' yyyy", { locale: es });
        }
        return format(new Date(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
    };

    const agregarRecordatorio = async (evento) => {
        try {
            const userRef = doc(baseDeDatos, 'users', currentUser.uid);
            const nuevoRecordatorio = {
                id: Date.now(),
                fecha: evento.fecha,
                descripcion: evento.descripcion,
                activo: true
            };

            await updateDoc(userRef, {
                recordatorios: arrayUnion(nuevoRecordatorio)
            });

            setRecordatorios(prev => [...prev, nuevoRecordatorio]);

            Swal.fire({
                icon: 'success',
                title: 'Recordatorio agregado',
                text: 'Te notificaremos cuando sea el momento',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('Error al agregar recordatorio:', error);
        }
    };

    return (
        <div className={style.personalizacionContainer}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={style.container}
            >
                <div className={style.perfilUsuarioBtns}>
                    <Button variant='text' size='small' color='error' sx={{color: isDarkMode ? 'black' : 'white'}} onClick={() => navigate.back()}>Volver atrás</Button>
                </div>
                <motion.h1 className={style.titulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Personalización y Experiencia
                </motion.h1>

                {/* Sección de Favoritos */}
                <section className={style.seccion}>
                    <motion.h2 className={style.subtitulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        Mis Favoritos
                    </motion.h2>
                    <Grid container spacing={4} sx={{ alignContent: 'stretch', justifyContent: 'center' }}>
                        {favoritos.map((producto) => (
                            <Grid item key={producto.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}

                                >
                                    <Card className={style.productoCard}>
                                        <div className={style.imageContainer}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={producto.opciones[0].img}
                                                alt={producto.nombre}
                                                sx={{ flex: 3 }}
                                            />
                                            <IconButton
                                                className={style.favoriteButton}
                                                onClick={() => toggleFavorito(producto)}
                                                color="error"
                                            >
                                                {favoritos.some(fav => fav.id === producto.id) ?
                                                    <Favorite sx={{ fontSize: 30 }} /> :
                                                    <FavoriteBorder sx={{ fontSize: 30 }} />}
                                            </IconButton>
                                        </div>
                                        <CardContent style={{ flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <h4>
                                                {producto.nombre}
                                            </h4>
                                            <p>
                                                ${producto.opciones[0].precio}
                                            </p>
                                            <div className={style.cardActions}>


                                                <div style={{ padding: 0, display: 'flex', flexDirection: 'column', marginTop: '15px', flex: 1, alignSelf: 'center', justifyContent: 'flex-end' }}>
                                                    {producto.opciones.length > 1 ? (
                                                        <Link href={`/detail/${producto.id}`} className={style.linkProducto}>
                                                            Ver Opciones
                                                        </Link>
                                                    ) : null}

                                                    <ItemCount
                                                        optionId={producto.opciones[0].id}
                                                        optionSize={producto.opciones[0].size}
                                                        optionPrecio={producto.opciones[0].precio}
                                                        optionImg={producto.opciones[0].img}
                                                        optionPromo={producto.promocion}
                                                        item={producto}
                                                        userSession={true}
                                                    />
                                                </div>

                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </section>

                {/* Sección de Recomendaciones */}
                <section className={style.seccion}>
                    <motion.h2 className={style.subtitulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        Recomendados para ti
                    </motion.h2>
                    <Grid container spacing={3} sx={{ alignContent: 'stretch', justifyContent: 'center' }}>
                        {recomendaciones.map((producto) => (
                            <Grid item key={producto.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}

                                >
                                    <Card className={style.productoCard}>
                                        <div className={style.imageContainer}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={producto.opciones[0].img}
                                                alt={producto.nombre}
                                                sx={{ flex: 3 }}
                                            />
                                            <IconButton
                                                className={style.favoriteButton}
                                                onClick={() => toggleFavorito(producto)}
                                                color="error"
                                            >
                                                {favoritos.some(fav => fav.id === producto.id) ?
                                                    <Favorite sx={{ fontSize: 30 }} /> :
                                                    <FavoriteBorder sx={{ fontSize: 30 }} />}
                                            </IconButton>
                                        </div>
                                        <CardContent style={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <h4 >
                                                {producto.nombre}
                                            </h4>
                                            <p>
                                                ${producto.opciones[0].precio}
                                            </p>
                                            <div className={style.cardActions}>

                                                <div style={{ padding: 0, display: 'flex', flexDirection: 'column', marginTop: '15px', flex: 1, alignSelf: 'center', justifyContent: 'flex-end' }}>
                                                    {producto.opciones.length > 1 ? (
                                                        <Link href={`/detail/${producto.id}`} className={style.linkProducto}>
                                                            Ver Opciones
                                                        </Link>
                                                    ) : null}

                                                    <ItemCount
                                                        optionId={producto.opciones[0].id}
                                                        optionSize={producto.opciones[0].size}
                                                        optionPrecio={producto.opciones[0].precio}
                                                        optionImg={producto.opciones[0].img}
                                                        optionPromo={producto.promocion}
                                                        item={producto}
                                                        userSession={true}
                                                    />
                                                </div>

                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </section>

                {/* Sección de Recordatorios */}
                <section className={style.seccion}>
                    <motion.h2 className={style.subtitulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        Mis Recordatorios
                    </motion.h2>
                    <Grid container spacing={3}>
                        {recordatorios.map((recordatorio) => (
                            <Grid item xs={12} sm={6} md={4} key={recordatorio.id}>
                                <Card className={style.recordatorioCard}>
                                    <CardContent>
                                        <h3>
                                            {recordatorio.descripcion}
                                        </h3>
                                        <p>
                                            Fecha: {formatearFecha(recordatorio.fecha)}
                                        </p>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={recordatorio.activo}
                                                    onChange={() => toggleRecordatorio(recordatorio.id)}
                                                    color="primary"
                                                />
                                            }
                                            label="Activo"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<NotificationsActive />}
                                onClick={() => navigate.push('/subscripcion-flores')}
                                className={style.btnAgregarRecordatorio}
                            >
                                ¡Quiero Subscrimirme!
                            </Button>
                        </Grid>
                    </Grid>
                </section>

                {/* seccion de añadir productos a favoritos */}
                <section className={style.seccion}>
                    <motion.h2 className={style.subtitulo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        Añadir productos a favoritos
                    </motion.h2>
                    <Grid container spacing={3} sx={{ alignContent: 'stretch', justifyContent: 'center' }}>
                        {productos.map((producto) => (
                            <Grid item key={producto.id} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                >
                                    <Card className={style.productoCard}>
                                        <div className={style.imageContainer}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={producto.opciones[0].img}
                                                alt={producto.nombre}
                                                sx={{ flex: 3 }}
                                            />
                                            <IconButton
                                                className={style.favoriteButton}
                                                onClick={() => toggleFavorito(producto)}
                                                color="error"
                                            >
                                                {favoritos.some(fav => fav.id === producto.id) ?
                                                    <Favorite sx={{ fontSize: 30 }} /> :
                                                    <FavoriteBorder sx={{ fontSize: 30 }} />}
                                            </IconButton>
                                        </div>
                                        <CardContent style={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <h5>
                                                {producto.nombre}
                                            </h5>
                                            <p style={{ margin: '10px 0 0', color: '#d4af37', fontWeight: '700' }}>
                                                ${producto.opciones[0].precio}
                                            </p>

                                            <div style={{ padding: 0, display: 'flex', flexDirection: 'column', marginTop: '15px', flex: 1, alignSelf: 'center', justifyContent: 'flex-end' }}>
                                                {producto.opciones.length > 1 ? (
                                                    <Link href={`/detail/${producto.id}`} className={style.linkProducto}>
                                                        Ver Opciones
                                                    </Link>
                                                ) : null}

                                                <ItemCount
                                                    optionId={producto.opciones[0].id}
                                                    optionSize={producto.opciones[0].size}
                                                    optionPrecio={producto.opciones[0].precio}
                                                    optionImg={producto.opciones[0].img}
                                                    optionPromo={producto.promocion}
                                                    item={producto}
                                                    userSession={true}
                                                />
                                            </div>

                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </section>


            </motion.div>
        </div>
    );
}

export default PersonalizacionExperiencia;