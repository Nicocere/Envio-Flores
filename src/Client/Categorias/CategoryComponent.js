"use client"

import React from 'react'
import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import style from './productos.module.css'
import Categories from '@/componentes/Categories/Categories';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';

const ProductsCategoryComponent = () => {
    const isSmallScreen = useMediaQuery('(max-width:650px)');
    const { isDarkMode } = useTheme();

    return (
        <div style={{
            background: isDarkMode ? '#fcf5f0' : '#1a0f0a',
            backdropFilter: !isDarkMode && 'blur(5px)',
            paddingTop: '50px'
        }}>
            <CheckoutStepper activeStep={0} />
            <div className={style.products}>
                <div className={style.productsContent} >
                    <Categories />
                    <div className={style.productsListContainer} >
                        <h2 style={{
                            fontSize: isSmallScreen && '1.76rem',
                            color: '#D4AF37',
                            textAlign: '-webkit-center',
                        }}>
                            Todos nuestros productos
                        </h2>
                        <ItemListContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsCategoryComponent;