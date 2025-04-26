"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import CompraFinalizada from '@/componentes/ComprasMP/FinalizadaMP/CompraFinalizada';


const ComprasMP = React.memo((props) => {

    return (
        <CompraFinalizada {...props} />
    );
});

ComprasMP.displayName = 'ComprasMP';

export default ComprasMP;