"use client"

import React, { use } from 'react';
import ItemListContainer from '@/componentes/ItemListContainer/ItemListContainer';
import Categories from '@/componentes/Categories/Categories';
import CheckoutStepper from '@/componentes/ProgressBar/CheckoutStepper';
import style from '@/Client/Productos/productos.module.css';

export default function ZonasDeEnvioComponent(props) {
  const { localidad } = props;

  return (
    <div>
      <CheckoutStepper activeStep={0} />
      <div className={style.products}>
        <div className={style.productsContent}>
          <Categories categoryName={localidad} />
          <div className={style.productsListContainer}>
            <h2 style={{ textAlign: '-webkit-center' }}>
              Productos que se pueden enviar a <strong >{localidad}</strong>
            </h2>
            <ItemListContainer />
          </div>
        </div>
      </div>
    </div>
  );
}