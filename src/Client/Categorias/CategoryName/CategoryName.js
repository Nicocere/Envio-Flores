"use client";

import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import Categories from '@/componentes/Categories/Categories';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import style from '../productos.module.css'
import { use } from 'react';
import { useTheme } from '@/context/ThemeSwitchContext';

export default function CategoryNameComponent(props) {

    const { categoryName } = props.categoryName;
    const { isDarkMode } = useTheme();


    return (
        <div style={{
            background: isDarkMode ? '#fcf5f0' : '#1a0f0a',
            backdropFilter: !isDarkMode && 'blur(5px)',
            paddingTop: '50px'
        }}>

            <CheckoutStepper activeStep={0} />
            <div className={style.products}>
                <div className={style.productsContent}>
                    <Categories categoryName={categoryName} />
                    <div className={style.productsListContainer}>
                        <h2 style={{
                            
                            textAlign: '-webkit-center',
                        }}>
                            Estas viendo la Categoria: <strong style={{ color: '#D4AF37' }}>
                                {categoryName}
                            </strong>
                        </h2>
                        <ItemListContainer categoryName={categoryName} />
                    </div>
                </div>
            </div>
        </div>

    )
}