import React from 'react';
import Link from 'next/link';
import './subCategoria.css'
import { useTheme } from '../../context/ThemeSwitchContext';


export const CategoriesSubMenu = () => {

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';

    return (
        <div className={`submenu ${className}`}>

            <Link className='navSeccion' href='/categoria/Rosas' >Rosas</Link>

            <Link className='navSeccion' href="/categoria/Floreros" >Floreros</Link>

            <Link className='navSeccion' href="/categoria/Arreglos" >Arreglos</Link>

            <Link className='navSeccion' href="/categoria/Especiales" >Especiales</Link>

            <Link className='navSeccion' href="/categoria/Canastas" >Canastas</Link>

            <Link className='navSeccion' href="/categoria/Ramos" >Ramos</Link>

            <Link className='navSeccion' href="/categoria/Plantas" >Plantas</Link>

            <Link className='navSeccion' href="/categoria/Comestibles" >Comestibles</Link>

            <Link className='navSeccion' href="/categoria/Desayunos" >Desayunos</Link>
        </div>
    );
}
