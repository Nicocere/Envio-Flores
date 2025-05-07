import React, { useState } from 'react';
import Link from 'next/link';
import './navSeccions.css'
import { CategoriesSubMenu } from '../SubCategories/SubCategory';
import { OcasionesSubMenu } from '../SubMenuOcasiones/OcasionesSubMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '../../context/ThemeSwitchContext';
import { CatalogoUnificadoMenu } from './CatalogoUnificadoMenu';

const NavSeccions = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showCatalogoMenu, setShowCatalogoMenu] = useState(false);

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';

    return (
        <ul className={`ulSeccion ${className}`}>

            <div className={`divSeccion ${className}`} >
                <Link className="navSeccions" href='/' onClick={() => setShowMobileMenu(!showMobileMenu)}> Inicio </Link>

                <div className={`navSeccion ${className}`}
                    onMouseEnter={() => setShowCatalogoMenu(true)}
                    onMouseLeave={() => setShowCatalogoMenu(false)}>
                    <Link href='/productos'>Catálogo
                        <KeyboardArrowDownIcon sx={{ transition: 'transform .54s ease-in-out', transform: showCatalogoMenu && 'rotateX(180deg)' }} />
                    </Link>
                    {showCatalogoMenu && <CatalogoUnificadoMenu />}
                </div>

                <Link className={`navSeccions ${className}`} href="/ayuda" onClick={() => setShowMobileMenu(!showMobileMenu)}>¿Cómo Comprar?</Link>

                <Link className={`navSeccions ${className}`} href="/contacto" onClick={() => setShowMobileMenu(!showMobileMenu)}>Contacto</Link>

                <Link className={`navSeccions ${className}`} href="/ubicacion" onClick={() => setShowMobileMenu(!showMobileMenu)}>Nuestro local</Link>

                <Link className={`navSeccions ${className}`} href="/subscripcion-flores" onClick={() => setShowMobileMenu(!showMobileMenu)}> Suscripción Floral</Link>

            </div>

        </ul>
    )
}

export default NavSeccions;