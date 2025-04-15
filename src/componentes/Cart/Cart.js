"use client"
import { useCart } from '../../context/CartContext';
import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Form from '../Form/Form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//Material UI
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import PropTypes from 'prop-types';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';


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
import { useCookies } from '../../context/CookieContext';
import localforage from 'localforage';
import { useTheme } from '@/context/ThemeSwitchContext';


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

    // Modificar la función handleAcceptCookies para usar localForage
    const handleAcceptCookies = async () => {
        try {
            await localforage.setItem('acceptedCookies', 'true');
            acceptCookies();
        } catch (error) {
            console.error("Error al guardar cookies:", error);
        }
    };

    const handleViewCookies = () => {
        // Handle view cookies logic here
        window.location.href = '/cookies';
    };


    // Estados para almacenar información del storage
    const [storedCartID, setStoredCartID] = useState('');
    const [storedUserID, setStoredUserID] = useState('');
    const [hasAcceptedCookies, setHasAcceptedCookies] = useState(null);

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
                                                            <h1 style={{ color: 'black', fontWeight: '400' }}>Tu pedido está listo<LocalFloristIcon style={{ color: '#a70000', ml: 1, verticalAlign: 'middle' }} /></h1>
                                                            <p style={{ color: 'black' }}>Sorprende a alguien especial con tu elección</p>

                                                            <List>
                                                                {itemSelected.map((prod, indx) => (
                                                                    <ListItem key={indx} sx={{ paddingLeft: '7px', borderBottom: '1px solid #c0c0c085' }}>
                                                                        <img className='imgInCart' src={prod.img} alt="Imagen producto en carrito" style={{ marginRight: '5px' }} />
                                                                        <ListItemText sx={{ fontWeight: '700', flex: '2', color: '#670000', maxWidth: '13ch', fontFamily: 'Jost, sans-serif' }} primary={prod.name} secondary={`Cantidad: ${prod.quantity}, Talle: ${prod.size}`} primaryTypographyProps={{ fontFamily: 'Jost, sans-serif' }} secondaryTypographyProps={{ fontFamily: 'Jost, sans-serif' }} />

                                                                        <ListItemText sx={{ fontWeight: '600', flex: '1', marginLeft: '10px', color: 'black', fontFamily: 'Jost, sans-serif' }} primary={priceDolar ? `USD$${(prod.precio / dolar).toFixed(2)}` : `$${prod.precio.toLocaleString('es-AR')}`} primaryTypographyProps={{ fontFamily: 'Jost, sans-serif' }} />

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

                                        <Paper elevation={24} sx={{ background: isSmallScreen ? isDarkMode ? '#670000' : '#fafafa' : isDarkMode ? 'linear-gradient(to top, #a70000, #670000)' : 'linear-gradient(to top, #FCFCFC, #FFFFFF)', padding: '30px, 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                                            <h1 style={{ color: isDarkMode ? 'white' : '#670000', padding: '20px', fontSize: isSmallScreen && '22px',fontWeight:'500' }}>
                                                {showPayments ? 'Retiro en local seleccionado' : `¿Cómo desea enviar ${cart.length <= 1 ? 'su producto?' : 'sus productos?'}`}
                                            </h1>



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

                                                    <Button variant='contained' color='error' sx={{ color: 'white', borderColor: 'darkgreen', margin: '10px 30px' }} onClick={handleFinishPayment}>Retiro en el Local</Button>
                                            }

                                            {
                                                retiraEnLocal && <Typography variant='h5' sx={{ margin: '20px auto 15px', padding: '15px', background: isDarkMode ? 'rgba(103, 0, 0, 0.1)' : '#f5f5f5', borderRadius: '8px', border: '2px solid #670000', width: '80%', color: isDarkMode ? 'white' : '#670000', fontWeight: 600, textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LocalShippingRoundedIcon sx={{ mr: 1 }}/> ¿Prefiere enviar sus productos a domicilio?</Typography>
                                            }
                                            <Button variant="contained"  sx={{ background:'#670000', color: 'white', margin: '10px 30px' }} onClick={() => { handleStepChange(3); handleChangeRetirarProducto(); }}>
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
                                        <Form itemSelected={itemSelected}  />
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
