import { CartContext, useCart } from '../../context/CartContext';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Form from '../Form/Form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//Material UI
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, List, ListItem, ListItemText, Paper, Tab, Tabs, TextField, Typography, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';


import DeleteIcon from '@mui/icons-material/Delete';
import CheckoutStepper from '../ProgressBar/CheckoutStepper';

import MercadoPagoButton from '../MercadoPago/MercadoPago'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import CardPaymentMP from '../MercadoPago/PasarelaDePago/CardPayment';
import PayPalButton from '../PaypalCheckoutButton/PayPalButton';
import { useForm } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { CookieContext, useCookies } from '../../context/CookieContext';


const MySwal = withReactContent(Swal);

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'darkred',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: 'white',
    },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#fff',
            textTransform: 'uppercase',

        },
        '&.Mui-focusVisible': {
            backgroundColor: 'darkred',
        },
    }),
);

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            style={{ minHeight: '40vh' }}
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const Cart = () => {

    //Cart
    const { cart, setCart, decryptCart, finalPrice, eliminarProd, totalPrecio, priceDolar, dolar } = useCart();

    //Cookie
    const { acceptedCookies, acceptCookies, showCookiePrompt, setShowCookiePrompt, setAcceptedCookies } = useCookies();


    const total = totalPrecio();
    const isSmallScreen = useMediaQuery('(max-width:850px)');

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    const [activeStep, setActiveStep] = useState(2);

    const [completeForm, setCompleteForm] = useState(false)
    const [confirmationDone, setConfirmationDone] = useState(false);

    const [showPayments, setShowPayments] = useState(false);
    const [retiraEnLocal, setRetiraEnLocal] = useState(false);
    const [showMercadoPago, setShowMercadoPago] = useState(true);
    const [showCardPayment, setShowCardPayment] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [saveDedicatoria, setSaveDedicatoria] = useState('');


    //Material UI
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleMercadoPagoClick = () => {
        setShowMercadoPago(true);
        setShowCardPayment(false);
    };

    const handleCardPaymentClick = () => {
        setShowMercadoPago(false);
        setShowCardPayment(true);
    };



    const handleChangeRetirarProducto = () => {

        if (activeStep === 3) {
            setShowPayments(true)
            setRetiraEnLocal(true);
        } else {
            setShowPayments(false)
            setRetiraEnLocal(false)
            setConfirmationDone(false);
            setCompleteForm(false)
        }

    };

    const handleFinishPayment = () => {
        setShowPayments(!showPayments)
        setRetiraEnLocal(true);
    }

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    // Verificar si todos los campos requeridos están completos
    const handleConfirmationClick = () => {
        const fieldsFilled = (

            watch('nombreComprador') &&
            watch('telefonoComprador') &&
            watch('apellidoComprador') &&
            watch('mailComprador') === watch('validateMail')
        );
        if (fieldsFilled) {
            setConfirmationDone(true);
            setCompleteForm(true)
        } else {

            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos y selecciona una localidad antes de confirmar.',
            });
        }
    };

    const handleChangeBtn = (e) => {
        e.preventDefault();
        setSaveDedicatoria(watch('dedicatoria'));
        reset({ dedicatoria: saveDedicatoria });
    }


    const deleteAll = () => {
        return (
            MySwal.fire({
                title: 'Quieres eliminar todos los productos?',
                text: "Vaciaras el carrito",
                icon: 'warning',

                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setCart([])
                    Swal.fire(
                        'Carrito Vacio!',
                        'Tu carrito ha sido vaciado.',
                        'success',


                    );
                }
            })
        )
    }


    const decryptedCart = Array.isArray(decryptCart(cart)) ? decryptCart(cart) : [];
    let itemSelected

    if (cart.length === undefined) {
        itemSelected = decryptedCart?.map((item) => {
            return { ...item }
        });

    } else {
        itemSelected = cart?.map((item) => {
            return { ...item }
        });

    }

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const pagoExitoso = queryParams.get('PagoExistoso');
    const paymentID = queryParams.get('Payment-ID');
    const order = queryParams.get('Order')
    const pagoPaypalExitoso = queryParams.get('PagoPayPalExistoso');
    // const CartID = queryParams.get('CartID');


    //manejo de errores
    const error = queryParams.get('Error');

    const pagoFallido = queryParams.get('PagoFallido');

    const [lastOrder, setLastOrder] = useState(null);
    let order_number = parseFloat(order)
    const [orderCartID, setOrderCartID] = useState(null);

    useEffect(() => {

        const getLastOrder = async () => {
            try {
                const ordersCollection = collection(baseDeDatos, 'ordenes');
                const ordersQuery = query(
                    ordersCollection,
                    orderBy('order_number', 'desc'),
                    where('order_number', '==', order_number),
                    limit(1),
                );

                const ordersSnapshot = await getDocs(ordersQuery);
                // let lastCode = Number;
                if (!ordersSnapshot.empty) {
                    const dataLastOrder = ordersSnapshot.docs[0].data();
                    // lastCode = lastOrder.order_number;
                    setLastOrder(dataLastOrder);
                    setOrderCartID(dataLastOrder.CartID);
                }
            } catch (error) {
                console.error('Error al obtener la última orden:', error);
                // Manejar el error según sea necesario
                setLastOrder(null);
            }
        };

        // Solo buscar la última orden si existe el parámetro 'Order' en la URL
        if (order) {
            getLastOrder();
        }

    }, [order]);

    console.log("orderCartID", orderCartID)
    // const [showCookiePrompt, setShowCookiePrompt] = useState(false);

    const handleAcceptCookies = () => {
        acceptCookies();
    };

    const handleViewCookies = () => {
        // Handle view cookies logic here
        window.location.href = '/cookies';
    };
    let hasAcceptedCookies = null
    const storedCartID = localStorage.getItem('CartID');
    const storedUserID = localStorage.getItem('UserID');
    hasAcceptedCookies = localStorage.getItem('acceptedCookies');

    useEffect(() => {
        if (!hasAcceptedCookies || !storedCartID || !storedUserID) {
            setShowCookiePrompt(true);
            setAcceptedCookies(false);
        } else {
            setShowCookiePrompt(false);
            setAcceptedCookies(true);
        }
    }, [showCookiePrompt, hasAcceptedCookies]);


    //NECESITO CREAR UNA VALIDACION PARA VERIFICAR QUE EL USUARIO NO ESTE INGRESANDO A UNA ORDEN QUE NO LE PERTENEZCA RESPECTO A SU CARTID O USERID QUE ESTA ALMACENADO EN EL LOCALSTORAGE
    if ((orderCartID === storedCartID) && (pagoExitoso === 'true' || pagoPaypalExitoso === 'true') && order) {

        if ((pagoExitoso === 'true' || pagoPaypalExitoso === 'true') && order) {
            return (
                <div className='div-compraFinalizada'>

                    {lastOrder && (
                        <div style={{ background: 'linear-gradient(to bottom, #dbdbdb , white)', borderRadius: '10px', margin: isSmallScreen ? '10px' : '40px' }}>
                            <h1 style={{ alignContent: 'center', fontWeight: 800, }}>¡Compra Exitosa!</h1>
                            <CheckCircleIcon color='success' fontSize='large' />
                            <h3 style={{ marginTop: '30px' }} >Hola <strong style={{ color: '#670000' }}> {lastOrder.datosComprador?.nombreComprador} {lastOrder.datosComprador?.apellidoComprador}</strong></h3>

                            <Paper elevation={24} sx={{ background: 'transparent', margin: '5px', borderRadius: '15px' }}>

                                <Box sx={{ bgcolor: '#670000' }}>
                                    <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="error"
                                        textColor="inherit" centered
                                        variant={!isSmallScreen && 'fullWidth'}>

                                        <StyledTab sx={{ padding: isSmallScreen && '5px', minWidth: '50px' }} icon={<ReceiptIcon />} label={!isSmallScreen && "Resumen"} />
                                        <StyledTab sx={{ padding: isSmallScreen && '5px', minWidth: '50px' }} icon={<CardGiftcardIcon />} label={!isSmallScreen && "Productos"} />
                                        <StyledTab sx={{ padding: isSmallScreen && '5px', minWidth: '50px' }}
                                            icon={lastOrder.retiraEnLocal ? <StoreRoundedIcon /> : <LocalShippingRoundedIcon />}
                                            label={!isSmallScreen && (lastOrder.retiraEnLocal ? "Retiro" : "Envío")}
                                        />
                                        <StyledTab sx={{ padding: isSmallScreen && '5px', minWidth: '50px' }} icon={<CreditCardRoundedIcon />} label={!isSmallScreen && "Pago"} />
                                    </StyledTabs>

                                </Box>

                                <TabPanel value={value}  {...a11yProps(0)} index={0}>
                                    <Typography>Resumen de la compra:</Typography>
                                    <h4>El ID de tu compra es: <strong style={{ color: '#670000' }}> {lastOrder.order_number}</strong> </h4>
                                    <p>Tu compra ha sido procesada correctamente.</p>
                                    <p>Compraste  <strong style={{ color: '#670000' }}> {lastOrder.products.length}</strong> {lastOrder.products.length > 1 ? 'productos' : 'producto'}</p>
                                    <p>Precio total final: <strong style={{ color: '#670000' }}> ${lastOrder.amount}</strong> </p>

                                    {isSmallScreen ?
                                        <>
                                            {lastOrder.retiraEnLocal ?
                                                <>
                                                    <p style={{ color: '#670000', fontWeight: 800, padding: '5px 10px' }}>Usted seleccionó que desea retirar el producto por nuestro local.</p>
                                                    <p style={{ color: 'black', fontWeight: 800, padding: '5px 10px' }}>Puede hacerlo de 7hs - 18hs en Av. Cramer 1915 (Belgrano, CABA)</p>
                                                </>
                                                :
                                                <>
                                                    <Typography variant='button' sx={{ color: '#670000', fontWeight: 800 }}>Usted seleccionó que desea retirar el producto por nuestro local.</Typography>
                                                    <Typography variant='button' sx={{ color: 'black', fontWeight: 800 }}>Puede hacerlo de 7hs - 18hs en Av. Cramer 1915 (Belgrano, CABA)</Typography>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <h5 style={{ color: '#670000', fontWeight: 800 }}>Usted seleccionó que desea que enviemos su producto.
                                            </h5>
                                            <span style={{ fontWeight: '500', fontSize: '.84rem' }}>{lastOrder.datosEnvio?.servicioPremium ? `Eligio el Servicio Premium, por lo que su producto estará llegando a las ${lastOrder.datosEnvio.horario}` : `Eligio el servicio de entrega normal, por lo que estaremos enviando sus productos entre las ${lastOrder.datosEnvio.horario}.`}</span>
                                        </>
                                    }

                                </TabPanel>
                                <TabPanel value={value}  {...a11yProps(1)} index={1}>
                                    <Typography>Productos comprados:</Typography>
                                    <List>
                                        {lastOrder.products?.map((prod, indx) => (
                                            <ListItem key={indx} sx={{ paddingLeft: '7px', borderBottom: '1px solid #c0c0c085' }}>
                                                <img width={120} height={120} style={{ marginRight: '15px' }} src={prod.img} alt="imagen producto en carrito" />
                                                <ListItemText sx={{ fontWeight: '600', flex: '2', color: 'black' }} primary={prod.name} secondary={`Cantidad: ${prod.quantity}`} />
                                                <ListItemText sx={{ fontWeight: '600', flex: '1', marginLeft: '10px', color: 'black' }} primary={priceDolar ? `USD$${Number(prod.price / dolar).toFixed(2) || Number(prod.precio / dolar).toFixed(2)}` : `$${prod.precio || prod.price}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </TabPanel>
                                <TabPanel value={value} {...a11yProps(2)} index={2}>
                                    {
                                        (lastOrder.datosEnvio && !lastOrder.retiraEnLocal) &&
                                        <>
                                            <div>
                                                <h2>ENVIA LOS PRODUCTOS</h2>
                                                {isSmallScreen ?
                                                    <>
                                                        <p style={{ color: '#670000', fontWeight: 800, padding: '5px 10px' }}>Usted seleccionó que desea que enviemos su producto.
                                                        </p>
                                                        <span style={{ fontWeight: '500', fontSize: '.74rem' }}>{lastOrder.datosEnvio?.servicioPremium ? `` : `Eligio el servicio de entrega normal, por lo que estaremos enviando sus productos entre las ${lastOrder.datosEnvio.horario}.`}
                                                        </span>
                                                    </>
                                                    :
                                                    <>
                                                        <h5 style={{ color: '#670000', fontWeight: 800 }}>Usted seleccionó que desea que enviemos su producto.
                                                        </h5>
                                                        <span style={{ fontWeight: '500', fontSize: '.84rem' }}>{lastOrder.datosEnvio?.servicioPremium ? `` : `Eligio el servicio de entrega normal, por lo que estaremos enviando sus productos entre las ${lastOrder.datosEnvio.horario}.`}</span>
                                                    </>}
                                            </div><Grid container spacing={2} sx={{ padding: '10px', display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>

                                                <Paper elevation={12} sx={{ flex: '1', margin: '10px', border: '1px solid darkred', borderRadius: '5px' }}>
                                                    <Typography variant='subtitle1' sx={{ background: '#670000', color: 'white', lineHeight: '2.75' }}>Datos del datosEnvio:</Typography>
                                                    <Typography variant='button' sx={{ verticalAlign: '-webkit-baseline-middle' }}>
                                                        Calle:  <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.calle} </strong> <br />
                                                        Altura: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.altura} </strong> <br />
                                                        Piso: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.piso} </strong> <br />
                                                        Localidad: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.localidad?.name} </strong> <br />
                                                        Fecha de entrega: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.fecha} </strong> <br />
                                                        Hora de entrega: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.horario} </strong> <br />
                                                    </Typography>
                                                </Paper>


                                                <Paper elevation={12} sx={{ flex: '1', margin: '10px', border: '1px solid darkred', borderRadius: '5px' }}>
                                                    <Typography variant='subtitle1' sx={{ background: '#670000', color: 'white', lineHeight: '2.75' }}>Datos de quien recibe:</Typography>

                                                    <Typography variant='button' sx={{ verticalAlign: '-webkit-baseline-middle' }}>
                                                        Lo recibe:  <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.nombreDestinatario} {lastOrder.datosEnvio.apellidoDestinatario} </strong> <br />
                                                        Telefono: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.phoneDestinatario} </strong> <br />
                                                        Dedicatoria: <strong style={{ color: 'darkred' }}> {lastOrder.datosEnvio.dedicatoria} </strong> <br />

                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </>

                                    }

                                    {
                                        lastOrder.retiraEnLocal &&
                                        <div >
                                            <h2 >Retira en el Local</h2>
                                            {isSmallScreen ?
                                                <>
                                                    <p style={{ color: '#670000', fontWeight: 800, padding: '5px 10px' }}>Usted seleccionó que desea retirar el producto por nuestro local.</p>
                                                    <p style={{ color: 'black', fontWeight: 800, padding: '5px 10px' }}>Puede hacerlo de 7hs - 18hs en Av. Cramer 1915 (Belgrano, CABA)</p>
                                                </>

                                                :
                                                <>
                                                    <h5 style={{ color: '#670000', fontWeight: 800 }}>Usted seleccionó que desea retirar el producto por nuestro local.</h5>
                                                    <h5 style={{ color: 'black', fontWeight: 800 }}>Puede hacerlo de 7hs - 18hs en Av. Cramer 1915 (Belgrano, CABA)</h5>
                                                </>

                                            }

                                            <iframe
                                                width={'100%'}
                                                height={'400'}
                                                margin={0}
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4946009088108!2d-58.46220712511634!3d-34.566349655524135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5d6f32252a9%3A0xe6ccbfb70807bab0!2sAv.%20Cr%C3%A1mer%201915%2C%20C1428CTC%20CABA!5e0!3m2!1ses!2sar!4v1698074048732!5m2!1ses!2sar" title="Ubicación"
                                            ></iframe>
                                        </div>

                                    }

                                </TabPanel>
                                <TabPanel value={value}  {...a11yProps(3)} index={3}>
                                    <Typography>Pago realizado con exito</Typography>

                                    <Typography variant='h5'>Realizo la compra mediante:
                                        <strong style={{ color: 'darkred' }}>

                                            {lastOrder.code_mercadopago && 'Mercado Pago'}
                                            {lastOrder.code_paypal && 'PayPal'}
                                        </strong>
                                    </Typography>
                                    <Typography variant='button'>
                                        El pago total de su compra fue de: <strong style={{ color: 'darkred' }}>
                                            ${lastOrder.amount}</strong>
                                    </Typography>
                                    <Typography >Mail de confirmación de compra:<strong style={{ color: 'darkred' }}> {lastOrder.email || lastOrder.datosComprador.email} </strong> </Typography>
                                    <Typography variant='caption'>Compruebe su correo electronico (en algunos casos, puede ser que este en su casillero de Spam)</Typography>

                                </TabPanel>
                            </Paper>
                            {/* )
} */}
                            <hr style={{ color: 'white', border: '3px solid white' }} />
                            <h4 style={{ color: '#670000', fontWeight: 800, marginTop: '50px' }}>¡Gracias por confiar en nosotros!</h4>
                            <img width={isSmallScreen ? 80 : 100} height={isSmallScreen ? 80 : 100} src={'/assets/imagenes/logo-envio-flores.png'} alt="logo datosEnvio flores" />
                            <hr style={{ color: 'white', border: '3px solid white' }} />

                            <h5 style={{ padding: '20px' }}>Puedes ir al <Link href="/" style={{ color: '#670000', fontWeight: 800 }}>Inicio</Link>{' '} para buscar y agregar otros productos </h5>
                        </div>
                    )}

                    {
                        (error || pagoFallido) && (
                            <>
                                <hr />
                                <p className='details-compra'>Hemos tenido un inconveniente al enviarte el mail de confirmacion.</p>
                                <p className='details-compra'> Pero no te preocupes!. </p>
                                <p className='details-compra'> Tu compra se ha realizado con exito!</p>
                                <p className='details-compra'> A continuacion, podras enviarnos un mensaje de WhatsApp para verificar el estado de tu compra.</p>
                                <div style={{
                                    marginTop: '30px',
                                }} >

                                    <a style={{
                                        color: 'white', padding: '20px', background: 'linear-gradient(to top, #a70000, #670000)', textDecoration: 'none',
                                        border: '1px solid darkred', borderRadius: '5px', marginTop: '30px', transition: 'all .44s ease-in-out',
                                        ':&hover': { color: 'white' }
                                    }}
                                        href="https://wa.me/+5491165421003?text=Hola%20EnvioFlores%20,%20He%20realizado%20un%20pedido%20mediante%20paypal%20,%20lo%20recibiste?!">
                                        Envianos un mensaje haciendo clíck aquí
                                    </a>
                                </div>

                            </>
                        )
                    }
                </div>
            );
        }


        if ((pagoExitoso === 'true' || pagoPaypalExitoso === 'true') && (error === 'true' || pagoFallido === 'true')) {
            return (
                <div className='div-compraFinalizada' style={{ margin: isSmallScreen ? '0' : '50px' }}>
                    <Typography variant='h3' className='compraFinalizada'>Gracias por comprar en Envio Flores. </Typography>

                    <p className='details-compra'>Hemos tenido un inconveniente al enviarte el mail de confirmacion.</p>
                    <p className='details-compra'> Pero no te preocupes!. </p>
                    <Typography variant='h4' className='details-compra'> ¡Tu compra se ha realizado con exito!  <CheckCircleIcon color='success' fontSize='large' />
                    </Typography>
                    <p className='details-compra'> A continuacion, podras enviarnos un mensaje de WhatsApp para verificar el estado de tu compra.</p>
                    <div style={{
                        margin: '30px',
                        padding: '20px',
                    }} >

                        <a className="link"
                            href="https://wa.me/+5491165421003?text=Hola%20EnvioFlores%20,%20He%20realizado%20un%20pedido%20mediante%20paypal%20,%20lo%20recibiste?!">
                            <Typography variant='button'>
                                Envianos un mensaje haciendo clíck aquí
                            </Typography>              <FaWhatsapp className='link-wp' />

                        </a>
                    </div>
                    <hr style={{ color: 'white', border: '3px solid white' }} />
                    <Paper elevation={24}>

                        <h4 style={{ color: '#670000', fontWeight: 800, marginTop: '50px' }}>¡Gracias por confiar en nosotros!</h4>
                        <img width={isSmallScreen ? 80 : 100} height={isSmallScreen ? 80 : 100} src='/assets/imagenes/logo-envio-flores.png' alt="logo datosEnvio flores" />
                        <hr style={{ color: 'white', border: '3px solid white' }} />
                        <h5 style={{ padding: '20px' }}>Puedes ir al <Link href="/" style={{ color: '#670000', fontWeight: 800 }}>Inicio</Link>{' '} para buscar y agregar otros productos </h5>
                    </Paper>


                </div>
            );
        }
    }

    if ((orderCartID !== storedCartID) && (pagoExitoso === 'true' || pagoPaypalExitoso === 'true') && order) {
        return (
            <div style={{ margin: isSmallScreen ? '0' : '30px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h1>Lo sentimos, pero no puedes acceder a esta orden</h1>
                <p>Por favor, verifica que la orden que intentas acceder sea la correcta.</p>
                <p>Si tienes alguna duda, por favor, comunicate con nosotros.</p>
                <Button variant='contained' sx={{ margin: '20px 0' }} color='error' href="https://wa.me/+5491165421003?text=Hola%20EnvioFlores%20,%20He%20realizado%20un%20pedido%20mediante%20su%20pagina%20,%20lo%20recibiste?!">Contactanos</Button>

                <img src={'/assets/imagenes/logo-envio-flores.png'} alt="Error 404" style={{ width: '150px', height: '150px' }} />
            </div>
        )
    }

    return (
        <>
            {
                (activeStep < 2 && !confirmationDone || !retiraEnLocal) &&
                <CheckoutStepper activeStep={2} cartEmpty={cart.length === 0} cartFull={cart.length !== 0} />
            }

            {
                retiraEnLocal && ((retiraEnLocal && !confirmationDone && <CheckoutStepper activeStep={3} />))
            }

            < div className='cart' >
                {
                    // Si las cookies no están aceptadas
                    !acceptedCookies ? (
                        <>
                            <h1 className='cartVacio'>
                                Lo sentimos, pero no podemos continuar sin su consentimiento.
                                Por favor acepte las cookies para continuar...
                            </h1>

                            <Button variant="text" color='success' onClick={handleAcceptCookies}>
                                Aceptar cookies
                            </Button>
                            <Button variant="text" color='success' onClick={handleViewCookies}>
                                Ver política de cookies
                            </Button>
                        </>
                    ) : (
                        // Si las cookies están aceptadas pero el carrito está vacío
                        cart.length === 0 ? (
                            <>
                                <h1 className='cartVacio'>
                                    El Carrito esta vacío...
                                    Puedes ir al <Link href="/" className='cart-home'>Inicio</Link>{' '}
                                    para buscar y agregar algún producto
                                </h1>
                            </>
                        ) : (
                            // Si las cookies están aceptadas y el carrito no está vacío
                            <>
                                {
                                    retiraEnLocal ?

                                        <Button variant="contained" sx={{ marginBottom: 0, marginTop: 1.25, marginRight: '10px' }} color='error' onClick={() => { handleStepChange(2); handleChangeRetirarProducto(); }}>
                                            Ver el carrito de compras
                                        </Button>

                                        :
                                        <>

                                            {/* Informacion del Carrito de compras */}
                                            {
                                                activeStep <= 2 && (

                                                    isSmallScreen ?
                                                        (<>
                                                            <Typography variant='h4' sx={{ color: 'black' }} >Tu pedido está listo<LocalFloristIcon sx={{ color: '#a70000', ml: 1, verticalAlign: 'middle' }} /></Typography>
                                                            <Typography variant='overline' sx={{ color: 'black' }}>Sorprende a alguien especial con tu elección</Typography>

                                                            <List>
                                                                {itemSelected.map((prod, indx) => (
                                                                    <ListItem key={indx} sx={{ paddingLeft: '7px', borderBottom: '1px solid #c0c0c085' }}>
                                                                        <img className='imgInCart' src={prod.img} alt="Imagen producto en carrito" style={{ marginRight: '5px' }} />
                                                                        <ListItemText sx={{ fontWeight: '700', flex: '2', color: '#670000', maxWidth: '13ch' }} primary={prod.name} secondary={`Cantidad: ${prod.quantity}, Talle: ${prod.size}`} />
                                                                        <ListItemText sx={{ fontWeight: '600', flex: '1', marginLeft: '10px', color: 'black' }} primary={priceDolar ? `USD$${(prod.precio / dolar).toFixed(2)}` : `$${prod.precio.toLocaleString('es-AR')}`} />
                                                                        <IconButton aria-label="delete" size="large"

                                                                            onClick={() => eliminarProd(prod.name,
                                                                                prod.size,
                                                                                prod.precio,
                                                                                prod.quantity
                                                                            )}>
                                                                            <DeleteIcon sx={{ fontSize: isSmallScreen ? '18px' : '22px' }} color="error" />

                                                                        </IconButton>
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                            <Button color='error' size='small' variant='contained' sx={{ alignSelf: 'center', margin: '15px' }} onClick={() => { deleteAll() }}>Eliminar Todo</Button>
                                                            {
                                                                priceDolar ?
                                                                    <h3 className='totalPrecio'>Precio total: USD${total}</h3>
                                                                    :
                                                                    <h3 className='totalPrecio'>Precio total: ${total.toLocaleString('es-AR')}</h3>
                                                            }
                                                        </>

                                                        )
                                                        :
                                                        <>
                                                            <Typography variant='h4' sx={{ color: 'black' }} >Tu pedido está casi listo<LocalFloristIcon sx={{ color: '#a70000', ml: 1, verticalAlign: 'middle' }} /></Typography>
                                                            <Typography variant='overline' sx={{ color: 'black' }}>Todo lo que necesitas para sorprender a alguien especial.</Typography>
                                                            <TableContainer>
                                                                <Table sx={{ maxWidth: '1200px', margin: '0 auto' }} aria-label="simple table" size='small'>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Imagen</TableCell>
                                                                            <TableCell>Producto</TableCell>
                                                                            <TableCell>Cantidad</TableCell>
                                                                            <TableCell>Tamaño</TableCell>
                                                                            <TableCell>Precio</TableCell>
                                                                            <TableCell>Acciones</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {itemSelected?.map((prod, indx) => {
                                                                            const prodPrecioUsd = (prod.precio / dolar).toFixed(2);
                                                                            return (
                                                                                <TableRow key={indx}>
                                                                                    <TableCell><img className='imgInCart' src={prod.img} alt="Imagen producto en carrito" /></TableCell>
                                                                                    <TableCell>{prod.name}</TableCell>
                                                                                    <TableCell>{prod.quantity}</TableCell>
                                                                                    <TableCell>{prod.size}</TableCell>
                                                                                    <TableCell>
                                                                                        {priceDolar ? `USD$${prodPrecioUsd}` : `$${prod.precio.toLocaleString('es-AR')}`}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <IconButton aria-label="delete" size="large"
                                                                                            onClick={() => eliminarProd(prod.name,
                                                                                                prod.size,
                                                                                                prod.precio,
                                                                                                prod.quantity
                                                                                            )}>
                                                                                            <DeleteIcon sx={{ fontSize: isSmallScreen ? '18px' : '22px' }} color="error" />
                                                                                        </IconButton>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            <br>

                                                            </br><Button variant="contained" color='error' sx={{ fontSize: isSmallScreen ? '8px' : '20px' }} onClick={deleteAll} startIcon={<DeleteIcon />}>
                                                                ELIMINAR TODO
                                                            </Button>


                                                            {
                                                                priceDolar ?
                                                                    <h3 className='totalPrecio'>Total: USD${total}</h3>
                                                                    :
                                                                    <h3 className='totalPrecio'>Total: ${total.toLocaleString('es-AR')}</h3>
                                                            }
                                                        </>
                                                )}
                                        </>
                                }

                                {activeStep <= 2 ? (

                                    <>

                                        <Paper elevation={24} sx={{  background: isSmallScreen ? 'transparent' :'linear-gradient(to top, #a70000, #670000)', padding: '30px, 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                                            <Typography variant='h3' sx={{ color: isSmallScreen ? '#670000' : 'white', fontSize: '25px', padding: '20px' }}>
                                                {showPayments ? 'Retiro en local seleccionado' : `Envío de ${cart.length <= 1 ? 'producto' : 'productos'}`}
                                            </Typography>



                                            {retiraEnLocal &&

                                                <>

                                                    {
                                                        !completeForm ?
                                                            (<form onSubmit={handleSubmit} className='form'>
                                                                {/* <CheckoutStepper activeStep={3} cartEmpty={cart.length === 0} /> */}

                                                                <div className='datos-recibe'>
                                                                    <Typography variant="h6" sx={{ color: '#670000', fontWeight: 600, marginBottom: '10px' }}>
                                                                        <CheckCircleIcon sx={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                                                        Gracias por elegir Envio Flores para su compra
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        <LocalFloristIcon sx={{ verticalAlign: 'middle', marginRight: '8px', color: '#670000' }} />
                                                                        Para completar su pedido, necesitamos algunos datos personales a continuación.
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ marginTop: '10px', fontStyle: 'italic' }}>
                                                                        <AccountBoxIcon sx={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '0.9rem', color: '#670000' }} />
                                                                        Su información está segura y será utilizada exclusivamente para procesar su pedido.
                                                                    </Typography>
                                                                </div>

                                                                <Paper elevation={12} sx={{ width: isSmallScreen ? '100%' : '70%', padding: '10px' }} className='datos-datosComprador'>

                                                                    <h3 className='titulo-datosEnvio'>Datos de quien retira el producto:</h3>

                                                                    <TextField
                                                                        {...register("nombreComprador", { required: true })}
                                                                        type="text"
                                                                        placeholder="Ingrese su nombre"
                                                                        name="nombreComprador"
                                                                        className='input-nombreApellido'
                                                                        required
                                                                        label='Nombre'
                                                                        size='small'
                                                                        margin='dense'
                                                                        variant="filled"
                                                                        color='success'
                                                                        sx={{
                                                                            '& .MuiInputBase-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiFilledInput-input': {
                                                                                color: 'darkgreen'
                                                                            }
                                                                        }}
                                                                    />
                                                                    {errors.nombreComprador && <p className='message-error' >Por favor ingrese su nombre</p>}

                                                                    <TextField
                                                                        {...register("apellidoComprador", { required: true })}
                                                                        type="text"
                                                                        placeholder="Ingrese su apellido"
                                                                        name="apellidoComprador"
                                                                        className='input-nombreApellido'
                                                                        required
                                                                        label='Apellido'
                                                                        size='small'
                                                                        margin='dense'
                                                                        variant="filled"
                                                                        color='success'
                                                                        sx={{
                                                                            '& .MuiInputBase-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiFilledInput-input': {
                                                                                color: 'darkgreen'
                                                                            }
                                                                        }}
                                                                    />
                                                                    {errors.apellidoComprador && <p className='message-error'>Por favor ingrese su apellido</p>}

                                                                    <TextField
                                                                        {...register("telefonoComprador", { required: true })}
                                                                        type="text"
                                                                        placeholder="Ingrese su número telefónico"
                                                                        name="telefonoComprador"
                                                                        className='input-nombreApellido'
                                                                        label='Teléfono de contacto'
                                                                        margin='dense'
                                                                        size='small'
                                                                        required
                                                                        variant="filled"
                                                                        color='success'
                                                                        sx={{
                                                                            '& .MuiInputBase-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiFilledInput-input': {
                                                                                color: 'darkgreen'
                                                                            }
                                                                        }}
                                                                    />
                                                                    {errors.telefonoComprador && <p className='message-error'>Por favor ingrese su número telefónico para contactarlo en caso necesario</p>}

                                                                    <TextField
                                                                        {...register("mailComprador", { required: true })}
                                                                        type="email"
                                                                        placeholder="Ingrese su correo electrónico"
                                                                        name="mailComprador"
                                                                        className='input-email'
                                                                        required
                                                                        label='Correo electrónico'
                                                                        size='small'
                                                                        margin='dense'
                                                                        variant="filled"
                                                                        color='success'
                                                                        sx={{
                                                                            '& .MuiInputBase-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiFilledInput-input': {
                                                                                color: 'darkgreen'
                                                                            }
                                                                        }}
                                                                    />
                                                                    {errors.mailComprador && <p className='message-error'>Por favor ingrese un correo electrónico válido</p>}

                                                                    <TextField
                                                                        {...register("validateMail", { required: true })}
                                                                        type="email"
                                                                        placeholder="Confirme su correo electrónico"
                                                                        name="validateMail"
                                                                        className='input-email'
                                                                        required
                                                                        label='Confirmar correo electrónico'
                                                                        size='small'
                                                                        margin='dense'
                                                                        variant="filled"
                                                                        color='success'
                                                                        sx={{
                                                                            '& .MuiInputBase-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                                color: 'darkred',
                                                                            },
                                                                            '& .MuiFilledInput-input': {
                                                                                color: 'darkgreen'
                                                                            }
                                                                        }}
                                                                    />
                                                                    {watch('validateMail') !== watch('mailComprador') && <p className='message-error'>Los correos electrónicos no coinciden</p>}

                                                                    <div style={{
                                                                        marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                                    }}>
                                                                        <h4 className='dedic-text'>Personalice su pedido con un mensaje especial:</h4>

                                                                        <textarea 
                                                                            {...register('dedicatoria')} 
                                                                            className='dedicatoria' 
                                                                            name="dedicatoria"
                                                                            placeholder="Escriba aquí su dedicatoria o mensaje personal..."
                                                                        />
                                                                        <div className='dedic-instructions'>
                                                                            <small className='dedic-text'>• Ejemplo: "Feliz Cumpleaños, te quiero mucho!"</small>
                                                                            <small className='dedic-text'>• El mensaje se enviará junto con su pedido</small>
                                                                            <small className='dedic-text'>• Deje el campo vacío si no desea incluir mensaje</small>
                                                                            <small className='dedic-text'>• Haga clic en "Guardar Mensaje" para confirmar</small>
                                                                        </div>
                                                                        <Button size='small' variant='contained' color='error'
                                                                            sx={{
                                                                                marginBottom: 1.20, marginTop: 1.20, '&:hover': {
                                                                                    backgroundColor: '#a70000',
                                                                                    fontWeight: 500
                                                                                },
                                                                            }} onClick={handleChangeBtn}>Guardar Mensaje</Button>

                                                                        {
                                                                            saveDedicatoria ? (
                                                                                <>
                                                                                    <h4 className='dedic-titulo'>Su mensaje guardado:</h4>
                                                                                    <h3 className='dedic-save'>{saveDedicatoria}</h3>
                                                                                </>
                                                                            ) : saveDedicatoria === ""
                                                                        }
                                                                    </div>
                                                                </Paper>

                                                                {
                                                                    !confirmationDone &&
                                                                    <>
                                                                        <Typography variant="body1" sx={{ marginTop: '20px', color: '#670000', fontWeight: 500 }}>
                                                                            Al confirmar sus datos, podrá proceder al pago y finalizar su pedido.
                                                                        </Typography>
                                                                        <Button variant='contained' color='success' sx={{ marginTop: '15px' }}
                                                                            onClick={() => {
                                                                                handleConfirmationClick();
                                                                            }}>
                                                                            CONFIRMAR DATOS
                                                                        </Button>
                                                                    </>
                                                                }

                                                                {priceDolar ? (
                                                                    <h2 className='totalPrecio'>Total final: USD${finalPrice}</h2>
                                                                ) : (
                                                                    <h2 className='totalPrecio'>Total final: ${finalPrice}</h2>
                                                                )}

                                                                <Typography variant="body2" sx={{ marginTop: '15px', fontStyle: 'italic', maxWidth: '500px', margin: '0 auto' }}>
                                                                    <span style={{ color: '#670000', fontWeight: 'bold' }}>
                                                                        ¡Ya casi termina! Complete el formulario y continúe hacia el proceso de pago para completar su pedido.
                                                                    </span>
                                                                </Typography>
                                                            </form>
                                                            )
                                                            :
                                                            <>

                                                                <CheckoutStepper activeStep={4} />
                                                                {confirmationDone &&
                                                                    <Paper elevation={12} sx={{ padding: isSmallScreen ? '10px' : '50px' }}>
                                                                        <Typography variant='h4'>Gracias por ingresar tus datos, ahora puede proceder con finalizar la compra. </Typography>

                                                                        <Accordion>
                                                                            <AccordionSummary sx={{ background: '#a70000' }} expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                                                                <Typography sx={{ color: 'white', textTransform: 'uppercase' }}>Datos de quien retira el Producto.</Typography>
                                                                            </AccordionSummary>
                                                                            <AccordionDetails>
                                                                                <Typography variant='button'>
                                                                                    Nombre:  <strong style={{ color: 'darkred' }}> {watch('nombreComprador')} </strong> <br />
                                                                                    Apellido: <strong style={{ color: 'darkred' }}> {watch('apellidoComprador')} </strong> <br />
                                                                                    Teléfono: <strong style={{ color: 'darkred' }}> {watch('telefonoComprador')} </strong> <br />
                                                                                    Email: <strong style={{ color: 'darkred' }}> {watch('mailComprador')} </strong> <br />
                                                                                </Typography>
                                                                            </AccordionDetails>
                                                                        </Accordion>
                                                                    </Paper>

                                                                }

                                                                {
                                                                    showPayments &&
                                                                    <>

                                                                        <Paper elevation={24} sx={{
                                                                            background: 'white', width: isSmallScreen ? '100%' : '80%', color: 'black', textAlign: '-webkit-center',
                                                                            marginTop: isSmallScreen ? '15px' : '20px', borderRadius: '10px'
                                                                        }}>

                                                                            <h3 style={{ color: 'white', background: '#a70000', padding: '25px 0px', border: '1px solid #a70000', boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.8),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)' }}>
                                                                                Seleccione un metodo de pago</h3>

                                                                            <div id='Payment' className='payments-btn-container' style={{ background: 'linear-gradient(to top, rgb(246, 246, 246), rgb(206, 206, 206))' }}>

                                                                                <div className='payments-buttons' style={{ background: 'transparent' }}>


                                                                                    <div className='mercadopago-buttons'>

                                                                                        {showMercadoPago && (
                                                                                            <Button size='small' variant='contained' color='error' endIcon={<CreditCardTwoToneIcon />}
                                                                                                sx={{ marginTop: '15px', width: 'fit-content', alignSelf: 'center' }} onClick={handleCardPaymentClick}>Pagar con Tarjeta de Crédito / Débito</Button>
                                                                                        )}

                                                                                        {showCardPayment && (
                                                                                            <Button size='small' variant='contained' color='error' endIcon={<AccountBoxIcon />}
                                                                                                sx={{ marginTop: '15px', width: 'fit-content', alignSelf: 'center' }} onClick={handleMercadoPagoClick}>Pagar con cuenta en Mercado Pago</Button>
                                                                                        )}

                                                                                        {showCardPayment && (

                                                                                            <div className='mercadopago-div'>
                                                                                                <h4 className='tarjetas' style={{ color: 'white' }}>Pagar con Tarjeta Nacionales</h4>
                                                                                                <span style={{ color: 'white', textTransform: 'uppercase' }}>Total a pagar: {
                                                                                                    priceDolar ?
                                                                                                        `USD$${total}`
                                                                                                        :
                                                                                                        ` $${total.toLocaleString('es-AR')}`
                                                                                                }</span>
                                                                                                <CardPaymentMP
                                                                                                    retiraEnLocal={true}
                                                                                                    total={total}
                                                                                                    title={cart[0].name}
                                                                                                    description={cart[0].descr}
                                                                                                    picture_url={cart[0].img}
                                                                                                    category_id={cart[0].tipo}
                                                                                                    quantity={cart[0].quantity}
                                                                                                    id={cart[0].id}
                                                                                                    size={cart[0].size}
                                                                                                    products={cart}
                                                                                                    finalPrice={finalPrice}
                                                                                                    mailComprador={watch('mailComprador')}
                                                                                                    nombreComprador={watch('nombreComprador')}
                                                                                                    phoneComprador={watch('telefonoComprador')}
                                                                                                    apellidoComprador={watch('apellidoComprador')}
                                                                                                    dedicatoria={saveDedicatoria}
                                                                                                />
                                                                                            </div>
                                                                                        )}


                                                                                        {showMercadoPago && (
                                                                                            <div className='mercadopago-div'>
                                                                                                <h4 className='tarjetas' style={{ color: 'white' }}>Pagar con Cuenta Mercado Pago</h4>
                                                                                                <span style={{ color: 'white', textTransform: 'uppercase' }}>Total a pagar: {
                                                                                                    priceDolar ?
                                                                                                        `USD$${total}`
                                                                                                        :
                                                                                                        `$${total.toLocaleString('es-AR')}`
                                                                                                }
                                                                                                </span>
                                                                                                <MercadoPagoButton
                                                                                                    retiraEnLocal={true}
                                                                                                    total={total}
                                                                                                    dedicatoria={saveDedicatoria}
                                                                                                    title={cart[0].name}
                                                                                                    description={cart[0].descr}
                                                                                                    picture_url={cart[0].img}
                                                                                                    category_id={cart[0].tipo}
                                                                                                    quantity={cart[0].quantity}
                                                                                                    id={cart[0].id}
                                                                                                    size={cart[0].size}
                                                                                                    products={cart}
                                                                                                    mailComprador={watch('mailComprador')}
                                                                                                    nombreComprador={watch('nombreComprador')}
                                                                                                    phoneComprador={watch('telefonoComprador')}
                                                                                                    apellidoComprador={watch('apellidoComprador')}
                                                                                                />
                                                                                            </div>
                                                                                        )}

                                                                                    </div>

                                                                                    <div className='paypal-div'>
                                                                                        <h4 className='tarjetas' style={{ color: 'white' }}>Tarjetas Internacionales</h4> <span style={{ color: 'white', textTransform: 'uppercase', fontSize: 'larger' }}>
                                                                                            Total a pagar: USD${
                                                                                                priceDolar ? total :
                                                                                                    (total / dolar).toFixed(1)

                                                                                            }</span>

                                                                                        <PayPalButton
                                                                                            retiraEnLocal={true}
                                                                                            total={priceDolar ? total :
                                                                                                (total / dolar).toFixed(1)
                                                                                            }
                                                                                            precioArg={finalPrice}

                                                                                            dedicatoria={saveDedicatoria}
                                                                                            title={cart[0].name}
                                                                                            description={cart[0].descr}
                                                                                            picture_url={cart[0].img}
                                                                                            category_id={cart[0].tipo}
                                                                                            quantity={cart[0].quantity}
                                                                                            id={cart[0].id}
                                                                                            size={cart[0].size}
                                                                                            products={cart}
                                                                                            mailComprador={watch('mailComprador')}
                                                                                            nombreComprador={watch('nombreComprador')}
                                                                                            phoneComprador={watch('telefonoComprador')}
                                                                                            apellidoComprador={watch('apellidoComprador')}
                                                                                        />
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                        </Paper>

                                                                    </>
                                                                }
                                                            </>
                                                    }
                                                </>

                                            }
                                            {
                                                showPayments ? null :

                                                    <Button variant='contained' color='error' sx={{ color: 'white', borderColor: 'darkgreen', margin: '10px 30px' }} className='btn-eliminarProd' onClick={handleFinishPayment}>Retiro en el Local</Button>
                                            }

                                            {
                                                retiraEnLocal && <Typography variant='h5' sx={{ margin: '20px 10px 5px', padding: '20px', background: 'white',border: '1px solid #670000', width: '100%', color: 'black' }}>¡Quiero enviar mis productos!</Typography>
                                            }
                                            <Button variant="contained" color='success' sx={{ color: 'white', margin: '10px 30px' }} onClick={() => { handleStepChange(3); handleChangeRetirarProducto(); }}>
                                                Enviar a domicilio
                                            </Button>
                                        </Paper>
                                    </>

                                ) :
                                    <>
                                        <Button variant="contained" sx={{ marginBottom: 0, marginTop: 1.25, marginRight: isSmallScreen ? '0px' : '10px' }} color='error' onClick={() => handleStepChange(2)}>
                                            Ver el carrito de compras
                                        </Button>

                                        <Button variant="outlined" color='error' sx={{ color: 'black', width: 'fit-content', alignSelf: 'center', marginBottom: 0, marginTop: 1.25, marginLeft: isSmallScreen ? '0px' : '10px' }} onClick={() => { handleStepChange(2); handleChangeRetirarProducto(); }}>Quiero retirar en el Local </Button>
                                    </>
                                }

                                {/* Sección del formulario */}
                                {activeStep === 3 && (

                                    <div className='formulario'>
                                        <h3 className='form-title'>Ingrese los datos de envío para confirmar la entrega.</h3>
                                        <Form itemSelected={itemSelected} idCompra={paymentID} />
                                    </div>
                                )}

                            </>
                        )
                    )
                }
            </div >
        </>
    );

};
export default Cart;
