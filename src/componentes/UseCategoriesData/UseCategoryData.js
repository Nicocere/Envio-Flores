"use client"

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';

const useCategoriesData = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [especialDates, setEspecialDates] = useState([]);
  const [ocassionList, setOcassionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesDoc = await getDocs(collection(baseDeDatos, 'categorias'));
        const categoryData = categoriesDoc.docs[0]?.data();
        
        if (!categoryData) {
          throw new Error('No se encontraron categorías');
        }

        // Función para ordenar arrays
        const sortArray = (array) => {
          const sorted = [...array].sort((a, b) => a.value.localeCompare(b.value));
          const todosIndex = sorted.findIndex(item => item.id === 'Todos');
          if (todosIndex > -1) {
            const todos = sorted.splice(todosIndex, 1)[0];
            sorted.unshift(todos);
          }

          console.log('Array ordenado:', sorted);
          return sorted;
        };

        // Setear cada array ordenado
        setCategoryList(sortArray(categoryData.categoryList || []));
        setEspecialDates(sortArray(categoryData.especialDates || []));
        setOcassionList(sortArray(categoryData.ocassionList || []));
        
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Solo se ejecuta al montar el componente

  return {
    categoryList,
    especialDates,
    ocassionList,
    loading,
    error
  };
};

export default useCategoriesData;