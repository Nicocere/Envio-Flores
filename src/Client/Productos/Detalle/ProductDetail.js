"use client"

import React from 'react'; // Importa React explícitamente
import { useMediaQuery } from '@mui/material';
import ItemDetailContainer from '@/componentes/ItemDetailContainer/ItemDetailContainer';

export default function ProductDetailComponent(props) {
  const isSmallScreen = useMediaQuery('(max-width:650px)');

   const {prodId} = props

  return (
        <ItemDetailContainer  prodId={prodId}/>
  )
}
