import React, { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Directions from '../Directions/Directions.js';
import { useCart } from '../../context/CartContext.js';
import MercadoPagoButton from '../MercadoPago/MercadoPago.js';
import PayPalButton from '../PaypalCheckoutButton/PayPalButton.js';
import Swal from 'sweetalert2';
import CardPaymentMP from '../MercadoPago/PasarelaDePago/CardPayment.js';
import { Button, FormHelperText, TextField, useTheme } from '@mui/material';
import CheckoutStepper from '../ProgressBar/CheckoutStepper.js';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';

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
    const {isDarkMode} = useTheme();

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

                            <textarea {...register('dedicatoria')} className='dedicatoria' name="dedicatoria" />
                            <div className='dedic-instructions'>
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
                                <div className="payment-header">
                                    <h3 className='metodo-pago-title'>Seleccione un método de pago seguro</h3>
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
                                            <Button
                                                size='small'
                                                variant='contained'
                                                color='error'
                                                endIcon={<CreditCardTwoToneIcon />}
                                                sx={{ marginTop: '15px', width: 'fit-content', alignSelf: 'center' }}
                                                onClick={handleCardPaymentClick}
                                            >
                                                Pagar con Tarjeta de Crédito / Débito
                                            </Button>
                                        )}

                                        {showCardPayment && (
                                            <Button
                                                size='small'
                                                variant='contained'
                                                color='error'
                                                endIcon={<AccountBoxIcon />}
                                                sx={{ marginTop: '15px', width: 'fit-content', alignSelf: 'center' }}
                                                onClick={handleMercadoPagoClick}
                                            >
                                                Pagar con cuenta en Mercado Pago
                                            </Button>
                                        )}

                                        {showCardPayment && (
                                            <div className='mercadopago-div'>
                                                <h3 className='tarjetas'>Tarjetas Nacionales</h3>
                                                <span>Total a pagar: ${finalPriceARS.toFixed(2)}</span>
                                                <CardPaymentMP
                                                    nombreDestinatario={watch('nombreDestinatario')}
                                                    apellidoDestinatario={watch('apellidoDestinatario')}
                                                    phoneDestinatario={watch('phoneDestinatario')}
                                                    mailComprador={watch('mailComprador')}
                                                    localidad={location}
                                                    nombreLocalidad={locationName}
                                                    precioLocalidad={locationValue}
                                                    calle={watch('calle')}
                                                    altura={watch('altura')}
                                                    piso={watch('piso')}
                                                    dedicatoria={saveDedicatoria}
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
                                                    id={cart[0]?._id || cart[0]?.id || ''}
                                                    size={cart[0]?.size || ''}
                                                    products={cart}
                                                />
                                            </div>
                                        )}

                                        {showMercadoPago && (
                                            <div className='mercadopago-div'>
                                                <h3 className='tarjetas'>Tarjetas Nacionales</h3>
                                                <span>Total a pagar: ${finalPriceARS.toFixed(2)}</span>
                                                <p>Pagar con cuenta en Mercado Pago</p>
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
                                        <h3 className='tarjetas'>Tarjetas Internacionales</h3>
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