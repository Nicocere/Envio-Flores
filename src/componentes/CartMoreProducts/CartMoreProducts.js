"use client";

import React, { useEffect, useRef, useState } from 'react';
import localforage from 'localforage';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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


    // Validación y destructuración segura de todos los contextos
    const { isDarkMode } = useTheme();
    const { cart = [], setCart = () => {}, priceDolar = false, dolar = 1 } = cartContext || {};
    const { CartID = null, UserID = null } = pageContext || {};

    // Verificación de contextos
    useEffect(() => {
    
        if (!cartContext) {
            console.error('CartContext no está disponible. Asegúrate de que el componente esté dentro de CartProvider');
        }
        if (!pageContext) {
            console.error('PageContext no está disponible. Asegúrate de que el componente esté dentro de PageProvider');
        }
    }, [ cartContext, pageContext]);

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

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



    useEffect(() => {
        const fetchProducts = async () => {
            try {
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
            }
        };

        fetchProducts();
    }, []);

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
                title: `<strong style="font-weight: bold;">Producto Agregado</strong>`,
                html: `<span style="font-weight: bold;">${product.nombre} (${selectedOption.nombre || product.nombre}) - ${displayPrice}</span>`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                position: 'bottom-end',
                background: 'linear-gradient(180deg,#dbdbdb,#fcf5f0)',
                iconColor: '#D4AF37',
                customClass: {
                    title: 'my-title-class',
                    popup: 'my-popup-class',
                    content: 'my-content-class',
                },
        
            });


            setShowOptions(false);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };

    return (
        <motion.div
            className={`${style.container} ${!isDarkMode ? style.dark : style.light}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
                        <motion.div
                ref={titleRef}
                className={style.titleContainer}
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.7, delay: 0.5 }}
            >
                <motion.h2
                    className={style.title}
                    style={{ color: isDarkMode ? '#2f1a0f' : '#FAF3EB' }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {isInView && "Sorprende con más amor".split("").map((char, index) => (
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
                    style={{ color: isDarkMode ? '#2f1a0f' : '#FAF3EB' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isSubtitleInView ? 
                        { opacity: 1, x: 0 } : 
                        { opacity: 0, x: -20 }
                    }
                    transition={{
                        duration: 0.7,
                        delay: 0.5
                    }}
                >
                    Complementa tu regalo con estos detalles especiales
                </motion.h4>
            </motion.div>

            
            <div className={style.carousel}>
                <button className={style.navButton} onClick={handlePrev}>←</button>

                <div className={style.carouselTrack}>
                    <AnimatePresence mode='sync'>
                        {products.slice(currentIndex, currentIndex + 3).map((product, idx) => (
                            <motion.div
                                key={product.id}
                                className={style.productCard}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setShowOptions(true);
                                }}
                            >
                                {(product.opciones?.[0]?.img || product.img) && (
                                    <div className={style.imageContainer}>
                                        <Image width={150} height={150}
                                            src={product.opciones[0].img || product.img}
                                            alt={product.nombre}
                                            className={style.productImage}
                                        />
                                    </div>
                                )}
                                <div className={style.productInfo}>
                                    <h3>{product.nombre}</h3>
                                    <p>{product.descr}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button className={style.navButton} onClick={handleNext}>→</button>
            </div>

            <AnimatePresence mode='sync'>
                {showOptions && selectedProduct && (
                    <motion.div
                        className={style.optionsModal}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className={style.modalContent}>
                            <button
                                className={style.closeButton}
                                onClick={() => setShowOptions(false)}
                            >
                                ×
                            </button>
                            <h3>{selectedProduct.nombre}</h3>
                            <small className={style.descrOpt}>{selectedProduct.descr}</small>
                            <div className={style.optionsGrid}>

                                {selectedProduct.opciones?.map((opcion, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={style.optionCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Image width={150} height={150}
                                            src={opcion.img || selectedProduct.img}
                                            alt={opcion.size}
                                            className={style.optionImage}
                                        />
                                        <div className={style.optionInfo}>
                                            <p className={style.price}>{opcion.size}</p>
                                            <p className={style.price}>
                                                ${opcion.precio?.toLocaleString('es-AR')}
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(selectedProduct, opcion)}
                                                className={style.addButton}
                                            >
                                                Agregar
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CartMoreProducts;