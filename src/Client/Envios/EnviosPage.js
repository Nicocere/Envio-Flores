"use client"

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import style from '@/app/envios/directions.module.css';
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
    const { localidad } = useSearchParams();
    const {isDarkMode} = useTheme();
    const [directions, setDirections] = useState([]);

    // Fetch direcciones
    const fetchDirections = async () => {
        const directionsRef = collection(baseDeDatos, 'direcciones');
        const orderedQuery = query(directionsRef, orderBy('name')); // Ordena por el campo 'nombre'

        const directionsSnapshot = await getDocs(orderedQuery);
        const directionsData = [];
        directionsSnapshot.forEach((doc) => {
            directionsData.push({ id: doc.id, ...doc.data() });
        });
        setDirections(directionsData);
    };

    useEffect(() => {
        fetchDirections();
    }, []);

    // Agrupa las direcciones por la primera letra de su nombre
    const groupedDirections = directions.reduce((acc, direction) => {
        const firstLetter = direction.name.charAt(0).toUpperCase();
        acc[firstLetter] = acc[firstLetter] || [];
        acc[firstLetter].push(direction);
        return acc;
    }, {});

    return (
        <div className={`${style.directionsDiv} ${!isDarkMode ? style.dark : style.light}`}>


            <h1>{`Zonas de envio ${localidad ? localidad : ''}`}</h1>

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {/* Renderiza las direcciones agrupadas */}
                {Object.entries(groupedDirections).map(([letter, directionsGroup]) => (
                    <div key={letter} className={style.groupContainer}>
                        <div className={style.letterHeader}>{letter}</div>
                        <ul className={style.envioDirectionList}>
                            {directionsGroup.map((direc) => (
                                <li className={style.liDirects} key={direc.id}>
                                    <Link className="envio-direction" href={`/envios/${generateSlug(direc.name)}`} title={`Envíos a ${direc.name}`}>
                                        Envíos a {direc.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LocalidadPageComponent = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <LocalidadPageContent />
        </Suspense>
    );
};

export default LocalidadPageComponent;