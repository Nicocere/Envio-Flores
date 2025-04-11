"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const CompraFinalizada = dynamic(() => import('../../../componentes/ComprasMP/FinalizadaMP/CompraFinalizada'), { ssr: false });

const ComprasMP = React.memo((props) => {

    return (
        <CompraFinalizada {...props} />
    );
});

ComprasMP.displayName = 'ComprasMP';

export default ComprasMP;