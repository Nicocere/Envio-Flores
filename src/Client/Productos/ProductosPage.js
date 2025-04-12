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


    return (
        <div style={{paddingTop: '30px'}}>
            <CheckoutStepper activeStep={0} />
            <div>
                <div className={style.products}>
                    <div className={style.productsContent}>
                        <Categories />
                        <div className={style.productsListContainer}>
            
                            <ItemListContainer />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProductsComponent;