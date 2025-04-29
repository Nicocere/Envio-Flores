"use client"

import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import style from './ventas.module.css';
import {
  Button,
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function VerVentas() {
  const navigate = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [products, setProducts] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderOf, setOrderOf] = useState('email');
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchOrders = async () => {
    const orderRef = collection(baseDeDatos, 'ordenes-envio-flores');
    const orderedQuery = query(orderRef, orderBy('order_number', 'desc'));
    const orderSnapShot = await getDocs(orderedQuery);
    const orderData = [];
    orderSnapShot.forEach((doc) => {
      orderData.push({ id: doc.id, ...doc.data() });
    });
    setOrdenes(orderData);
  };

  const fetchProducts = async () => {
    const productsCollection = query(collection(baseDeDatos, 'productos'));
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

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

  const totalVendidos = products.reduce((acc, producto) => acc + Number(producto.vendidos), 0);
  const productosMasVendidos = products.sort((a, b) => b.vendidos - a.vendidos);

  const comprasPorEmail = {};
  ordenes.forEach((orden) => {
    const { email } = orden.datosComprador;
    comprasPorEmail[email] = (comprasPorEmail[email] || 0) + 1;
  });

  const totalComprasPorUsuario = {};
  ordenes.forEach((orden) => {
    const { email } = orden.datosComprador;
    totalComprasPorUsuario[email] = (totalComprasPorUsuario[email] || 0) + parseFloat(orden.datosEnvio.totalPrice);
  });

  const totalMontoTodasOrdenes = ordenes.reduce((total, orden) => total + parseFloat(orden.datosEnvio.totalPrice), 0).toFixed(2);

  const handleUserRowClick = (index) => {
    setExpandedUser(expandedUser === index ? null : index);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderOf === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderOf(property);
  };

  const compareValues = (a, b) => {
    if (order === 'asc') {
      return a[orderOf] < b[orderOf] ? -1 : a[orderOf] > b[orderOf] ? 1 : 0;
    } else {
      return b[orderOf] < a[orderOf] ? -1 : b[orderOf] > a[orderOf] ? 1 : 0;
    }
  };

  const handleShowMore = () => {
    const newVisibleProducts = Math.min(visibleProducts + 8, totalProducts);
    setVisibleProducts(newVisibleProducts);
  };

  const handleShowLess = () => {
    setVisibleProducts(8);
  };

  useEffect(() => {
    setTotalProducts(productosMasVendidos.length);
  }, [productosMasVendidos]);

  const groupOrdersByMonth = (orders) => {
    const groupedOrders = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!groupedOrders[key]) {
        groupedOrders[key] = { count: 0, total: 0 };
      }

      groupedOrders[key].count += 1;
      groupedOrders[key].total += parseFloat(order.datosEnvio.totalPrice);
    });

    return groupedOrders;
  };

  const groupedOrders = groupOrdersByMonth(ordenes);

  const chartData = {
    labels: Object.keys(groupedOrders),
    datasets: [
      {
        label: 'Compras Realizadas',
        data: Object.values(groupedOrders).map((order) => order.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Precio Total de las Compras',
        data: Object.values(groupedOrders).map((order) => order.total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className={style.divVentas}>
      <div className={style.perfilUsuarioBtns}>
        <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
      </div>

      <h1> ¿Cómo vamos este mes?  </h1>

      <div className={style.divTextsOrders}>
        <p className={style.pOrders}>Bienvenido al Panel de Control de Ventas. Esta sección te proporciona un análisis detallado y completo de todas las transacciones realizadas en tu tienda.</p>
        <p className={style.pOrders}>En el resumen principal encontrarás métricas clave como el número total de productos vendidos y el monto total generado por las ventas. La sección de usuarios te permite ver detalles específicos de cada cliente, incluyendo su historial de compras y el total gastado.</p>
        <p className={style.pOrders}>Para acceder a los detalles de compra, utiliza los botones "Ver compras" junto a cada usuario. Allí encontrarás información completa sobre cada orden: datos del comprador, detalles del destinatario, productos adquiridos, dedicatorias y más.</p>
        <p className={style.pOrders}>En la sección de productos más vendidos, podrás visualizar el ranking de tus productos ordenados por popularidad. Usa los botones "Ver más" y "Ver menos" para ajustar la cantidad de productos mostrados.</p>
        <p className={style.pOrders}>Por último, el gráfico de barras muestra un resumen de las compras realizadas por mes. Cada barra representa el número de compras y el monto total de las ventas en un mes específico.</p>
        <p className={style.pOrders}>Las tablas son interactivas: puedes ordenar la información por email y expandir/contraer los detalles según necesites. Cada orden incluye fecha, número de orden, monto y acceso a información detallada de la entrega.</p>
      </div>
      <br />

      <div className={style.divOrders}>
        <Paper elevation={6} sx={{ padding: '10px' }}>
          <h1> Total de productos que vendimos:  </h1>
          <h3>
            <strong> {totalVendidos} </strong> productos vendidos
          </h3>
          <h3>  Un total de: <strong>{Number(totalMontoTodasOrdenes).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</strong></h3>
        </Paper>

        <br />

        <Paper elevation={12} sx={{ background: '#670000b8', color: '#fff', padding: '30px' }}>
          <h1>
            Usuarios y sus compras:
          </h1>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel sx={{ color: 'black', '&:hover': { color: '#373737' } }}
                      active={orderOf === 'email'}
                      direction={orderOf === 'email' ? order : 'asc'}
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
                        <TableCell>{comprasPorEmail[email] > 1 ? `${comprasPorEmail[email]} compras` : `${comprasPorEmail[email]} compra`}</TableCell>
                        <TableCell>${totalComprasPorUsuario[email].toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            aria-label="expand row"
                            variant='contained' size='large' sx={{ color: '#670000', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '5px 20px', background: '#670000', '&:hover': { background: '#ffffff', color: '#670000' } }}
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
                              <h3>Compras realizadas</h3>
                              <TableContainer component={Paper} elevation={12}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Fecha de compra</TableCell>
                                      <TableCell>Número de Orden</TableCell>
                                      <TableCell>Monto de la compra ($)</TableCell>
                                      <TableCell>Acciones</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {ordenes
                                      .filter((orden) => orden.datosComprador.email === email)
                                      .map((orden, compraIndex) => (
                                        <React.Fragment key={compraIndex}>
                                          <TableRow>
                                            <TableCell>{formatDate(orden.createdAt)}</TableCell>
                                            <TableCell>{orden.order_number}</TableCell>
                                            <TableCell>${orden.datosEnvio.totalPrice}</TableCell>
                                            <TableCell>
                                              <Button
                                                variant='contained' size='large' sx={{ color: '#670000', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '5px 10px', background: '#670000', '&:hover': { background: '#ffffff', color: '#670000' } }}
                                                onClick={() => setOpenOrderId(openOrderId === orden.id ? null : orden.id)}
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
                                          <TableRow>
                                            <TableCell
                                              style={{ paddingBottom: 0, paddingTop: 0, background: '#494949' }}
                                              colSpan={3}
                                            >
                                              {openOrderId === orden.id && (
                                                <Paper elevation={5} sx={{ border: '1px solid grey', margin: '10px' }}>
                                                  <TableRow key={compraIndex}>
                                                    <TableCell colSpan={6}>
                                                      <div className={style.orderDetails}>
                                                        <br />
                                                        <Typography variant="h6">DATOS DE LA ORDEN</Typography>
                                                        <p>Orden Creada el: <strong>{formatDate(orden.createdAt)}</strong></p>

                                                        {orden.payment === 'PayPal' ? (
                                                          <p>Metodo de Pago: PayPal</p>
                                                        ) : orden.payment === 'Mercado Pago Cuenta' ? (
                                                          <p>Metodo de Pago: Mercado Pago Cuenta</p>
                                                        ) : (
                                                          <p>Metodo de Pago: Tarjeta</p>
                                                        )}

                                                        <br />
                                                        <Typography variant="h6">DATOS COMPRADOR:</Typography>
                                                        <p> Nombre y Apellido comprador: <strong>{orden.datosComprador.nombreComprador} {orden.datosComprador.apellidoComprador}</strong></p>
                                                        <p> Telefono: <strong>{orden.datosComprador.tel_comprador}</strong></p>
                                                        <p> E-mail: <strong>{orden.datosComprador.email}</strong></p>
                                                        <br />
                                                        <hr />
                                                        <Typography variant="h6">{orden.retiraEnLocal ? "DATOS DE QUIEN RETIRA EL PRODUCTO" : "DATOS DE ENVIO:"}  </Typography>
                                                        {
                                                          orden.retiraEnLocal ? (
                                                            <p> Retira en local: <strong>Si</strong> </p>
                                                          ) : (

                                                            <>
                                                              <p> Nombre y Apellido destinatario: <strong>{orden.datosEnvio.nombreDestinatario} {orden.datosEnvio.apellidoDestinatario}</strong></p>
                                                              <p> Telefono: {orden.datosEnvio.phoneDestinatario ? (
                                                                <strong>{orden.datosEnvio.phoneDestinatario}</strong>
                                                              ) : (
                                                                <strong>No especificado</strong>
                                                              )}</p>
                                                              <p> Direccion: <strong>{orden.datosEnvio.calle} {orden.datosEnvio.altura}</strong></p>
                                                              <p> Piso: <strong>{orden.datosEnvio.piso}</strong></p>
                                                            </>
                                                          )
                                                        }

                                                        <p> Fecha: <strong>{orden.datosEnvio.fecha}</strong> </p>
                                                        <p> Horario: <strong>{orden.datosEnvio.horario}</strong></p>

                                                        <br />
                                                        <p> Dedicatoria: <strong>{orden.datosEnvio.dedicatoria}</strong> </p>
                                                        <br />
                                                        <hr />
                                                        <div className={style.divProdsOrders}>
                                                          <Typography variant="h6">Productos:</Typography>
                                                          <ul>
                                                            {orden.products.map((product) => (
                                                              <li key={product.id}>
                                                                {product.name} | (Tamaño: {product.size}) | (Precio: ${product.precio}) | (Cantidad: {product.quantity}) |
                                                                <Image width={120} height={120} src={product.img} alt="Imagen del producto" />
                                                              </li>
                                                            ))}
                                                          </ul>
                                                        </div>
                                                        <br />
                                                        <Button
                                                          aria-label="expand row"
                                                          size="small"
                                                          onClick={() => setOpenOrderId(openOrderId === orden.id ? null : orden.id)}
                                                        >
                                                          {openOrderId === orden.id && (
                                                            <>
                                                              Ocultar
                                                              <KeyboardArrowUpIcon />
                                                            </>
                                                          )}
                                                        </Button>
                                                      </div>
                                                    </TableCell>
                                                  </TableRow>
                                                </Paper>
                                              )}
                                            </TableCell>
                                          </TableRow>
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
        </Paper>

        <br />

        <Paper elevation={16} sx={{ marginTop: '20px', background: '#670000b8', padding: '30px' }}>
          <h1>
            Los productos más vendidos fueron:
          </h1>

          <h3>
            Cantidad de productos mostrados: <strong> {visibleProducts}</strong>
          </h3>
          <Grid container spacing={2}>
            {productosMasVendidos?.slice(0, visibleProducts).map((producto) => (
              <Grid item key={producto.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ maxWidth: 445, maxHeight: 545 }}>
                  <CardMedia
                    component="img"
                    height="300"
                    alt={producto.nombre}
                    image={producto.opciones[0].img}
                  />
                  <CardContent>
                    <h5>{producto.nombre}</h5>
                    <p>Vendidos:<strong style={{ color: '#670000' }}> {producto.vendidos} </strong>unidades</p>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {visibleProducts < totalProducts && (
            <Button
              sx={{ margin: '10px' }}
              variant="contained"
              color="primary"
              onClick={handleShowMore}
              disabled={visibleProducts === totalProducts}
            >
              Ver más <KeyboardArrowDownIcon />
            </Button>
          )}
          {visibleProducts > 8 && (
            <Button
              sx={{ margin: '10px' }}
              variant="contained"
              color="error"
              onClick={handleShowLess}
              disabled={visibleProducts === 8}
            >
              Ver menos <KeyboardArrowUpIcon />
            </Button>
          )}
        </Paper>

        <Paper elevation={16} sx={{ marginTop: '20px', padding: '30px' }}>
          <h1>Resumen de Compras por Mes</h1>
          <Bar data={chartData} />
        </Paper>
      </div>
    </div>
  );
}

export default VerVentas;