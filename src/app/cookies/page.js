"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const CookiePolicy = dynamic(() => import('../../componentes/Cookies/Cookies')); 


const CookiesPage = React.memo((props) => {
    

    return (
        <CookiePolicy />
    );
});

export default CookiesPage;