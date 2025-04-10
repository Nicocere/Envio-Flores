import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import'./navSeccions.css'
import { CategoriesSubMenu } from '../SubCategories/SubCategory';
import '../../index.css'
import { OcasionesSubMenu } from '../SubMenuOcasiones/OcasionesSubMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '../../context/ThemeSwitchContext';

const NavSeccions = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showSubMenuProducts, setShowSubMenuProducts] = useState(false);
    const [showSubMenuOcasiones, setShowSubMenuOcasiones] = useState(false);

    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';


    // const toggleSubMenu = () => {
    //     setShowSubMenuProducts(!showSubMenuProducts);
    // };

    return (
        <ul className={`ulSeccion ${className}`}>

            <div className={`divSeccion ${className}`} >
                <NavLink className="navSeccions" to='/' onClick={() => setShowMobileMenu(!showMobileMenu)}> Inicio </NavLink>

                <div className={`navSeccion ${className}`} //onClick={toggleSubMenu}
                                            onMouseEnter={() => setShowSubMenuProducts(true)} 
                                            onMouseLeave={() => setShowSubMenuProducts(false)}>
                    <NavLink  to='/productos'>Productos
                    <KeyboardArrowDownIcon sx={{ transition:'transform .54s ease-in-out', transform: showSubMenuProducts && 'rotateX(180deg)'}}/>
                    </NavLink>
                    {showSubMenuProducts && <CategoriesSubMenu />}
                </div> 

                <div className={`ocasionesSeccion ${className}`} //onClick={toggleSubMenu}
                                            onMouseEnter={() => setShowSubMenuOcasiones(true)} 
                                            onMouseLeave={() => setShowSubMenuOcasiones(false)}>
                    <NavLink  to='/ocasiones'>Ocasiones
                    <KeyboardArrowDownIcon   sx={{ transition:'transform .54s ease-in-out', transform: showSubMenuOcasiones && 'rotateX(180deg)'}}/>
                    </NavLink>
                    {showSubMenuOcasiones && <OcasionesSubMenu />}
                </div> 
               
                <NavLink className={`navSeccions ${className}`} to="/ayuda" onClick={() => setShowMobileMenu(!showMobileMenu)}>¿Cómo Comprar?</NavLink> 

                <NavLink className={`navSeccions ${className}`} to="/ubicacion" onClick={() => setShowMobileMenu(!showMobileMenu)}>Contacto</NavLink>

                <NavLink className={`navSeccions ${className}`} to="/envios" onClick={() => setShowMobileMenu(!showMobileMenu)}>Zonas de Envio</NavLink>

            </div>

        </ul>
    )
}

export default NavSeccions;