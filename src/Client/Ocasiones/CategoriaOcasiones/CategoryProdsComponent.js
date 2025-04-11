"use client"

import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import style from '@/app/ocasiones/[categoria]/ocasiones.module.css'
import { use } from 'react';
import { useTheme } from '@/context/ThemeSwitchContext';
import Categories from '@/componentes/Categories/Categories';

export default function CategoryProdsComponents(props) {

    const { category } = props
    const { isDarkMode } = useTheme();

    return (
        <div style={{
            background: isDarkMode ? '#fcf5f0' : '#1a0f0a',
            backdropFilter: !isDarkMode && 'blur(5px)',
            paddingTop: '50px'
        }}>      <CheckoutStepper activeStep={0} />
            <div className={style.products}>
                <div className={style.productsContent}>
                    <Categories categoryName={category} />
                    <div className={style.productsListContainer}>
                        <h2 style={{
                            color: '#D4AF37',
                            textAlign: '-webkit-center',
                        }}>
                            Estas viendo la ocasión: <strong style={{ color: '#D4AF37' }}>
                                {category}
                            </strong>
                        </h2>
                        <ItemListContainer categoryName={category} />
                    </div>
                </div>
            </div>
        </div>

    )
}