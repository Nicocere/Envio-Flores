import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './orders.css'
// import { dataOrders } from '../../ecommerce.datos-del-envios';

function SeeOrders() {

    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [userData, setUserData] = useState(null);


    // Función para formatear la fecha de manera legible
    const formatReadableDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const fetchOrders = async () => {
        const orderRef = collection(baseDeDatos, 'ordenes');
        const orderedQuery = query(orderRef, orderBy('order_number', 'desc')); // Ordena por el campo 'order_number' en orden descendente

        const orderSnapShot = await getDocs(orderedQuery);
        const orderData = [];
        orderSnapShot.forEach((doc) => {
            orderData.push({ id: doc.id, ...doc.data() });
        });
        setOrdenes(orderData);

        // Buscar y agregar órdenes de la colección "ordenes-temporales-PayPal"
        const tempOrderRef = collection(baseDeDatos, 'ordenes-temporales-PayPal');
        const tempOrderSnapshot = await getDocs(tempOrderRef);
        tempOrderSnapshot.forEach((doc) => {
            orderData.push({ id: doc.id, ...doc.data() });
        });
        setOrdenes(orderData);

    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const addOrders = async () => {
        // try {

        //     const orderCollectionRef = collection(baseDeDatos, 'ordenes');

        //     // Recorre las direcciones y añádelas a Firebase Database
        //     for (const order of dataOrders) {
        //         await addDoc(orderCollectionRef, order);
        //     }

        //     Swal.fire({
        //         icon: 'success',
        //         title: 'Direcciones Añadidas',
        //         text: 'Todas las direcciones se han añadido correctamente.',
        //     });
        // } catch (error) {
        //     console.error('Error al añadir direcciones: ', error);
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: `Hubo un problema añadiendo direcciones: ${error.message}`,
        //     });
        // }
    };

    const [openOrderId, setOpenOrderId] = useState(null);

    const toggleOrderDetails = (orderId) => {
        if (openOrderId === orderId) {
            setOpenOrderId(null);
        } else {
            setOpenOrderId(orderId);
        }
    };

    const deleteOrder = async (orderId, comprador) => {

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
                    text: `Has eliminado la orden de ${comprador}`,
                    toast: true,             // Esto hace que la alerta se muestre como un toast
                    position: 'top-left',     // Posición en la esquina superior derecha
                    showConfirmButton: false, // No mostrar botón de confirmación
                    timer: 1500,             // Duración de la alerta (en milisegundos)
                    timerProgressBar: true,   // Muestra una barra de progreso mientras la alerta se desvanece
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
        <div className='div-orders'>
            <Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px 60px' }}>
                <Typography variant='h2' style={{ color: 'white', margin: '15px 60px' }}> Ordenes de Compras:</Typography>

                <div className='perfil-usuario-btns'>
                    <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>
                </div>

                {userData && (
                    <Typography style={{ color: 'white', fontSize: '25px', margin: '15px' }}>Hola {userData.username}, estas son tus compras</Typography>
                )}

                <div>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)', boxShadow: '0 0 12px 3px black' }}>
                                <TableRow>
                                    <TableCell sx={{ textTransform: 'uppercase', color: 'white' }}>Nombre y Apellido</TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', color: 'white' }}>Fecha de Compra</TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', color: 'white' }}>N° Orden</TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', color: 'white' }}>Teléfono</TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', color: 'white' }}>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ordenes?.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <TableRow>
                                            <TableCell >{order.comprador?.nombreComprador || order.comprador?.datosComprador.nombreComprador} {order.comprador?.apellidoComprador || order.comprador?.datosComprador.apellidoComprador}</TableCell>
                                            <TableCell >{formatReadableDate(order.createdAt)}</TableCell>
                                            <TableCell >{order.order_number}</TableCell>
                                            <TableCell >{order.comprador?.email || order.comprador?.datosComprador?.email}</TableCell>
                                            <TableCell >{order.comprador?.tel_comprador || order.comprador?.datosComprador?.tel_comprador}</TableCell>
                                            <TableCell >
                                                <Button onClick={() => toggleOrderDetails(order.id)} color='error'> {openOrderId === order.id ? 'Cerrar Orden' : "Ver Orden"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Accordion expanded={openOrderId === order.id}>
                                                    <AccordionSummary onClick={() => toggleOrderDetails(order.id)} sx={{ background: '#670000', color: 'white' }} expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} aria-controls="panel1a-content" id="panel1a-header">
                                                        <Typography sx={{ textTransform: 'uppercase' }}>Datos de la Orden</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {openOrderId === order.id && (
                                                            <TableRow key={`details-${order.id}`}>
                                                                <TableCell colSpan={6}>
                                                                    <Accordion expanded={openOrderId === order.id}>
                                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" onClick={() => toggleOrderDetails(order.id)}>
                                                                            <Typography>Datos de la Orden</Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails sx={{background:'linear-gradient(181deg, rgb(246, 246, 246), rgb(206, 206, 206))', display:'flex', flexDirection:'row',  }}>
                                                                            <div style={{ flex: '1', margin: '5px', padding: '5px', border: '1px solid silver' }} className="orderDetails">
                                                                                <br />
                                                                                <Typography variant="h6">DATOS DE LA ORDEN</Typography>
                                                                                <p>Orden Creada el: {formatReadableDate(order.createdAt)}</p>
                                                                                <p>Codigo alternativo (MercadoPago): <strong>{order.code_mercadopago}</strong></p>
                                                                                <br />
                                                                                <Typography variant="h6">DATOS COMPRADOR:</Typography>
                                                                                <p> Nombre y Apellido comprador: {order.comprador?.nombreComprador} {order.comprador?.apellidoComprador}</p>
                                                                                <p> Telefono: {order.comprador?.tel_comprador}</p>
                                                                                <p> E-mail: {order.comprador?.email}</p>
                                                                                <br />
                                                                            </div>
                                                                            <div className="orderDetails" style={{ flex: '1', margin: '5px', padding: '5px', border: '1px solid silver' }}>

                                                                                <Typography variant="h6">DATOS DESTINATARIO:</Typography>
                                                                                <p> Nombre y Apellido destinatario: {order.envio?.nombreDestinatario} {order.envio?.apellidoDestinatario}</p>
                                                                                <p> Telefono: {order.envio?.phoneDestinatario}</p>
                                                                                <p> Fecha: {order.envio?.fecha} </p>
                                                                                <p> Horario: {order.envio?.horario}</p>
                                                                                <p> Dirección: {order.envio?.calle} {order.envio?.altura} {order.envio?.piso}, {order.envio?.localidad?.name}</p>
                                                                                <br />
                                                                                <p> Dedicatoria: <strong>{order.envio?.dedicatoria}</strong> </p>
                                                                                <br />
                                                                            </div>
                                                                            <div className="orderDetails" style={{ flex: '1', margin: '5px', padding: '5px', border: '1px solid silver' }}>

                                                                                <Typography variant="h6">Productos:</Typography>
                                                                                <ul>
                                                                                    {order.products.map((product) => (
                                                                                        <li key={product.id}>
                                                                                            {product.name} | (Tamaño: {product.size}) | (Precio: ${product.precio}) | (Cantidad: {product.quantity}) |
                                                                                            <img src={product.img} alt="Imagen del producto" width="50" />
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>

                                                                                <br />
                                                                            </div>
                                                                        </AccordionDetails>
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
                                                                                    onClick={() => deleteOrder(order.id, order.comprador?.nombreComprador)}
                                                                                >
                                                                                    Eliminar Orden
                                                                                </Button>
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
                </div>
            </Paper>
        </div>

        //     <div className='div-orders'>
        //                    <div className='perfil-usuario-btns'>
        //                 <Button color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>

        //             </div>
        //         <h1>Ordenes</h1>
        //         {ordenes.length === 0 ?

        //             <div>
        //                 <button onClick={addOrders}>Añadir todas las Ordenes</button>
        //             </div>
        //             : null
        //         }
        //         <div>
        //             <h1>TODAS LAS ORDENES</h1>

        //             <table className="ordersTable">
        //                 <thead>
        //                     <tr>
        //                         <th>Nombre y Apellido</th>
        //                         <th>Fecha de Compra</th>
        //                         <th>N° Orden</th>
        //                         <th>Email</th>
        //                         <th>Teléfono</th>
        //                         <th>Acción</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {ordenes?.map((order, index) => (
        //                         <React.Fragment>

        //                             <tr key={order.index}>
        //                                 <td>{order.comprador?.nombreComprador} {order.comprador?.apellidoComprador}</td>
        //                                 <td>{order.createdAt}</td>
        //                                 <td>{order.order_number}</td>
        //                                 <td>{order.comprador?.email}</td>
        //                                 <td>{order.comprador?.tel_comprador}</td>
        //                                 <td>
        //                                     <button onClick={() => toggleOrderDetails(order.id)}>
        //                                         Ver Orden
        //                                     </button>
        //                                 </td>
        //                             </tr>
        //                             {openOrderId === order.id && (
        //                                 <tr>
        //                                     <td colSpan="5">
        //                                         <div className="orderDetails">
        //                                             <br />
        //                                             <h3>DATOS DE LA ORDEN <strong>
        //                                                 {order.order_number}:</strong></h3>
        //                                             <p>Orden Creada el: {order.createdAt}</p>
        //                                             <p>Codigo alternativo (MercadoPago):<strong> {order.code_mercadopago} </strong></p>
        //                                             <br />
        //                                             <br />
        //                                             <strong>DATOS COMPRADOR:</strong>
        //                                             <br />
        //                                             <p> Nombre y Apellido comprador: {order.comprador?.nombreComprador}{' '}
        //                                                 {order.comprador?.apellidoComprador} </p>

        //                                             <p> Telefono: {order.comprador?.tel_comprador} </p>

        //                                             <p> E-mail: {order.comprador?.email}</p>
        //                                             <br />
        //                                             <hr />
        //                                             <strong>DATOS DESTINATARIO:</strong>
        //                                             <br />
        //                                             <p> Nombre y Apellido destinatario: {order.envio?.nombreDestinatario}{' '}
        //                                                 {order.envio?.apellidoDestinatario}</p>

        //                                             <p> Telefono: {order.envio?.phoneDestinatario}</p>

        //                                             <p> Fecha: {order.envio?.fecha} </p>

        //                                             <p> Horario: {order.envio?.horario}</p>

        //                                             <p> Dirección: {order.envio?.calle} {order.envio?.altura} {order.envio?.piso},{' '}
        //                                                 {order.envio?.localidad?.name}</p>
        //                                             <br />
        //                                             <p> Dedicatoria:<strong>{order.envio?.dedicatoria} </strong> </p>
        //                                             <br />
        //                                             <hr />

        //                                             <div className='div-prods-order'>

        //                                                 <strong>Productos:</strong>
        //                                                 <ul >
        //                                                     {order.products.map((product, index) => (
        //                                                         <li key={product.id}>
        //                                                             {product.name} |
        //                                                             (Tamaño: {product.size}) |
        //                                                             (Precio: ${product.precio}) |
        //                                                             (Cantidad: {product.quantity}) |
        //                                                             <img
        //                                                                 src={product.img}
        //                                                                 alt="Imagen del producto"
        //                                                                 width="50"
        //                                                             />
        //                                                         </li>
        //                                                     ))}
        //                                                 </ul>
        //                                             </div>
        //                                             <br />
        //                                             <button className="btn-table-delete" onClick={() => deleteOrder(order.id, order.comprador?.nombreComprador)}>Eliminar Orden</button>
        //                                         </div>
        //                                     </td>

        //                                 </tr>
        //                             )}
        //                         </React.Fragment>
        //                     ))}
        //                 </tbody>
        //             </table>

        //             <hr />
        //         </div>
        //     </div>
    );
}

export default SeeOrders;
