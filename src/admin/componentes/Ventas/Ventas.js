import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './ventas.css'
import {
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Box,
  TableSortLabel,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { FadeLoader } from 'react-spinners';

function VerVentas() {

  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchOrders = useCallback(async () => {
    const orderRef = collection(baseDeDatos, 'ordenes');
    const orderedQuery = query(orderRef, orderBy('order_number', 'desc')); // Ordena por el campo 'order_number' en orden descendente

    const orderSnapShot = await getDocs(orderedQuery);
    const orderData = [];
    orderSnapShot.forEach((doc) => {
      orderData.push({ id: doc.id, ...doc.data() });
    });
    setOrdenes(orderData);
    
    // // Buscar y agregar órdenes de la colección "ordenes-temporales-PayPal"
    // const tempOrderRef = collection(baseDeDatos, 'ordenes-temporales-PayPal');
    // const tempOrderSnapshot = await getDocs(tempOrderRef);
    // tempOrderSnapshot.forEach((doc) => {
    //   orderData.push({ id: doc.id, ...doc.data() });
    // });
    // setOrdenes(orderData);

    if (orderData) {
      setIsLoading(false)
    }
  }, []); // Añade las dependencias necesarias aquí

  // Crear un objeto para realizar el seguimiento de las compras por email
  const comprasPorEmail = {};

  // Iterar sobre las órdenes y realizar el seguimiento del total de compras por email
  ordenes.forEach((orden) => {
    const email = orden.datosComprador.email || orden.email; // Corregir asignación de la variable email
    comprasPorEmail[email] = (comprasPorEmail[email] || 0) + 1;
  });

  useEffect(() => {
    const storedEncryptedData = localStorage.getItem('p');
    const parsedStoredData = JSON.parse(storedEncryptedData);

    if (!parsedStoredData?.nonce || !parsedStoredData.key || !parsedStoredData.data) {
      console.log('Datos almacenados incompletos');
      return;
    }

    const nonce = naclUtil.decodeBase64(parsedStoredData.nonce);
    const key = naclUtil.decodeBase64(parsedStoredData.key);
    const encryptedData = naclUtil.decodeBase64(parsedStoredData.data);

    const decryptedData = nacl.secretbox.open(encryptedData, nonce, key);

    if (decryptedData) {
      const textDecoder = new TextDecoder('utf-8');
      const decryptedDataString = textDecoder.decode(decryptedData);
      const parsedData = JSON.parse(decryptedDataString);
      setProducts(parsedData); // Almacena los productos descifrados en el estado
    } else {
      console.log('Error al descifrar los datos');
    }

    fetchOrders();
  }, []); // Array de dependencias vacío


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


  // Cantidad total de productos vendidos
  const totalVendidos = products.reduce((acc, producto) => acc + Number(producto.vendidos), 0);

  // Ordenar productos por cantidad vendida de mayor a menor
  const productosMasVendidos = products.sort((a, b) => b.vendidos - a.vendidos);

  const [openOrderId, setOpenOrderId] = useState(null);

  // Crear un ref para el usuario correspondiente
  const userRef = useRef(null);

  // Función para desplazarse hacia el usuario
  const scrollToUser = () => {
    userRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Función para mostrar/ocultar detalles de la orden
  const toggleOrderDetails = (orderId) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
    if (openOrderId === orderId) {
      scrollToUser();
    }
  };


  // Estado para manejar la expansión de filas de la tabla de usuarios
  const [expandedUser, setExpandedUser] = useState(null);

  // Estado para manejar la expansión de filas de la tabla de compras por usuario
  const [expandedCompra, setExpandedCompra] = useState(null);

  const handleUserRowClick = (index) => {
    setExpandedUser(expandedUser === index ? null : index);
    setExpandedCompra(null); // Cerrar la expansión de compras al cambiar de usuario
  };

  // Estados para el orden y la dirección del orden
  const [orden, setOrder] = useState('asc');
  const [orderOf, setOrderOf] = useState('email'); // Establecer la columna inicial para ordenar


  // Función para manejar el cambio de orden
  const handleRequestSort = (property) => {
    const isAsc = orderOf === property && orden === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderOf(property); // Nueva línea para actualizar la columna actual
  };

  // Función para comparar dos valores durante el ordenamiento
  const compareValues = (a, b) => {
    if (orden === 'asc') {
      return a[orderOf] < b[orderOf] ? -1 : a[orderOf] > b[orderOf] ? 1 : 0;
    } else {
      return b[orderOf] < a[orderOf] ? -1 : b[orderOf] > a[orderOf] ? 1 : 0;
    }
  };

  // Objeto para almacenar el total de compras por usuario
  const totalComprasPorUsuario = {};

  // Iterar sobre las órdenes y realizar el seguimiento del total de compras por usuario
  ordenes.forEach((orden) => {
    const email = orden.datosComprador.email || orden.email; // Obtener el email del datosComprador
    let amount = 0; // Inicializar el monto total en 0

    // Verificar si la orden tiene productos
    if (orden.products && Array.isArray(orden.products)) {
      // Iterar sobre los productos de la orden y sumar el monto de cada producto
      orden.products.forEach((producto) => {
        // Calcular el monto del producto multiplicando el precio por la cantidad
        const precioProducto = parseFloat(producto.precio);
        const cantidadProducto = parseInt(producto.quantity);
        const montoProducto = parseFloat(precioProducto * cantidadProducto);
        // Sumar el monto del producto al monto total de la orden
        amount += montoProducto;
      });
    }
    // Sumar el monto total de la orden al monto total de compras del usuario
    totalComprasPorUsuario[email] = (totalComprasPorUsuario[email] || 0) + amount;
  });

  // Productos visibles...
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMore, setShowMore] = useState(true);

  // Función para mostrar más productos
  const handleShowMore = () => {
    const newVisibleProducts = Math.min(visibleProducts + 8, totalProducts);
    setVisibleProducts(newVisibleProducts);
    if (newVisibleProducts === totalProducts) {
      // Si se mostraron todos los productos, ocultar el botón "Ver más"
      setShowMore(false);
    }
  };

  // Función para ocultar productos
  const handleShowLess = () => {
    setVisibleProducts(8);
    // Mostrar el botón "Ver más" al ocultar productos
    setShowMore(true);
  };

  useEffect(() => {
    // Actualizar el estado total de productos cuando cambie la lista de productos
    setTotalProducts(productosMasVendidos.length);
  }, [productosMasVendidos]);

  // Calcular el precio total de todos los productos vendidos de las órdenes
  const totalMontoTodasOrdenes = ordenes.reduce((total, orden) => {
    return total + orden.products.reduce((subtotal, producto) => {
      return subtotal + ((parseFloat(producto.precio) || parseFloat(producto.price)) * parseFloat(producto.quantity));
    }, 0);
  }, 0).toLocaleString('es-AR');




  return (

    <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px', marginTop: '20px' }}>
      <div className="perfil-usuario-btns">
        <Typography variant='h2' sx={{ color: 'white' }}>Ventas</Typography>
        <Button sx={{ margin: 5 }} variant="contained" color='error' size='small' onClick={() => navigate(-1)}>
          Volver atrás
        </Button>
      </div>

      <Typography variant="h4" sx={{ color: 'white', background: '#670000', marginTop: 8, marginBottom: 3, borderRadius: '10px' }} gutterBottom>
        ¿Cómo vamos este mes?
      </Typography>

      <Paper elevation={3} className="div-orders">

        <Paper elevation={6} sx={{ padding: '10px', color: 'white', background: '#670000', }} >

          <Typography variant="subtitle" sx={{ borderBottom: '1px solid silver' }} gutterBottom>
            TOTAL DE VENTAS :
            <Typography variant='subtitle1'>
              Ordenes: <strong> {ordenes.length}
              </strong>
            </Typography>
            <Typography variant='subtitle1'>
              Productos:   <strong> {totalVendidos} vendidos.
              </strong>
            </Typography>
            <Typography variant='subtitle1'>
              Monto total de ventas: <strong> ${totalMontoTodasOrdenes}
              </strong>
            </Typography>
          </Typography>
        </Paper>

        <br />

        <Paper elevation={12} sx={{ backgroundColor: '#424242', color: '#ffffff' }}>

          {/* Mostrar la tabla de usuarios y compras agrupadas por email */}
          <Typography variant="h6" gutterBottom>
            Usuarios y sus compras:
          </Typography>

          {isLoading ?
            (<div className="spinner-container">
              <p className="loadMP" style={{ color: 'white' }}>Cargando...</p>
              <FadeLoader loading={isLoading} className="fadeLoader" color="#035b0e" />
            </div>)
            :
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow ref={userRef}>
                    <TableCell>
                      <TableSortLabel sx={{ color: 'black', '&:hover': { color: '#373737' } }}
                        active={orderOf === 'email'}
                        direction={orderOf === 'email' ? orden : 'asc'}
                        onClick={() => handleRequestSort('email')}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>Veces que compró</TableCell>
                    <TableCell>Total gastado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(comprasPorEmail)
                    .sort((a, b) => compareValues({ email: a }, { email: b }))
                    .map((email, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{email}</TableCell>
                          <TableCell>{comprasPorEmail[email] > 1 ?
                            (`${comprasPorEmail[email]} compras`) : (`${comprasPorEmail[email]} compra`)} </TableCell>
                          <TableCell>${(totalComprasPorUsuario[email].toLocaleString('es-AR'))}</TableCell>

                          <TableCell>
                            <Button
                              color='error'
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleUserRowClick(index)}
                            >
                              {expandedUser === index ? (
                                <>
                                  Ocultar
                                  <KeyboardArrowUpIcon />
                                </>
                              ) : (
                                <>
                                  Ver compras
                                  <KeyboardArrowDownIcon />
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#97979745', marginTop: '10px' }} colSpan={4}>
                            <Collapse in={expandedUser === index} timeout="auto" unmountOnExit>
                              <Box margin={1}>
                                {/* Agregar la tabla de compras por usuario */}
                                <Typography variant='h3' sx={{ margin: '14px' }}>Compras realizadas:</Typography>
                                <TableContainer component={Paper} elevation={12}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Fecha de compra</TableCell>
                                        <TableCell>N° De Orden</TableCell>
                                        <TableCell>Monto de la compra ($)</TableCell>

                                        <TableCell>Acciones</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {ordenes
                                        .filter((orden) => (orden.datosComprador.email || orden.email) === email)
                                        .map((orden, compraIndex) => (
                                          <React.Fragment key={orden.order_number}>
                                            <TableRow>
                                              <TableCell>{formatReadableDate(orden.createdAt)}</TableCell>
                                              <TableCell>{orden.order_number}</TableCell>

                                              <TableCell>
                                                ${orden.products.reduce((total, prod) => total + (Number(prod.precio) || Number(prod.price)), 0)}
                                              </TableCell>
                                              <TableCell>
                                                <Button
                                                  color='error'
                                                  aria-label="expand row"
                                                  size="small"
                                                  onClick={() => toggleOrderDetails(orden.id)}
                                                >
                                                  {openOrderId === orden.id ? (
                                                    <>
                                                      Ocultar
                                                      <KeyboardArrowUpIcon />
                                                    </>
                                                  ) : (
                                                    <>
                                                      Ver detalles
                                                      <KeyboardArrowDownIcon />
                                                    </>
                                                  )}
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                    
                                                {openOrderId === orden.id && (
                                                  <Paper elevation={5} sx={{ border: '1px solid grey', margin: '10px' }}>
                                            
                                                      <div className="divOrder" key={orden.id}>
                                                            
                                                            <div className="orderDetails">
                                                                <div style={{flex:'3'}} >
                                                                    <Typography variant="h5">DATOS DE LA ORDEN</Typography>
                                                                    <p>Orden Creada el: {formatReadableDate(orden.createdAt)}</p>
                                                                    <p>Compra realizada a travez de:  <strong style={{padding:'0px '}}>{orden.MercadoPago && 'Mercado Pago'}{orden.PayPal && 'Pay-Pal'}</strong></p>
                                                                    <br />
                                                                    <Typography variant="h5">DATOS DEL COMPRADOR:</Typography>
                                                                    <p> Nombre y Apellido: {orden.datosComprador?.nombreComprador} {orden.datosComprador?.apellidoComprador}</p>
                                                                    <p> Telefono: {orden.datosComprador?.tel_comprador}</p>
                                                                    <p> E-mail: {orden.datosComprador?.email}</p>
                                                                </div>
                                                                <hr />
                                                                <div style={{flex:'3'}}>

                                                                    {
                                                                        orden.retiraEnLocal === false ? (
                                                                            <>

                                                                                <Typography variant="h5">DATOS DESTINATARIO:</Typography>
                                                                                <p> Nombre y Apellido: {orden.datosEnvio?.nombreDestinatario} {orden.datosEnvio?.apellidoDestinatario}</p>
                                                                                <p> Telefono: {orden.datosEnvio?.phoneDestinatario}</p>
                                                                                <p> Fecha: {orden.datosEnvio?.fecha} </p>
                                                                                <p> Horario: {orden.datosEnvio?.horario}</p>
                                                                                <p> Dirección: {orden.datosEnvio?.calle} {orden.datosEnvio?.altura} {orden.datosEnvio?.piso}, {orden.datosEnvio?.localidad?.name}</p>
                                                                                <br />
                                                                                <p> Dedicatoria: <strong>{orden.datosEnvio?.dedicatoria}</strong> </p>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <h4>¡Has elegido Retirarlo en el local!</h4>
                                                                                <p> Dedicatoria: <strong>{orden.datosEnvio?.dedicatoria}</strong> </p>

                                                                            </>
                                                                        )
                                                                    }
                                                                </div>

                                                                        </div>
                                                                <hr />
                                                                <div className='div-prods-orden'>
                                                                    <Typography variant="h5" >PRODUCTOS COMPRADOS:</Typography>
                                                                    <ul>
                                                                        {orden.products?.map((product) => (
                                                                            <li key={product.id}>
                                                                                <img src={product.img} alt="Imagen del producto" width="50" />
                                                                                {product.name} | (Tamaño: {product.size}) | (Precio: ${product.precio}) | (Cantidad: {product.quantity}) |
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <br />

                                                    
                                                            </div>
                                                          <br />
                                                          <Button
                                                            aria-label="expand row"
                                                            size="small"

                                                            onClick={() => toggleOrderDetails(orden.id)}
                                                          >
                                                            {openOrderId === orden.id && (
                                                              <>
                                                                Ocultar
                                                                <KeyboardArrowUpIcon />
                                                              </>
                                                            )}
                                                          </Button>
                                                
                                                  </Paper>
                                                )}
                                          
                                          </React.Fragment>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

          }
        </Paper>

        <br />


        {/* Sección de productos más vendidos */}
        <Paper elevation={16} sx={{ marginTop: '20px' }}>
          <Typography sx={{ padding: '20px', backgroundColor: '#424242', color: '#ffffff' }} variant="h6">
            Los productos más vendidos fueron:
          </Typography>

          <Typography sx={{ padding: '20px' }} variant="subtitle2">
            Cantidad de productos mostrados: {visibleProducts}
          </Typography>
          <Grid container spacing={2}>
            {productosMasVendidos?.slice(0, visibleProducts).map((producto) => (
              <Grid item key={producto.id} xs={12} sm={6} md={4} lg={3}>

                <Card sx={{ maxWidth: 345, maxHeight: 345 }} >
                  <CardMedia
                    component="img"
                    height="140"
                    alt={producto.nombre}
                    image={producto.opciones[0]?.img || producto.img}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">{producto.nombre}</Typography>
                    <Typography variant="body2">Vendidos: {producto.vendidos} unidades</Typography>
                  </CardContent>
                </Card>

              </Grid>
            ))}
          </Grid>
          {
            visibleProducts < totalProducts && (
              <Button
                sx={{ margin: '10px' }}
                variant="contained"
                color="primary"
                onClick={handleShowMore}
                disabled={visibleProducts === totalProducts} // Desactivar el botón "Ver más" cuando ya se mostraron todos los productos
              >
                Ver más <ExpandMoreIcon />
              </Button>
            )
          }

          {
            visibleProducts > 8 && (
              <Button
                sx={{ margin: '10px' }}
                variant="contained"
                color="error"
                onClick={handleShowLess}
                disabled={visibleProducts === 8} // Desactivar el botón "Ver menos" cuando ya están visibles 8 productos
              >
                Ver menos <ExpandLessIcon />
              </Button>

            )}
        </Paper>

        {/* Puedes agregar la lógica para mostrar los productos más vistos */}

      </Paper>

    </Paper>
  );
}

export default VerVentas;
