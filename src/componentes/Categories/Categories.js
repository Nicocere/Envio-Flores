import { NavLink, useParams } from 'react-router-dom'
import './Categories.css'
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import React, { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTheme } from '../../context/ThemeSwitchContext';



const Categories = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { categoryName, searchParam } = useParams()
  const [categoryroute, setCategoryRoute] = useState();

  const openMenu = showMobileMenu ? 'seccion' : 'seccionCerrada';
  


  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { isDarkMode } = useTheme();
  const className = isDarkMode ? 'dark-mode' : '';


  useEffect(() => {
    function handleDocumentInteraction(event) {
      // Si el menú está abierto y la interacción no fue en el menú ni en el botón, cierra el menú
      if (showMobileMenu && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    }

    // Agrega el event listener
    document.addEventListener('click', handleDocumentInteraction);
    document.addEventListener('touchstart', handleDocumentInteraction);

    // Limpieza: remueve el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('click', handleDocumentInteraction);
      document.removeEventListener('touchstart', handleDocumentInteraction);
    };

  }, [showMobileMenu]);



  useEffect(() => {
    if (categoryName) {
      setCategoryRoute(categoryName)
    } else if (searchParam) {
      setCategoryRoute(searchParam)
    } else {
      setCategoryRoute("Productos")
    }
  }, [categoryName, searchParam]);

  return (

    <nav className={`navBarSeccions ${className}`}>
      
      <ul className={openMenu} ref={menuRef}>

        <div className='categorySeccion'>

          <NavLink className={`seccionLi ${className}`} to='/productos' ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Todo </NavLink>

          <NavLink className={`seccionLi ${className}`} to='/categoria/Rosas' ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Rosas</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Floreros" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Floreros</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Arreglos" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Arreglos</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Especiales" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Especiales</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Canastas" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Canastas</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Ramos" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Ramos</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Plantas" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Plantas</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Comestibles" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Comestibles</NavLink>

          <NavLink className={`seccionLi ${className}`} to="/categoria/Desayunos" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Desayunos</NavLink>
        </div>

      </ul>
    </nav>
  );
}

export default Categories;

