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

    useEffect(() => {
        const fetchCodes = async () => {
            const storedCartID = await getOrCreateUniqueCode('CartID', 24 * 60 * 60 * 1000); // 24 hours expiration
            const storedUserID = await getOrCreateUniqueCode('UserID', 24 * 60 * 60 * 1000); // 24 hours expiration
            setCartID(storedCartID);
            setUserID(storedUserID);
        };
        fetchCodes();
    }, []);

    // Verifica si el valor de "accepted Cookies" está en el localforage al cargar la página
    useEffect(() => {
        const fetchAcceptedCookies = async () => {
            const storedAcceptedCookies = await localforage.getItem('acceptedCookies');
            if (storedAcceptedCookies) {
                setAcceptedCookies(true);
            }
        };
        fetchAcceptedCookies();
    }, []);

    // Función para aceptar las cookies y guardar el valor en el localforage
    const acceptCookies = async () => {
        await localforage.setItem('acceptedCookies', 'true');
        await localforage.setItem("CartID", CartID);
        await localforage.setItem("UserID", UserID);
        setAcceptedCookies(true);
        setShowCookiePrompt(false);
    };

    // Verifica si las cookies existen al montar un componente
    useEffect(() => {
        const fetchCookies = async () => {
            const storedCartID = await localforage.getItem('CartID');
            const storedUserID = await localforage.getItem('UserID');
            const storedAcceptedCookies = await localforage.getItem('acceptedCookies');

            if (!storedCartID || !storedUserID || !storedAcceptedCookies) {
                // Crea una alerta o aviso de que debe aceptar las cookies y setea como false acceptedCookies
                setShowCookiePrompt(true);
                setAcceptedCookies(false);
            }
        };
        fetchCookies();
    }, []);

    return (
        <CookieContext.Provider value={{
            acceptedCookies,
            acceptCookies,
            setAcceptedCookies,
            CartID,
            UserID,
            showCookiePrompt, 
            setShowCookiePrompt
        }}>
            {children}
        </CookieContext.Provider>
    );
};

// Creamos un hook personalizado para usar el contexto
export const useCookies = () => {
    const context = useContext(CookieContext);
    if (context === undefined) {
        throw new Error('useCookies debe ser utilizado dentro de un CookieProvider');
    }
    return context;
};