"use client"

import React from 'react'
import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import style from '../../app/ocasiones/productos.module.css'
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import {  useMediaQuery } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';
import Categories from '@/componentes/Categories/Categories';

const OcasionesComponent = () => {
    const { isDarkMode } = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:650px)');

    return (

        <div style={{paddingTop: '50px'}}>     
               <CheckoutStepper activeStep={0} />
            <div className={style.products}>
                <div className={style.productsContent}> 
                    <Categories />
                    <div className={style.productsListContainer}>
                        <h2
                            style={{
                            
                                textAlign: '-webkit-center'
                            }}
                        >
                            Regalos para Ocasiones Especiales
                        </h2>
                        <ItemListContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OcasionesComponent;