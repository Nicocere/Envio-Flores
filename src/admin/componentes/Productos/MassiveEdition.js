"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Swal from 'sweetalert2';
import { PulseLoader  } from 'react-spinners';
import { useRouter } from 'next/navigation';
import style from './addProds.module.css';
import localforage from 'localforage';

 function MassiveEdition() {
    const navigate = useRouter();    
    
    // const initialSelectedProducts = useMemo(() => selectedProducts || [], [selectedProducts]);
    const [products, setSelectedProducts] = useState([]);
    const [percentageAdjustment, setPercentageAdjustment] = useState(0);
    const [originalValues, setOriginalValues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Asegúrate de que esta lógica solo se ejecute una vez o bajo ciertas condiciones
        const fetchData = async () => {
            const selectedProducts = await localforage.getItem('massiveProds');
            setSelectedProducts(selectedProducts || []);
    
                    // Almacenar los valores originales cuando se carga la página
        const valores = selectedProducts.map((product) => ({
            ...product
        }));

        setOriginalValues(valores);
        };


        fetchData();
    }, []);



    const handlePriceChange = (productId, optionIndex, newPrice) => {
        const updatedProducts = products.map((product) => {
            if (product.id === productId) {
                const updatedOptions = product.opciones.map((option, index) => {
                    if (index === optionIndex) {
                        return { ...option, precio: parseInt(newPrice, 10) };
                    }
                    return option;
                });

                return { ...product, opciones: updatedOptions };
            }
            return product;
        });

        setSelectedProducts(updatedProducts);
    };

    const handleOptionDelete = (productId, optionIndex) => {
        const updatedProducts = products.map((product) => {
            if (product.id === productId) {
                const updatedOptions = product.opciones.filter((option, index) => index !== optionIndex);
                return { ...product, opciones: updatedOptions };
            }
            return product;
        });

        setSelectedProducts(updatedProducts);
    };

    const handleOptionAdd = (productId) => {
        const updatedProducts = products.map((product) => {
            if (product.id === productId) {
                const newOption = {
                    img: '', // Puedes proporcionar valores predeterminados o requeridos aquí
                    precio: 0,
                    size: '',
                };
                const updatedOptions = [...product.opciones, newOption];
                return { ...product, opciones: updatedOptions };
            }
            return product;
        });

        setSelectedProducts(updatedProducts);
    };

    const handlePercentageAdjustment = () => {
        const adjustedProducts = products.map((product) => {
            const adjustedOptions = product.opciones.map((option) => {
                const adjustedPrice = Math.round(option.precio * (1 + percentageAdjustment / 100));
                return { ...option, precio: adjustedPrice };
            });

            return { ...product, opciones: adjustedOptions };
        });

        setSelectedProducts(adjustedProducts);
    };

    const handleClearAdjustment = () => {
        const clearedProducts = products.map((product) => {
            const clearedOptions = product.opciones.map((option) => {
                return { ...option, precio: Math.round(option.precio / (1 + percentageAdjustment / 100)) };
            });

            return { ...product, opciones: clearedOptions };
        });

        setSelectedProducts(clearedProducts);
    };
    
    const handleRestoreDefaults = () => {
        // Restaurar los valores originales almacenados
        if (originalValues) {
            setSelectedProducts(originalValues.map((product) => ({ ...product })));
        }
        setPercentageAdjustment(0);
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            for (const updatedProduct of products) {
                const productDocRef = doc(baseDeDatos, 'productos', updatedProduct.id);
                await updateDoc(productDocRef, { opciones: updatedProduct.opciones });
            }
            setIsLoading(false)

            Swal.fire('Cambios guardados con éxito', '', 'success').then(() => {
                navigate('/administrador/addProds');
            });
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            Swal.fire('Error al guardar cambios', '', 'error');
        }
    };

    return (
        <div className={style.divMassiveEdit}>
                            <div className='perfil-usuario-btns'>
                    <Button color='error' variant='contained' size='small' sx={{ margin: '0 0 20px' }} onClick={() => navigate.back()}>Volver atrás</Button>

                </div>
            <div className={style.divPorcentaje}>
                <label>Porcentaje de ajuste:  {''}</label>
                <span> % </span>
                <input
                    type="number"
                    value={isNaN(percentageAdjustment) ? '' : percentageAdjustment}
                    onChange={(e) => setPercentageAdjustment(Math.max(0, e.target.value === '' ? 0 : parseInt(e.target.value, 10)))}
                />

                <Button color='success' variant='contained' sx={{ backgroundColor: '#ca0043', fontSize: '10px', fontWeight: '700', margin: '0 10px', '&:hover': { backgroundColor: '#ff0054' } }}
                    onClick={handlePercentageAdjustment} disabled={percentageAdjustment === 0} >
                    Aplicar ajuste
                </Button>
                
                <Button disabled={percentageAdjustment === 0} variant='outlined' color='error' sx={{ fontSize: '10px', fontWeight: '700', marginRight: '25px', marginLeft: '0', '&:hover': { backgroundColor: '#ff223d', color:'white' }  }} onClick={handleClearAdjustment} endIcon={<ClearRoundedIcon color='error' size='small' sx={{'&:hover':{color:'white'}}} />}>
                        Restar Ajuste
                    
                </Button>

                <Button color='error' variant='contained' sx={{ fontSize: '10px', fontWeight: '700' }}
                    onClick={handleRestoreDefaults} disabled={percentageAdjustment === 0} >
                    Restaurar Valores Predeterminados
                </Button>
            </div>

            <form>
                {products.map((product, productIndex) => (
                    <div key={product.id} className={style.divEditMassive}>
                        <h2 className={style.titleProducts}>{product.nombre}</h2>
                        {product.opciones.map((option, optionIndex) => (
                            <div key={optionIndex} className={style.divMapeditMassive}>
                                <label>Precio para {option.size} <strong>$</strong> </label>
                                <input
                                    type="number"
                                    value={option.precio}
                                    onChange={(e) => handlePriceChange(product.id, optionIndex, e.target.value)}
                                />
                                <IconButton onClick={() => handleOptionDelete(product.id, optionIndex)}>
                                    <DeleteIcon sx={{color:'#de2865'}} />
                                </IconButton>
                            </div>
                        ))}
                        <IconButton onClick={() => handleOptionAdd(product.id)} disabled>
                            <AddIcon />
                        </IconButton>
                    </div>
                ))}
            </form>
            <button className={style.btnConfirmMassiveEdition} type="button" onClick={handleSubmit}>
                Guardar cambios
            </button>

            {isLoading ? (
                <div className={style.WaitingAllChanges}>
                    Cambiando todos los precios, espere...
                    <PulseLoader  color="#670000" />
                </div>
            ) : (
                null
                )}
        </div>
    );
}

export default MassiveEdition;
