"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { createContext, useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { baseDeDatos } from '../admin/FireBaseConfig';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export const CartContext = createContext();

const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const CartProvider = ({ children }) => {
    // Estado inicial del carrito
    const [cart, setCart] = useState([]);
    const [cartLocalStorage, setCartLocalStorage] = useState(null);
    
    // Estados para precios y ubicación
    const [finalPriceARS, setFinalPriceARS] = useState(0); // Precio en pesos argentinos
    const [finalPriceUSD, setFinalPriceUSD] = useState(0); // Precio en dólares
    const [locationValue, setLocationValue] = useState(0);
    const [location, setLocation] = useState({});
    const [locationName, setLocationName] = useState("");

    // Estados para el envío Premium
    const [premiumAdded, setPremiumAdded] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    
    // Estado para seleccionar la moneda de visualización
    const [priceDolar, setPriceDolar] = useState(false);

    // Clave para encriptación (usando useState para que se mantenga constante entre renderizados)
    const [encryptionKey] = useState(() => nacl.randomBytes(32));

    // Función para encriptar el carrito
    const encryptCart = (cartData) => {
        try {
            const nonce = nacl.randomBytes(24);
            const encryptedData = nacl.secretbox(
                naclUtil.decodeUTF8(JSON.stringify(cartData)),
                nonce,
                encryptionKey
            );
            const encryptedDataString = naclUtil.encodeBase64(encryptedData);
            return {
                nonce: naclUtil.encodeBase64(nonce),
                data: encryptedDataString,
                key: naclUtil.encodeBase64(encryptionKey),
            };
        } catch (error) {
            console.error('Error al encriptar el carrito:', error);
            return { nonce: '', data: '', key: '' }; // Valor por defecto en caso de error
        }
    };

    // Función para desencriptar el carrito
    const decryptCart = (encryptedCart) => {
        try {
            if (!encryptedCart) {
                return [];
            }

            const { nonce, key, data } = encryptedCart;

            if (!nonce || !key || !data) {
                return [];
            }

            const decodedNonce = naclUtil.decodeBase64(nonce);
            const decodedKey = naclUtil.decodeBase64(key);
            const decodedData = naclUtil.decodeBase64(data);

            const decryptedData = nacl.secretbox.open(decodedData, decodedNonce, decodedKey);

            if (!decryptedData) {
                throw new Error('Error al desencriptar los datos del carrito.');
            }

            const decryptedDataString = naclUtil.encodeUTF8(decryptedData);
            return JSON.parse(decryptedDataString);
        } catch (error) {
            console.error('Error al desencriptar el carrito:', error);
            return [];
        }
    };

    // Inicializar el carrito solo cuando estamos en el cliente
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const storedEncryptedCart = localStorage.getItem('c');
                setCartLocalStorage(storedEncryptedCart);
                
                if (storedEncryptedCart) {
                    const parsed = JSON.parse(storedEncryptedCart);
                    const decryptedCart = decryptCart(parsed);
                    if (Array.isArray(decryptedCart)) {
                        setCart(decryptedCart);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar el carrito desde localStorage:', error);
            setCart([]);
        }
    }, []);

    // Guardar el carrito en localStorage cuando cambie (solo en el cliente)
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && cart.length > 0) {
                const encrypted = encryptCart(cart);
                localStorage.setItem('c', JSON.stringify(encrypted));
            }
        } catch (error) {
            console.error('Error al guardar el carrito en localStorage:', error);
        }
    }, [cart]);

    // Estado para almacenar los costos desde Firestore
    const [costos, setCostos] = useState([]);
    
    // Función para obtener los costos desde Firestore
    const fetchCosts = async () => {
        try {
            const costosRef = collection(baseDeDatos, 'costos');
            const costosSnapShot = await getDocs(costosRef);
            const costosData = [];
            costosSnapShot.forEach((doc) => {
                costosData.push({ id: doc.id, ...doc.data() });
            });
            setCostos(costosData);
        } catch (error) {
            console.error('Error al obtener costos desde Firestore:', error);
            setCostos([]);
        }
    };

    // Calcular valores derivados utilizando useMemo para evitar recálculos innecesarios
    const costoEnvios = useMemo(() => 
        costos.filter(cost => cost?.categoria?.includes("envios")), [costos]);
    
    const precioEnvioPremium = useMemo(() => 
        Number(costoEnvios[0]?.precio || 0), [costoEnvios]);

    const costoRosa = useMemo(() => 
        costos.filter(cost => cost?.categoria?.includes("rosas")), [costos]);
    
    const rose_unit = useMemo(() => 
        Number(costoRosa[0]?.precio || 0), [costoRosa]);

    const costoDolar = useMemo(() => 
        costos.filter(cost => cost?.categoria?.includes("moneda")), [costos]);
    
    const dolar = useMemo(() => 
        Number(costoDolar[0]?.precio || 1), [costoDolar]);

    const envioPremiumInUsd = useMemo(() => 
        Number((precioEnvioPremium / (dolar || 1)).toFixed(2)), [precioEnvioPremium, dolar]);

    // Cargar los costos al montar el componente
    useEffect(() => {
        fetchCosts();
    }, []);

    // Función para calcular el precio total (tanto en ARS como en USD)
    const calcularPrecios = () => {
        let acumuladorARS = 0;
        let acumuladorUSD = 0;
        let precioFinalARS = 0;
        let precioFinalUSD = 0;

        if (Array.isArray(cart)) {
            cart.forEach((prod) => {
                // Precio en pesos argentinos
                acumuladorARS += prod.quantity * prod.precio;
                
                // Precio en dólares (convertido desde ARS)
                const precioEnUSD = parseFloat((prod.precio / (dolar || 1)).toFixed(2));
                acumuladorUSD += prod.quantity * precioEnUSD;
            });
        }

        // Calcular precio final en ARS incluyendo envío y ubicación
        precioFinalARS = acumuladorARS;
        if (isPremium) {
            precioFinalARS += precioEnvioPremium;
        }
        precioFinalARS += locationValue;

        // Calcular precio final en USD incluyendo envío y ubicación
        precioFinalUSD = acumuladorUSD;
        if (isPremium) {
            precioFinalUSD += envioPremiumInUsd;
        }
        // Convertir locationValue a USD
        const locationValueUSD = parseFloat((locationValue / (dolar || 1)).toFixed(2));
        precioFinalUSD += locationValueUSD;
        
        return {
            precioFinalARS,
            precioFinalUSD,
            subtotalARS: acumuladorARS,
            subtotalUSD: acumuladorUSD
        };
    };

    // Función para actualizar los precios totales
    const actualizarPrecios = () => {
        const { precioFinalARS, precioFinalUSD } = calcularPrecios();
        setFinalPriceARS(precioFinalARS);
        setFinalPriceUSD(precioFinalUSD);
    };

    // Actualizar los precios cuando cambian las dependencias relevantes
    useEffect(() => {
        actualizarPrecios();
    }, [cart, isPremium, dolar, locationValue, precioEnvioPremium]);

    // Obtener el precio final según la moneda seleccionada (para compatibilidad con código existente)
    const finalPrice = useMemo(() => 
        priceDolar ? finalPriceUSD : finalPriceARS, 
        [priceDolar, finalPriceARS, finalPriceUSD]
    );

    // Función para eliminar productos del carrito
    const eliminarProd = async (name, size, precio) => {
        try {
            // Buscar el índice del producto en el carrito
            const productIndex = cart.findIndex(prod => 
                (prod.precio === precio) && (prod.size === size) && (prod.name === name)
            );

            // Verificar si el producto está en el carrito
            if (productIndex !== -1) {
                if (cart[productIndex].quantity > 1) {
                    // Preguntar cuánta cantidad eliminar si hay más de una unidad
                    const { value: quantityToRemove } = await Swal.fire({
                        title: 'Cantidad a eliminar',
                        input: 'number',
                        inputLabel: 'Ingrese la cantidad que desea eliminar',
                        inputValue: 1,
                        inputValidator: (value) => {
                            if (parseInt(value) <= 0 || parseInt(value) > cart[productIndex].quantity) {
                                return 'Ingrese una cantidad válida!';
                            }
                            return null;
                        }
                    });

                    // Si el usuario cancela, no hacer nada
                    if (!quantityToRemove) return;

                    // Crear una copia del carrito para modificar
                    const updatedCart = [...cart];
                    updatedCart[productIndex].quantity -= parseInt(quantityToRemove);

                    // Si la cantidad restante es mayor a cero, actualizar el carrito
                    if (updatedCart[productIndex].quantity > 0) {
                        setCart(updatedCart);
                    } else {
                        // Si la cantidad es cero, eliminar el producto del carrito
                        setCart(updatedCart.filter(prod => 
                            (prod.size !== size) || (prod.precio !== precio) || (prod.name !== name)
                        ));
                    }
                } else {
                    // Si solo hay una unidad, eliminar el producto directamente
                    setCart(cart.filter(prod => 
                        (prod.size !== size) || (prod.precio !== precio) || (prod.name !== name)
                    ));
                }

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'warning',
                    title: 'Producto eliminado!',
                    text: 'El producto ha sido eliminado de tu carrito.',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    background: '#f3f3f3',
                    iconColor: '#a30000'
                });
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
        }
    };

    // Función para obtener la cantidad de un producto específico
    const cantidadProducto = (id) => {
        const producto = cart?.find((prod) => prod.id === id);
        return producto?.quantity || 0;
    };

    // Función para obtener el precio total (para compatibilidad con código existente)
    const totalPrecio = () => {
        return priceDolar ? finalPriceUSD : finalPriceARS;
    };

    // Valores a exportar en el contexto
    const contextValue = {
        cart,
        cartLocalStorage,
        setCart,
        encryptCart,
        decryptCart,
        rose_unit,
        setPriceDolar,
        priceDolar,
        eliminarProd,
        cantidadProducto,
        totalPrecio,
        setLocationValue,
        locationValue,
        setLocation,
        location,
        setLocationName,
        locationName,
        envioPremiumInUsd,
        dolar,
        finalPrice,          // Precio final según moneda seleccionada (priceDolar)
        finalPriceARS,       // Precio final en pesos argentinos
        finalPriceUSD,       // Precio final en dólares
        setFinalPriceARS,
        setFinalPriceUSD,
        precioEnvioPremium,
        setPremiumAdded,
        premiumAdded,
        isPremium,
        setIsPremium,
        actualizarPrecios    // Función para actualizar los precios manualmente si es necesario
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};

export default CartProvider;