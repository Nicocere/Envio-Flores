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
                        <h2 className={style.productsTitle} style={{ color: isDarkMode ? '#fff' : '#000' }}>
                            Estas viendo la Categoria: <strong style={{ color: isDarkMode ? '#ff6b6b' : '#a70000' }}>
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