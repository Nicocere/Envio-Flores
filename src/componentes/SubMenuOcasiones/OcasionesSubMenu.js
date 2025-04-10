import React from 'react';
import { NavLink } from "react-router-dom";
import './ocasionesSubMenu.css'
import { useTheme } from '../../context/ThemeSwitchContext';


export const OcasionesSubMenu = () => {

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';

    return (
        <div className={`submenuOcasiones ${className}`}>
            <NavLink className='ocasionesSeccion' to='/ocasiones/Aniversarios' >Aniversarios</NavLink>

            <NavLink className='ocasionesSeccion' to="/ocasiones/Casamientos" >Casamientos</NavLink>

            <NavLink className='ocasionesSeccion' to="/ocasiones/Cumpleaños" >Cumpleaños</NavLink>

            <NavLink className='ocasionesSeccion' to="/ocasiones/Condolencias" >Condolencias</NavLink>

            <NavLink className='ocasionesSeccion' to="/ocasiones/Nacimientos" >Nacimientos</NavLink>

            <NavLink className='ocasionesSeccion' to="/ocasiones/RegalosHombres" >Regalos para Ellos</NavLink>

        </div>
    );
}
