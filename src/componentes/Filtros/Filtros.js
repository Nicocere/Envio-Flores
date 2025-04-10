import React, {  useContext, useEffect, useState } from "react";
import './Filtros.css'
import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FilterContext, useFilter } from "../../context/FilterContext";


const Filtros = ({ products }) => {

    const {  changeList } = useFilter();

    const theme = createTheme();

    theme.typography.h2 = {
        color: theme.palette.getContrastText(grey[900]),
        padding: 20,
        fontFamily: 'Carattere, sans-serif',
        fontSize: '1.2rem',
        '@media (min-width:600px)': {
            fontSize: '1.5rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '2.4rem',
        },
    };

    // const [items, setItems] = useState([]);
    const [sortOrder, setSortOrder] = useState(''); // Valor predeterminado.


 const filtrado = (products) => {
    let processedItems = products; // Clonar el array para no mutar el original
        switch (sortOrder) {
            case 'recientes':
                processedItems.sort((a, b) => (b.createdAt) - (a.createdAt));
                break;
            case 'barato':
                processedItems.sort((a, b) => (a.opciones[0].precio) - (b.opciones[0].precio));
                break;
            case 'caro':
                processedItems.sort((a, b) => (b.opciones[0].precio) - (a.opciones[0].precio));
                break;
            case 'vendidos':
                processedItems.sort((a, b) => b.vendidos - a.vendidos);
                break;
            case 'alfabeto1':
                processedItems.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'alfabeto2':
                processedItems.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            default:
                break;
        }
        changeList(processedItems)
     };


     useEffect(() => {
        filtrado();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortOrder]);// <- Añadir currentPage y sortOrder como dependencias


    return (


                    <div className="div-filtros">

                        <label>
                            <input className=""
                                type="checkbox"
                                value="recientes"
                                checked={sortOrder === "recientes"}
                                onChange={e => setSortOrder(prevOrder => prevOrder === e.target.value ? 'sin_ordenacion' : e.target.value)}
                            /> Recién añadidos
                        </label>

                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    value="barato"
                                    checked={sortOrder === "barato"}
                                    onChange={e => setSortOrder(prevOrder => prevOrder === e.target.value ? 'sin_ordenacion' : e.target.value)}
                                /> Menor precio
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="caro"
                                    checked={sortOrder === "caro"}
                                    onChange={e => setSortOrder(prevOrder => prevOrder === e.target.value ? 'sin_ordenacion' : e.target.value)}
                                /> Mayor precio
                            </label>

                        </div>

                        <label>
                            <input
                                type="checkbox"
                                value="vendidos"
                                checked={sortOrder === "vendidos"}
                                onChange={e => setSortOrder(prevOrder => prevOrder === e.target.value ? 'sin_ordenacion' : e.target.value)}
                            /> Más vendidos
                        </label>

                        <div>

                            <label>
                                <input className=""
                                    type="checkbox"
                                    value="alfabeto1"
                                    checked={sortOrder === "alfabeto1"}
                                    onChange={e => setSortOrder(prevOrder => prevOrder === e.target.value ? 'sin_ordenacion' : e.target.value)}
                                /> Ordenar de A / Z
                            </label>

                            <label>
                                <input className=""
                                    type="checkbox"
                                    value="alfabeto2"
                                    checked={sortOrder === "alfabeto2"}
                                    onChange={e => setSortOrder(prevOrder => prevOrder === e.target.value ? 'sin_ordenacion' : e.target.value)}
                                /> Ordenar de Z / A
                            </label>
                        </div>
                    </div>

    );

};

export default Filtros;