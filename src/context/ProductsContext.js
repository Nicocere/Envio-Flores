"use client"

import { useContext, createContext, useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';
import localforage from "localforage";
import { collection, onSnapshot } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Función para normalizar los productos antes de comparar
  const normalizeProducts = (products) => {
    return products
      .map(product => ({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        descripcion: product.descripcion,
        categoria: product.categoria,
        // Añadir solo los campos que necesitas comparar
      }))
      .sort((a, b) => a.id.localeCompare(b.id)); // Ordenar por ID para asegurar mismo orden
  };

  // Función para comparar productos
  const areProductsEqual = (stored, firestore) => {
    if (!stored || !firestore) return false;
    if (stored.length !== firestore.length) return false;

    const normalizedStored = normalizeProducts(stored);
    const normalizedFirestore = normalizeProducts(firestore);

    return JSON.stringify(normalizedStored) === JSON.stringify(normalizedFirestore);
  };

  useEffect(() => {
    let unsubscribe;

    const setupProductsSync = async () => {
      try {
        const storedProducts = await localforage.getItem('productos');

        if (Array.isArray(storedProducts) && storedProducts.length > 0) {
          setProducts(storedProducts);
        }

        const productosRef = collection(baseDeDatos, 'productos');
        unsubscribe = onSnapshot(productosRef, async (snapshot) => {
          const firestoreProducts = [];
          snapshot.forEach((doc) => {
            firestoreProducts.push({ id: doc.id, ...doc.data() });
          });

          if (!areProductsEqual(storedProducts, firestoreProducts)) {
            await localforage.setItem('productos', firestoreProducts);
            setProducts(firestoreProducts);
          }
        }, (error) => {
          console.error("Error al escuchar cambios en Firestore:", error);
        });

      } catch (err) {
        console.error("Error en la sincronización:", err);
        try {
          const res = await axios.get('/api/productos');
          if (res.data.productList) {
            setProducts(res.data.productList);
            await localforage.setItem('productos', res.data.productList);
          }
        } catch (apiError) {
          console.error("Error al obtener productos de la API:", apiError);
        }
      }
    };

    setupProductsSync();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export function useProductsContext() {
  return useContext(ProductsContext);
}