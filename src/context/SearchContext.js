"use client";

import React, { createContext, useState, useContext } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [prodEncontrado, setProdEncontrado] = useState([]);
    const [navBarSearcher, setNavBarSearcher] = useState(false);
    const [clearInputNavBar, setClearInputNavBar] = useState(false);
    const [clearInputMain, setClearInputMain] = useState(false);

    const changeList = (item) => {
        setProdEncontrado(item);
    };

    return (
        <SearchContext.Provider
            value={{
                prodEncontrado,
                changeList,
                setNavBarSearcher,
                navBarSearcher,
                setClearInputNavBar,
                clearInputNavBar,
                setClearInputMain,
                clearInputMain,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    return useContext(SearchContext);
};

export default SearchProvider;