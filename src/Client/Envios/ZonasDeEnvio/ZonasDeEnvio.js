"use client"

import React, { use } from 'react';
import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import Categories from '@/componentes/Categories/Categories';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import style from '@/app/productos/productos.module.css';

export default function ZonasDeEnvioComponent(props) {
  const { localidad } = props.localidad

  return (
    <div>
      <CheckoutStepper activeStep={0} />
      <div className={style.products}>
        <div className={style.productsContent}>
          <Categories categoryName={localidad} />
          <div className={style.productsListContainer}>
            <h2 style={{ color: '#D4AF37', textAlign: '-webkit-center' }}>
              Productos que se pueden enviar a: <strong style={{ color: '#D4AF37' }}>{localidad}</strong>
            </h2>
            <ItemListContainer />
          </div>
        </div>
      </div>
    </div>
  );
}