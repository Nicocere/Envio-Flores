import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { NavLink, useParams } from 'react-router-dom';
import './directions.css';

const generateSlug = (str) => {
    const lowerCaseStr = str.toLowerCase();
    const words = lowerCaseStr.split(' ');

    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join('-');
};

const LocalidadPage = () => {
    const { localidad } = useParams();

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
        <div className='directions-div'>
            <Helmet>
                <title>Zonas de entrega Envio Flores domicilio en el día a Gran Buenos Aires y Capital Federal</title>
                <meta name="description" content="¡Compra flores frescas, chocolates, bebidas, peluches y más y sorprende a tus seres queridos!" />
            </Helmet>
            <h1>{`Zonas de envio ${localidad ? localidad : ''}`}</h1>

            <div className="grouped-directions" style={{display:'flex', flexDirection:'row', flexWrap:'wrap',}}>
                {/* Renderiza las direcciones agrupadas */}
                {Object.entries(groupedDirections).map(([letter, directionsGroup]) => (
                    <div className="group" key={letter} style={{flex:'2 2 30%', margin:'14px'}}>
                        <div className="letter-heading" style={{background:'darkred', color:'white', fontWeight:'800'}}>{letter}</div>
                        <ul className="envio-direction-list">
                            {directionsGroup.map((direc) => (
                                <li className='li-directs' key={direc.id}>
                                    <NavLink className="envio-direction" to={`/envios/${generateSlug(direc.name)}`}>
                                        Envíos a {direc.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocalidadPage;
