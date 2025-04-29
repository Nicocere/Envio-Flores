import React, { useState, useEffect, useMemo } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Swal from 'sweetalert2';
import { PulseLoader  } from 'react-spinners';
import style from './direcciones.module.css'
import { useRouter } from 'next/navigation';
import localforage from 'localforage';

function MassiveEdition() {
    const navigate = useRouter();

    const [selectedDirections, setSelectedDirections] = useState([]);
    const [percentageAdjustment, setPercentageAdjustment] = useState(0);
    const [originalValues, setOriginalValues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        // Asegúrate de que esta lógica solo se ejecute una vez o bajo ciertas condiciones
        const fetchData = async () => {
            const selectedProducts = await localforage.getItem('massiveDirections');
            setSelectedDirections(selectedProducts || []);
    
                    // Almacenar los valores originales cuando se carga la página
        const valores = selectedProducts.map((product) => ({
            ...product
        }));

        setOriginalValues(valores);
        };


        fetchData();
    }, []);


    const handlePriceChange = (directionId, newPrice) => {
        const updatedDirections = selectedDirections.map((direc) => {
            if (direc.id === directionId) {
                // Modificar el precio de la dirección correspondiente
                return { ...direc, cost: newPrice, value: newPrice }; // Actualiza tanto el campo cost como el campo value
            }
            return direc;
        });

        setSelectedDirections(updatedDirections);
    };


    const handleOptionDelete = (productId, optionIndex) => {
        const updatedProducts = selectedDirections.map((product) => {
            if (product.id === productId) {
                const updatedOptions = product.opciones.filter((option, index) => index !== optionIndex);
                return { ...updatedOptions };
            }
            return product;
        });

        setSelectedDirections(updatedProducts);
    };

    const handleOptionAdd = (productId) => {
        const updatedProducts = selectedDirections.map((product) => {
            if (product.id === productId) {
                const newOption = {
                    img: '', // Puedes proporcionar valores predeterminados o requeridos aquí
                    precio: 0,
                    size: '',
                };
                const updatedOptions = [...product.opciones, newOption];
                return { ...product };
            }
            return product;
        });

        setSelectedDirections(updatedProducts);
    };

    const handlePercentageAdjustment = () => {
        const adjustedProducts = selectedDirections.map((product) => {
            const adjustedOptions = product.opciones.map((option) => {
                const adjustedPrice = Math.round(option.precio * (1 + percentageAdjustment / 100));
                return { ...option, precio: adjustedPrice };
            });

            return { ...product, opciones: adjustedOptions };
        });

        setSelectedDirections(adjustedProducts);
    };

    const handleClearAdjustment = () => {
        const clearedProducts = selectedDirections.map((product) => {
            const clearedOptions = product.opciones.map((option) => {
                return { ...option, precio: Math.round(option.precio / (1 + percentageAdjustment / 100)) };
            });

            return { ...product, opciones: clearedOptions };
        });

        setSelectedDirections(clearedProducts);
        setPercentageAdjustment(0);
    };

    const handleRestoreDefaults = () => {
        // Restaurar los valores originales almacenados
        if (originalValues) {
            setSelectedDirections(originalValues.map((product) => ({ ...product })));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            for (const updatedProduct of selectedDirections) {
                const productDocRef = doc(baseDeDatos, 'direcciones', updatedProduct.id);
                await updateDoc(productDocRef, updatedProduct); // Pasa los datos actualizados como segundo argumento
            }
            setIsLoading(false)
    
            Swal.fire('Cambios guardados con éxito', '', 'success').then(() => {
                navigate.push('/administrador/directions');
            });
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            Swal.fire('Error al guardar cambios', '', 'error');
        }
    };
    

    return (
        <div className={style.divMassiveEdit}>
            <div className={style.divPorcentaje}>
                <label>Porcentaje de ajuste:</label>
                <input
                    type="number"
                    value={isNaN(percentageAdjustment) ? '' : percentageAdjustment}
                    onChange={(e) => setPercentageAdjustment(Math.max(0, e.target.value === '' ? 0 : parseInt(e.target.value, 10)))}
                />
                <span>%</span>
                <Button color='success' variant='contained' sx={{ fontSize: '10px', fontWeight: '700', margin: '0 10px' }}
                    onClick={handlePercentageAdjustment} disabled={percentageAdjustment === 0} >
                    Aplicar ajuste
                </Button>
                <IconButton sx={{ marginRight: '25px', marginLeft: '0', '&:hover': { backgroundColor: '#ff22223d' } }} onClick={handleClearAdjustment} disabled={percentageAdjustment === 0}>
                    <ClearRoundedIcon color='error' size='small' />
                </IconButton>

                <Button color='warning' variant='contained' sx={{ fontSize: '10px', fontWeight: '700' }}
                    onClick={handleRestoreDefaults} disabled={!originalValues} >
                    Restaurar Valores Predeterminados
                </Button>
            </div>

            <form>
                {selectedDirections?.map((direction, idx) => (
                    <div key={direction.id} className={style.divEditMassive}>
                        <h2>{direction.name}</h2>
                        <div key={direction.id} className={style.divMapEditMassive}>
                            <label>Precio para {direction.name} <strong>$</strong> </label>
                            <input
                                type="number"
                                value={direction.cost}
                                onChange={(e) => handlePriceChange(direction.id, e.target.value)}
                            />
                            <IconButton onClick={() => handleOptionDelete(direction.id, idx)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>

                        <IconButton onClick={() => handleOptionAdd(direction.id)} disabled>
                            <AddIcon />
                        </IconButton>
                    </div>
                ))}
            </form>
            <button className={style.btnConfirmMassiveEdition} type="button" onClick={handleSubmit}>
                Guardar cambios
            </button>

            {isLoading ? (
                <div className={style.waitingAllChanges}>
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
