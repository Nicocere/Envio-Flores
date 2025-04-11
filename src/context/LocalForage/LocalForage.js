// useStoredData.js
"use client";
import { useState, useEffect } from 'react';
import localforage from 'localforage';

export default function useStoredData(key) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let storedData;
      if (typeof window !== 'undefined') { // Asegúrate de que el código se está ejecutando en el navegador
        storedData = await localforage.getItem(key);
      }
      if (storedData) {
        // Si los datos ya están en localforage, los usas
        setData(storedData);
      }
    };

    fetchData();
  }, [key]);

  return data;
}