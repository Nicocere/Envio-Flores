"use client";

import React, { useEffect, useRef, useState } from 'react';
import localforage from 'localforage';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import style from './CartMoreProducts.module.css';
import { useTheme } from '@/context/ThemeSwitchContext';
import { useCart } from '@/context/CartContext';
import { usePageContext } from '@/context/Context';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Image from 'next/image';

const MySwal = withReactContent(Swal);

const CartMoreProducts = () => {
    const cartContext = useCart();
    const pageContext = usePageContext();
    const { isDarkMode } = useTheme();
    
    // Solución: Extraer solo lo que necesitamos (eliminamos cart que no se usa)
    const { setCart = () => {}, priceDolar = false, dolar = 1 } = cartContext || {};
    const { CartID = null, UserID = null } = pageContext || {};

    // Estado
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [isModalClosing, setIsModalClosing] = useState(false);

    // Referencias para animaciones
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const isInView = useInView(titleRef, { once: false, amount: 0.3 });
    const isSubtitleInView = useInView(subtitleRef, { once: false, amount: 0.3 });

    // Cargar productos al iniciar
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const storedProducts = await localforage.getItem('productos') || [];
                const storedAddons = await localforage.getItem('adicionales') || [];

                // Filtrar productos con opciones y mejorar algoritmo de selección
                const productsWithOptions = storedProducts.filter(product =>
                    product.opciones && product.opciones.length > 0 && 
                    product.opciones[0]?.img // Asegurar que tengan imagen
                );

                // Mezclar productos y adicionales, priorizando complementos populares
                const shuffledProducts = shuffleArray([
                    ...productsWithOptions.slice(0, 12), 
                    ...storedAddons
                ]);
                
                // Seleccionar productos más adecuados para complemento
                const selectedProducts = shuffledProducts
                    .slice(0, 100)
                    .sort((a, b) => (b.populares || 0) - (a.populares || 0));

                setProducts(selectedProducts);
            } catch (error) {
                console.error('Error al cargar productos complementarios:', error);
            }
        };

        fetchProducts();
    }, []);

    // Función para mezclar productos aleatoriamente
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Función mejorada para agregar al carrito
    const addToCart = async (product, selectedOption) => {
        try {
            // Obtener estado actual del carrito
            const cartData = await localforage.getItem('cart');
            const currentCart = cartData || [];

            // Buscar si el producto ya existe en el carrito
            const existingProductIndex = currentCart.findIndex(p => 
                p.id === product.id && p.size === (selectedOption.nombre || product.nombre)
            );

            // Si existe, incrementar cantidad; si no, agregar nuevo
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
                    UserID: await UserID,
                    addedAt: new Date().toISOString()
                });
            }

            // Actualizar carrito en estado y almacenamiento
            setCart(currentCart);
            await localforage.setItem('cart', currentCart);

            // Calcular precio para mostrar
            const priceInUsd = ((selectedOption.precio || product.precio) / dolar).toFixed(2);
            const displayPrice = priceDolar ? 
                `USD$${priceInUsd}` : 
                `$${Number(selectedOption.precio || product.precio).toLocaleString('es-AR')}`;

            // Mostrar confirmación animada
            MySwal.fire({
                toast: true,
                title: `<strong style="font-weight: bold;">¡Excelente elección!</strong>`,
                html: `<span style="font-weight: bold;">${product.nombre} (${selectedOption.nombre || product.nombre}) - ${displayPrice}</span><br><small>¡Perfecta combinación para tu regalo!</small>`,
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                position: 'bottom-end',
                background: isDarkMode ? 'linear-gradient(135deg, #1e1e1e, #121212)' : 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                color: isDarkMode ? '#FAF3EB' : '#670000',
                iconColor: '#A70000',
                customClass: {
                    popup: isDarkMode ? 'swal-dark-mode' : '',
                    title: 'swal-title',
                    content: 'swal-content',
                    timerProgressBar: isDarkMode ? 'swal-dark-mode' : '',
                },
            });

            // Cerrar modal con animación
            setIsModalClosing(true);
            setTimeout(() => {
                setShowOptions(false);
                setIsModalClosing(false);
            }, 300);
        } catch (error) {
            console.error('Error al agregar complemento al carrito:', error);
            MySwal.fire({
                toast: true,
                title: 'Ocurrió un error',
                text: 'No se pudo agregar el producto, inténtelo de nuevo',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'bottom-end',
            });
        }
    };

    // Función para cerrar modal
    const handleCloseModal = () => {
        setIsModalClosing(true);
        setTimeout(() => {
            setShowOptions(false);
            setIsModalClosing(false);
        }, 300);
    };

    // Obtener clase para modo oscuro/claro
    const themeClass = isDarkMode ? style.dark : style.light;

    return (
        <motion.div
            className={`${style.container} ${themeClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <motion.div
                ref={titleRef}
                className={style.titleContainer}
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.h2
                    className={style.title}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {isInView && "Complementos que enamoran".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
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

                <motion.h4
                    ref={subtitleRef}
                    className={style.subtitle}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isSubtitleInView ? 
                        { opacity: 1, x: 0 } : 
                        { opacity: 0, x: -20 }
                    }
                    transition={{
                        duration: 0.7,
                        delay: 0.4
                    }}
                >
                    Sorprende con estos detalles especiales para un regalo inolvidable
                </motion.h4>
            </motion.div>

            {/* Swiper reemplaza el carousel anterior */}
            <div className={style.swiperContainer}>
                <Swiper
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    initialSlide={1}
                loop={true}
                    loopAddBlankSlides={true}
                    pagination={{ 
                        el: '.swiper-pagination',
                        clickable: true,
                        dynamicBullets: true 
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    modules={[ Pagination, Navigation, Autoplay]}
                    className={style.swiper}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.2,
                            spaceBetween: 10,
                        },
                        450: {
                            slidesPerView: 1.85,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 3.2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 4.5,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 5.5,
                            spaceBetween: 20,
                        },
                        
                    }}
                >
                    {products.map((product, idx) => (
                        <SwiperSlide key={product.id + idx} className={style.swiperSlide}>
                            <motion.div
                                className={style.productCard}
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setShowOptions(true);
                                }}
                            >
                                {(product.opciones?.[0]?.img || product.img) && (
                                    <div className={style.imageContainer}>
                                        <Image 
                                            width={300} 
                                            height={300}
                                            src={product.opciones[0].img || product.img}
                                            alt={product.nombre}
                                            className={style.productImage}
                                            priority={idx < 3}
                                        />
                                        <div className={style.productBadge}>
                                            Complemento ideal
                                        </div>
                                    </div>
                                )}
                                <div className={style.productInfo}>
                                    <h3>{product.nombre}</h3>
                                    <p>{product.descr || "El complemento perfecto para tu regalo especial"}</p>
                                    <span className={style.viewOptions}>Ver opciones</span>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                    <div className={`swiper-pagination ${style.swiperPagination}`}></div>
                    <div className={`swiper-button-prev ${style.swiperButtonPrev}`}></div>
                    <div className={`swiper-button-next ${style.swiperButtonNext}`}></div>
                </Swiper>
            </div>

            {/* Modal de opciones mejorado */}
            <AnimatePresence mode='sync'>
                {showOptions && selectedProduct && (
                    <motion.div
                        className={style.optionsModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            // Cerrar si se hace clic fuera del contenido
                            if (e.target === e.currentTarget) handleCloseModal();
                        }}
                    >
                        <motion.div
                            className={`${style.modalContent} ${isModalClosing ? style.closing : ''}`}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <button
                                className={style.closeButton}
                                onClick={handleCloseModal}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                            
                            <div className={style.modalHeader}>
                                <h3>{selectedProduct.nombre}</h3>
                                <div className={style.descrOptContainer}>
                                    <p className={style.descrOpt}>
                                        {selectedProduct.descr || "Complemento perfecto para hacer tu regalo aún más especial. Nuestros complementos son seleccionados cuidadosamente para garantizar la máxima calidad."}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={style.optionsGrid}>
                                {selectedProduct.opciones?.map((opcion, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={style.optionCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ 
                                            scale: 1.03,
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                                        }}
                                    >
                                        <div className={style.optionImageContainer}>
                                            <Image 
                                                width={200} 
                                                height={200}
                                                src={opcion.img || selectedProduct.img}
                                                alt={opcion.nombre || opcion.size || selectedProduct.nombre}
                                                className={style.optionImage}
                                            />
                                        </div>
                                        <div className={style.optionInfo}>
                                            <h4>{opcion.nombre || opcion.size || "Opción estándar"}</h4>
                                            <div className={style.priceTag}>
                                                <span className={style.currency}>$</span>
                                                <span className={style.price}>
                                                    {opcion.precio?.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(selectedProduct, opcion)}
                                                className={style.addButton}
                                            >
                                                <span className={style.addButtonText}>Agregar al carrito</span>
                                                <span className={style.addButtonIcon}>+</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className={style.modalFooter}>
                                <p className={style.modalFooterText}>
                                    Estos complementos harán que tu regalo sea inolvidable
                                </p>

                                <motion.button
                                    className={style.closeModalButton}
                                    onClick={handleCloseModal}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cerrar
                                </motion.button>
                            </div>


                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CartMoreProducts;