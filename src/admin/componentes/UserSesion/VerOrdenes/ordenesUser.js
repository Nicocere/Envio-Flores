import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { auth, baseDeDatos } from '../../../FireBaseConfig';
// import Swal from user/buys'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from '@firebase/auth';
import { Timestamp } from 'firebase/firestore';

// css
import './ordenesUser.css';
// import { dataOrders } from '../../../ecommerce.datos-del-envios';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function UserSeeBuys() {
    const [ordenes, setOrdenes] = useState([]);
    const [error, setError] = useState('');
    const isSmallScreen = window.innerWidth < 658;
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
    }, []);

    // Función para formatear la fecha de manera legible
    const formatReadableDate = (dateString) => {
        // Verifica si createdAt es una instancia de Timestamp
        if (dateString instanceof Timestamp) {
            // Convierte Timestamp a Date y luego a string
            return dateString.toDate().toLocaleDateString('es-ES'); // Ajusta el formato de fecha según necesites
        } else {

            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
    };


    const fetchOrders = async () => {
        if (!userData || !userData.email) {
            console.error("No hay datos de usuario disponibles");
            return;
        }

        const orderRef = collection(baseDeDatos, 'ordenes');
        const orderedQuery = query(
            orderRef,
            orderBy('order_number', 'desc'),
            where('datosComprador.email', '==', userData.email)
        );

        try {
            const orderSnapShot = await getDocs(orderedQuery);
            const orderData = [];
            orderSnapShot.forEach((doc) => {
                orderData.push({ id: doc.id, ...doc.data() });
            });
            setOrdenes(orderData);
        } catch (error) {
            console.error("Error al obtener las órdenes:", error);
            setError('Error al obtener las órdenes')
        }
    };

    useEffect(() => {
        if (userData) {
            fetchOrders();
        }
    }, [userData]);

    const [openOrderId, setOpenOrderId] = useState(null);

    const toggleOrderDetails = (orderId) => {
        if (openOrderId === orderId) {
            setOpenOrderId(null);
        } else {
            setOpenOrderId(orderId);
        }
    };

    // Función de ayuda para formatear la fecha
    function formatCreatedAt(createdAt) {
        // Verifica si createdAt es una instancia de Timestamp
        if (createdAt instanceof Timestamp) {
            // Convierte Timestamp a Date y luego a string
            return createdAt.toDate().toLocaleDateString('es-ES'); // Ajusta el formato de fecha según necesites
        } else {
            // Si no es una instancia de Timestamp, asume que es una cadena
            return createdAt;
        }
    }


    return (

        <div className='div-orders'>
            <div className='perfil-usuario-btns'>
                <Button color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>
            </div>

            {userData && (
                <Typography style={{ color: '#670000', fontSize: '25px', margin: '15px' }}>Hola {userData.username}, estas son tus compras</Typography>
            )}

            <div>
                <Typography variant='h2' style={{ color: '#670000', margin: '15px' }}>Compras:</Typography>
                <Typography variant='h6' style={{ color: '#670000', margin: '15px' }}>compras realizadas:  
                    <h3>
                    {ordenes.length}
                    </h3>
                    </Typography>

                {error && (<Typography style={{ color: 'red' }}>{error}</Typography>)}
                <div className='table-order'>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ background: '#670000', color: 'white' }}>Nombre y Apellido</TableCell>
                                <TableCell sx={{ background: '#670000', color: 'white' }}>Fecha de Compra</TableCell>
                                <TableCell sx={{ background: '#670000', color: 'white' }}>N° Orden</TableCell>
                                <TableCell sx={{ background: '#670000', color: 'white' }}>Email</TableCell>
                                <TableCell sx={{ background: '#670000', color: 'white' }}>Teléfono</TableCell>
                                <TableCell sx={{ background: '#670000', color: 'white' }}>Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes?.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow>
                                        <TableCell sx={{fontSize:'medium', fontWeight:'600'}} >{order.datosComprador?.nombreComprador} {order.datosComprador?.apellidoComprador}</TableCell>
                                        <TableCell sx={{fontSize:'medium', fontWeight:'600'}} >{formatReadableDate(order.createdAt)}</TableCell>
                                        <TableCell sx={{fontSize:'medium', fontWeight:'600',color:'#670000' }} >{order.order_number}</TableCell>
                                        <TableCell sx={{fontSize:'medium', fontWeight:'600'}} >{order.datosComprador?.email}</TableCell>
                                        <TableCell sx={{fontSize:'medium', fontWeight:'600'}} >{order.datosComprador?.tel_comprador}</TableCell>
                                        <TableCell sx={{fontSize:'medium', fontWeight:'600'}} >
                                            <Button onClick={() => toggleOrderDetails(order.id)}>Ver Orden</Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{borderBottom:'1px solid grey', marginBottom:'10px'}} colSpan={6}>
                                            <Accordion expanded={openOrderId === order.id}>
                                                <AccordionSummary sx={{ background: 'linear-gradient(to bottom, #858585, #434343)' }} onClick={() => toggleOrderDetails(order.id)} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                                    <Typography sx={{ color: 'white', fontSize: 'large', }} >Datos de la Orden <strong>{order.order_number}</strong></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {openOrderId === order.id && (
                                                         <div className="divOrder" key={order.id}>
                                                            
                                                                        <div className="orderDetails">
                                                                            <div style={{flex:'3'}} >
                                                                                <Typography variant="h5">DATOS DE LA ORDEN</Typography>
                                                                                <p>Orden Creada el: {formatReadableDate(order.createdAt)}</p>
                                                                                <p>Compra realizada a travez de:  <strong style={{padding:'0px '}}>{order.MercadoPago && 'Mercado Pago'}{order.PayPal && 'Pay-Pal'}</strong></p>
                                                                                <br />
                                                                                <Typography variant="h5">DATOS DEL COMPRADOR:</Typography>
                                                                                <p> Nombre y Apellido: {order.datosComprador?.nombreComprador} {order.datosComprador?.apellidoComprador}</p>
                                                                                <p> Telefono: {order.datosComprador?.tel_comprador}</p>
                                                                                <p> E-mail: {order.datosComprador?.email}</p>
                                                                            </div>
                                                                            <hr />
                                                                            <div style={{flex:'3'}}>

                                                                                {
                                                                                    order.retiraEnLocal === false ? (
                                                                                        <>

                                                                                            <Typography variant="h5">DATOS DESTINATARIO:</Typography>
                                                                                            <p> Nombre y Apellido: {order.datosEnvio?.nombreDestinatario} {order.datosEnvio?.apellidoDestinatario}</p>
                                                                                            <p> Telefono: {order.datosEnvio?.phoneDestinatario}</p>
                                                                                            <p> Fecha: {order.datosEnvio?.fecha} </p>
                                                                                            <p> Horario: {order.datosEnvio?.horario}</p>
                                                                                            <p> Dirección: {order.datosEnvio?.calle} {order.datosEnvio?.altura} {order.datosEnvio?.piso}, {order.datosEnvio?.localidad?.name}</p>
                                                                                            <br />
                                                                                            <p> Dedicatoria: <strong>{order.datosEnvio?.dedicatoria}</strong> </p>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <h4>¡Has elegido Retirarlo en el local!</h4>
                                                                                            <p> Dedicatoria: <strong>{order.datosEnvio?.dedicatoria}</strong> </p>

                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </div>

                                                                                    </div>
                                                                            <hr />
                                                                            <div className='div-prods-order'>
                                                                                <Typography variant="h5" >PRODUCTOS COMPRADOS:</Typography>
                                                                                <ul>
                                                                                    {order.products.map((product) => (
                                                                                        <li key={product.id}>
                                                                                            <img src={product.img} alt="Imagen del producto" width="50" />
                                                                                            {product.name} | (Tamaño: {product.size}) | (Precio: ${product.precio}) | (Cantidad: {product.quantity}) |
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                            <br />

                                                                
                                                                        </div>
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
                </div>

                <hr color='black'/>
            </div>
        </div>
    );
}

export default UserSeeBuys;