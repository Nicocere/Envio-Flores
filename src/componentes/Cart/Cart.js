"use client"
import { useCart } from '../../context/CartContext';
import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import Form from '../Form/Form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//Material UI
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// Añade estos imports si no los tienes ya
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Grid from '@mui/material/Grid';

import PropTypes from 'prop-types';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';


import DeleteIcon from '@mui/icons-material/Delete';
import CheckoutStepper from '../ProgressBar/CheckoutStepper';

import MercadoPagoButton from '../MercadoPago/MercadoPago'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PayPalButton from '../PaypalCheckoutButton/PayPalButton';
import { useForm } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCookies } from '../../context/CookieContext';
import localforage from 'localforage';
import { useTheme } from '@/context/ThemeSwitchContext';
import { DateRangeIcon } from '@mui/x-date-pickers';
import { AccountBox, CardGiftcard, CreditCardTwoTone, Timelapse } from '@mui/icons-material';
import CardPaymentMP from '../MercadoPago/PasarelaDePago/CardPayment';


const MySwal = withReactContent(Swal);



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


const CartComponents = () => {

    const { isDarkMode } = useTheme()
    //CartComponents
    const { cart, setCart, decryptCart, finalPrice, eliminarProd, totalPrecio, priceDolar, dolar } = useCart();

    //Cookie
    const { acceptedCookies, acceptCookies, showCookiePrompt, setShowCookiePrompt, setAcceptedCookies } = useCookies();

    const datosRef = useRef(null);
    const formularioEnvioRef = useRef(null);

    const total = totalPrecio();
    const isSmallScreen = useMediaQuery('(max-width:850px)');

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    const [activeStep, setActiveStep] = useState(2);

    const [completeForm, setCompleteForm] = useState(false)
    const [confirmationDone, setConfirmationDone] = useState(false);

    const [paymentMethodSelected, setPaymentMethodSelected] = useState('');
    const [hasSelectedPaymentMethod, setHasSelectedPaymentMethod] = useState(false); // Nuevo estado

    const [showPayments, setShowPayments] = useState(false);
    const [retiraEnLocal, setRetiraEnLocal] = useState(false);
    const [showMercadoPago, setShowMercadoPago] = useState(true);
    const [showCardPayment, setShowCardPayment] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [saveDedicatoria, setSaveDedicatoria] = useState('');


    // Estados para almacenar información del storage
    const [storedCartID, setStoredCartID] = useState('');
    const [storedUserID, setStoredUserID] = useState('');
    const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);
    const [selectedDate, setSelectedDate] = useState(''); // estado para la fecha seleccionada
    const [selectedTime, setSelectedTime] = useState(''); // estado para el horario seleccionado

    //Material UI
    const [value, setValue] = React.useState(0);

    const [characterCount, setCharacterCount] = useState(0);

    // Añadir esta función para manejar el conteo de caracteres
    const handleDedicatoriaChange = (e) => {
        setCharacterCount(e.target.value.length);
    };


    const handleMercadoPagoClick = () => {
        setShowMercadoPago(true);
        setShowCardPayment(false);
        setPaymentMethodSelected('mercadopago');
        setHasSelectedPaymentMethod(true); // Marcar que ya se seleccionó método
    };

    const handleCardPaymentClick = () => {
        setShowMercadoPago(false);
        setShowCardPayment(true);
        setPaymentMethodSelected('cardpayment');
        setHasSelectedPaymentMethod(true); // Marcar que ya se seleccionó método
    };

    const handleScrollToRef = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


    const handleChangeDateTime = (e) => {
        e.preventDefault()
        setSelectedDate(e.target.value)
        setSelectedTime(e.target.value)
    }
    const getAvailableTimeSlots = () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();

        const timeSlots = [
            { value: "7hs-10hs", label: "Mañana (7hs a 10hs)", startHour: 7, endHour: 10 },
            { value: "9hs-12hs", label: "Mañana (9hs a 12hs)", startHour: 9, endHour: 12 },
            { value: "13hs-16hs", label: "Tarde (13hs a 16hs)", startHour: 13, endHour: 16 },
            { value: "16hs-19hs", label: "Tarde (16hs a 19hs)", startHour: 16, endHour: 19 }
        ];

        const selectedDate = watch('fechaEnvio');
        const isToday = selectedDate === currentDate.toISOString().split('T')[0];

        if (isToday) {
            return timeSlots.filter(slot => slot.startHour >= currentHour + 3 || (slot.startHour === currentHour + 2 && currentMinute === 0));
        }

        return timeSlots;
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
            watch('mailComprador') === watch('validateMail') &&
            watch('selectHorario') &&
            watch('fechaEnvio')
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

    // Modificar la función handleAcceptCookies para usar localForage
    const handleAcceptCookies = async () => {
        try {
            await localforage.setItem('acceptedCookies', true);
            setHasAcceptedCookies(true);
            // setAcceptedCookies(true);
            acceptCookies();
        } catch (error) {
            console.error("Error al guardar cookies:", error);
        }
    };

    const handleViewCookies = () => {
        // Handle view cookies logic here
        window.location.href = '/cookies';
    };

    // Cargar datos de localForage de forma segura en el lado del cliente
    useEffect(() => {
        const loadStorageData = async () => {
            try {


                // Obtener datos de manera asíncrona
                const cartID = await localforage.getItem('CartID') || '';
                const userID = await localforage.getItem('UserID') || '';
                const cookies = await localforage.getItem('acceptedCookies');

                // Actualizar estados
                setStoredCartID(cartID);
                setStoredUserID(userID);
                setHasAcceptedCookies(cookies);
            } catch (error) {
                console.error("Error al cargar datos de almacenamiento:", error);
            }
        };

        // Ejecutar solo en el cliente
        if (typeof window !== 'undefined') {
            loadStorageData();
        }
    }, []);


    useEffect(() => {
        if (!hasAcceptedCookies || !storedCartID || !storedUserID) {
            setShowCookiePrompt(true);
            setAcceptedCookies(false);
        } else {
            setShowCookiePrompt(false);
            setAcceptedCookies(true);
        }
    }, [showCookiePrompt, hasAcceptedCookies]);


    return (
        <>
            {
                (activeStep < 2 && !confirmationDone || !retiraEnLocal) &&
                <CheckoutStepper activeStep={2} cartEmpty={cart.length === 0} cartFull={cart.length !== 0} />
            }

            {
                retiraEnLocal && ((retiraEnLocal && !confirmationDone && <CheckoutStepper activeStep={3} />))
            }

            < div className='cart' ref={formularioEnvioRef} >
                {
                    // Si las cookies no están aceptadas
                    !hasAcceptedCookies ? (
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
                                                            <h1 style={{ color: 'black', fontWeight: '400' }}>Tu pedido está listo<LocalFloristIcon style={{ color: '#a70000', ml: 1, verticalAlign: 'middle' }} /></h1>
                                                            <p style={{ color: 'black' }}>Sorprende a alguien especial con tu elección</p>

                                                            <List>
                                                                {itemSelected.map((prod, indx) => (
                                                                    <ListItem key={indx} sx={{ paddingLeft: '7px', borderBottom: '1px solid #c0c0c085' }}>
                                                                        <img className='imgInCart' src={prod.img} alt="Imagen producto en carrito" style={{ marginRight: '5px' }} />
                                                                        <ListItemText sx={{ fontWeight: '700', flex: '2', color: '#670000', maxWidth: '13ch', fontFamily: 'Nexa, sans-serif' }} primary={prod.name} secondary={`Cantidad: ${prod.quantity}, Talle: ${prod.size}`} primaryTypographyProps={{ fontFamily: 'Nexa, sans-serif' }} secondaryTypographyProps={{ fontFamily: 'Nexa, sans-serif' }} />

                                                                        <ListItemText sx={{ fontWeight: '600', flex: '1', marginLeft: '10px', color: 'black', fontFamily: 'Nexa, sans-serif' }} primary={priceDolar ? `USD$${(prod.precio / dolar).toFixed(2)}` : `$${prod.precio.toLocaleString('es-AR')}`} primaryTypographyProps={{ fontFamily: 'Nexa, sans-serif' }} />

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
                                                                    <h2 className='totalPrecio'>Precio total: USD${total}</h2>
                                                                    :
                                                                    <h2 className='totalPrecio'>Precio total: ${total.toLocaleString('es-AR')}</h2>
                                                            }
                                                        </>

                                                        )
                                                        :
                                                        <>
                                                            <h1 style={{ color: 'black', fontWeight: '400' }} >Tu pedido está casi listo<LocalFloristIcon sx={{ color: '#a70000', ml: 1, verticalAlign: 'middle' }} /></h1>
                                                            <p style={{ color: 'black' }}>Todo lo que necesitas para sorprender a alguien especial.</p>
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

                                        <Paper elevation={24} sx={{ background: isSmallScreen ? isDarkMode ? '#670000' : '#fafafa' : isDarkMode ? 'linear-gradient(to top,rgb(11, 11, 11),rgb(0, 0, 0))' : 'linear-gradient(to top, #FCFCFC, #FFFFFF)', padding: '30px, 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '20px 4px', borderRadius: '10px' }}>

                                            <h1 style={{ color: isDarkMode ? 'white' : '#670000', padding: '20px', fontSize: isSmallScreen && '22px', fontWeight: '500' }}>
                                                {showPayments ? 'Retiro en local seleccionado' : `¿Cómo desea enviar ${cart.length <= 1 ? 'su producto?' : 'sus productos?'}`}
                                            </h1>



                                            {retiraEnLocal &&

                                                <>

                                                    {
                                                        !completeForm ?
                                                            (<form onSubmit={handleSubmit} className='form'>

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
                                                                                color: isDarkMode ? 'white' : 'darkgreen'
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
                                                                                color: isDarkMode ? 'white' : 'darkgreen'
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
                                                                                color: isDarkMode ? 'white' : 'darkgreen'
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
                                                                                color: isDarkMode ? 'white' : 'darkgreen'
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
                                                                                color: isDarkMode ? 'white' : 'darkgreen'
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
                                                                            maxLength={300}
                                                                            onChange={handleDedicatoriaChange}
                                                                        />
                                                                        <div style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '5px', color: characterCount > 150 ? '#a70000' : isDarkMode ? '#e0e0e0' : '#666' }}>
                                                                            {characterCount}/300 caracteres
                                                                        </div>
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

                                                                    <div className='datos-fecha-envio'>
                                                                        <h3 className='titulo-datos-envio'>Fecha y Horario que viene a retirar:</h3>

                                                                        {/* Selector de Fecha */}
                                                                        <label htmlFor="deliveryDate" className='lbl-fecha-envio'>Fecha:</label>
                                                                        <input
                                                                            type="date"
                                                                            id="deliveryDate"
                                                                            name="deliveryDate"
                                                                            className='input-fecha-envio'
                                                                            onChange={handleChangeDateTime}
                                                                            {...register("fechaEnvio", { required: true })} />
                                                                        {errors.fechaEnvio && <p className='message-error'>Debe seleccionar una fecha</p>}

                                                                        <label htmlFor="deliveryTime" className='lbl-horario-envio'>Horario que vendría:</label>
                                                                        <select
                                                                            id="deliveryTime"
                                                                            name="deliveryTime"
                                                                            className='select-horario-envio'
                                                                            onChange={handleChangeDateTime}
                                                                            {...register("selectHorario", { required: true })}
                                                                        >
                                                                            <option value="">Seleccione un horario</option>
                                                                            {getAvailableTimeSlots().map(slot => (
                                                                                <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                                            ))}
                                                                        </select>
                                                                        {errors.selectHorario && <p className='message-error'>Debe seleccionar un horario</p>}
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
                                                                        datosRef.current?.scrollIntoView({ behavior: 'smooth' });
                                                                        handleScrollToRef(formularioEnvioRef);
                                                                    }}
                                                                            >
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

                                                            <div className='container-payments-cart' > 

                                                                <CheckoutStepper activeStep={4} />

                                                                {confirmationDone &&
                                                                    <Paper
                                                                    ref={datosRef} id="datos"
                                                                        elevation={12}
                                                                        sx={{
                                                                            padding: isSmallScreen ? '20px' : '40px',
                                                                            borderRadius: '12px',
                                                                            background: isDarkMode ? 'rgba(25, 25, 28, 0.95)' : '#ffffff',
                                                                            transition: 'all 0.3s ease',
                                                                            boxShadow: isDarkMode
                                                                                ? '0 8px 32px rgba(150, 0, 0, 0.3)'
                                                                                : '0 8px 24px rgba(0, 0, 0, 0.1)',
                                                                            border: isDarkMode ? '1px solid rgba(103, 0, 0, 0.3)' : 'none',
                                                                            maxWidth: '900px',
                                                                            margin: '0 auto'
                                                                        }}
                                                                    >
                                                                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                                                                            <CheckCircleOutlineIcon
                                                                                sx={{
                                                                                    fontSize: 40,
                                                                                    color: '#670000',
                                                                                    mb: 1
                                                                                }}
                                                                            />
                                                                            <Typography
                                                                                variant='h5'
                                                                                sx={{
                                                                                    fontWeight: 500,
                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                    mb: 1
                                                                                }}
                                                                            >
                                                                                ¡Gracias por completar sus datos!
                                                                            </Typography>
                                                                            <Typography
                                                                                variant='body1'
                                                                                sx={{
                                                                                    color: isDarkMode ? '#e0e0e0' : '#555555',
                                                                                    maxWidth: '600px',
                                                                                    margin: '0 auto'
                                                                                }}
                                                                            >
                                                                                Hemos registrado correctamente su información. A continuación puede revisar sus datos y proceder a finalizar su compra.
                                                                            </Typography>
                                                                        </Box>

                                                                        <Accordion
                                                                            sx={{
                                                                                mb: 2,
                                                                                borderRadius: '8px',
                                                                                overflow: 'hidden',
                                                                                background: isDarkMode ? 'rgba(30, 30, 33, 0.9)' : '#f9f9f9',
                                                                                border: isDarkMode ? '1px solid rgba(103, 0, 0, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
                                                                                '&:before': {
                                                                                    display: 'none',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <AccordionSummary
                                                                                sx={{
                                                                                    background: isDarkMode ? 'rgba(103, 0, 0, 0.9)' : '#a70000',
                                                                                    transition: 'all 0.2s ease',
                                                                                    '&:hover': {
                                                                                        background: isDarkMode ? 'rgba(123, 0, 0, 0.9)' : '#c70000',
                                                                                    }
                                                                                }}
                                                                                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                                            >
                                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                    <PersonOutlineIcon sx={{ color: 'white', mr: 1.5 }} />
                                                                                    <Typography
                                                                                        sx={{
                                                                                            color: 'white',
                                                                                            textTransform: 'uppercase',
                                                                                            fontWeight: 500,
                                                                                            fontSize: '0.95rem'
                                                                                        }}
                                                                                    >
                                                                                        Datos de quien retira el producto
                                                                                    </Typography>
                                                                                </Box>
                                                                            </AccordionSummary>
                                                                            <AccordionDetails
                                                                                sx={{
                                                                                    padding: 3,
                                                                                    background: isDarkMode ? 'rgba(30, 30, 33, 0.8)' : '#ffffff'
                                                                                }}
                                                                            >
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item xs={12} sm={6}>
                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Nombre
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                <PersonIcon
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {watch('nombreComprador')}
                                                                                            </Typography>
                                                                                        </Box>

                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Apellido
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                <PersonIcon
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {watch('apellidoComprador')}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    </Grid>
                                                                                    <Grid item xs={12} sm={6}>
                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Teléfono
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                <PhoneIcon
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {watch('telefonoComprador')}
                                                                                            </Typography>
                                                                                        </Box>

                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Email
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    flexWrap: 'wrap'
                                                                                                }}
                                                                                            >
                                                                                                <EmailIcon
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {watch('mailComprador')}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    </Grid>
                                                                                    <Grid item xs={12} sm={6}>
                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Fecha de Retiro
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                <DateRangeIcon
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {watch('fechaEnvio')}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    </Grid>
                                                                                    <Grid item xs={12} sm={6}>
                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Horario de Retiro
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    flexWrap: 'wrap'
                                                                                                }}
                                                                                            >
                                                                                                <Timelapse
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {watch('selectHorario')}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    </Grid>

                                                                                    <Grid item xs={24} sm={12}>
                                                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                                                            <Typography
                                                                                                variant='body2'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                                                    mb: 0.5,
                                                                                                    fontSize: '0.85rem'
                                                                                                }}
                                                                                            >
                                                                                                Dedicatoria
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant='body1'
                                                                                                sx={{
                                                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                                                    fontWeight: 600,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    flexWrap: 'wrap'
                                                                                                }}
                                                                                            >
                                                                                                <CardGiftcard
                                                                                                    sx={{
                                                                                                        color: isDarkMode ? '#a70000' : '#670000',
                                                                                                        mr: 1,
                                                                                                        fontSize: '1.2rem'
                                                                                                    }}
                                                                                                />
                                                                                                {saveDedicatoria}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    </Grid>

                                                                                </Grid>
                                                                            </AccordionDetails>
                                                                        </Accordion>


                                                                    </Paper>

                                                                }

                                                                {
                                                                    showPayments &&
                                                                    <>

                                                                        <Paper elevation={24} sx={{
                                                                            background: 'white', color: 'black', textAlign: '-webkit-center',
                                                                            width: '-webkit-fill-available', padding: isSmallScreen ? '20px 5px' : '40px', margin: '0 auto', boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.8),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)', border: isDarkMode ? '1px solid rgba(103, 0, 0, 0.3)' : 'none',
                                                                            marginTop: isSmallScreen ? '15px' : '20px', borderRadius: '10px'
                                                                        }}>
                                                                            <h3 style={{ color: 'white', background: isDarkMode ? '#000' : '#a70000', padding: '25px 0px', margin: '10px', border: isDarkMode ? '1px dashed rgb(255, 255, 255)' : '1px solid #a70000', borderRadius: '30px', }}>
                                                                                Seleccione un método de pago
                                                                            </h3>

                                                                            <div id='Payment' className='payments-btn-container' style={{ background: isDarkMode ? 'rgba(6, 6, 6, 0.9)' : '#f5f5f5', padding: isSmallScreen ? '20px 0' : '20px', borderRadius: '10px', }}>
                                                                                <div className='payments-buttons' style={{ background: 'transparent' }}>

                                                                                    <div className='mercadopago-buttons'>
                                                                                        <Typography variant="h6" sx={{
                                                                                            color: 'white',
                                                                                            mb: 3,
                                                                                            textAlign: 'center',
                                                                                            fontWeight: 600,
                                                                                            fontSize: { xs: '1.1rem', md: '1.25rem' }
                                                                                        }}>
                                                                                            {!hasSelectedPaymentMethod
                                                                                                ? "¿Cómo desea realizar el pago?"
                                                                                                : "Seleccione su método de pago preferido"}
                                                                                        </Typography>

                                                                                        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                                                                                            <Grid item xs={12} sm={6} md={5}>
                                                                                                <Paper
                                                                                                    elevation={6}
                                                                                                    onClick={handleMercadoPagoClick}
                                                                                                    sx={{
                                                                                                        p: 3,
                                                                                                        textAlign: 'center',
                                                                                                        height: '100%',
                                                                                                        borderRadius: '12px',
                                                                                                        cursor: 'pointer',
                                                                                                        transition: 'all 0.3s ease',
                                                                                                        bgcolor: showMercadoPago ? 'rgba(103, 0, 0, 0.8)' : 'rgba(30, 30, 33, 0.9)',
                                                                                                        border: showMercadoPago ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
                                                                                                        position: 'relative',
                                                                                                        overflow: 'hidden',
                                                                                                        '&:hover': {
                                                                                                            transform: 'translateY(-5px)',
                                                                                                            boxShadow: '0 12px 20px -10px rgba(103, 0, 0, 0.4)'
                                                                                                        },
                                                                                                        '&::before': showMercadoPago ? {
                                                                                                            content: '""',
                                                                                                            position: 'absolute',
                                                                                                            top: 0,
                                                                                                            left: 0,
                                                                                                            width: '5px',
                                                                                                            height: '100%',
                                                                                                            backgroundColor: 'white'
                                                                                                        } : {}
                                                                                                    }}
                                                                                                >
                                                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                                                        <AccountBox sx={{
                                                                                                            fontSize: { xs: '2.5rem', md: '3rem' },
                                                                                                            mb: 2,
                                                                                                            color: 'white',
                                                                                                            transition: 'transform 0.3s ease',
                                                                                                            transform: showMercadoPago ? 'scale(1.1)' : 'scale(1)'
                                                                                                        }} />
                                                                                                        <Typography variant="h6" sx={{
                                                                                                            color: 'white',
                                                                                                            fontWeight: 600,
                                                                                                            mb: 1,
                                                                                                            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                                                                                                        }}>
                                                                                                            Cuenta Mercado Pago
                                                                                                        </Typography>
                                                                                                        <Typography variant="body2" sx={{
                                                                                                            color: '#e0e0e0',
                                                                                                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                                                                                                        }}>
                                                                                                            Pague fácilmente con su cuenta de Mercado Pago
                                                                                                        </Typography>
                                                                                                    </Box>
                                                                                                    {showMercadoPago && (
                                                                                                        <CheckCircleIcon
                                                                                                            sx={{
                                                                                                                position: 'absolute',
                                                                                                                top: '10px',
                                                                                                                right: '10px',
                                                                                                                color: 'white',
                                                                                                                fontSize: '1.5rem'
                                                                                                            }}
                                                                                                        />
                                                                                                    )}
                                                                                                </Paper>
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={6} md={5}>
                                                                                                <Paper
                                                                                                    elevation={6}
                                                                                                    onClick={handleCardPaymentClick}
                                                                                                    sx={{
                                                                                                        p: 3,
                                                                                                        textAlign: 'center',
                                                                                                        height: '100%',
                                                                                                        borderRadius: '12px',
                                                                                                        cursor: 'pointer',
                                                                                                        transition: 'all 0.3s ease',
                                                                                                        bgcolor: showCardPayment ? 'rgba(103, 0, 0, 0.8)' : 'rgba(30, 30, 33, 0.9)',
                                                                                                        border: showCardPayment ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
                                                                                                        position: 'relative',
                                                                                                        overflow: 'hidden',
                                                                                                        '&:hover': {
                                                                                                            transform: 'translateY(-5px)',
                                                                                                            boxShadow: '0 12px 20px -10px rgba(103, 0, 0, 0.4)'
                                                                                                        },
                                                                                                        '&::before': showCardPayment ? {
                                                                                                            content: '""',
                                                                                                            position: 'absolute',
                                                                                                            top: 0,
                                                                                                            left: 0,
                                                                                                            width: '5px',
                                                                                                            height: '100%',
                                                                                                            backgroundColor: 'white'
                                                                                                        } : {}
                                                                                                    }}
                                                                                                >
                                                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                                                        <CreditCardTwoTone sx={{
                                                                                                            fontSize: { xs: '2.5rem', md: '3rem' },
                                                                                                            mb: 2,
                                                                                                            color: 'white',
                                                                                                            transition: 'transform 0.3s ease',
                                                                                                            transform: showCardPayment ? 'scale(1.1)' : 'scale(1)'
                                                                                                        }} />
                                                                                                        <Typography variant="h6" sx={{
                                                                                                            color: 'white',
                                                                                                            fontWeight: 600,
                                                                                                            mb: 1,
                                                                                                            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                                                                                                        }}>
                                                                                                            Tarjeta de Crédito/Débito
                                                                                                        </Typography>
                                                                                                        <Typography variant="body2" sx={{
                                                                                                            color: '#e0e0e0',
                                                                                                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                                                                                                        }}>
                                                                                                            Pague directamente con sus tarjetas bancarias
                                                                                                        </Typography>
                                                                                                    </Box>
                                                                                                    {showCardPayment && (
                                                                                                        <CheckCircleIcon
                                                                                                            sx={{
                                                                                                                position: 'absolute',
                                                                                                                top: '10px',
                                                                                                                right: '10px',
                                                                                                                color: 'white',
                                                                                                                fontSize: '1.5rem'
                                                                                                            }}
                                                                                                        />
                                                                                                    )}
                                                                                                </Paper>
                                                                                            </Grid>
                                                                                        </Grid>

                                                                                        {!hasSelectedPaymentMethod ? (
                                                                                            <Box sx={{
                                                                                                display: 'flex',
                                                                                                justifyContent: 'center',
                                                                                                mb: 3,
                                                                                                mt: 2
                                                                                            }}>
                                                                                                <Button
                                                                                                    variant="contained"
                                                                                                    color="primary"
                                                                                                    disabled={!showMercadoPago && !showCardPayment}
                                                                                                    onClick={() => setHasSelectedPaymentMethod(true)}
                                                                                                    sx={{
                                                                                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                                                                        color: '#670000',
                                                                                                        fontWeight: 600,
                                                                                                        px: 4,
                                                                                                        py: 1,
                                                                                                        '&:hover': {
                                                                                                            bgcolor: 'white',
                                                                                                        },
                                                                                                        '&.Mui-disabled': {
                                                                                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                                                                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    Continuar con el método seleccionado
                                                                                                </Button>
                                                                                            </Box>
                                                                                        ) : (
                                                                                            <Box sx={{
                                                                                                display: 'flex',
                                                                                                justifyContent: 'center',
                                                                                                mb: 3,
                                                                                                mt: 2
                                                                                            }}>
                                                                                                <Button
                                                                                                    variant="text"
                                                                                                    onClick={() => {
                                                                                                        setHasSelectedPaymentMethod(false);
                                                                                                        setShowMercadoPago(false);
                                                                                                        setShowCardPayment(false);
                                                                                                        setPaymentMethodSelected('');
                                                                                                    }}
                                                                                                    sx={{
                                                                                                        color: 'white',
                                                                                                        textDecoration: 'underline',
                                                                                                        '&:hover': {
                                                                                                            bgcolor: 'transparent',
                                                                                                            opacity: 0.8
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    Cambiar método de pago
                                                                                                </Button>
                                                                                            </Box>
                                                                                        )}

                                                                                        {/* Componentes de pago según la selección (solo mostrar cuando hasSelectedPaymentMethod es true) */}
                                                                                        {hasSelectedPaymentMethod && showCardPayment && (
                                                                                            <Box
                                                                                                sx={{
                                                                                                    mt: 4,
                                                                                                    pt: 3,
                                                                                                    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                                                                                                }}
                                                                                                className='mercadopago-div'
                                                                                            >
                                                                                                <Typography variant="subtitle1" sx={{
                                                                                                    color: 'white',
                                                                                                    fontWeight: 600,
                                                                                                    mb: 2,
                                                                                                    textAlign: 'center',
                                                                                                    bgcolor: 'rgba(103, 0, 0, 0.6)',
                                                                                                    p: 1,
                                                                                                    borderRadius: '5px'
                                                                                                }}>
                                                                                                    Pagar con Tarjeta Nacional
                                                                                                </Typography>
                                                                                                <Typography variant="body2" sx={{
                                                                                                    color: 'white',
                                                                                                    textTransform: 'uppercase',
                                                                                                    mb: 2,
                                                                                                    textAlign: 'center',
                                                                                                    fontWeight: 500
                                                                                                }}>
                                                                                                    Total a pagar: {
                                                                                                        priceDolar
                                                                                                            ? `USD$${total}`
                                                                                                            : `$${total.toLocaleString('es-AR')}`
                                                                                                    }
                                                                                                </Typography>
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
                                                                                            </Box>
                                                                                        )}

                                                                                        {hasSelectedPaymentMethod && showMercadoPago && (
                                                                                            <Box
                                                                                                sx={{
                                                                                                    mt: 4,
                                                                                                    pt: 3,
                                                                                                    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                                                                                                }}
                                                                                                className='mercadopago-div'
                                                                                            >
                                                                                                <Typography variant="subtitle1" sx={{
                                                                                                    color: 'white',
                                                                                                    fontWeight: 600,
                                                                                                    mb: 2,
                                                                                                    textAlign: 'center',
                                                                                                    bgcolor: 'rgba(103, 0, 0, 0.6)',
                                                                                                    p: 1,
                                                                                                    borderRadius: '5px'
                                                                                                }}>
                                                                                                    Pagar con Cuenta Mercado Pago
                                                                                                </Typography>
                                                                                                <Typography variant="body2" sx={{
                                                                                                    color: 'white',
                                                                                                    textTransform: 'uppercase',
                                                                                                    mb: 2,
                                                                                                    textAlign: 'center',
                                                                                                    fontWeight: 500
                                                                                                }}>
                                                                                                    Total a pagar: {
                                                                                                        priceDolar
                                                                                                            ? `USD$${total}`
                                                                                                            : `$${total.toLocaleString('es-AR')}`
                                                                                                    }
                                                                                                </Typography>
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
                                                                                                    fechaEnvio={watch('fechaEnvio')}
                                                                                                    horarioEnvio={watch('selectHorario')}
                                                                                                />
                                                                                            </Box>
                                                                                        )}
                                                                                    </div>

                                                                                    <div className='paypal-div'>
                                                                                        <h4 className='tarjetas' style={{ color: 'white' }}>Pagos Internacionales</h4>
                                                                                        <span style={{ color: 'white', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                                            Total a pagar: USD${
                                                                                                priceDolar ? total :
                                                                                                    (total / dolar).toFixed(1)
                                                                                            }
                                                                                        </span>

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
                                                                                            fechaEnvio={watch('fechaEnvio')}
                                                                                            horarioEnvio={watch('selectHorario')}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Paper>
                                                                    </>
                                                                }
                                                            </div>
                                                    }
                                                </>

                                            }
                                            {
                                                showPayments ? null :

                                                    <Button variant='contained' color='error' sx={{ color: 'white', borderColor: 'darkgreen', margin: '10px 30px' }} onClick={handleFinishPayment}>Retiro en el Local</Button>
                                            }

                                            {
                                                retiraEnLocal && <Typography variant='h5' sx={{ margin: '20px auto 15px', padding: '15px', background: isDarkMode ? 'rgba(103, 0, 0, 0.1)' : '#f5f5f5', borderRadius: '8px', border: '2px solid #670000', width: '80%', color: isDarkMode ? 'white' : '#670000', fontWeight: 600, textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LocalShippingRoundedIcon sx={{ mr: 1 }} /> ¿Prefiere enviar sus productos a domicilio?</Typography>
                                            }
                                            <Button variant="contained" sx={{ background: '#670000', color: 'white', margin: '10px 30px', border: '1px solid #670000', transition: 'all .5s ease', '&:hover': { background: '#a70000', } }} onClick={() => { handleStepChange(3); handleChangeRetirarProducto(); }}>
                                                Enviar a domicilio
                                            </Button>
                                        </Paper>
                                    </>

                                ) :
                                    <>
                                        <Button variant="contained" sx={{ marginBottom: 0, marginTop: 1.25, marginRight: isSmallScreen ? '0px' : '10px' }} color='error' onClick={() => handleStepChange(2)}>
                                            Ver el carrito de compras
                                        </Button>

                                        <Button variant="outlined" color='error' sx={{ color: isDarkMode ? 'white' : 'var(--text-dark)', width: 'fit-content', alignSelf: 'center', marginBottom: 0, marginTop: 1.25, marginLeft: isSmallScreen ? '0px' : '10px' }} onClick={() => { handleStepChange(2); handleChangeRetirarProducto(); }}>Quiero retirar en el Local </Button>
                                    </>
                                }

                                {/* Sección del formulario */}
                                {activeStep === 3 && (

                                    <div className='formulario'>
                                        <h3 className='form-title'>Ingrese los datos de envío para confirmar la entrega.</h3>
                                        <Form itemSelected={itemSelected} />
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
export default CartComponents;
