"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import localforage from 'localforage';

// Crea el contexto de cookies
export const CookieContext = createContext(null);

// Crea el proveedor de cookies
export const CookieProvider = ({ children }) => {
    // COOKIES
    const [acceptedCookies, setAcceptedCookies] = useState(false);
    
    // Cookie Prompt
    const [showCookiePrompt, setShowCookiePrompt] = useState(false);
    
    // Estado de carga para controlar la inicialización
    const [isLoading, setIsLoading] = useState(true);

    // CARTID & USERID
    const [CartID, setCartID] = useState('');
    const [UserID, setUserID] = useState('');

    const generateRandomCode = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const getOrCreateUniqueCode = async (key, expirationTime) => {
        const code = await localforage.getItem(key);
        if (!code || (Date.now() - parseInt(code.split('_')[1]) > expirationTime)) {
            const newCode = generateRandomCode(10) + '_' + Date.now();
            await localforage.setItem(key, newCode);
            return newCode.split('_')[0]; // Return only the code without the timestamp
        }
        return code.split('_')[0]; // Return only the code without the timestamp
    };

    // Inicialización: cargar todos los datos almacenados
    useEffect(() => {
        const initializeContext = async () => {
            try {
                // Verificar estado de cookies primero
                const storedAcceptedCookies = await localforage.getItem('acceptedCookies');
                
                if (storedAcceptedCookies === true) {
                    setAcceptedCookies(true);
                    setShowCookiePrompt(false);
                    
                    // Si las cookies están aceptadas, cargar IDs
                    const storedCartID = await localforage.getItem('CartID');
                    const storedUserID = await localforage.getItem('UserID');
                    
                    if (storedCartID) {
                        setCartID(storedCartID.split('_')[0]);
                    }
                    
                    if (storedUserID) {
                        setUserID(storedUserID.split('_')[0]);
                    }
                } else {
                    // Si no hay cookies aceptadas, generar IDs pero mostrar prompt
                    const newCartID = await getOrCreateUniqueCode('CartID', 24 * 60 * 60 * 1000);
                    const newUserID = await getOrCreateUniqueCode('UserID', 24 * 60 * 60 * 1000);
                    
                    setCartID(newCartID);
                    setUserID(newUserID);
                    setShowCookiePrompt(true);
                }
            } catch (error) {
                console.error("Error initializing cookie context:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeContext();
    }, []);
    
    // Reaccionar a cambios en acceptedCookies
    useEffect(() => {
        if (!isLoading) {
            setShowCookiePrompt(!acceptedCookies);
        }
    }, [acceptedCookies, isLoading]);

    // Función para aceptar las cookies y guardar el valor en el localforage
    const acceptCookies = async () => {
        try {
            // Primero actualizar el estado local
            setAcceptedCookies(true);
            setShowCookiePrompt(false);
            
            // Luego guardar en localforage
            await localforage.setItem('acceptedCookies', true);
            
            // Asegurarse de que CartID y UserID estén guardados
            const cartIDWithTimestamp = CartID + '_' + Date.now();
            const userIDWithTimestamp = UserID + '_' + Date.now();
            
            await localforage.setItem("CartID", cartIDWithTimestamp);
            await localforage.setItem("UserID", userIDWithTimestamp);
        } catch (error) {
            console.error("Error al aceptar cookies:", error);
        }
    };

    // Valor del contexto a proporcionar
    const contextValue = {
        acceptedCookies,
        acceptCookies,
        setAcceptedCookies,
        CartID,
        UserID,
        showCookiePrompt, 
        setShowCookiePrompt,
        isLoading
    };

    return (
        <CookieContext.Provider value={contextValue}>
            {children}
        </CookieContext.Provider>
    );
};

// Creamos un hook personalizado para usar el contexto
export const useCookies = () => {
    const context = useContext(CookieContext);
    return context;
};