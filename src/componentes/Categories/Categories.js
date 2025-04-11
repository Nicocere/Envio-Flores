import {  useParams } from 'react-router-dom'
import Link from 'next/link';
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

          <Link className={`seccionLi ${className}`} href='/productos' ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Todo </Link>

          <Link className={`seccionLi ${className}`} href='/categoria/Rosas' ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Rosas</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Floreros" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Floreros</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Arreglos" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Arreglos</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Especiales" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Especiales</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Canastas" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Canastas</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Ramos" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Ramos</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Plantas" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Plantas</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Comestibles" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Comestibles</Link>

          <Link className={`seccionLi ${className}`} href="/categoria/Desayunos" ><ArrowForwardIosIcon sx={{fontSize: 'small', }}/> Desayunos</Link>
        </div>

      </ul>
    </nav>
  );
}

export default Categories;

