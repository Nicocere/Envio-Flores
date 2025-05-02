"use client"

import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import Categories from '@/componentes/Categories/Categories';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import style from '../productos.module.css'
import { useTheme } from '@/context/ThemeSwitchContext';

export default function CategoryComponent(props) {
    const { categoryName } = props
    const { isDarkMode } = useTheme();

    return (
        <div >
            <CheckoutStepper activeStep={0} />
            <div className={style.products}>
                <div className={style.productsContent}>
                    <Categories categoryName={categoryName} />
                    <div className={style.productsListContainer}>
                    
                        <ItemListContainer categoryName={categoryName} />
                    </div>
                </div>
            </div>
        </div>

    )
}