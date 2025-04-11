"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import PagoPendientePage from '@/componentes/ComprasMP/Pendientes/ComprasPendientes';


const ComprasMP = React.memo((props) => {

    return (
        <PagoPendientePage {...props} />
    );
});

ComprasMP.displayName = 'ComprasMP';

export default ComprasMP;