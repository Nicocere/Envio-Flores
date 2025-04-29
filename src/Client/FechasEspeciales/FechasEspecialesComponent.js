"use client"

import React from 'react'
import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import style from '../../app/ocasiones/productos.module.css'
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import {  useMediaQuery } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';
import Categories from '@/componentes/Categories/Categories';

const FechasEspecialesComponent = () => {
    const { isDarkMode } = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:650px)');

    return (

        <div style={{
            background: isDarkMode ? '#fcf5f0' : '#1a0f0a',
            backdropFilter: !isDarkMode && 'blur(5px)',
            paddingTop: '50px'
        }}>     
               <CheckoutStepper activeStep={0} />
            <div className={style.products}>
                <div className={style.productsContent}>
                    <Categories />
                    <div className={style.productsListContainer}>
                        <h2
                            style={{
                                fontSize: isSmallScreen && '1.76rem',
                                color: isDarkMode ? '#670000' : '#A6855D',
                                textAlign: '-webkit-center'
                            }}
                        >
                            Regalos para Fechas Especiales
                        </h2>
                        <ItemListContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FechasEspecialesComponent;