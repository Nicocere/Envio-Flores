import {  useParams } from 'react-router-dom';
import Link from 'next/link';
import './categoriesOcasiones.css'
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import React, { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTheme } from '../../context/ThemeSwitchContext';


const CategoriesOcasiones = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { categoryName, searchParam } = useParams()
  const [categoryroute, setCategoryRoute] = useState();

  const openMenu = showMobileMenu ? 'seccionOcasiones' : 'seccionCerradaOcasiones';
  
  const { isDarkMode } = useTheme();
  const className = isDarkMode ? 'dark-mode' : '';

  const menuRef = useRef(null);

  useEffect(() => {
    if (categoryName) {
      setCategoryRoute(categoryName)
    } else if (searchParam) {
      setCategoryRoute(searchParam)
    } else {
      setCategoryRoute("Ocasiones")
    }
  }, [categoryName, searchParam]);

  return (

    <nav className={`ocasionesSeccions ${className}`}>
      
      <ul className={openMenu} ref={menuRef}>

        <div className='categorySeccionOcasiones'>

          <Link className={`seccionOcasionesLi ${className}`} href='/ocasiones/Aniversarios'> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Aniversarios </Link>

          <Link className={`seccionOcasionesLi ${className}`} href="/ocasiones/Casamientos"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Casamientos</Link>

          <Link className={`seccionOcasionesLi ${className}`} href="/ocasiones/Cumpleaños"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Cumpleaños</Link>

          <Link className={`seccionOcasionesLi ${className}`} href="/ocasiones/Condolencias"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Condolencias</Link>

          <Link className={`seccionOcasionesLi ${className}`} href="/ocasiones/Nacimientos"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Nacimientos</Link>

          <Link className={`seccionOcasionesLi ${className}`} href="/ocasiones/RegalosHombres"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Regalos para Ellos</Link>

        
        </div>

      </ul>
    </nav>
  );
}

export default CategoriesOcasiones;

