"use client";

import React, { createContext, useState, useContext } from 'react';

export const FilterContext = createContext();

const FilterProvider = ({ children }) => {
    const [prodsFiltrados, setProdsFiltrados] = useState([]);

    const changeList = (itemsFiltrados) => {
        setProdsFiltrados(itemsFiltrados);
    };

    return (
        <FilterContext.Provider
            value={{
                prodsFiltrados,
                changeList
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    return useContext(FilterContext);
};

export default FilterProvider;