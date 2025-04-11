"use client"

import { useContext, createContext, useState, useEffect } from "react";
import React from 'react';
import localforage from "localforage";

export const Context = createContext();

const generateRandomCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getOrCreateUniqueCode = async (storage, key, expirationTime) => {
  let code = await storage.getItem(key);

  if (!code || (Date.now() - parseInt(code.split('_')[1]) > expirationTime)) {
    const newCode = generateRandomCode(10) + '_' + Date.now();
    await storage.setItem(key, newCode);
    code = newCode;
  }
  return code.split('_')[0]; // Return only the code without the timestamp
};

export const ContextProvider = ({ children }) => {
  const [device, setDevice] = useState(null);
  const [CartID, setCart] = useState(null);
  const [UserID, setUserID] = useState(null);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      if (/Android/i.test(userAgent)) {
        setDevice('Android');
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        setDevice('iOS');
      } else {
        setDevice('PC');
      }
    };

    const fetchInitialData = async () => {
      const cartID = await getOrCreateUniqueCode(localforage, 'CartID', 24 * 60 * 60 * 1000);
      const userID = await getOrCreateUniqueCode(localforage, 'UserID', 24 * 60 * 60 * 1000);
      setCart(cartID);
      setUserID(userID);
    };

    detectDevice();
    fetchInitialData();
  }, []);

  useEffect(() => {
    // No es necesario guardar los IDs aquí ya que se guardan en getOrCreateUniqueCode
  }, [CartID, UserID]);

  useEffect(() => {
    const handleUnload = () => {
      // Considerar si realmente se desea limpiar todo en localforage al cerrar
      // localforage.clear();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        device,
        CartID,
        UserID,
      }}>
      {children}
    </Context.Provider>
  )
}

export function usePageContext() {
  return useContext(Context);
}