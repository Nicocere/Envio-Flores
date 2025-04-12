"use client"

import { useTheme } from '@/context/ThemeSwitchContext';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import style from './Categories.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const Categories = ({ categoryName }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isDarkMode } = useTheme();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const pathname = usePathname();

  const getCategoryType = (path) => {
    if (path.includes('/ocasiones')) return 'ocassionList';
    if (path.includes('/fechas-especiales')) return 'especialDates';
    return 'categoryList';
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesDoc = await getDocs(collection(baseDeDatos, 'categorias'));
        const categoryData = categoriesDoc.docs[0]?.data();
        
        if (!categoryData) {
          console.error('No se encontraron categorías');
          return;
        }

        const categoryType = getCategoryType(pathname);
        const categoryList = categoryData[categoryType] || [];

        // Ordenar categorías alfabéticamente
        const sortedCategories = [...categoryList].sort((a, b) => 
          a.value.localeCompare(b.value)
        );

        // Mover "Todos" al principio si existe
        const todosIndex = sortedCategories.findIndex(cat => cat.id === 'Todos');
        if (todosIndex > -1) {
          const todos = sortedCategories.splice(todosIndex, 1)[0];
          sortedCategories.unshift(todos);
        }

        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [pathname]);

  useEffect(() => {
    const handleDocumentInteraction = (event) => {
      if (showMobileMenu && !menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleDocumentInteraction);
    document.addEventListener('touchstart', handleDocumentInteraction);

    return () => {
      document.removeEventListener('click', handleDocumentInteraction);
      document.removeEventListener('touchstart', handleDocumentInteraction);
    };
  }, [showMobileMenu]);

  if (loading) {
    return <div style={{color:isDarkMode ? 'var(--text-light)': 'var(--text-dark)'}}>Cargando categorías...</div>;
  }

  const getBaseUrl = () => {
    if (pathname.includes('/ocasiones')) return '/ocasiones';
    if (pathname.includes('/fechas-especiales')) return '/fechas-especiales';
    return '/productos';
  };

  return (
    <div className={style.divNavBarSeccions}>
      <h5 style={{
        color: 'var(--primary-color)',
        fontWeight: '800',
        textAlign: '-webkit-center',
        paddingLeft: '40px',
      }}>
        Categorias:
      </h5>
      <nav className={style.navBarSeccions}>
        <ul className={style.openMenu} ref={menuRef}>
          <div className={`${style.categorySeccion} ${isDarkMode ? style.darkMode : style.lightMode}`}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.id === 'Todos' ? getBaseUrl() : `${getBaseUrl()}/${category.id}`}
                className={categoryName === category.id || (categoryName === undefined && category.id === 'Todos')
                  ? `${style.seccionLi} ${style.active}`
                  : style.seccionLi}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 'small' }} /> {category.value}
              </Link>
            ))}
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Categories;