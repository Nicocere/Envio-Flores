"use client"

import { CartContext, useCartContext } from '../../context/CartContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Form from '../../componentes/Form/Form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Accordion, AccordionDetails, AccordionSummary, Button, FormHelperText, IconButton, List, ListItem, ListItemText, Paper, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckoutStepper from '../../componentes/ProgressBar/CheckoutStepper';
import { green } from '@mui/material/colors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import style from './cart.module.css'
import Image from 'next/image';
import SendIcon from '@mui/icons-material/Send';

import MercadoPagoButton from '../../componentes/MercadoPago/MercadoPago';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import CardPaymentMP from '../../componentes/MercadoPago/PasarelaDePago/CardPayment';
import PayPalButton from '../../componentes/PaypalCheckoutButton/PayPalButton';
import { useForm } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import localforage from 'localforage';
import { usePageContext } from '@/context/Context';
import CartMoreProducts from '@/componentes/CartMoreProducts/CartMoreProducts';
import CartPopUpProducts from '@/componentes/CartPopUpProducts/CartPopUpProducts';
import { useTheme } from '@/context/ThemeSwitchContext';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useCookies } from '@/context/CookieContext';

// const CartPopUpProducts = dynamic(() => import('@/componentes/CartMoreProducts/CartMoreProducts'), { ssr: false }); 
// const CartMoreProducts = dynamic(() => import('@/componentes/CartMoreProducts/CartMoreProducts'), { ssr: false });

const MySwal = withReactContent(Swal);


const CartComponent = () => {

    const { acceptCookies, acceptedCookies, showCookiePrompt, setShowCookiePrompt } = useCookies();

    const { CartID, UserID } = usePageContext();
    const { cart, setCart, setLocation, setLocationValue, setIsPremium, isPremium, precioEnvioPremium, envioPremiumInUsd, eliminarProd, totalPrecio, priceDolar, dolar } = useCartContext();
    const total = totalPrecio();
    const isSmallScreen = useMediaQuery('(max-width:850px)');
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const { isDarkMode } = useTheme();
    const [activeStep, setActiveStep] = useState(2);
    const [completeForm, setCompleteForm] = useState(false)
    const [confirmationDone, setConfirmationDone] = useState(false);
    const navigation = useRouter();
    const [showPayments, setShowPayments] = useState(false);
    const [retiraEnLocal, setRetiraEnLocal] = useState(false);
    const [showMercadoPago, setShowMercadoPago] = useState(true);
    const [showCardPayment, setShowCardPayment] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [saveDedicatoria, setSaveDedicatoria] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); // estado para la fecha seleccionada
    const [selectedTime, setSelectedTime] = useState(''); // estado para el horario seleccionado
    const textRef = useRef(null);

    const handleChangeBtn = (e) => {
        e.preventDefault();
        setSaveDedicatoria(watch('dedicatoria'));
        reset({ dedicatoria: saveDedicatoria });
    }
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (textRef.current) {
            observer.observe(textRef.current);
        }

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, []);

    const letterVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        exit: { opacity: 0, x: -20, transition: { duration: 0.8 } }
    };


    const fixedTextVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: { opacity: 0, x: 50, transition: { duration: 0.5, ease: "easeIn" } }
    };

    const textVariants2 = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: { opacity: 0, x: -50, transition: { duration: 0.5, ease: "easeIn" } }
    };

    useEffect(() => {
        if (cart.length > 0 && activeStep <= 2) {
            setShowPopup(true);
        }
    }, [cart.length, activeStep]);


    useEffect(() => {
        const isFormComplete =
            watch('nombreComprador') &&
            watch('apellidoComprador') &&
            watch('telefonoComprador') &&
            watch('mailComprador');

        setIsButtonDisabled(!isFormComplete);
    }, [watch('nombreComprador'), watch('apellidoComprador'), watch('telefonoComprador'), watch('mailComprador')]);


    const generateWhatsAppLink = () => {
        const mensaje = `Nombre y Apellido: ${watch('nombreComprador')} ${watch('apellidoComprador')},
          Teléfono: ${watch('telefonoComprador')}, 
          Email: ${watch('mailComprador')}`;
        const encodedMessage = encodeURIComponent(`Hola Florerias Argentinas!. Realice una transferencia y queria retirar mi producto en el local.
             Los datos son: ${mensaje}`);
        return `https://wa.me/+5491165421003?text=${encodedMessage}`;
    };
    const handleSendMessage = () => {
        navigation.push(generateWhatsAppLink())
        // Aquí puedes redirigir al enlace de WhatsApp
        // window.location.href = generateWhatsAppLink();
    };

    const handleShowTransfer = () => {
        setShowTransfer(!showTransfer);
        setShowAccounts(!showAccounts);

    }

    const handleMercadoPagoClick = () => {
        setShowMercadoPago(true);
        setShowCardPayment(false);
    };

    const handleCardPaymentClick = () => {
        setShowMercadoPago(false);
        setShowCardPayment(true);
    };


    const handleChangeRetirarProducto = () => {

        if (activeStep === 4) {
            setShowPayments(true)
            setShowAccounts(true)
            setRetiraEnLocal(true);
            setActiveStep(3)
        } else {
            setShowPayments(false)
            setShowAccounts(false)
            setRetiraEnLocal(false)
            setConfirmationDone(false);
            setCompleteForm(false)
        }

    };

    const handleAddMoreProducts = () => {
        if (cart.length > 0 && activeStep <= 2) {
            setShowPopup(true);
        }
    };


    const handleFinishPayment = () => {
        setShowPayments(!showPayments)
        setShowAccounts(!showAccounts)
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
            watch('mailComprador')
        );
        if (fieldsFilled) {
            setConfirmationDone(true);
            setCompleteForm(true);
            setActiveStep(4)
        } else {

            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
            });
        }
    };

    const handleFormSubmit = async () => {
        const emailPromocion = await localforage.getItem('emailPromocion');
        const mailComprador = watch('mailComprador');


        const fieldsFilled = (

            watch('nombreComprador') &&
            watch('telefonoComprador') &&
            watch('apellidoComprador') &&
            watch('mailComprador')
        );

        if (emailPromocion) {
            if (mailComprador !== emailPromocion) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El correo debe coincidir con el correo de la promoción para aplicar el descuento.',
                });
                return;
            }
        } else {
            const hasPromotion = cart.some(prod => prod.promocion && prod.promocion.status === true);
            if (hasPromotion) {
                const { value: email } = await Swal.fire({
                    title: 'Ingrese su correo para la promoción',
                    input: 'email',
                    inputLabel: 'Correo electrónico',
                    inputPlaceholder: 'Ingrese su correo',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Debe ingresar un correo!';
                        }
                    }
                });

                if (email) {
                    await localforage.setItem('emailPromocion', email);
                    if (email !== mailComprador) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El correo debe coincidir con el correo de la promoción para aplicar el descuento.',
                        });
                        return;
                    }
                }
            }
        }

        if (fieldsFilled) {
            setConfirmationDone(true);
            setCompleteForm(true);
            setActiveStep(4)
        } else {

            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
            });
        }
    };

    const deleteAll = async () => {
        return (
            MySwal.fire({
                title: '¿Quieres eliminar todos los productos?',
                text: "Vaciaras el carrito",
                icon: 'warning',
                iconColor: '#D4AF37 ',
                showCancelButton: true,
                confirmButtonColor: '#D4AF37 ',
                cancelButtonColor: '#2f1a0f',
                confirmButtonText: 'Eliminar Todo',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await localforage.setItem('cart', []);
                    setCart([])
                    Swal.fire({
                        title: 'Carrito Vacio!',
                        text: 'Tu carrito ha sido vaciado.',
                        icon: 'success',
                        iconColor: '#D4AF37 ',
                        background: 'linear-gradient(to top,#dbdbdb,#fcf5f0)',
                    })
                }
            })
        )
    }

    const handleRetirarLocal = () => {
        handleStepChange(2);
        handleChangeRetirarProducto();
        setLocation({})
        setLocationValue(0)
        setIsPremium(false)
    }


    let itemSelected = cart || []
    const router = useRouter();
    const queryParams = router.query;
    const pagoExitoso = queryParams?.get('PagoExistoso');
    const paymentID = queryParams?.get('Payment-ID');
    const order = queryParams?.get('Order')
    const pagoPaypalExitoso = queryParams?.get('PagoPayPalExistoso');

    if (pagoExitoso === 'true' || pagoPaypalExitoso === 'true') {
        return (
            <div className={style.divCompraFinalizada}>
                <h3 className={style.compraFinalizada}>Gracias por comprar en Florerias Argentinas. </h3>
                <h2 className={style.compraFinalizada}>Tu ID de tu compra es: <strong>{paymentID} </strong> </h2>
                <h1 className={style.idCompra}> N° de Pedido: <strong> {order} </strong> </h1>
                <p className={style.detailsCompra}> Podras visualizar los detalles de tu compra en la direccion de E-mail que ingresaste
                    <span>(En caso de que no pueda visualizarlo en su casilla de mail, verifique su casilla de Spam.) </span></p>
                <h4 className={style.compraFinalizada}>
                    Puedes ir al <Link href="/" className={style.cartHome}>Inicio</Link>{' '} para seguir viendo otros productos
                </h4>
            </div>
        );
    }

const handleAcceptCookies = () => {
    acceptCookies();
    setShowCookiePrompt(false);
};

const handleViewCookies = () => {
    setShowCookiePrompt(false);
    navigation.push('/cookies');
};




    return (
        <div className={style.cart} style={{ background: isDarkMode ? '#fcf5f0' : '#1a0f0a', color: isDarkMode ? '#2f1a0f' : '#fcf5f0' }}>


            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className={style.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={style.modalContent}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", damping: 15 }}
                        >
                            <Tooltip title="Cerrar" placement="top" arrow sx={{zIndex: 1199}}>
                            <button
                                className={style.closeButton}
                                onClick={() => setShowPopup(false)}
                            >
                                ×
                            </button>
                            </Tooltip>
                            <CartPopUpProducts />
                            <button
                                className={style.closeModal}
                                onClick={() => setShowPopup(false)}
                            >
                            No quiero agregar nada
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {
                activeStep === 2 &&
                <CheckoutStepper activeStep={2} cartEmpty={cart.length === 0} cartFull={cart.length !== 0} />
            }

            {
                pagoExitoso === 'true' || pagoPaypalExitoso === 'true' ? (
                    <>
                        <h2 className={style.compraFinalizada}>Gracias por comprar en Florerias Argentinas. </h2>
                        <h2 className={style.compraFinalizada}>Tu ID de tu compra es:</h2>
                        <h1 className={style.idCompra}> N° de pedido: {paymentID} </h1>
                        <h4 className={style.compraFinalizada}>
                            Puedes ir al <Link href="/" className={style.cartHome}>Inicio</Link>{' '} para seguir viendo otros productos
                        </h4>
                    </>
                ) : !acceptedCookies ? (
                        <div className={style.cartVacioSinCookies}>
                            <h1 className={style.cartVacio}>
                                Lo sentimos, pero no podemos continuar sin su consentimiento.
                                Por favor acepte las cookies para continuar...
                            </h1>
                    <div className={style.btnContainer}>

                            <button  className={style.btnAcceptCookie} onClick={handleAcceptCookies}>
                                Aceptar cookies
                            </button>
                            <button className={style.btnDeniedCookie}  onClick={handleViewCookies}>
                                Ver política de cookies
                            </button>
                    </div>
                        </div> 
                        )
                     : ( 
                    cart.length === 0 ? (
                        <>
                            <h1 className={style.cartVacio} style={{ background: isDarkMode ? '#f5e9d7e6' : '#2f1a0fb8', color: isDarkMode ? '#2f1a0f' : '#fcf5f0', boxShadow: !isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.81)' : '0 4px 12px rgba(0, 0, 0, 0.24)' }}>
                                El Carrito esta vacío...
                                Puedes ir al <Link href="/" className={style.cartHome}>Inicio</Link>{' '}
                                para buscar y agregar algún producto
                            </h1>
                        </>
                    ) : (
                        <>
                            {
                                retiraEnLocal ?

                                    <Button variant="contained" sx={{ color: '#2f1a0f', background: '#D4AF37', margin: '10px 30px', transition: 'all .33s ease', '&:hover': { background: '#fcf5f0 ', color: ' #2f1a0f', fontSize: 'medium' } }} onClick={() => { handleStepChange(2); handleChangeRetirarProducto(); }}>
                                        Ver el carrito de compras
                                    </Button> :
                                    <>

                                        {/* Informacion del Carrito de compras */}
                                        {
                                            activeStep <= 2 && (

                                                isSmallScreen ?
                                                    (<>

                                                        <h2 >Carrito de Compras</h2>
                                                        <h3>Estos son los productos que seleccionó</h3>


                                                        <motion.div
                                                            className={style.mobileCartList}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {itemSelected.map((prod, indx) => (
                                                                <motion.div
                                                                    key={indx}
                                                                    className={style.mobileCartItem}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: indx * 0.1 }}
                                                                    whileHover={{ scale: 1.02 }}
                                                                >
                                                                    <div className={style.itemImageContainer}>
                                                                        <motion.div
                                                                            whileHover={{ scale: 1.05 }}
                                                                            transition={{ duration: 0.3 }}
                                                                        >
                                                                            <Image
                                                                                width={80}
                                                                                height={80}
                                                                                src={prod.img}
                                                                                alt={prod.name}
                                                                                className={style.productImage}
                                                                            />
                                                                        </motion.div>
                                                                    </div>

                                                                    <div className={style.itemDetails}>
                                                                        <motion.h3
                                                                            className={style.productName}
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            transition={{ delay: 0.2 }}
                                                                        >
                                                                            {prod.name}
                                                                        </motion.h3>

                                                                        <motion.div
                                                                            className={style.productInfo}
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            transition={{ delay: 0.3 }}
                                                                        >
                                                                            <span>Cantidad: {prod.quantity}</span>
                                                                            <span>Talle: {prod.size}</span>
                                                                        </motion.div>

                                                                        <motion.div
                                                                            className={style.productPrice}
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            transition={{ delay: 0.4 }}
                                                                        >
                                                                            {priceDolar ?
                                                                                `USD$${(prod.precio / dolar).toFixed(2)}` :
                                                                                `$${prod.precio.toLocaleString('es-AR')}`
                                                                            }
                                                                        </motion.div>
                                                                    </div>

                                                                    <motion.button
                                                                        className={style.deleteButton}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => eliminarProd(
                                                                            prod.name,
                                                                            prod.size,
                                                                            prod.precio,
                                                                            prod.id,
                                                                            prod.quantity
                                                                        )}
                                                                    >
                                                                        <DeleteIcon sx={{ fontSize: '20px' }} />
                                                                    </motion.button>
                                                                </motion.div>
                                                            ))}
                                                        </motion.div>
                                                        <Button color='error' size='small' variant='contained' sx={{ alignSelf: 'center', margin: '15px' }} onClick={(event) => { deleteAll() }}>Eliminar Todo</Button>
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
                                                        <h2>Carrito de Compras</h2>
                                                        <h4>Estos son los productos que seleccionó</h4>

                                                        <div className={style.divTableCart}>
                                                            <table className={isDarkMode ? style.tableCart : style.tableCartDark}>
                                                                <thead className={style.tableHead}>
                                                                    <tr className={style.tableHeadTr}>
                                                                        <th>Imagen</th>
                                                                        <th>Producto</th>
                                                                        <th>Cantidad</th>
                                                                        <th>Tamaño</th>
                                                                        <th>Precio</th>
                                                                        <th>Promocion</th>
                                                                        <th>Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className={style.tableBody}>
                                                                    {itemSelected?.map((prod, indx) => {
                                                                        const prodPrecioUsd = (prod.precio / dolar).toFixed(2);
                                                                        return (
                                                                            <tr className={style.tableInfo} key={indx} >
                                                                                <td><Image width={120} height={120} className='imgInCart' src={prod.img} alt="imagen producto en carrito" style={{ marginRight: '5px' }} /></td>
                                                                                <td className={style.detailsInCart}>{prod.name}</td>
                                                                                <td className={style.detailsInCart}>{prod.quantity}</td>
                                                                                <td className={style.detailsInCart}>{prod.size}</td>
                                                                                <td className={style.detailsInCart}>
                                                                                    {prod.promocion && prod.promocion?.status === true ? (
                                                                                        <>
                                                                                            <span className={style.originalPrice}>
                                                                                                Antes: {priceDolar ? `USD$${prodPrecioUsd}` : `$${prod.precio.toLocaleString('es-AR')}`}
                                                                                            </span>
                                                                                            <br />
                                                                                            <span className={style.discountedPrice}>
                                                                                                Después: {priceDolar ? `USD$${(prodPrecioUsd * (1 - prod.promocion.descuento / 100)).toFixed(2)}` : `$${(prod.precio * (1 - prod.promocion.descuento / 100)).toLocaleString('es-AR')}`}
                                                                                            </span>
                                                                                        </>
                                                                                    ) : (
                                                                                        priceDolar ? `USD$${prodPrecioUsd}` : `$${prod.precio.toLocaleString('es-AR')}`
                                                                                    )}
                                                                                </td>
                                                                                <td className={style.detailsInCart}>{prod.promocion && prod.promocion?.status === true ? `${prod.promocion.descuento}% OFF` : 'No'}</td>
                                                                                <td>
                                                                                    <IconButton aria-label="delete" size="large"

                                                                                        onClick={() => eliminarProd(prod.name,
                                                                                            prod.size,
                                                                                            prod.precio,
                                                                                            prod.id,
                                                                                            prod.quantity
                                                                                        )}>
                                                                                        <DeleteIcon sx={{ fontSize: isSmallScreen ? '18px' : '22px' }} color="error" />

                                                                                    </IconButton>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        <br>

                                                        </br><Button variant="contained" sx={{ backgroundColor: '#91190b', fontSize: isSmallScreen ? '8px' : '20px', margin: '20px 0', '&:hover': { backgroundColor: 'red' } }} onClick={deleteAll} startIcon={<DeleteIcon />}>
                                                            ELIMINAR TODO
                                                        </Button>


                                                        {
                                                            priceDolar ?
                                                                <h2 className={style.totalPrecio}>Total: USD${total}</h2>
                                                                :

                                                                <h2 className={style.totalPrecio}>
                                                                    Total: ${new Intl.NumberFormat('es-AR', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                        useGrouping: true
                                                                    }).format(total)}
                                                                </h2>

                                                        }
                                                    </>
                                            )}
                                    </>
                            }

                            {(activeStep >= 2 && activeStep !== 3) ? (

                                <>

                                    <Paper elevation={1} sx={{ background: isDarkMode ? '#fcf5f0' : '#0c0402', padding: '30px, 0', display: 'flex', marginBottom: '100px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>

                                        <h2 style={{ color: isDarkMode ? '#2f1a0f' : '#FAF3EB', fontSize: '25px', padding: '20px' }}>
                                            {showPayments ? 'Seleccionó Retirar en Local' : (cart.length <= 1 ? '¿Dónde desea que enviemos su Producto?' : '¿Dónde desea que enviemos sus Productos?')}
                                        </h2>



                                        {retiraEnLocal &&

                                            <>

                                                {
                                                    !completeForm ?
                                                        (<form onSubmit={handleSubmit} className={`${style.form} ${!isDarkMode ? style.darkMode : style.lightMode}`}>

                                                            <div style={{ color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', padding: '5px 35px' }}>
                                                                <p>Gracias por confiar en Florerias Argentinas, antes de finalizar, debe completar todos los datos requeridos aqui abajo...</p>


                                                                {/* <div className='div-dedicatoria' >
                                                                <h4 className='dedic-text'>Aqui puede agregar una dedicatoria:</h4>

                                                                <textarea {...register('dedicatoria')} className='dedicatoria' name="dedicatoria" />
                                                                <Button size='small' variant='contained' color='error'
                                                                    sx={{
                                                                        marginBottom: 1.20, marginTop: 1.20, '&:hover': {
                                                                            backgroundColor: '#a70000',
                                                                            fontWeight: 500
                                                                        },
                                                                    }} onClick={handleChangeBtn}>Guardar Dedicatoria</Button>

                                                                {
                                                                    saveDedicatoria ? (
                                                                        <>
                                                                            <h4 className='dedic-titulo'>Usted escribió:</h4>
                                                                            <h3 className='dedic-save'>{saveDedicatoria}</h3>

                                                                        </>
                                                                    ) : saveDedicatoria === ""
                                                                }
                                                            </div> */}

                                                            </div>

                                                            <Paper
                                                                elevation={12}
                                                                sx={{
                                                                    width: isSmallScreen ? '-webkit-fill-available' : '70%',
                                                                    padding: '20px', margin: isSmallScreen ? '10px' : '20px',
                                                                    background: isDarkMode ? '#F5E9D7' : '#ffffff1a',
                                                                    color: isDarkMode ? '#2f1a0f' : '#fcf5f0',
                                                                    transition: 'all 0.3s ease',
                                                                    '& .MuiTextField-root': {
                                                                        marginBottom: '1rem',
                                                                        '& .MuiInputBase-root': {
                                                                            color: isDarkMode ? '#2f1a0f' : '#fcf5f0',
                                                                            '&.Mui-focused': {
                                                                                color: isDarkMode ? '#D4AF37' : '#fcf5f0',
                                                                            },
                                                                        },
                                                                        '& .MuiInputLabel-root': {
                                                                            color: isDarkMode ? '#2f1a0f' : '#fcf5f0',
                                                                            '&.Mui-focused': {
                                                                                color: isDarkMode ? '#D4AF37' : '#fcf5f0',
                                                                            },
                                                                        },
                                                                        '& .MuiFilledInput-underline:before': {
                                                                            borderBottomColor: isDarkMode ? '#D4AF37' : '#fcf5f0',
                                                                        },
                                                                        '& .MuiFilledInput-underline:after': {
                                                                            borderBottomColor: isDarkMode ? '#D4AF37' : '#fcf5f0',
                                                                        },
                                                                    },
                                                                    '& .message-error': {
                                                                        color: isDarkMode ? '#D4AF37' : '#fcf5f0',
                                                                    },
                                                                }}
                                                                className={style.datosComprador}
                                                            >
                                                                <h3 className='titulo-datosEnvio'>Datos de quien retira el producto:</h3>

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
                                                                    color='secondary'
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
                                                                    color='secondary'
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
                                                                    color='secondary'
                                                                />
                                                                {errors.telefonoComprador && <p className='message-error'>Debe ingresar su N° de Telefono por si necesitamos comunicarnos con usted</p>}

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
                                                                    color='secondary'
                                                                />
                                                                {errors.mailComprador && <p className='message-error'>Debe ingresar un E-mail</p>}

                                                                <div className={style.divDedicatoria}>
                                                                    <h4 className={style.dedicText}>Aqui puede agregar una dedicatoria:</h4>

                                                                    <textarea {...register('dedicatoria')} className={style.dedicatoria} name="dedicatoria" />
                                                                    <Button size='small' variant='contained'
                                                                        sx={{ width: 'fit-content', alignSelf: 'center', color: 'white', background: '#D4AF37 ', margin: '10px 30px', transition: 'background .33s ease', '&:hover': { background: isDarkMode ? '#F5E9D7 ' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#F5E9D7' } }} onClick={handleChangeBtn}>Guardar Dedicatoria</Button>

                                                                    {saveDedicatoria ? (
                                                                        <div style={{ margin: '20px 0 25px' }}>
                                                                            <h4 className={style.dedicTitulo}>Usted escribió:</h4>
                                                                            <div className={style.dedicSaveContainer}>

                                                                                <h3 className={style.dedicSave}>{saveDedicatoria}</h3>
                                                                            </div>

                                                                        </div>
                                                                    ) : saveDedicatoria === ""}
                                                                </div>
                                                                <div className={style.datosFechaEnvio}>
                                                                    <h3 className={style.tituloDatosEnvio}>Fecha y Horario que viene a retirar:</h3>

                                                                    {/* Selector de Fecha */}
                                                                    <label htmlFor="deliveryDate" className='lbl-fecha-envio'>Fecha:</label>
                                                                    <input
                                                                        type="date"
                                                                        id="deliveryDate"
                                                                        name="deliveryDate"
                                                                        className={style.inputFechaEnvio}
                                                                        onChange={handleChangeDateTime}
                                                                        {...register("fechaEnvio", { required: true })} />
                                                                    {errors.fechaEnvio && <p className={style.messageError}>Debe seleccionar una fecha</p>}

                                                                    <label htmlFor="deliveryTime" className={style.lblHorarioEnvio}>Horario que vendría:</label>
                                                                    <select
                                                                        id="deliveryTime"
                                                                        name="deliveryTime"
                                                                        className={style.selectHorarioEnvio}
                                                                        onChange={handleChangeDateTime}
                                                                        {...register("selectHorario", { required: true })}
                                                                    >
                                                                        <option value="">Seleccione un horario</option>
                                                                        {getAvailableTimeSlots().map(slot => (
                                                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                                        ))}
                                                                    </select>
                                                                    {errors.selectHorario && <p className={style.messageError}>Debe seleccionar un horario</p>}
                                                                </div>

                                                            </Paper>
                                                            {
                                                                !confirmationDone &&
                                                                <Button
                                                                    variant='contained'
                                                                    color='secondary'
                                                                    sx={{
                                                                        color: '#2f1a0f',
                                                                        background: '#D4AF37',
                                                                        margin: '10px 30px',
                                                                        transition: 'all .33s ease',
                                                                        '&:hover': {
                                                                            background: '#fcf5f0 ',
                                                                            color: ' #2f1a0f'
                                                                        }
                                                                    }}

                                                                    disabled={isButtonDisabled}
                                                                    // type="submit"
                                                                    onClick={() => {
                                                                        handleFormSubmit();
                                                                    }}
                                                                >
                                                                    {isButtonDisabled ? 'Complete todos los campos' : 'Confirmar Datos'}
                                                                </Button>
                                                            }

                                                            {priceDolar ? (
                                                                <h2 style={{ color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', }}>Total final: USD${total}</h2>
                                                            ) : (
                                                                <h2 className={style.totalPrecio} style={{ color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', }}>
                                                                    Total final: ${new Intl.NumberFormat('es-AR', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                        useGrouping: true
                                                                    }).format(total)}
                                                                </h2>

                                                            )}

                                                        </form>
                                                        )
                                                        :
                                                        <>

                                                            <CheckoutStepper activeStep={4} />
                                                            {confirmationDone &&
                                                                <Paper
                                                                    elevation={12}
                                                                    sx={{
                                                                        padding: isSmallScreen ? '10px' : '50px',
                                                                        background: isDarkMode ? '#ffffff1a' : '#ffffff1a',
                                                                        color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease',
                                                                        transition: 'all 0.3s ease',
                                                                    }}
                                                                >

                                                                    <h3 style={{ padding: '10px 30px' }}>Gracias por ingresar tus datos, ahora puede proceder con finalizar la compra.</h3>

                                                                    <Accordion>
                                                                        <AccordionSummary
                                                                            sx={{
                                                                                background: isDarkMode ? '#ffffff1a' : '#2f1a0f',
                                                                                border: isDarkMode ? '1px solid #D4AF37' : '1px solid #D4AF37',
                                                                                color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', borderRadius: '10px'
                                                                            }}
                                                                            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                                                        >
                                                                            <p style={{ textTransform: 'uppercase' }}>Datos de quien retira el Producto.</p>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails>
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 0.5 }}
                                                                            >
                                                                                <h4>
                                                                                    Nombre: <strong style={{ color: '#D4AF37' }}>{watch('nombreComprador')}</strong> <br />
                                                                                    Apellido: <strong style={{ color: '#D4AF37' }}>{watch('apellidoComprador')}</strong> <br />
                                                                                    Teléfono: <strong style={{ color: '#D4AF37' }}>{watch('telefonoComprador')}</strong> <br />
                                                                                    Email: <strong style={{ color: '#D4AF37' }}>{watch('mailComprador')}</strong> <br />
                                                                                </h4>
                                                                            </motion.div>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                </Paper>

                                                            }


                                                            {
                                                                showPayments &&
                                                                <>
                                                                    <motion.div
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                    >
                                                                        <div style={{
                                                                            color: isDarkMode ? '#2f1a0f' : '#FAF3EB',
                                                                            padding: '5px 0',
                                                                            margin: '20px 40px 10px',
                                                                            textTransform: 'uppercase',
                                                                            display: 'flex',
                                                                            flexWrap: 'wrap',
                                                                            justifyContent: 'center',
                                                                            gap: '13px'
                                                                        }}>
                                                                            {"¡Estás a un paso de finalizar la compra!".split("").map((char, index) => (
                                                                                <motion.span
                                                                                    key={index}
                                                                                    custom={index}
                                                                                    variants={letterVariants}
                                                                                >
                                                                                    {char}
                                                                                </motion.span>
                                                                            ))}
                                                                        </div>
                                                                    </motion.div>


                                                                    <motion.div
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                        variants={fixedTextVariants}
                                                                    >
                                                                        <h4 style={{
                                                                            color: isDarkMode ? '#2f1a0f' : '#FAF3EB',
                                                                            padding: '20px'
                                                                        }}>
                                                                            Selecciona el método de pago que deseas utilizar aquí abajo
                                                                        </h4>
                                                                    </motion.div>
                                                                </>
                                                            }

                                                            {
                                                                showPayments &&
                                                                <Paper
                                                                    elevation={24}
                                                                    sx={{
                                                                        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                                                                        width: isSmallScreen ? '-webkit-fill-available' : '85%',
                                                                        padding: isSmallScreen ? '20px' : '30px 89px',
                                                                        color: isDarkMode ? '#2f1a0f' : '#FAF3EB',
                                                                        textAlign: 'center',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                >
                                                                    <h2 style={{ color: isDarkMode ? '#D4AF37' : '#FAF3EB', margin: '15px 10px' }}>Seleccione un método de pago</h2>
                                                                    <div className={style.paymentOptions}>
                                                                        <h4 className={style.text}>Si querés pagar mediante una transferencia, hace click aquí</h4>
                                                                        <Button
                                                                            variant='contained'
                                                                            color='secondary'
                                                                            onClick={handleShowTransfer}
                                                                            sx={{
                                                                                margin: '20px 0',
                                                                                background: '#D4AF37',
                                                                                color: '#2f1a0f ',
                                                                                '&:hover': { background: '#FAF3EB' }
                                                                            }}
                                                                        >
                                                                            {showTransfer ? 'Mejor no...' : "Deseo pagarlo con Transferencia"}
                                                                        </Button>
                                                                        {showTransfer && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 0.5 }}
                                                                            >
                                                                                <Typography variant="body1">Cuenta de Mercado Pago</Typography>
                                                                                <Typography variant="body1">CVU: 0000003100094511404914</Typography>
                                                                                <Typography variant="body1">Alias: regalosflores</Typography>
                                                                                <Typography variant="body1">Nombre: Luz Marina londoño cuartas</Typography>
                                                                                <Typography className={style.text} variant='subtitle1'>
                                                                                    Cuando hagas la transferencia, haz click aquí para enviarme el comprobante al WhatsApp de Florerias Argentinas con los datos de la compra
                                                                                </Typography>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    color="success"
                                                                                    onClick={(e) => { handleSendMessage({}); e.stopPropagation(); }}
                                                                                    sx={{ marginTop: '10px', background: '#093209', '&:hover': { background: '#005f00' } }}
                                                                                    endIcon={<SendIcon />}
                                                                                >
                                                                                    Enviar a WhatsApp
                                                                                </Button>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                    <hr style={{ width: '100%', margin: '20px 0', border: '1px solid #D4AF37' }} />

                                                                    {showAccounts && (
                                                                        <div>
                                                                            <Typography variant="body1" className={style.text}>Con Cuentas o Tarjetas de Crédito/Débito</Typography>
                                                                            <div id='Payment' className='payments-btn-container' style={{ background: 'transparent' }}>
                                                                                <div style={{
                                                                                    background: 'transparent',
                                                                                    display: 'flex',
                                                                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                                                                    justifyContent: 'space-around',
                                                                                    alignItems: 'center'
                                                                                }}>
                                                                                    <div className={style.MercadoPagoButton}>
                                                                                        {showMercadoPago && (
                                                                                            <Button
                                                                                                size='small'
                                                                                                variant='contained'
                                                                                                color='secondary'
                                                                                                endIcon={<CreditCardTwoToneIcon />}
                                                                                                sx={{
                                                                                                    marginTop: '15px',
                                                                                                    width: 'fit-content',
                                                                                                    alignSelf: 'center',
                                                                                                    background: '#D4AF37',
                                                                                                    '&:hover': { background: isDarkMode ? '#F5E9D7 ' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#F5E9D7' }
                                                                                                }}
                                                                                                onClick={handleCardPaymentClick}
                                                                                            >
                                                                                                Quiero pagar con Tarjeta de Crédito/Débito
                                                                                            </Button>
                                                                                        )}
                                                                                        {showCardPayment && (
                                                                                            <Button
                                                                                                size='small'
                                                                                                variant='contained'
                                                                                                color='secondary'
                                                                                                endIcon={<AccountBoxIcon />}
                                                                                                sx={{
                                                                                                    marginTop: '15px',
                                                                                                    width: 'fit-content',
                                                                                                    alignSelf: 'center',
                                                                                                    background: '#D4AF37',
                                                                                                    '&:hover': { background: isDarkMode ? '#F5E9D7 ' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#F5E9D7' }

                                                                                                }}
                                                                                                onClick={handleMercadoPagoClick}
                                                                                            >
                                                                                                Quiero pagar con mi cuenta en MercadoPago
                                                                                            </Button>
                                                                                        )}
                                                                                        {showCardPayment && (
                                                                                            <div className={style.mercadopagoDiv}>
                                                                                                <motion.h4
                                                                                                    className='tarjetas'
                                                                                                    style={{ fontWeight: '600', color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', margin: '15px' }}
                                                                                                    initial="hidden"
                                                                                                    animate="visible"
                                                                                                    exit="exit"
                                                                                                    variants={textVariants}
                                                                                                >
                                                                                                    Pagar con Tarjetas Nacionales
                                                                                                </motion.h4>
                                                                                                <motion.span
                                                                                                    style={{ color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', textTransform: 'uppercase' }}
                                                                                                    initial="hidden"
                                                                                                    animate="visible"
                                                                                                    exit="exit"
                                                                                                    variants={textVariants}
                                                                                                >
                                                                                                    Total a pagar: {priceDolar ? `USD$${total}` : ` $${total.toLocaleString('es-AR')}`}
                                                                                                </motion.span>
                                                                                                <CardPaymentMP
                                                                                                    CartID={CartID}
                                                                                                    UserID={UserID}
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
                                                                                                    mailComprador={watch('mailComprador')}
                                                                                                    nombreComprador={watch('nombreComprador')}
                                                                                                    phoneComprador={watch('telefonoComprador')}
                                                                                                    apellidoComprador={watch('apellidoComprador')}
                                                                                                    fechaEnvio={watch('fechaEnvio')}
                                                                                                    selectHorario={watch('selectHorario')}
                                                                                                    dedicatoria={watch('dedicatoria')}
                                                                                                    horarioEnvio={watch('selectHorario')}
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                        {showMercadoPago && (
                                                                                            <div className={style.mercadopagoDiv}>
                                                                                                <motion.h4
                                                                                                    className='tarjetas'
                                                                                                    style={{ fontWeight: '600', color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', margin: '15px' }}
                                                                                                    initial="hidden"
                                                                                                    animate="visible"
                                                                                                    exit="exit"
                                                                                                    variants={textVariants2}
                                                                                                >
                                                                                                    Pagar con Cuenta Mercado Pago
                                                                                                </motion.h4>
                                                                                                <motion.span
                                                                                                    style={{ color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', textTransform: 'uppercase' }}
                                                                                                    initial="hidden"
                                                                                                    animate="visible"
                                                                                                    exit="exit"
                                                                                                    variants={textVariants2}
                                                                                                >
                                                                                                    Total a pagar: {priceDolar ? `USD$${total}` : ` $${total.toLocaleString('es-AR')}`}
                                                                                                </motion.span>
                                                                                                <MercadoPagoButton
                                                                                                    CartID={CartID}
                                                                                                    UserID={UserID}
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
                                                                                                    mailComprador={watch('mailComprador')}
                                                                                                    nombreComprador={watch('nombreComprador')}
                                                                                                    phoneComprador={watch('telefonoComprador')}
                                                                                                    apellidoComprador={watch('apellidoComprador')}
                                                                                                    fechaEnvio={watch('fechaEnvio')}
                                                                                                    selectHorario={watch('selectHorario')}
                                                                                                    dedicatoria={watch('dedicatoria')}
                                                                                                    horarioEnvio={watch('selectHorario')}
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className={style.PayPalDiv}>
                                                                                        <h4 className='tarjetas' style={{ fontWeight: '600', color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', margin: '10px 0' }}>Tarjetas Internacionales</h4>
                                                                                        <span style={{ color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease', textTransform: 'uppercase', fontSize: 'larger' }}>
                                                                                            Total a pagar: USD${
                                                                                                priceDolar ? total : (total / dolar).toFixed(1)
                                                                                            }
                                                                                        </span>
                                                                                        <PayPalButton
                                                                                            CartID={CartID}
                                                                                            UserID={UserID}
                                                                                            retiraEnLocal={true}
                                                                                            itemSelected={itemSelected}
                                                                                            total={priceDolar ? total : (total / dolar).toFixed(1)}
                                                                                            title={cart[0].name}
                                                                                            description={cart[0].descr}
                                                                                            picture_url={cart[0].img}
                                                                                            category_id={cart[0].tipo}
                                                                                            quantity={cart[0].quantity}
                                                                                            id={cart[0].id}
                                                                                            size={cart[0].size}
                                                                                            products={cart}
                                                                                            dedicatoria={saveDedicatoria}
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
                                                                        </div>
                                                                    )}
                                                                </Paper>

                                                            }
                                                        </>
                                                }
                                            </>

                                        }

                                        <div>

                                            {
                                                showPayments ? null :
                                                    <>
                                                        <Button variant='contained' color='secondary' sx={{ color: '#2f1a0f', background: '#D4AF37', margin: '10px 30px', transition: 'all .33s ease', '&:hover': { background: '#fcf5f0 ', color: ' #2f1a0f', fontSize: 'medium' } }} className='btn-eliminarProd' onClick={handleFinishPayment}>Retiro en el Local</Button>
                                                        {/* <Button variant="contained" sx={{ color: 'white', background: '#D4AF37', margin: '10px 30px', transition: 'background .33s ease',     '&:hover': { background: isDarkMode ? '#F5E9D7 ' : '#2f1a0f', color:isDarkMode ? '#2f1a0f' : '#F5E9D7' } }} onClick={handleRetirarLocal}>Quiero retirar en el Local </Button> */}
                                                        <Button variant='contained' color='secondary' sx={{ color: '#2f1a0f', background: '#D4AF37', margin: '10px 30px', transition: 'all .33s ease', '&:hover': { background: '#fcf5f0 ', color: ' #2f1a0f', fontSize: 'medium' } }} onClick={handleAddMoreProducts}>Añadir más productos</Button>
                                                    </>
                                            }
                                            {
                                                retiraEnLocal && <h3 style={{ margin: '20px 0 5px', fontWeight: '800', padding: '25px', borderRadius: '10px', width: '100%', color: isDarkMode ? '#2f1a0f' : 'white', transition: 'all .8s ease' }}>¡Quiero enviar mis produtos!</h3>
                                            }
                                            <Button variant="contained" sx={{ color: '#2f1a0f', background: '#D4AF37', margin: '10px 30px', transition: 'all .33s ease', '&:hover': { background: '#fcf5f0 ', color: ' #2f1a0f', fontSize: 'medium' } }} onClick={() => { handleStepChange(3); handleChangeRetirarProducto(); }}>
                                                Enviar a domicilio
                                            </Button>
                                        </div>

                                    </Paper>
                                </>

                            ) :
                                <>

                                    <Button variant="contained" sx={{ color: 'white', background: '#D4AF37', margin: '10px 30px', transition: 'background .33s ease', '&:hover': { background: isDarkMode ? '#F5E9D7 ' : '#2f1a0f', color: isDarkMode ? '#2f1a0f' : '#F5E9D7' } }} onClick={handleRetirarLocal}>Quiero retirar en el Local </Button>
                                </>
                            }

                            {/* Sección del formulario */}
                            {activeStep === 3 && (

                                <div className='formulario'>
                                    <Form itemSelected={itemSelected} idCompra={paymentID} />
                                </div>
                            )}

                        </>
                    )
                )
            }

            <CartMoreProducts />

        </div >
    );

};
export default CartComponent;
