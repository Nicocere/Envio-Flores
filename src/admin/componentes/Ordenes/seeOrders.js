"use client"

import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import style from './orders.module.css'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function SeeOrders() {

    const navigate = useRouter();
    const [ordenes, setOrdenes] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchMethod, setSearchMethod] = useState('');
    const [searchValue, setSearchValue] = useState('');

    // Función para formatear la fecha de manera legible
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

        // Si es un Timestamp (tiene segundos y nanosegundos)
        if (dateValue.seconds) {
            return formatReadableDate(new Date(dateValue.seconds * 1000));
        }

        // Si es una cadena ISO
        try {
            return formatReadableDate(new Date(dateValue));
        } catch (e) {
            return dateValue; // Devolver original si falla el parsing
        }
    };


    const fetchOrders = async () => {
        const orderRef = collection(baseDeDatos, 'ordenes-envio-flores');
        const orderedQuery = query(orderRef, orderBy('order_number', 'desc'));

        const orderSnapShot = await getDocs(orderedQuery);
        const orderData = [];
        orderSnapShot.forEach((doc) => {
            orderData.push({ id: doc.id, ...doc.data() });
        });
        setOrdenes(orderData);
        setFilteredOrders(orderData);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearchMethodChange = (event) => {
        setSearchMethod(event.target.value);
        setSearchValue('');
        setFilteredOrders(ordenes);
    };

    const handleSearchValueChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);

        if (value === '') {
            setFilteredOrders(ordenes);
            return;
        }

        const filtered = ordenes.filter((order) => {
            switch (searchMethod) {
                case 'nombreApellido':
                    return `${order.datosComprador?.nombreComprador} ${order.datosComprador?.apellidoComprador}`.toLowerCase().includes(value.toLowerCase());
                case 'telefono':
                    return order.datosComprador?.tel_comprador.includes(value);
                case 'numeroOrden':
                    return order.order_number.toString().includes(value);
                case 'fecha':
                    return formatDate(order.createdAt).toLowerCase().includes(value.toLowerCase());
                default:
                    return true;
            }
        });

        setFilteredOrders(filtered);
    };

    const [openOrderId, setOpenOrderId] = useState(null);

    const toggleOrderDetails = (orderId) => {
        if (openOrderId === orderId) {
            setOpenOrderId(null);
        } else {
            setOpenOrderId(orderId);
        }
    };

    const deleteOrder = async (orderId, datosComprador) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esta acción.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await deleteDoc(doc(baseDeDatos, 'ordenes', orderId));
                Swal.fire({
                    icon: 'success',
                    title: 'Orden Eliminada',
                    text: `Has eliminado la order de ${datosComprador}`,
                    toast: true,
                    position: 'top-left',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
                fetchOrders();
            }
        } catch (e) {
            console.error('Error al eliminar el producto: ', e);
            Swal.fire(
                'Error',
                `Hubo un problema eliminando el producto. Error:${e}`,
                'error'
            );
        }
    };

    return (
        <div className={style.divOrders}>
            <div className={style.perfilUsuarioBtns}>
                <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
            </div>

            <h1>Compras:</h1>
            <div className={style.divTextsOrders}>
                <p className={style.pOrders}>Bienvenido al panel de gestión de órdenes. Aquí encontrarás un registro detallado de todas las compras realizadas por los usuarios.</p>
                <p className={style.pOrders}>Para acceder a la información completa de cada order, incluyendo datos del comprador y productos, utiliza el botón "Ver Orden".</p>
                <p className={style.pOrders}>Si prefiere, puede ver la informacion completa de cada order, haciendo click sobre "Datos de la Orden" debajo de la informacion del comprador.</p>
                <p className={style.pOrders}>Si necesitas eliminar una order del sistema, utiliza el botón "Eliminar Orden" disponible en los detalles de cada compra.</p>
                <p className={style.pOrders}>Importante: La eliminación de órdenes es una acción permanente y no podrás recuperar la información una vez eliminada.</p>
            </div>
            <br />


            <div className={style.searchContainer}>
                <label htmlFor="searchMethod">Filtrar Ordenes por:</label>
                <select id="searchMethod" value={searchMethod} onChange={handleSearchMethodChange} className={style.searchSelect} >
                    <option value="nombreApellido">Nombre y Apellido</option>
                    <option value="telefono">Teléfono</option>
                    <option value="numeroOrden">Número de Orden</option>
                    <option value="fecha">Fecha de Compra</option>
                </select>

                {searchMethod && (
                    <div className={style.searchInputContainer}>
                        <label htmlFor="searchValue">Buscar por {searchMethod === 'nombreApellido' ? 'Nombre y Apellido' : searchMethod === 'telefono' ? 'Teléfono' : searchMethod === 'numeroOrden' ? 'Número de Orden' : searchMethod === 'fecha' ? 'Fecha de la compra' : searchMethod}:</label>
                        <input
                            type="text"
                            placeholder={`Buscar por ${searchMethod}`}
                            value={searchValue}
                            onChange={handleSearchValueChange}
                            className={style.searchInput}
                        />
                    </div>
                )}

            </div>


            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ background: '#670000', color: 'white', fontSize: 'larger' }}>Nombre y Apellido</TableCell>
                            <TableCell sx={{ background: '#670000', color: 'white', fontSize: 'larger' }}>Fecha de Compra</TableCell>
                            <TableCell sx={{ background: '#670000', color: 'white', fontSize: 'larger' }}>N° Orden</TableCell>
                            <TableCell sx={{ background: '#670000', color: 'white', fontSize: 'larger' }}>Email</TableCell>
                            <TableCell sx={{ background: '#670000', color: 'white', fontSize: 'larger' }}>Teléfono</TableCell>
                            <TableCell sx={{ background: '#670000', color: 'white', fontSize: 'larger' }}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders?.map((order) => (
                            <React.Fragment key={order.id}>
                                <TableRow>
                                    <TableCell>{order.datosComprador?.nombreComprador} {order.datosComprador?.apellidoComprador}</TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>{order.order_number}</TableCell>
                                    <TableCell>{order.datosComprador?.email}</TableCell>
                                    <TableCell>{order.datosComprador?.tel_comprador}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => toggleOrderDetails(order.id)} variant='contained' size='large' sx={{ color: '#670000', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '10px 20px', background: '#670000', '&:hover': { background: '#ffffff', color: '#670000' } }}>
                                            {openOrderId === order.id ? 'Cerrar Orden' : "Ver Orden"}
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ borderBottom: '2px solid #670000' }}>
                                    <TableCell colSpan={6}>
                                        <Accordion expanded={openOrderId === order.id}>
                                            <AccordionSummary onClick={() => toggleOrderDetails(order.id)} sx={{ background: '#e7e7e7' }} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                                <Typography>Datos de la Orden</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {openOrderId === order.id && (
                                                    <TableRow key={`details-${order.id}`}>
                                                        <TableCell colSpan={6}>
                                                            <Accordion expanded={openOrderId === order.id}>
                                                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" onClick={() => toggleOrderDetails(order.id)}>
                                                                    <Typography>Datos de la Orden</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div className="orderDetails">
                                                                        <br />
                                                                        <Typography variant="h6">DATOS DE LA ORDEN</Typography>
                                                                        <p>Orden Creada el: {formatDate(order.createdAt)}</p>
                                                                        {order.payment === 'PayPal' ? (
                                                                            <p>Metodo de Pago: PayPal</p>
                                                                        ) : order.payment === 'Mercado Pago Cuenta' ? (
                                                                            <p>Metodo de Pago: Mercado Pago Cuenta</p>
                                                                        ) : (
                                                                            <p>Metodo de Pago: Tarjeta</p>
                                                                        )}
                                                                        <br />
                                                                        <Typography variant="h6">DATOS COMPRADOR:</Typography>
                                                                        <p> Nombre y Apellido: <strong>{order.datosComprador?.nombreComprador} {order.datosComprador?.apellidoComprador}</strong></p>
                                                                        <p> Telefono: <strong>{order.datosComprador?.tel_comprador}</strong></p>
                                                                        <p> E-mail: <strong>{order.datosComprador?.email}</strong></p>
                                                                        <br />
                                                                        <hr />
                                                                        <Typography variant="h6">{order.retiraEnLocal ? "DATOS DE QUIEN RETIRA EL PRODUCTO" : "DATOS DE ENVIO:"}  </Typography>
                                                                        {
                                                                            order.retiraEnLocal ? (
                                                                                <p> Retira en local: <strong>Si</strong> </p>
                                                                            ) : (

                                                                                <>
                                                                                    <p> Nombre y Apellido destinatario: <strong>{order.datosEnvio.nombreDestinatario} {order.datosEnvio.apellidoDestinatario}</strong></p>
                                                                                    <p> Telefono: {order.datosEnvio.phoneDestinatario ? (
                                                                                        <strong>{order.datosEnvio.phoneDestinatario}</strong>
                                                                                    ) : (
                                                                                        <strong>No especificado</strong>
                                                                                    )}</p>
                                                                                    <p> Direccion: <strong>{order.datosEnvio.calle} {order.datosEnvio.altura}</strong></p>
                                                                                    <p> Piso: <strong>{order.datosEnvio.piso}</strong></p>
                                                                                </>
                                                                            )
                                                                        }

                                                                        <p> Fecha: <strong>{order.datosEnvio?.fecha}</strong> </p>
                                                                        <p> Horario: <strong>{order.datosEnvio?.horario}</strong></p>
                                                                        <br />
                                                                        <p> Dedicatoria: <strong>{order.datosEnvio?.dedicatoria}</strong> </p>
                                                                        <br />
                                                                        <hr />
                                                                        <div className='div-prods-order'>
                                                                            <Typography variant="h6">Productos:</Typography>
                                                                            <ul>
                                                                                {order.products.map((product) => (
                                                                                    <li key={product.id}>
                                                                                        {product.name} | (Tamaño: {product.size}) | (Precio: ${product.precio}) | (Cantidad: {product.quantity}) |
                                                                                        <Image src={product.img} alt="Imagen del producto" width={100} height={100} style={{ borderRadius: '10px' }} />
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                        <br />
                                                                        <Button
                                                                            size='small'
                                                                            color='error'
                                                                            variant='outlined'
                                                                            sx={{
                                                                                margin: '10px',
                                                                                '&:hover': {
                                                                                    backgroundColor: 'red',
                                                                                    color: 'white',
                                                                                    fontWeight: 500
                                                                                }
                                                                            }}
                                                                            onClick={() => deleteOrder(order.id, order.datosComprador?.nombreComprador)}
                                                                        >
                                                                            Eliminar Orden
                                                                        </Button>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <hr />
            <br />
        </div>
    );
}

export default SeeOrders;