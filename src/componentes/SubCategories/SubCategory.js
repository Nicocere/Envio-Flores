import React from 'react';
import { NavLink } from "react-router-dom";
import './subCategoria.css'
import { useTheme } from '../../context/ThemeSwitchContext';


export const CategoriesSubMenu = () => {

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';

    return (
        <div className={`submenu ${className}`}>

            <NavLink className='navSeccion' to='/categoria/Rosas' >Rosas</NavLink>

            <NavLink className='navSeccion' to="/categoria/Floreros" >Floreros</NavLink>

            <NavLink className='navSeccion' to="/categoria/Arreglos" >Arreglos</NavLink>

            <NavLink className='navSeccion' to="/categoria/Especiales" >Especiales</NavLink>

            <NavLink className='navSeccion' to="/categoria/Canastas" >Canastas</NavLink>

            <NavLink className='navSeccion' to="/categoria/Ramos" >Ramos</NavLink>

            <NavLink className='navSeccion' to="/categoria/Plantas" >Plantas</NavLink>

            <NavLink className='navSeccion' to="/categoria/Comestibles" >Comestibles</NavLink>

            <NavLink className='navSeccion' to="/categoria/Desayunos" >Desayunos</NavLink>
        </div>
    );
}
