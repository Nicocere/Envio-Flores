import React, { useState } from 'react';
import Link from 'next/link';
import './navSeccions.css'
import { CategoriesSubMenu } from '../SubCategories/SubCategory';

import { OcasionesSubMenu } from '../SubMenuOcasiones/OcasionesSubMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '../../context/ThemeSwitchContext';

const NavSeccions = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showSubMenuProducts, setShowSubMenuProducts] = useState(false);
    const [showSubMenuOcasiones, setShowSubMenuOcasiones] = useState(false);

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';



    return (
        <ul className={`ulSeccion ${className}`}>

            <div className={`divSeccion ${className}`} >
                <Link className="navSeccions" href='/' onClick={() => setShowMobileMenu(!showMobileMenu)}> Inicio </Link>

                <div className={`navSeccion ${className}`} //onClick={toggleSubMenu}
                    onMouseEnter={() => setShowSubMenuProducts(true)}
                    onMouseLeave={() => setShowSubMenuProducts(false)}>
                    <Link href='/productos'>Productos
                        <KeyboardArrowDownIcon sx={{ transition: 'transform .54s ease-in-out', transform: showSubMenuProducts && 'rotateX(180deg)' }} />
                    </Link>
                    {showSubMenuProducts && <CategoriesSubMenu />}
                </div>

                <div className={`ocasionesSeccion ${className}`} //onClick={toggleSubMenu}
                    onMouseEnter={() => setShowSubMenuOcasiones(true)}
                    onMouseLeave={() => setShowSubMenuOcasiones(false)}>
                    <Link href='/ocasiones'>Ocasiones
                        <KeyboardArrowDownIcon sx={{ transition: 'transform .54s ease-in-out', transform: showSubMenuOcasiones && 'rotateX(180deg)' }} />
                    </Link>
                    {showSubMenuOcasiones && <OcasionesSubMenu />}
                </div>

                <Link className={`navSeccions ${className}`} href="/ayuda" onClick={() => setShowMobileMenu(!showMobileMenu)}>¿Cómo Comprar?</Link>

                <Link className={`navSeccions ${className}`} href="/contacto" onClick={() => setShowMobileMenu(!showMobileMenu)}>Contacto</Link>

                <Link className={`navSeccions ${className}`} href="/ubicacion" onClick={() => setShowMobileMenu(!showMobileMenu)}>Nuestro local</Link>

            </div>

        </ul>
    )
}

export default NavSeccions;