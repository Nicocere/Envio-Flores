import React from 'react';
import Link from 'next/link';
import './ocasionesSubMenu.css'
import { useTheme } from '../../context/ThemeSwitchContext';


export const OcasionesSubMenu = () => {

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';

    return (
        <div className={`submenuOcasiones ${className}`}>
            <Link className='ocasionesSeccion' href='/ocasiones/Aniversarios' >Aniversarios</Link>

            <Link className='ocasionesSeccion' href="/ocasiones/Casamientos" >Casamientos</Link>

            <Link className='ocasionesSeccion' href="/ocasiones/Cumpleaños" >Cumpleaños</Link>

            <Link className='ocasionesSeccion' href="/ocasiones/Condolencias" >Condolencias</Link>

            <Link className='ocasionesSeccion' href="/ocasiones/Nacimientos" >Nacimientos</Link>

            <Link className='ocasionesSeccion' href="/ocasiones/RegalosHombres" >Regalos para Ellos</Link>

        </div>
    );
}
