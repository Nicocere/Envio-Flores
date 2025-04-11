"use client"

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { baseDeDatos, auth } from '@/admin/FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import style from './gestionPedidos.module.css';
import { PulseLoader } from 'react-spinners';
import Image from 'next/image';
import localforage from 'localforage';
import { useCartContext } from '@/context/CartContext';
import { usePageContext } from '@/context/Context';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeContext } from '@/context/ThemeSwitchContext';

function UserOrders() {
    const [ordenes, setOrdenes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [openOrderId, setOpenOrderId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const { isDarkMode } = useThemeContext();
    const [newSize, setNewSize] = useState('');
    const { cart, setCart } = useCartContext();
    const { CartID, UserID } = usePageContext();
    const navigate = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                fetchOrders(user.email);
            } else {
                navigate.push('/login', { replace: true });
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchOrders = async (email) => {
        const orderRef = collection(baseDeDatos, 'ordenes-floreriasargentinas');
        const q = query(orderRef, where('datosComprador.email', '==', email));
        const orderSnapShot = await getDocs(q);
        const orderData = [];
        orderSnapShot.forEach((doc) => {
            orderData.push({ id: doc.id, ...doc.data() });
        });
        setOrdenes(orderData);
    };

    const formatReadableDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'America/Argentina/Buenos_Aires'
        };
        return new Date(dateString).toLocaleString('es-AR', options);
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return '';

        if (dateValue.seconds) {
            return formatReadableDate(new Date(dateValue.seconds * 1000));
        }

        try {
            return formatReadableDate(new Date(dateValue));
        } catch (e) {
            return dateValue;
        }
    };

    const toggleOrderDetails = (orderId) => {
        if (openOrderId === orderId) {
            setOpenOrderId(null);
        } else {
            setOpenOrderId(orderId);
        }
    };

    const handleOptionSelect = (opcion) => {
        setNewSize(opcion.size);
        setSelectedOption(opcion);
    };

//  Actualizar el cierre del diálogo para limpiar el estado
const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setNewSize('');
    setSelectedOption(null);
};

    //Actualizar handleDialogConfirm
const handleDialogConfirm = async () => {
    if (selectedProduct && selectedOption) {
        try {
            const cartData = await localforage.getItem('cart');
            const cart = cartData || [];
            
            const newProduct = {
                id: selectedProduct.id,
                size: selectedOption.size,
                precio: selectedOption.precio,
                name: selectedProduct.nombre || selectedProduct.name,
                img: selectedOption.img,
                quantity: 1,
                CartID: await CartID,
                UserID: await UserID
            };

            const existingProductIndex = cart.findIndex(
                cartItem => cartItem.id === newProduct.id && cartItem.size === newProduct.size
            );

            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += newProduct.quantity;
            } else {
                cart.push(newProduct);
            }

            setCart(cart);
            await localforage.setItem('cart', cart);
            
            handleDialogClose();
            
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: 'El producto ha sido agregado al carrito.',
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al agregar el producto al carrito.',
            });
        }
    }
};


    const repeatOrder = async (order) => {
        try {
            const cartData = await localforage.getItem('cart');
            const cart = cartData || [];
            const productosData = await localforage.getItem('productos');


            for (const product of order.products) {
                const currentProduct = productosData.find(p => p.id === product.id);
                if (currentProduct) {
                    const existingProductIndex = cart.findIndex(cartItem => cartItem.id === product.id && cartItem.size === product.size);
                    if (existingProductIndex !== -1) {
                        cart[existingProductIndex].quantity += product.quantity;
                    } else if (currentProduct.opciones.includes(product.size)) {
                        cart.push({
                            id: product.id,
                            size: product.size,
                            precio: currentProduct.precio,
                            name: product.name,
                            img: product.img,
                            quantity: product.quantity,
                            CartID: await CartID,
                            UserID: await UserID
                        });
                    } else {


                        setSelectedProduct(currentProduct);
                        setOpenDialog(true);
                        return;
                    }
                } else {
                    console.warn(`Producto con ID ${product.name} y tamaño ${product.id} no encontrado en productos.`);
                }
            }

            setCart(cart);
            await localforage.setItem('cart', cart);

            Swal.fire({
                icon: 'success',
                title: 'Orden Repetida',
                text: 'Los productos han sido agregados al carrito.',
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        } catch (e) {
            console.error('Error al repetir la orden: ', e);
            Swal.fire(
                'Error',
                `Hubo un problema repitiendo la orden. Error:${e}`,
                'error'
            );
        }
    };

    return (
        <div className={style.divOrders}>
            <div className={style.perfilUsuarioBtns}>
                <Button variant='text' size='small' color='error' sx={{color: !isDarkMode ? 'white' : 'black'}} onClick={() => navigate.back()}>Volver atrás</Button>
            </div>

            <h1>Mis Compras:</h1>
            <div className={style.divTextsOrders}>
                <p className={style.pOrders}>Aquí encontrarás un registro detallado de todas tus compras realizadas. Podrás ver el estado de tus pedidos, repetir órdenes anteriores, consultar los detalles de envío y revisar los productos adquiridos. Si algún producto no está disponible en su tamaño original, te ofreceremos alternativas similares.</p>
            </div>
            <br />

            {ordenes.length > 0 ? (
                <TableContainer 
                    component={Paper} 
                    sx={{
                        maxHeight: 840,
                        borderRadius: '15px',
                        overflow: 'auto',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: '#fff',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {['Fecha de Compra', 'N° Orden', 'Estado', 'Monto', 'Acción'].map((header) => (
                                    <TableCell 
                                        key={header}
                                        sx={{ 
                                            background: 'linear-gradient(145deg, #d4af37 0%, #c4a032 100%)',
                                            color: 'white',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            padding: '16px 20px',
                                            textAlign: 'center',
                                            borderBottom: '3px solid rgba(47, 26, 15, 0.1)'
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow 
                                        sx={{ 
                                            '&:hover': {
                                                background: 'rgba(212, 175, 55, 0.05)',
                                                transition: 'all 0.3s ease'
                                            },
                                            borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                                        }}
                                    >
                                        <TableCell sx={{ textAlign: 'center', color: '#2f1a0f' }}>
                                            {formatDate(order.createdAt)}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', color: '#2f1a0f', fontWeight: '500' }}>
                                            {order.order_number}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Chip
                                                label={order.estado}
                                                sx={{
                                                    backgroundColor: order.estado === 'Completado' ? '#4CAF50' : 
                                                                   order.estado === 'Pendiente' ? '#FFC107' : '#2196F3',
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    padding: '8px 12px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ 
                                            textAlign: 'center', 
                                            color: '#2f1a0f',
                                            fontWeight: '600',
                                            fontSize: '1.1rem'
                                        }}>
                                            ${order.datosEnvio.totalPrice}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <motion.div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <Button
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                    variant='contained'
                                                    sx={{
                                                        background: openOrderId === order.id ? 
                                                            'linear-gradient(145deg, #2f1a0f 0%, #3a2116 100%)' : 
                                                            'linear-gradient(145deg, #d4af37 0%, #c4a032 100%)',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '25px',
                                                        minWidth: '120px',
                                                        fontWeight: '500',
                                                        '&:hover': {
                                                            background: '#2f1a0f',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {openOrderId === order.id ? 'Cerrar' : "Ver Orden"}
                                                </Button>
                                                <Button
                                                    onClick={() => repeatOrder(order)}
                                                    variant='outlined'
                                                    sx={{
                                                        color: '#d4af37',
                                                        border: '2px solid #d4af37',
                                                        padding: '8px 16px',
                                                        borderRadius: '25px',
                                                        minWidth: '120px',
                                                        fontWeight: '500',
                                                        '&:hover': {
                                                            background: '#d4af37',
                                                            color: 'white',
                                                            border: '2px solid #d4af37',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(20, 16, 1, 0.3)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    Repetir
                                                </Button>
                                            </motion.div>
                                        </TableCell>
                                    </TableRow>
                
                                    <TableRow>
                        <TableCell colSpan={5} sx={{ padding: 0 }}>
                            <AnimatePresence mode="wait">
                                {openOrderId === order.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ 
                                            opacity: 1, 
                                            height: "auto",
                                            transition: {
                                                height: {
                                                    duration: 0.4,
                                                    ease: "easeInOut"
                                                },
                                                opacity: {
                                                    duration: 0.3,
                                                    delay: 0.1
                                                }
                                            }
                                        }}
                                        exit={{ 
                                            opacity: 0,
                                            height: 0,
                                            transition: {
                                                height: {
                                                    duration: 0.3
                                                },
                                                opacity: {
                                                    duration: 0.2
                                                }
                                            }
                                        }}
                                        style={{
                                            overflow: "hidden",
                                            background: 'rgba(212, 175, 55, 0.05)',
                                            borderBottom: '2px solid #d4af37'
                                        }}
                                    >
                                        <motion.div
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: 20 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ padding: '2rem' }}
                                        >
                                            <Typography variant="h5" sx={{ 
                                                color: '#2f1a0f',
                                                fontWeight: 600,
                                                marginBottom: '1.5rem',
                                                textAlign: 'center',
                                                borderBottom: '2px solid #d4af37',
                                                paddingBottom: '0.5rem'
                                            }}>
                                                Detalles de la Orden
                                            </Typography>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <div className="orderDetails" style={{
                                                    background: '#fff',
                                                    padding: '2rem',
                                                    borderRadius: '15px',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                                }}>
                                                    <Typography variant="h6" sx={{ color: '#d4af37', marginBottom: '1rem' }}>
                                                        DATOS DE LA ORDEN
                                                    </Typography>
                                                    <p>Orden Creada el: {formatDate(order.createdAt)}</p>
                                                    {order.payment === 'PayPal' ? (
                                                        <p>Método de Pago: PayPal</p>
                                                    ) : order.payment === 'Mercado Pago Cuenta' ? (
                                                        <p>Método de Pago: Mercado Pago Cuenta</p>
                                                    ) : (
                                                        <p>Método de Pago: Tarjeta</p>
                                                    )}

                                                    <Typography variant="h6" sx={{ 
                                                        color: '#d4af37', 
                                                        marginTop: '2rem',
                                                        marginBottom: '1rem' 
                                                    }}>
                                                        DATOS COMPRADOR:
                                                    </Typography>
                                                    <p>Nombre y Apellido: <strong>{order.datosComprador?.nombreComprador} {order.datosComprador?.apellidoComprador}</strong></p>
                                                    <p>Teléfono: <strong>{order.datosComprador?.tel_comprador}</strong></p>
                                                    <p>E-mail: <strong>{order.datosComprador?.email}</strong></p>

                                                    <Typography variant="h6" sx={{ 
                                                        color: '#d4af37', 
                                                        marginTop: '2rem',
                                                        marginBottom: '1rem' 
                                                    }}>
                                                        {order.retiraEnLocal ? "DATOS DE QUIEN RETIRA EL PRODUCTO" : "DATOS DE ENVÍO:"}
                                                    </Typography>
                                                    
                                                    {order.retiraEnLocal ? (
                                                        <p>Retira en local: <strong>Sí</strong></p>
                                                    ) : (
                                                        <>
                                                            <p>Nombre y Apellido destinatario: <strong>{order.datosEnvio.nombreDestinatario} {order.datosEnvio.apellidoDestinatario}</strong></p>
                                                            <p>Teléfono: {order.datosEnvio.phoneDestinatario ? (
                                                                <strong>{order.datosEnvio.phoneDestinatario}</strong>
                                                            ) : (
                                                                <strong>No especificado</strong>
                                                            )}</p>
                                                            <p>Dirección: <strong>{order.datosEnvio.calle} {order.datosEnvio.altura}</strong></p>
                                                            <p>Piso: <strong>{order.datosEnvio.piso}</strong></p>
                                                        </>
                                                    )}

                                                    <p>Fecha: <strong>{order.datosEnvio?.fecha}</strong></p>
                                                    <p>Horario: <strong>{order.datosEnvio?.horario}</strong></p>
                                                    <p>Dedicatoria: <strong>{order.datosEnvio?.dedicatoria ? order.datosEnvio?.dedicatoria : 'Sin Dedicatoria'}</strong></p>

                                                    <motion.div 
                                                        className='div-prods-order'
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        <Typography variant="h6" sx={{ 
                                                            color: '#d4af37',
                                                            marginTop: '2rem',
                                                            marginBottom: '1rem'  
                                                        }}>
                                                            Productos:
                                                        </Typography>
                                                        <div style={{ 
                                                            display: 'grid', 
                                                            gap: '1rem',
                                                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
                                                        }}>
                                                            {order.products.map((product, idx) => (
                                                                <motion.div
                                                                    key={product.id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: 0.1 * idx }}
                                                                    style={{
                                                                        padding: '1rem',
                                                                        background: 'rgba(212, 175, 55, 0.05)',
                                                                        borderRadius: '10px',
                                                                        border: '1px solid #d4af37'
                                                                    }}
                                                                >
                                                                    <Image 
                                                                        src={product.img} 
                                                                        alt={product.name}
                                                                        width={100} 
                                                                        height={100}
                                                                        style={{ 
                                                                            borderRadius: '10px',
                                                                            marginBottom: '1rem' 
                                                                        }} 
                                                                    />
                                                                    <p><strong>{product.name}</strong></p>
                                                                    <p>Tamaño: {product.size}</p>
                                                                    <p>Precio: ${product.precio}</p>
                                                                    <p>Cantidad: {product.quantity}</p>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </TableCell>
                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
            )}

            <AnimatePresence>
                {openDialog && (
                    <motion.div
                        className={style.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}

                    >
                        <motion.div
                            className={style.modalContent}
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{
                                scale: 1,
                                y: 0,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25
                                }
                            }}
                            exit={{
                                scale: 0.9,
                                y: 20,
                                transition: { duration: 0.2 }
                            }}
                            style={{
                                background: 'linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)',
                                padding: '2rem',
                                borderRadius: '20px',
                                boxShadow: '0 4px 30px rgba(212, 175, 55, 0.2)',
                                width: '90%',
                                maxWidth: '500px',
                                position: 'relative',
                                border: '2px solid #d4af37'
                            }}
                        >
                            <motion.div
                                className={style.modalHeader}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className={style.modalTitle} style={{
                                    color: '#2f1a0f',
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    textAlign: 'center',
                                    fontSize: '1.8rem',
                                    fontWeight: '600',
                                    borderBottom: '2px solid #d4af37',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: '10px'
                                }}>Selecciona el nuevo tamaño</h2>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    textAlign: 'center',
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    background: 'rgba(212, 175, 55, 0.05)',
                                    borderRadius: '15px',
                                    border: '1px solid #d4af37'
                                }}
                            >
                                <p style={{
                                    color: '#2f1a0f',
                                    fontSize: '1.1rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    El tamaño seleccionado originalmente no está disponible.
                                </p>
                                <p style={{
                                    color: '#2f1a0f',
                                    fontSize: '1rem'
                                }}>
                                    Por favor, selecciona un nuevo tamaño y haz click en "Confirmar" para continuar con tu pedido.
                                </p>
                            </motion.div>

                            <div className={style.sizeOptions} style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                justifyContent: 'center',
                                marginBottom: '2rem'
                            }}>
                            {selectedProduct?.opciones?.map((opcion, idx) => (
    <motion.button
        key={idx}
        className={`${style.sizeOption} ${newSize === opcion.size ? style.selected : ''}`}
        onClick={() => handleOptionSelect(opcion)}
        whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)'
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            color: newSize === opcion.size ? 'white' : '#d4af37',
            fontWeight: newSize === opcion.size ? '600' : '400',
            border: `2px solid ${newSize === opcion.size ? '#d4af37' : '#2f1a0f'}`,
            borderRadius: '15px',
            background: newSize === opcion.size ? '#d4af37' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            gap: '0.5rem',
            boxShadow: newSize === opcion.size ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
        }}
    >
        <motion.img
            src={opcion.img}
            alt={opcion.name}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '3px solid #d4af37',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
        />
        <motion.p 
            style={{
                fontSize: '1.1rem',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                marginTop: '0.5rem'
            }}
        >
            ${opcion.precio}
        </motion.p>
        <motion.p
            style={{
                fontSize: '1rem', textTransform:'capitalize'
            }}
        >
            {opcion.size}
        </motion.p>
    </motion.button>
))}
                            </div>

                            <motion.div
                                className={style.modalActions}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '1.5rem',
                                    marginTop: '1.5rem'
                                }}
                            >
                                <motion.button
                                    className={style.buttonCancel}
                                    onClick={handleDialogClose}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '1rem 2rem',
                                        border: '2px solid #d4af37',
                                        borderRadius: '25px',
                                        background: 'transparent',
                                        color: '#2f1a0f',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Cancelar
                                </motion.button>
                                <motion.button
                                    className={style.buttonConfirm}
                                    onClick={handleDialogConfirm}
                                    disabled={!newSize}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '1rem 2rem',
                                        border: '2px solid #d4af37',
                                        borderRadius: '25px',
                                        background: '#d4af37',
                                        color: '#fff',
                                        cursor: newSize ? 'pointer' : 'not-allowed',
                                        opacity: newSize ? 1 : 0.6,
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500',
                                        fontSize: '1.1rem',
                                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                                    }}
                                >
                                    Confirmar
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default UserOrders;