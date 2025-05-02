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
import { FaGift, FaShoppingCart, FaMagic, FaSearch } from 'react-icons/fa';
import { IoFlower, IoClose } from 'react-icons/io5';
import { BsArrowRight } from 'react-icons/bs';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MySwal = withReactContent(Swal);

// Constantes de animación optimizadas para rendimiento
const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const popupAnimation = {
  initial: { scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 }
};

const slideUpAnimation = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 15 }
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
    const { cart = [], setCart = () => {}, priceDolar = false, dolar = 1 } = cartContext || {};
    const { CartID = null, UserID = null } = pageContext || {};

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const isInView = useInView(titleRef, {
        once: true,
        amount: 0.3
    });
    const isSubtitleInView = useInView(subtitleRef, {
        once: true,
        amount: 0.3
    });

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

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
            // Bloquear scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
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
                title: `<strong>¡Perfecto! Añadido a tu carrito 🎉</strong>`,
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

                        <div className={style.popupBackground}>
                        <div className={style.popupHeader}>
                            <motion.button 
                                className={style.closePopupButton}
                                onClick={handleClose}
                                aria-label="Cerrar popup"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <IoClose />
                            </motion.button>
                        </div>
                        
                        <motion.div
                            ref={titleRef}
                            className={style.titleContainer}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className={style.title}>
                                <span className={style.emoji}>✨</span>
                                Complementa tu regalo
                            </h2>

                            <p className={style.subtitle} ref={subtitleRef}>
                                Pequeños detalles que <strong>sorprenderán y emocionarán</strong> a esa persona especial
                            </p>
                            
                            <div className={style.benefitsContainer}>
                                <div className={style.benefitItem}>
                                    <FaMagic className={style.benefitIcon} />
                                    <span>Experiencia única</span>
                                </div>
                                <div className={style.benefitItem}>
                                    <FaGift className={style.benefitIcon} />
                                    <span>Mayor impacto</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className={style.swiperContainer}>
                            {loading ? (
                                <div className={style.loaderContainer}>
                                    <div className={style.loader}></div>
                                    <p className={style.loaderText}>Cargando complementos...</p>
                                </div>
                            ) : products.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, A11y]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true, dynamicBullets: true }}
                                    className={style.swiper}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1.1,
                                            spaceBetween: 10
                                        },
                                        480: {
                                            slidesPerView: 1.8,
                                            spaceBetween: 15
                                        },
                                        640: {
                                            slidesPerView: 2.2,
                                            spaceBetween: 20
                                        },
                                        768: {
                                            slidesPerView: 3.3,
                                            spaceBetween: 20
                                        },
                                        1024: {
                                            slidesPerView: 4.2,
                                            spaceBetween: 20
                                        }
                                    }}
                                >
                                    {products.map((product, idx) => (
                                        <SwiperSlide key={product.id || idx}>
                                            <Tooltip title={`Ver opciones de ${product.nombre}`} arrow placement="top">
                                                <motion.div
                                                    className={style.productCard}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.08 }}
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
                                                            <div className={style.imageOverlay}>
                                                                <div className={style.imageOverlayContent}>
                                                                    <span>Ver opciones</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className={style.productInfo}>
                                                        <h3>{product.nombre}</h3>
                                                        <p>{product.descr}</p>
                                                        <div className={style.viewOptionsBtn}>
                                                            Ver opciones <BsArrowRight />
                                                        </div>
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
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Continuar sin complementos
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
                                        className={`${style.modalContent} ${isDarkMode ? style.dark : style.light}`}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <motion.button
                                            className={style.closeButton}
                                            onClick={() => setShowOptions(false)}
                                            aria-label="Cerrar"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <IoClose />
                                        </motion.button>
                                        
                                        <div className={style.modalHeader}>
                                            <IoFlower className={style.modalIcon} />
                                            <h3 className={style.modalTitle}>
                                                {selectedProduct.nombre}
                                            </h3>
                                        </div>
                                        
                                        {selectedProduct.descr && (
                                            <div className={style.descrOptWrapper}>
                                                <p className={style.descrOpt}>{selectedProduct.descr}</p>
                                            </div>
                                        )}
                                        
                                        <div className={style.optionsGrid}>
                                            {selectedProduct.opciones ? (
                                                selectedProduct.opciones.map((opcion, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        className={style.optionCard}
                                                        {...slideUpAnimation}
                                                        transition={{ delay: idx * 0.08 }}
                                                        whileHover={{ y: -5 }}
                                                    >
                                                        <div className={style.optionImageWrapper}>
                                                            <img
                                                                src={opcion.img || selectedProduct.img}
                                                                alt={opcion.size || selectedProduct.nombre}
                                                                className={style.optionImage}
                                                                loading="lazy"
                                                            />
                                                            {idx === 0 && (
                                                                <div className={style.optionBadge}>
                                                                    Más Popular
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={style.optionInfo}>
                                                            <h4 className={style.optionName}>{opcion.size || selectedProduct.nombre}</h4>
                                                            <p className={style.price}>
                                                                ${opcion.precio?.toLocaleString('es-AR')}
                                                            </p>
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => addToCart(selectedProduct, opcion)}
                                                                className={style.addButton}
                                                            >
                                                                <FaShoppingCart /> Agregar
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <motion.div
                                                    className={style.optionCard}
                                                    {...slideUpAnimation}
                                                    whileHover={{ y: -5 }}
                                                >
                                                    <div className={style.optionImageWrapper}>
                                                        <img
                                                            src={selectedProduct.img}
                                                            alt={selectedProduct.nombre}
                                                            className={style.optionImage}
                                                            loading="lazy"
                                                        />
                                                        <div className={style.optionBadge}>
                                                            Recomendado
                                                        </div>
                                                    </div>
                                                    <div className={style.optionInfo}>
                                                        <h4 className={style.optionName}>{selectedProduct.nombre}</h4>
                                                        <p className={style.price}>
                                                            ${selectedProduct.precio?.toLocaleString('es-AR')}
                                                        </p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
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

                            </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartPopUpProducts;