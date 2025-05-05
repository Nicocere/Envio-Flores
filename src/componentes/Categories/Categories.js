"use client"

import { useTheme } from '@/context/ThemeSwitchContext';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import style from './Categories.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const Categories = ({ categoryName }) => {
  const [categoryData, setCategoryData] = useState({
    categoryList: [],
    ocassionList: [],
    especialDates: []
  });
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    categoryList: false,
    ocassionList: false,
    especialDates: false
  });
  const { isDarkMode } = useTheme();
  const pathname = usePathname();

  // Determinar qué tipo de categoría está activa según la URL
  const getActiveCategoryType = () => {
    if (pathname.includes('/ocasiones')) return 'ocassionList';
    if (pathname.includes('/fechas-especiales')) return 'especialDates';
    return 'categoryList';
  };

  // Obtener el título legible para cada tipo de categoría
  const getCategoryTypeTitle = (type) => {
    switch (type) {
      case 'categoryList': return 'Categorías';
      case 'ocassionList': return 'Ocasiones';
      case 'especialDates': return 'Fechas Especiales';
      default: return 'Categorías';
    }
  };

  // Obtener la URL base para cada tipo de categoría
  const getBaseUrl = (type) => {
    switch (type) {
      case 'categoryList': return '/productos';
      case 'ocassionList': return '/ocasiones';
      case 'especialDates': return '/fechas-especiales';
      default: return '/productos';
    }
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesDoc = await getDocs(collection(baseDeDatos, 'categorias'));
        const rawCategoryData = categoriesDoc.docs[0]?.data();
        
        if (!rawCategoryData) {
          console.error('No se encontraron categorías');
          return;
        }

        // Procesar y ordenar todas las categorías
        const processedData = {};
        
        // Procesar cada tipo de categoría (categorías, ocasiones, fechas especiales)
        ['categoryList', 'ocassionList', 'especialDates'].forEach(type => {
          const list = rawCategoryData[type] || [];
          
          // Ordenar alfabéticamente
          const sortedList = [...list].sort((a, b) => 
            a.value.localeCompare(b.value)
          );

          // Mover "Todos" al principio si existe
          const todosIndex = sortedList.findIndex(cat => cat.id === 'Todos');
          if (todosIndex > -1) {
            const todos = sortedList.splice(todosIndex, 1)[0];
            sortedList.unshift(todos);
          }

          processedData[type] = sortedList;
        });

        setCategoryData(processedData);
        
        // Determinar qué sección debe estar expandida inicialmente
        const activeType = getActiveCategoryType();
        setExpandedSections(prev => ({
          ...prev,
          [activeType]: true
        }));
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  // Manejar la expansión/contracción de las secciones
  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newState = { ...prev };
      
      // Cerrar todas las secciones
      Object.keys(newState).forEach(key => {
        newState[key] = false;
      });
      
      // Abrir la sección seleccionada (toggle)
      newState[section] = !prev[section];
      
      return newState;
    });
  };

  if (loading) {
    return (
      <div className={`${style.loadingContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
        <div className={style.spinner}></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  const activeType = getActiveCategoryType();

  // Determinar si una categoría está activa
  const isActiveCategory = (categoryId, type) => {
    if (type !== activeType) return false;
    return categoryName === categoryId || (categoryName === undefined && categoryId === 'Todos');
  };

  // Ordenar los tipos de categorías para que el activo aparezca primero
  const orderedCategoryTypes = ['categoryList', 'ocassionList', 'especialDates']
    .sort((a, b) => {
      if (a === activeType) return -1;
      if (b === activeType) return 1;
      return 0;
    });

  return (
    <div className={`${style.categoriesContainer} ${isDarkMode ? style.darkMode : style.lightMode}`}>
      {orderedCategoryTypes.map(type => (
        <div key={type} className={style.categorySection}>
          <button 
            className={`${style.categoryHeader} ${activeType === type ? style.activeHeader : ''}`}
            onClick={() => toggleSection(type)}
            aria-expanded={expandedSections[type]}
          >
            <span>{getCategoryTypeTitle(type)}</span>
            {expandedSections[type] ? 
              <ExpandLessIcon className={style.expandIcon} /> : 
              <ExpandMoreIcon className={style.expandIcon} />
            }
          </button>
          
          <div className={`${style.categoryContent} ${expandedSections[type] ? style.expanded : ''}`}>
            <div className={style.linksContainer}>
              {categoryData[type].map((category) => (
                <Link
                  key={category.id}
                  href={category.id === 'Todos' ? getBaseUrl(type) : `${getBaseUrl(type)}/${category.id}`}
                  className={`${style.categoryLink} ${isActiveCategory(category.id, type) ? style.activeLink : ''}`}
                >
                  <ArrowForwardIosIcon className={style.arrowIcon} />
                  <span>{category.value}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;