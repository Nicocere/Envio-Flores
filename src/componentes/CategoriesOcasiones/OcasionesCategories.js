import { NavLink, useParams } from 'react-router-dom'
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

          <NavLink className={`seccionOcasionesLi ${className}`} to='/ocasiones/Aniversarios'> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Aniversarios </NavLink>

          <NavLink className={`seccionOcasionesLi ${className}`} to="/ocasiones/Casamientos"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Casamientos</NavLink>

          <NavLink className={`seccionOcasionesLi ${className}`} to="/ocasiones/Cumpleaños"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Cumpleaños</NavLink>

          <NavLink className={`seccionOcasionesLi ${className}`} to="/ocasiones/Condolencias"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Condolencias</NavLink>

          <NavLink className={`seccionOcasionesLi ${className}`} to="/ocasiones/Nacimientos"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Nacimientos</NavLink>

          <NavLink className={`seccionOcasionesLi ${className}`} to="/ocasiones/RegalosHombres"> <ArrowForwardIosIcon sx={{fontSize: 'small', }}/>  Regalos para Ellos</NavLink>

        
        </div>

      </ul>
    </nav>
  );
}

export default CategoriesOcasiones;

