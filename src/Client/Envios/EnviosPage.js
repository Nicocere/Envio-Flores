"use client"

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import style from './Envios.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeSwitchContext';

const generateSlug = (str) => {
    const lowerCaseStr = str.toLowerCase();
    const words = lowerCaseStr.split(' ');

    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join('-');
};

const LocalidadPageContent = () => {
    const searchParams = useSearchParams();
    const localidad = searchParams.get('localidad');
    const { isDarkMode } = useTheme();
    
    const [directions, setDirections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('');
    const [alphabet, setAlphabet] = useState([]);

    // Fetch direcciones
    const fetchDirections = async () => {
        try {
            setLoading(true);
            const directionsRef = collection(baseDeDatos, 'direcciones');
            const orderedQuery = query(directionsRef, orderBy('name'));
            const directionsSnapshot = await getDocs(orderedQuery);
            
            const directionsData = [];
            directionsSnapshot.forEach((doc) => {
                directionsData.push({ id: doc.id, ...doc.data() });
            });
            
            setDirections(directionsData);
            
            // Generar alfabeto único basado en las direcciones disponibles
            const uniqueLetters = [...new Set(directionsData.map(dir => dir.name.charAt(0).toUpperCase()))];
            setAlphabet(uniqueLetters.sort());
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching directions:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirections();
    }, []);

    // Filtra direcciones por letra
    const filteredDirections = activeFilter 
        ? directions.filter(dir => dir.name.charAt(0).toUpperCase() === activeFilter)
        : directions;

    // Agrupa las direcciones por la primera letra de su nombre
    const groupedDirections = filteredDirections.reduce((acc, direction) => {
        const firstLetter = direction.name.charAt(0).toUpperCase();
        acc[firstLetter] = acc[firstLetter] || [];
        acc[firstLetter].push(direction);
        return acc;
    }, {});

    // Manejador para filtrar por letra
    const handleLetterFilter = (letter) => {
        setActiveFilter(letter === activeFilter ? '' : letter);
    };

    return (
        <div className={`${style.directionsDiv} ${isDarkMode ? style.dark : style.light}`}>
            <h1>{`Zonas de envío ${localidad ? `en ${localidad}` : ''}`}</h1>
            
            {/* Filtro alfabético */}
            <div className={style.alphabetContainer}>
                {alphabet.map(letter => (
                    <button 
                        key={letter}
                        className={`${style.letterButton} ${activeFilter === letter ? style.activeLetterButton : ''}`}
                        onClick={() => handleLetterFilter(letter)}
                        aria-label={`Filtrar por letra ${letter}`}
                    >
                        {letter}
                    </button>
                ))}
                {activeFilter && (
                    <button 
                        className={style.letterButton}
                        onClick={() => setActiveFilter('')}
                        aria-label="Mostrar todas las localidades"
                    >
                        Todos
                    </button>
                )}
            </div>

            {loading ? (
                <div className={style.loader}>Cargando localidades...</div>
            ) : Object.keys(groupedDirections).length > 0 ? (
                <div className={style.groupsContainer}>
                    {/* Renderiza las direcciones agrupadas */}
                    {Object.entries(groupedDirections).map(([letter, directionsGroup]) => (
                        <div key={letter} className={style.groupContainer}>
                            <div className={style.letterHeader}>{letter}</div>
                            <ul className={style.envioDirectionList}>
                                {directionsGroup.map((direc) => (
                                    <li className={style.liDirects} key={direc.id}>
                                        <Link 
                                            href={`/envios/${generateSlug(direc.name)}`} 
                                            title={`Envíos a ${direc.name}`}
                                        >
                                            Envíos a {direc.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={style.emptyState}>
                    <p>No se encontraron localidades{activeFilter ? ` que comiencen con la letra ${activeFilter}` : ''}.</p>
                    {activeFilter && (
                        <button 
                            className={style.letterButton}
                            onClick={() => setActiveFilter('')}
                        >
                            Mostrar todas
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const LocalidadPageComponent = () => {
    return (
        <Suspense fallback={
            <div className={`${style.directionsDiv} ${style.light}`}>
                <div className={style.loader}>Cargando...</div>
            </div>
        }>
            <LocalidadPageContent />
        </Suspense>
    );
};

export default LocalidadPageComponent;