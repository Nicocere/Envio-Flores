import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import { Button, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Swal from 'sweetalert2';
import { FadeLoader } from 'react-spinners';

function MassiveEdition() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialSelectedDirections = location.state?.selectedDirections || [];
    const [selectedDirections, setSelectedDirections] = useState(initialSelectedDirections);
    const [percentageAdjustment, setPercentageAdjustment] = useState(0);
    const [originalValues, setOriginalValues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Almacenar los valores originales cuando se carga la página
        const originalValues = initialSelectedDirections.map((direc) => ({
            ...direc
        }));
        setOriginalValues(originalValues);
    }, [initialSelectedDirections]);

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
                navigate('/administrador/directions');
            });
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            Swal.fire('Error al guardar cambios', '', 'error');
        }
    };
    

    return (
        <div className='div-massiveEdit'>
            <div className='div-porcentaje'>
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
                    <div key={direction.id} className='div-edit-massive'>
                        <h2>{direction.name}</h2>
                        <div key={direction.id} className='div-mapedit-massive'>
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
            <button className='btn-confirm-massiveEdition' type="button" onClick={handleSubmit}>
                Guardar cambios
            </button>

            {isLoading ? (
                <div className="waiting-all-changes">
                    Cambiando todos los precios, espere...
                    <FadeLoader color="darkgreen" />
                </div>
            ) : (
                null
            )}
        </div>
    );
}

export default MassiveEdition;
