"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Directions from '../Directions/Directions.js';
import { useCart } from '../../context/CartContext.js';
import MercadoPagoButton from '../MercadoPago/MercadoPago.js';
import PayPalButton from '../PaypalCheckoutButton/PayPalButton.js';
import Swal from 'sweetalert2';
import { Button, Chip, FormHelperText, TextField } from '@mui/material';
import CheckoutStepper from '../ProgressBar/CheckoutStepper.js';

import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// Añade estos imports si no los tienes ya
import Grid from '@mui/material/Grid';




import { useTheme } from '@/context/ThemeSwitchContext';
import { AccessTime, Badge, CardGiftcard, CheckCircleOutline, Email, Event, ExpandMore, LocalShipping, LocationOn, Person, PersonPin, Phone, ReceiptLong, ShoppingCart, SwapHoriz } from '@mui/icons-material';

import './form.css';

const Form = ({ itemSelected }) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors } } = useForm({
            defaultValues: {
                location: null,
            }
        });

    const [filledFields, setFilledFields] = useState({});

    const {
        finalPriceARS, finalPriceUSD,
        precioEnvioPremium, envioPremiumInUsd,
        locationValue,
        actualizarPrecios,
        isPremium,
        setIsPremium, locationName,
        location, cart, dolar,
        priceDolar, setPriceDolar
    } = useCart();
    const { isDarkMode } = useTheme();

    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    const [saveDedicatoria, setSaveDedicatoria] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showMercadoPago, setShowMercadoPago] = useState(true);
    const [showCardPayment, setShowCardPayment] = useState(false);
    const [confirmationDone, setConfirmationDone] = useState(false);
    const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
    const [activeStep, setActiveStep] = useState(3);
    const [locationError, setLocationError] = useState(false);

    const formularioEnvioRef = useRef(null);
    const paymentsRef = useRef(null);
    const [characterCount, setCharacterCount] = useState(0);

    // Añadir esta función para manejar el conteo de caracteres
    const handleDedicatoriaChange = (e) => {
        setCharacterCount(e.target.value.length);
    };

    // Esta función verifica si la ubicación ha sido seleccionada
    const checkLocationSelected = () => {
        if (!location || Object.keys(location).length === 0) {
            setLocationError(true);
            return false;
        }
        setLocationError(false);
        return true;
    };

    const handleScrollToRef = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleMercadoPagoClick = () => {
        setShowMercadoPago(true);
        setShowCardPayment(false);
    };

    const handleCardPaymentClick = () => {
        setShowMercadoPago(false);
        setShowCardPayment(true);
    };

    const handleChangeDateTime = (e) => {
        e.preventDefault();
        setSelectedDate(e.target.value);
        setSelectedTime(e.target.value);
    }

    const handleChangeBtn = (e) => {
        e.preventDefault();
        setSaveDedicatoria(watch('dedicatoria'));
        reset({ dedicatoria: saveDedicatoria });
    }

    // Cambiar la moneda de visualización
    const toggleCurrency = () => {
        setPriceDolar(!priceDolar);
        // Forzar actualización de precios
        actualizarPrecios();
    };

    // Verificar si todos los campos requeridos están completos
    const handleConfirmationClick = () => {
        // Primero verificamos que haya seleccionado una ubicación
        if (!checkLocationSelected()) {
            Swal.fire({
                icon: 'error',
                title: 'Ubicación requerida',
                text: 'Por favor, selecciona una localidad para el envío.',
            });
            return;
        }

        const fieldsFilled = (
            watch('nombreDestinatario') &&
            watch('apellidoDestinatario') &&
            watch('phoneDestinatario') &&
            watch('calle') &&
            watch('altura') &&
            watch('piso') &&
            watch('nombreComprador') &&
            watch('telefonoComprador') &&
            watch('apellidoComprador') &&
            watch('mailComprador') &&
            watch('fechaEnvio') &&
            watch('selectHorario') &&
            watch('mailComprador') === watch('validateMail')
        );

        if (fieldsFilled) {
            setConfirmationDone(true);
            setActiveStep(4);
            // Asegurarse de que los precios estén actualizados
            actualizarPrecios();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos antes de confirmar.',
            });
        }
    };

    // Efecto para monitorear si hay una ubicación seleccionada y actualizar el estado
    useEffect(() => {
        if (location && Object.keys(location).length > 0) {
            setHasSelectedLocation(true);
            setLocationError(false);
            // Actualizar precios cuando cambia la ubicación
            actualizarPrecios();
        } else {
            setHasSelectedLocation(false);
        }
    }, [location, actualizarPrecios]);

    // Efecto para actualizar el precio final cuando cambia el valor de la localidad
    useEffect(() => {
        if ((priceDolar && finalPriceUSD !== 0) || (!priceDolar && finalPriceARS !== 0)) {
            setHasSelectedLocation(true);
        } else {
            setHasSelectedLocation(false);
        }
    }, [finalPriceARS, finalPriceUSD, priceDolar]);

    // Efecto para actualizar el precio cuando cambia el servicio premium
    useEffect(() => {
        // Actualizar precios cuando cambia el servicio premium
        actualizarPrecios();
    }, [isPremium, priceDolar, dolar, actualizarPrecios]);

    // Efecto para monitorear los campos completados
    useEffect(() => {
        const fields = ['nombreDestinatario', 'apellidoDestinatario', 'phoneDestinatario',
            'calle', 'altura', 'piso', 'nombreComprador', 'telefonoComprador',
            'apellidoComprador', 'mailComprador', 'validateMail', 'dedicatoria',
            'fechaEnvio', 'selectHorario'];

        const filledValues = {};
        fields.forEach(field => {
            filledValues[field] = !!watch(field);
        });

        setFilledFields(filledValues);
    }, [watch]);

    return (
        <div ref={formularioEnvioRef} className={`form-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            {activeStep === 3 && (
                <form onSubmit={handleSubmit} className='form'>
                    <CheckoutStepper activeStep={3} cartEmpty={cart.length === 0} />
                    <div className='form-header'>
                        <h1 className='form-title-h1'>Detalles de su envío</h1>
                        <div className='form-intro'>
                            <span className='form-icon'>🌹</span>
                            <p>Gracias por confiar en <strong>Envío Flores</strong>. Complete los siguientes datos para finalizar su pedido.</p>
                        </div>
                        <div className='form-progress'>
                            <div className='progress-step active'>
                                <span className='step-number'>1</span>
                                <span className='step-text'>Información de entrega</span>
                            </div>
                        </div>
                    </div>
                    <div className='datos-recibe'>
                        <h3 className='titulo-datosEnvio'>Datos de quién Recibe:</h3>

                        <TextField
                            {...register("nombreDestinatario", { required: true })}
                            type="text"
                            placeholder="Nombre..."
                            label='Nombre...'
                            name="nombreDestinatario"
                            className='input-nombreApellido'
                            required
                            margin="dense"
                            size="small"
                            variant="filled"
                            color='error'
                        />
                        <FormHelperText error>{errors.nombreDestinatario && errors.nombreDestinatario.message}</FormHelperText>

                        <TextField
                            {...register("apellidoDestinatario", { required: true })}
                            type="text"
                            placeholder="Apellido..."
                            label='Apellido..'
                            name="apellidoDestinatario"
                            className='input-nombreApellido'
                            required
                            margin="dense"
                            size="small"
                            variant="filled"
                            color='error'
                        />
                        {errors.apellidoDestinatario && <p className='message-error'>Debe ingresar un Apellido</p>}

                        <TextField
                            required
                            {...register("phoneDestinatario", { required: true, minLength: 5 })}
                            type="text"
                            placeholder="Telefono..."
                            name="phoneDestinatario"
                            className='input-phone'
                            margin="dense"
                            label='Telefono...'
                            size="small"
                            variant="filled"
                            color='error'
                        />
                        {errors.phoneDestinatario && <p className='message-error'>El numero de Telefono no es valido</p>}

                        {/* Componente de selección de dirección con manejo de errores */}
                        <div className={locationError ? 'location-container error' : 'location-container'}>
                            <Directions
                                locationSelect={location}
                                className={locationError ? 'input-error' : ""}
                            />
                            {locationError &&
                                <p className='message-error'>Debe seleccionar una localidad para continuar</p>
                            }
                        </div>

                        <TextField
                            {...register("calle", { required: true })}
                            type="text"
                            placeholder="Calle..."
                            name="calle"
                            className='input-calle'
                            size="small"
                            margin="dense"
                            required
                            label='Calle...'
                            variant="filled"
                            color='error'
                        />
                        {errors.calle && <p className='message-error'>La Calle no es valida</p>}

                        <TextField
                            {...register("altura", { required: true })}
                            type="text"
                            placeholder="Altura..."
                            name="altura"
                            className='input-altura'
                            size="small"
                            required
                            label='Altura..'
                            margin="dense"
                            variant="filled"
                            color='error'
                        />
                        {errors.altura && <p className='message-error'>La Altura no es valida</p>}

                        <TextField
                            {...register("piso", { required: true })}
                            type="text"
                            placeholder="Piso..."
                            name="piso"
                            className='input-piso'
                            size="small"
                            required
                            margin="dense"
                            label='Piso / Departamento..'
                            variant="filled"
                            color='error'
                        />
                        {errors.piso && <p className='message-error'>El piso no es valido</p>}

                        <div className='div-dedicatoria'>
                            <h4 className='dedic-text'>Aqui puede agregar una dedicatoria:</h4>

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
                            </div>                            <div className='dedic-instructions'>
                                <small className='dedic-text'>• Ejemplo: "Feliz Cumpleaños, te quiero mucho!"</small>
                                <small className='dedic-text'>• El mensaje se enviará junto con su pedido</small>
                                <small className='dedic-text'>• Deje el campo vacío si no desea incluir mensaje</small>
                                <small className='dedic-text'>• Haga clic en "Guardar Mensaje" para confirmar</small>
                            </div>
                            <Button
                                size='small'
                                variant='contained'
                                color='error'
                                sx={{
                                    marginBottom: 1.20,
                                    marginTop: 1.20,
                                    '&:hover': {
                                        backgroundColor: '#a70000',
                                        fontWeight: 500
                                    },
                                }}
                                onClick={handleChangeBtn}
                            >
                                Guardar Dedicatoria
                            </Button>

                            {saveDedicatoria && (
                                <>
                                    <h4 className='dedic-titulo'>Usted escribió:</h4>
                                    <h3 className='dedic-save'>{saveDedicatoria}</h3>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='datos-Fecha-Envio'>
                        <h3 className='titulo-datosEnvio'>Fecha y Horario de Envío:</h3>

                        <label htmlFor="deliveryDate" className='lbl-fecha-envio'>Fecha de entrega:</label>
                        <input
                            type="date"
                            id="deliveryDate"
                            name="deliveryDate"
                            className='input-fecha-envio'
                            onChange={handleChangeDateTime}
                            {...register("fechaEnvio", { required: true })}
                        />
                        {errors.fechaEnvio && <p className='message-error'>Debe seleccionar una fecha</p>}

                        {!isPremium ? (
                            <>
                                <label htmlFor="deliveryTime" className='lbl-horario-envio'>Horario de entrega:</label>
                                <select
                                    id="deliveryTime"
                                    name="deliveryTime"
                                    className='select-horario-envio'
                                    onChange={handleChangeDateTime}
                                    {...register("selectHorario", { required: true })}
                                >
                                    <option value="">Seleccione un horario</option>
                                    <option value="7hs-10hs">Mañana (7hs a 10hs)</option>
                                    <option value="9hs-12hs">Mañana (9hs a 12hs)</option>
                                    <option value="13hs-16hs">Tarde (13hs a 16hs)</option>
                                    <option value="16hs-19hs">Tarde (16hs a 19hs)</option>
                                </select>
                            </>
                        ) : null}

                        <div className='div-horarioPremium-envio'>
                            <input
                                type="checkbox"
                                id="premiumService"
                                name="premiumService"
                                onChange={(e) => setIsPremium(e.target.checked)}
                            />
                            {priceDolar ? (
                                <label htmlFor="premiumService">Servicio Premium (+USD${envioPremiumInUsd})</label>
                            ) : (
                                <label htmlFor="premiumService">Servicio Premium (+${precioEnvioPremium})</label>
                            )}
                        </div>

                        {isPremium && (
                            <div className='select-horarioPremium-envio'>
                                <label htmlFor="deliveryPremiumTime">Ingrese el horario deseado:</label>
                                <TextField
                                    type="text"
                                    id="deliveryPremiumTime"
                                    name="deliveryPremiumTime"
                                    placeholder="Ej. 20:30"
                                    required
                                    label='Elija un horario'
                                    onChange={handleChangeDateTime}
                                    {...register("selectHorario", { required: true })}
                                    variant="filled"
                                    color='error'
                                />
                            </div>
                        )}

                        {errors.selectHorario && <p className='message-error'>Debe seleccionar un horario</p>}
                    </div>

                    <div className='datos-comprador'>
                        <h3 className='titulo-datosEnvio'>Datos de quién Envia:</h3>

                        <TextField
                            {...register("nombreComprador", { required: true })}
                            type="text"
                            placeholder="Nombre de comprador..."
                            name="nombreComprador"
                            className='input-nombreApellido'
                            required
                            label='Nombre...'
                            size='small'
                            margin='dense'
                            variant="filled"
                            color='error'
                        />
                        {errors.nombreComprador && <p className='message-error'>Debe ingresar su Nombre</p>}

                        <TextField
                            {...register("apellidoComprador", { required: true })}
                            type="text"
                            placeholder="Apellido de comprador..."
                            name="apellidoComprador"
                            className='input-nombreApellido'
                            required
                            label='Apellido...'
                            size='small'
                            margin='dense'
                            variant="filled"
                            color='error'
                        />
                        {errors.apellidoComprador && <p className='message-error'>Debe ingresar su Apellido</p>}

                        <TextField
                            {...register("telefonoComprador", { required: true })}
                            type="text"
                            placeholder="Telefono del comprador..."
                            name="telefonoComprador"
                            className='input-nombreApellido'
                            label='Telefono...'
                            margin='dense'
                            size='small'
                            required
                            variant="filled"
                            color='error'
                        />
                        {errors.telefonoComprador &&
                            <p className='message-error'>Debe ingresar su N° de Telefono por si necesitamos comunicarnos con usted</p>
                        }

                        <TextField
                            {...register("mailComprador", { required: true })}
                            type="email"
                            placeholder="Ingrese su E-mail..."
                            name="mailComprador"
                            className='input-email'
                            required
                            label='Email...'
                            size='small'
                            margin='dense'
                            variant="filled"
                            color='error'
                        />
                        {errors.mailComprador && <p className='message-error'>Debe ingresar un E-mail</p>}

                        <TextField
                            {...register("validateMail", { required: true })}
                            type="email"
                            placeholder="Repita su E-mail..."
                            name="validateMail"
                            className='input-email'
                            required
                            label='Repita su email'
                            size='small'
                            margin='dense'
                            variant="filled"
                            color='error'
                        />
                        {watch('validateMail') !== watch('mailComprador') &&
                            <p className='message-error'>Los E-mails no coinciden</p>
                        }
                    </div>



                    {!confirmationDone && (
                        <Button
                            variant='contained'
                            color='success'
                            onClick={() => {
                                if (checkLocationSelected()) {
                                    handleConfirmationClick();
                                    handleScrollToRef(formularioEnvioRef);
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Localidad requerida',
                                        text: 'Por favor, selecciona una localidad para el envío antes de continuar.',
                                    });
                                }
                            }}
                        >
                            Confirmar Datos
                        </Button>
                    )}

                    {/* Mostrar el precio según la moneda seleccionada */}
                    {priceDolar ? (
                        <h2 className='totalPrecio'>Total final: USD${finalPriceUSD.toFixed(2)}</h2>
                    ) : (
                        <h2 className='totalPrecio'>Total final: ${finalPriceARS.toFixed(2)}</h2>
                    )}
                    {/* Botón para cambiar la moneda de visualización */}
                    <Button
                        variant='outlined'
                        color='error'
                        size='small'

                        sx={{ marginBottom: 2, marginTop: .25 }}
                        onClick={toggleCurrency}
                    >
                        {priceDolar ? 'Ver en Pesos (ARS)' : 'Ver en Dólares (USD)'}
                    </Button>

                    {(confirmationDone && activeStep === 3) && (
                        <Button
                            variant="contained"
                            color='success'
                            onClick={() => {
                                handleConfirmationClick();
                                handleScrollToRef(formularioEnvioRef);
                                handleStepChange(4);
                            }}
                        >
                            Finalizar la compra
                        </Button>
                    )}
                </form>
            )}

            {activeStep === 4 && (
                <div>
                    {confirmationDone ? (
                        <>
                            <Button
                                variant="contained"
                                color='success'
                                size='small'
                                sx={{ marginBottom: 2.35 }}
                                onClick={() => {
                                    handleScrollToRef(formularioEnvioRef);
                                    handleStepChange(3);
                                }}
                            >
                                Volver a los Datos de envio
                            </Button>
                            <CheckoutStepper activeStep={4} />
                            <div className="payment-section">

                                <Paper
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
                                        <CheckCircleOutline
                                            sx={{
                                                fontSize: 40,
                                                color: isDarkMode ? 'var(--primary-light)' : '#670000',
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
                                            boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                boxShadow: isDarkMode ? '0 6px 25px rgba(0, 0, 0, 0.3)' : '0 6px 16px rgba(0, 0, 0, 0.15)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <AccordionSummary
                                            sx={{
                                                background: isDarkMode ? 'rgba(103, 0, 0, 0.9)' : '#a70000',
                                                transition: 'all 0.2s ease',
                                                padding: '12px 24px',
                                                '&:hover': {
                                                    background: isDarkMode ? 'rgba(123, 0, 0, 0.9)' : '#c70000',
                                                }
                                            }}
                                            expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ReceiptLong sx={{ color: 'white', mr: 1.5 }} />
                                                <Typography
                                                    sx={{
                                                        color: 'white',
                                                        textTransform: 'uppercase',
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    Resumen de su pedido
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>

                                        <AccordionDetails
                                            sx={{
                                                padding: { xs: 2, sm: 3 },
                                                background: isDarkMode ? 'rgba(30, 30, 33, 0.8)' : '#ffffff'
                                            }}
                                        >
                                            {/* Sección: Datos de Facturación */}
                                            <Box sx={{ mb: 4 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: isDarkMode ? '#ffffff' : '#333333',
                                                        borderBottom: `2px solid ${isDarkMode ? '#a70000' : '#a70000'}`,
                                                        pb: 1,
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Person sx={{ mr: 1, color: isDarkMode ? '#a70000' : '#a70000' }} />
                                                    Datos del Comprador
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                            <Typography
                                                                variant='body2'
                                                                sx={{
                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                    mb: 0.5,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Badge sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Nombre y Apellido
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {`${watch('nombreComprador')} ${watch('apellidoComprador')}`}
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
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Phone sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Teléfono de contacto
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {watch('telefonoComprador')}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                            <Typography
                                                                variant='body2'
                                                                sx={{
                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                    mb: 0.5,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Email sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Email para confirmación
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2,
                                                                    wordBreak: 'break-word'
                                                                }}
                                                            >
                                                                {watch('mailComprador')}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            {/* Sección: Datos del Destinatario */}
                                            <Box sx={{ mb: 4 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: isDarkMode ? '#ffffff' : '#333333',
                                                        borderBottom: `2px solid ${isDarkMode ? '#3f51b5' : '#3f51b5'}`,
                                                        pb: 1,
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <PersonPin sx={{ mr: 1, color: isDarkMode ? '#3f51b5' : '#3f51b5' }} />
                                                    Datos del Destinatario
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                            <Typography
                                                                variant='body2'
                                                                sx={{
                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                    mb: 0.5,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Badge sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Nombre y Apellido
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {`${watch('nombreDestinatario')} ${watch('apellidoDestinatario')}`}
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
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Phone sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Teléfono de contacto
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {watch('phoneDestinatario')}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                            <Typography
                                                                variant='body2'
                                                                sx={{
                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                    mb: 0.5,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <LocationOn sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Dirección completa
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {`${watch('calle')} ${watch('altura')}, ${watch('piso')} - ${locationName}`}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            {/* Sección: Detalles del Envío */}
                                            <Box sx={{ mb: 4 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: isDarkMode ? '#ffffff' : '#333333',
                                                        borderBottom: `2px solid ${isDarkMode ? '#4caf50' : '#4caf50'}`,
                                                        pb: 1,
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <LocalShipping sx={{ mr: 1, color: isDarkMode ? '#4caf50' : '#4caf50' }} />
                                                    Detalles del Envío
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                            <Typography
                                                                variant='body2'
                                                                sx={{
                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                    mb: 0.5,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Event sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Fecha de entrega
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {new Date(watch('fechaEnvio')).toLocaleDateString('es-ES', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
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
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <AccessTime sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Horario{isPremium ? ' Premium' : ''}
                                                            </Typography>
                                                            <Typography
                                                                variant='body1'
                                                                sx={{
                                                                    color: isDarkMode ? '#ffffff' : '#333333',
                                                                    fontWeight: 600,
                                                                    ml: 2,
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                {watch('selectHorario')}
                                                                {isPremium && (
                                                                    <Chip
                                                                        label="Premium"
                                                                        size="small"
                                                                        color="primary"
                                                                        sx={{
                                                                            ml: 1,
                                                                            background: 'gold',
                                                                            color: 'black',
                                                                            fontWeight: 'bold',
                                                                            fontSize: '0.7rem'
                                                                        }}
                                                                    />
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Box sx={{ mb: 2, textAlign: 'left' }}>
                                                            <Typography
                                                                variant='body2'
                                                                sx={{
                                                                    color: isDarkMode ? '#aaaaaa' : '#666666',
                                                                    mb: 0.5,
                                                                    fontSize: '0.85rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <CardGiftcard sx={{
                                                                    fontSize: '0.9rem',
                                                                    mr: 0.5,
                                                                    color: isDarkMode ? '#888888' : '#777777'
                                                                }} />
                                                                Dedicatoria
                                                            </Typography>
                                                            <Paper
                                                                elevation={1}
                                                                sx={{
                                                                    p: 2,
                                                                    background: isDarkMode ? 'rgba(40, 40, 45, 0.5)' : '#f9f9f9',
                                                                    borderLeft: `3px solid ${isDarkMode ? '#a70000' : '#a70000'}`,
                                                                    borderRadius: 1,
                                                                    fontStyle: 'italic'
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant='body2'
                                                                    sx={{
                                                                        color: isDarkMode ? '#e0e0e0' : '#555555',
                                                                    }}
                                                                >
                                                                    {saveDedicatoria || <em>Sin dedicatoria</em>}
                                                                </Typography>
                                                            </Paper>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            {/* Sección: Resumen del Pedido */}
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: isDarkMode ? '#ffffff' : '#333333',
                                                        borderBottom: `2px solid ${isDarkMode ? '#ff9800' : '#ff9800'}`,
                                                        pb: 1,
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <ShoppingCart sx={{ mr: 1, color: isDarkMode ? '#ff9800' : '#ff9800' }} />
                                                    Resumen del Pedido
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TableContainer component={Paper} sx={{
                                                            background: isDarkMode ? 'rgba(40, 40, 45, 0.5)' : '#ffffff',
                                                            mb: 2
                                                        }}>
                                                            <Table size="small">
                                                                <TableHead sx={{
                                                                    background: isDarkMode ? 'rgba(30, 30, 33, 0.9)' : '#f5f5f5',
                                                                }}>
                                                                    <TableRow>
                                                                        <TableCell sx={{
                                                                            color: isDarkMode ? '#ffffff' : '#333333',
                                                                            fontWeight: 600
                                                                        }}>Concepto</TableCell>
                                                                        <TableCell align="right" sx={{
                                                                            color: isDarkMode ? '#ffffff' : '#333333',
                                                                            fontWeight: 600
                                                                        }}>Importe</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell sx={{ color: isDarkMode ? '#e0e0e0' : '#555555' }}>
                                                                            Productos ({cart.reduce((sum, item) => sum + item.quantity, 0)} ítems)
                                                                        </TableCell>
                                                                        <TableCell align="right" sx={{ color: isDarkMode ? '#e0e0e0' : '#555555' }}>
                                                                            {priceDolar
                                                                                ? `USD $${(finalPriceUSD - (isPremium ? envioPremiumInUsd : 0) - (locationValue / dolar)).toFixed(2)}`
                                                                                : `$ ${(finalPriceARS - (isPremium ? precioEnvioPremium : 0) - locationValue).toFixed(2)}`}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell sx={{ color: isDarkMode ? '#e0e0e0' : '#555555' }}>
                                                                            Envío a {locationName}
                                                                        </TableCell>
                                                                        <TableCell align="right" sx={{ color: isDarkMode ? '#e0e0e0' : '#555555' }}>
                                                                            {priceDolar ? `USD $${(locationValue / dolar).toFixed(2)}` : `$ ${locationValue.toFixed(2)}`}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {isPremium && (
                                                                        <TableRow>
                                                                            <TableCell sx={{ color: isDarkMode ? '#e0e0e0' : '#555555' }}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                    Servicio Premium
                                                                                    <Chip
                                                                                        label="Premium"
                                                                                        size="small"
                                                                                        sx={{
                                                                                            ml: 1,
                                                                                            background: 'gold',
                                                                                            color: 'black',
                                                                                            fontWeight: 'bold',
                                                                                            fontSize: '0.7rem'
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </TableCell>
                                                                            <TableCell align="right" sx={{ color: isDarkMode ? '#e0e0e0' : '#555555' }}>
                                                                                {priceDolar ? `USD $${envioPremiumInUsd.toFixed(2)}` : `$ ${precioEnvioPremium.toFixed(2)}`}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                    <TableRow>
                                                                        <TableCell sx={{
                                                                            fontWeight: 'bold',
                                                                            color: isDarkMode ? '#ffffff' : '#333333',
                                                                            borderTop: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                                                                        }}>
                                                                            TOTAL
                                                                        </TableCell>
                                                                        <TableCell align="right" sx={{
                                                                            fontWeight: 'bold',
                                                                            color: isDarkMode ? '#ffffff' : '#333333',
                                                                            fontSize: '1.1rem',
                                                                            borderTop: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                                                                        }}>
                                                                            {priceDolar ? `USD $${finalPriceUSD.toFixed(2)}` : `$ ${finalPriceARS.toFixed(2)}`}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            startIcon={<SwapHoriz />}
                                                            size="small"
                                                            onClick={toggleCurrency}
                                                            sx={{ mt: 1 }}
                                                        >
                                                            {priceDolar ? 'Ver en Pesos (ARS)' : 'Ver en Dólares (USD)'}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>


                                </Paper>
                                <div className="payment-header">
                                    <h1 className='metodo-pago-title'>Seleccione un método de pago seguro</h1>
                                    <div className="payment-info">
                                        <span className="payment-icon">💳</span>
                                        <span className='payment-subtitle'>¡Último paso! Elija cómo desea pagar su pedido</span>
                                    </div>
                                    <div className="payment-security">
                                        <span className="security-icon">🔒</span>
                                        <span className="security-text">Todos nuestros pagos son procesados en un entorno seguro</span>
                                    </div>
                                </div>
                            </div>
                            <div id='Payment' ref={paymentsRef} className='payments-btn-container'>
                                <div className='payments-buttons'>
                                    <div className='mercadopago-buttons'>

                                        {showMercadoPago && (
                                            <div className='mercadopago-div'>
                                                <h3 className='tarjetas'>Pagos Nacionales</h3>
                                                <span>Total a pagar: ${finalPriceARS.toFixed(2)}</span>
                                                <MercadoPagoButton
                                                    nombreDestinatario={watch('nombreDestinatario')}
                                                    apellidoDestinatario={watch('apellidoDestinatario')}
                                                    phoneDestinatario={watch('phoneDestinatario')}
                                                    localidad={location}
                                                    nombreLocalidad={locationName}
                                                    precioLocalidad={locationValue}
                                                    calle={watch('calle')}
                                                    altura={watch('altura')}
                                                    piso={watch('piso')}
                                                    dedicatoria={saveDedicatoria}
                                                    mailComprador={watch('mailComprador')}
                                                    nombreComprador={watch('nombreComprador')}
                                                    phoneComprador={watch('telefonoComprador')}
                                                    apellidoComprador={watch('apellidoComprador')}
                                                    fechaEnvio={watch('fechaEnvio')}
                                                    horarioEnvio={watch('selectHorario')}
                                                    servicioPremium={isPremium}
                                                    envioPremium={precioEnvioPremium}
                                                    total={finalPriceARS} // Siempre en pesos para Mercado Pago
                                                    title={cart[0]?.name || ''}
                                                    description={cart[0]?.descr || ''}
                                                    picture_url={cart[0]?.img || ''}
                                                    category_id={cart[0]?.tipo || ''}
                                                    quantity={cart[0]?.quantity || 1}
                                                    id={cart[0]?.id || ''}
                                                    size={cart[0]?.size || ''}
                                                    products={cart}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className='paypal-div'>
                                        <h3 className='tarjetas'>Pagos Internacionales</h3>
                                        <span>Total a pagar: USD${finalPriceUSD.toFixed(2)}</span>

                                        <PayPalButton
                                            itemSelected={itemSelected}
                                            precioArg={finalPriceARS}
                                            total={finalPriceUSD.toFixed(2)} // Directamente USD para PayPal
                                            precioLocalidad={locationValue}
                                            nombreDestinatario={watch('nombreDestinatario')}
                                            apellidoDestinatario={watch('apellidoDestinatario')}
                                            phoneDestinatario={watch('phoneDestinatario')}
                                            mailComprador={watch('mailComprador')}
                                            localidad={location}
                                            nombreLocalidad={locationName}
                                            calle={watch('calle')}
                                            altura={watch('altura')}
                                            piso={watch('piso')}
                                            dedicatoria={saveDedicatoria}
                                            nombreComprador={watch('nombreComprador')}
                                            phoneComprador={watch('telefonoComprador')}
                                            apellidoComprador={watch('apellidoComprador')}
                                            fechaEnvio={watch('fechaEnvio')}
                                            horarioEnvio={watch('selectHorario')}
                                            title={cart[0]?.name || ''}
                                            description={cart[0]?.descr || ''}
                                            picture_url={cart[0]?.img || ''}
                                            category_id={cart[0]?.tipo || ''}
                                            quantity={cart[0]?.quantity || 1}
                                            id={cart[0]?.id || ''}
                                            size={cart[0]?.size || ''}
                                            products={cart}
                                            servicioPremium={isPremium}
                                            envioPremium={precioEnvioPremium}
                                            dolar={dolar}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : hasSelectedLocation ? (
                        <>
                            {priceDolar ? (
                                <h2 className='totalPrecio'>Total final: USD${finalPriceUSD.toFixed(2)}</h2>
                            ) : (
                                <h2 className='totalPrecio'>Total final: ${finalPriceARS.toFixed(2)}</h2>
                            )}
                            <h1 className='alert-finalprice'>
                                Antes de Finalizar la compra, debe completar TODOS los campos.
                            </h1>
                        </>
                    ) : (
                        <h1 className='alert-finalprice'>
                            Antes de Finalizar la compra, debe elegir una Localidad de envío y completar TODOS los campos.
                        </h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default Form;