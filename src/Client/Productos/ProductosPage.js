"use client"

import React from 'react'
import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import style from './productos.module.css'
import Categories from '@/componentes/Categories/Categories';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';

const ProductsComponent = () => {
    const { isDarkMode } = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:650px)');


    return (
        <div style={{
            background: isDarkMode ? '#fcf5f0' : '#1a0f0a',
            backdropFilter: !isDarkMode && 'blur(5px)',
            paddingTop: '50px'
        }}>
            <CheckoutStepper activeStep={0} />
            <div>
                <div className={style.products}>
                    <div className={style.productsContent}>
                        <Categories />
                        <div className={style.productsListContainer}>
                            <h2 style={{
                                fontSize: isSmallScreen && '1.76rem',
                                color: isDarkMode ? '#2f1a0f' : '#fcf5f0',
                                background: isDarkMode ? '#fcf5f0' : '#2f1a0f',
                                textAlign: '-webkit-center',
                                margin: '0',
                                transition: 'all 0.8s ease',
                                padding: '10px',
                            }}>
                                Todos nuestros productos
                            </h2>
                            <ItemListContainer />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProductsComponent;