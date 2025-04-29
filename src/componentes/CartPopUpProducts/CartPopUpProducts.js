"use client";

import React, { useEffect, useRef, useState } from 'react';
import localforage from 'localforage';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import style from './CartPopUpProducts.module.css';
import { useTheme } from '@/context/ThemeSwitchContext';
import { useCart } from '@/context/CartContext';
import { usePageContext } from '@/context/Context';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { FaGift, FaHeart, FaShoppingCart, FaStar, FaMagic, FaSearch, FaRegSmile } from 'react-icons/fa';
import { IoFlower, IoClose } from 'react-icons/io5';
import { BsArrowRight, BsBoxSeam } from 'react-icons/bs';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MySwal = withReactContent(Swal);

// Constantes de animación
const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const popupAnimation = {
  initial: {  scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: {  scale: 0.9, y: 20 }
};

const slideUpAnimation = {
  initial: {  y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: {  y: 20 }
};

const CartPopUpProducts = ({ isOpen: externalIsOpen = false, onClose }) => {
    const cartContext = useCart();
    const pageContext = usePageContext();
    const { isDarkMode } = useTheme();
    
    // Estado interno para controlar la apertura automática
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    // Estado combinado (externo o interno)
    const isOpen = externalIsOpen || internalIsOpen;
    
    // Validación y destructuración segura del contexto
    const { cart = [], setCart = () => { }, priceDolar = false, dolar = 1 } = cartContext || {};
    const { CartID = null, UserID = null } = pageContext || {};

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(true);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const isInView = useInView(titleRef, {
        once: false,
        amount: 0.5
    });
    const isSubtitleInView = useInView(subtitleRef, {
        once: false,
        amount: 0.5
    });

    // Verificación del contexto
    useEffect(() => {
        if (!cartContext) {
            console.error('CartContext no está disponible');
        }
    }, [cartContext]);

    // Efecto para apertura automática
    useEffect(() => {
        const checkAndShowPopup = async () => {
            // Verificar si el popup se ha mostrado recientemente
            const lastShown = localStorage.getItem('addonPopupLastShown');
            const currentTime = new Date().getTime();
            const showCooldown = 1000 * 60 * 60 * 24; // 24 horas de cooldown
            
            if (!lastShown || (currentTime - parseInt(lastShown)) > showCooldown) {
                // Verificar si hay productos en el carrito
                const cartData = await localforage.getItem('cart');
                if (cartData && cartData.length > 0) {
                    // Esperar 2 segundos antes de mostrar el popup para no interrumpir inmediatamente
                    setTimeout(() => {
                        setInternalIsOpen(true);
                        // Guardar timestamp de cuándo se mostró
                        localStorage.setItem('addonPopupLastShown', currentTime.toString());
                    }, 2000);
                }
            }
        };
        
        checkAndShowPopup();
        
    }, [cart]); // Se ejecuta cuando cambia el carrito

    // Cargar productos cuando se abre el popup
    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            const storedProducts = await localforage.getItem('productos') || [];
            const storedAddons = await localforage.getItem('adicionales') || [];

            const productsWithOptions = storedProducts.filter(product =>
                product.opciones && product.opciones.length > 0
            );

            const shuffledProducts = shuffleArray([...productsWithOptions, ...storedAddons]);
            const selectedProducts = shuffledProducts.slice(0, 8);

            setProducts(selectedProducts);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const addToCart = async (product, selectedOption) => {
        try {
            const cartData = await localforage.getItem('cart');
            const currentCart = cartData || [];

            const existingProductIndex = currentCart.findIndex(p =>
                p.id === product.id && p.size === (selectedOption.nombre || product.nombre)
            );

            if (existingProductIndex !== -1) {
                currentCart[existingProductIndex].quantity += 1;
            } else {
                currentCart.push({
                    id: product.id,
                    idOption: selectedOption.id || product.id,
                    size: selectedOption.nombre || product.nombre,
                    precio: selectedOption.precio || product.precio,
                    name: product.nombre,
                    img: selectedOption.img || product.img,
                    quantity: 1,
                    CartID: await CartID,
                    UserID: await UserID
                });
            }

            setCart(currentCart);
            await localforage.setItem('cart', currentCart);

            const priceInUsd = ((selectedOption.precio || product.precio) / dolar).toFixed(2);
            const displayPrice = priceDolar ?
                `USD$${priceInUsd}` :
                `$${Number(selectedOption.precio || product.precio).toLocaleString('es-AR')}`;

            MySwal.fire({
                toast: true,
                title: `<strong>¡Excelente elección! 🎉</strong>`,
                text: `${product.nombre} (${selectedOption.nombre || product.nombre}) - ${displayPrice}`,
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                position: 'bottom-end',
                background: isDarkMode ? 'var(--background-dark)' : 'var(--background-light)',
                iconColor: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)',
                confirmButtonColor: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)',
                color: isDarkMode ? 'var(--text-light)' : 'var(--text-dark)',
                customClass: {
                    title: 'swal-title',
                    popup: `swal-popup ${isDarkMode ? 'swal-dark-mode' : ''}`,
                    content: 'swal-content',
                    container: 'swal-container'
                },
            });

            setShowOptions(false);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };
    
    // Función para cerrar el popup (interno y externo)
    const handleClose = () => {
        setInternalIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className={style.popupOverlay}
                    {...fadeInAnimation}
                    onClick={(e) => {
                        // Cerrar solo si se hace clic en el fondo
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <motion.div
                        className={`${style.popupContainer} ${isDarkMode ? style.dark : style.light}`}
                        {...popupAnimation}
                        transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                        }}
                    >
                        <div className={style.popupHeader}>
                            <motion.button 
                                className={style.closePopupButton}
                                onClick={handleClose}
                                aria-label="Cerrar popup"
                                whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-button)' }}
                                transition={{ duration: 0.3 }}
                            >
                                <IoClose />
                            </motion.button>
                        </div>
                        
                        <motion.div
                            ref={titleRef}
                            className={style.titleContainer}
                            initial={{  y: -20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {  y: -20 }}
                            transition={{ duration: 0.7 }}
                        >
                            <motion.h1
                                ref={subtitleRef}
                                className={style.subtitle}
                        
                            >
                                <span className={style.titleDecoration}><FaMagic /></span>
                                Dale un toque especial a tu regalo
                                <span className={style.titleDecoration}><FaGift /></span>
                            </motion.h1>

                            <motion.h2
                                className={style.title}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {isInView && "Haz tu sorpresa inolvidable".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{  y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.03,
                                            type: "spring"
                                        }}
                                        style={{ display: "inline-block" }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </motion.h2>

                            <motion.h3
                                className={style.subtitle}
                            
                        
                            >
                                Pequeños detalles que <strong>crean momentos mágicos</strong> y hacen de tu regalo una experiencia única
                            </motion.h3>
                            
                            <motion.h6
                                className={`${style.subtitle} ${style.instructionText}`}
                                initial={{  y: 20 }}
                                animate={isSubtitleInView ?
                                    { opacity: 1, y: 0 } :
                                    {  y: 20 }
                                }
                                transition={{
                                    duration: 0.7,
                                    delay: 0.5
                                }}
                            >
                                <FaSearch style={{ marginRight: '5px', verticalAlign: 'middle' }} /> 
                                Selecciona un producto para explorar las opciones disponibles
                            </motion.h6>
                        </motion.div>

                        <div className={style.swiperContainer}>
                            {loading ? (
                                <div className={style.loaderContainer}>
                                    <div className={style.loader}></div>
                                </div>
                            ) : products.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, A11y]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    navigation
                                    // pagination={{ clickable: true }}
                                    className={style.swiper}
                                    breakpoints={{
                                        // Cuando el ancho de la ventana es >= 320px
                                        320: {
                                            slidesPerView: 1.35,
                                            spaceBetween: 10
                                        },
                                        // Cuando el ancho de la ventana es >= 480px
                                        480: {
                                            slidesPerView: 1.5,
                                            spaceBetween: 10
                                        },

                                        // Cuando el ancho de la ventana es >= 640px
                                        640: {
                                            slidesPerView: 2.2,
                                            spaceBetween: 20
                                        },
                                        // Cuando el ancho de la ventana es >= 768px
                                        768: {
                                            slidesPerView: 3.5,
                                            spaceBetween: 30
                                        },
                                        // Cuando el ancho de la ventana es >= 1024px
                                        1024: {
                                            slidesPerView: 4.2,
                                            spaceBetween: 40
                                        }
                                    }}
                                >
                                    {products.map((product, idx) => (
                                        <SwiperSlide key={product.id || idx}>
                                            <Tooltip title={`Ver ${product.nombre}`} arrow placement="top">
                                                <motion.div
                                                    className={style.productCard}
                                                    initial={{  y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowOptions(true);
                                                    }}
                                                    whileHover={{ y: -5 }}
                                                >
                                                    {idx % 3 === 0 && (
                                                        <div className={style.productBadge}>
                                                            Favorito
                                                        </div>
                                                    )}
                                                    {(product.opciones?.[0]?.img || product.img) && (
                                                        <div className={style.imageContainer}>
                                                            <img
                                                                src={product.opciones?.[0]?.img || product.img}
                                                                alt={product.nombre}
                                                                className={style.productImage}
                                                                loading="lazy"
                                                            />
                                                            <div className={style.imageOverlay}></div>
                                                        </div>
                                                    )}

                                                    <div className={style.productInfo}>
                                                        <h3>{product.nombre}</h3>
                                                        <p>{product.descr}</p>
                                                        <motion.span 
                                                            className={style.viewOptionsBtn}
                                                            whileHover={{ scale: 1.05, opacity: 1 }}
                                                        >
                                                            Ver opciones <BsArrowRight />
                                                        </motion.span>
                                                    </div>
                                                </motion.div>
                                            </Tooltip>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className={style.noProductsMessage}>
                                    No se encontraron productos adicionales disponibles.
                                </div>
                            )}
                        </div>
                        
                        <div className={style.popupFooter}>
                            <motion.button 
                                className={style.skipButton}
                                onClick={handleClose}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Continuar sin adicionales
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {showOptions && selectedProduct && (
                                <motion.div
                                    className={style.optionsModal}
                                    {...fadeInAnimation}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) setShowOptions(false);
                                    }}
                                >
                                    <motion.div 
                                        className={style.modalContent}
                                        initial={{  scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{  scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <motion.button
                                            className={style.closeButton}
                                            onClick={() => setShowOptions(false)}
                                            aria-label="Cerrar"
                                            whileHover={{ scale: 1.1, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <IoClose />
                                        </motion.button>
                                        <h3 className={style.modalTitle}>
                                            <IoFlower style={{ marginRight: '10px', color: 'var(--accent-color)' }} />
                                            {selectedProduct.nombre}
                                        </h3>
                                        <div className={style.descrOptWrapper}>
                                            <p className={style.descrOpt}>{selectedProduct.descr}</p>
                                        </div>
                                        <div className={style.optionsGrid}>
                                            {selectedProduct.opciones ? (
                                                selectedProduct.opciones.map((opcion, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        className={style.optionCard}
                                                        {...slideUpAnimation}
                                                        transition={{ delay: idx * 0.1 }}
                                                        whileHover={{ 
                                                            y: -5, 
                                                            boxShadow: isDarkMode 
                                                                ? "0 10px 20px rgba(0,0,0,0.3)" 
                                                                : "0 10px 20px rgba(0,0,0,0.15)" 
                                                        }}
                                                    >
                                                        <div className={style.optionImageWrapper}>
                                                            <img
                                                                src={opcion.img || selectedProduct.img}
                                                                alt={opcion.size || selectedProduct.nombre}
                                                                className={style.optionImage}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className={style.optionInfo}>
                                                            <p className={style.optionName}>{opcion.size || selectedProduct.nombre}</p>
                                                            <p className={style.price}>
                                                                ${opcion.precio?.toLocaleString('es-AR')}
                                                                {idx === 0 && (
                                                                    <span className={style.priceBadge}>Popular</span>
                                                                )}
                                                            </p>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => addToCart(selectedProduct, opcion)}
                                                                className={style.addButton}
                                                            >
                                                                <FaShoppingCart /> Agregar al carrito
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <motion.div
                                                    className={style.optionCard}
                                                    {...slideUpAnimation}
                                                    whileHover={{ 
                                                        y: -5, 
                                                        boxShadow: isDarkMode 
                                                            ? "0 10px 20px rgba(0,0,0,0.3)" 
                                                            : "0 10px 20px rgba(0,0,0,0.15)" 
                                                    }}
                                                >
                                                    <div className={style.optionImageWrapper}>
                                                        <img
                                                            src={selectedProduct.img}
                                                            alt={selectedProduct.nombre}
                                                            className={style.optionImage}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className={style.optionInfo}>
                                                        <p className={style.optionName}>{selectedProduct.nombre}</p>
                                                        <p className={style.price}>
                                                            ${selectedProduct.precio?.toLocaleString('es-AR')}
                                                            <span className={style.priceBadge}>Recomendado</span>
                                                        </p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => addToCart(selectedProduct, selectedProduct)}
                                                            className={style.addButton}
                                                        >
                                                            <FaShoppingCart /> Agregar al carrito
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartPopUpProducts;