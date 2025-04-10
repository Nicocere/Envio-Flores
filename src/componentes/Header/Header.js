import Convertidor from "../Convertidor/Convertidor";
import NavBarTop from "../Nav/NavBar";
import React from 'react';
import Conctacto from "../Contacto/Contacto";
import { useMediaQuery } from "@mui/material";
import NavBarMobile from "../NavBarMobile/NavBarMobile";


const Header = () => {

    const isSmallScreen = useMediaQuery('(max-width:650px)');


    return (
        <>
            {/* <Conctacto /> */}
            <header className="div-header-dinamic">

                {
                    isSmallScreen ? <NavBarMobile/> :
                        <NavBarTop />
                }

            </header>


        </>
    );
};

export default Header;