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
    const initialSelectedProducts = location.state?.selectedProducts || [];
    const [selectedProducts, setSelectedProducts] = useState(initialSelectedProducts);
    const [percentageAdjustment, setPercentageAdjustment] = useState(0);
    const [originalValues, setOriginalValues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // Almacenar los valores originales cuando se carga la página
        const originalValues = initialSelectedProducts.map((product) => ({
            ...product
        }));
        setOriginalValues(originalValues);
    }, [initialSelectedProducts]);

    const handlePriceChange = (productId, optionIndex, newPrice) => {
        const updatedProducts = selectedProducts.map((product) => {
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
        const updatedProducts = selectedProducts.map((product) => {
            if (product.id === productId) {
                const updatedOptions = product.opciones.filter((option, index) => index !== optionIndex);
                return { ...product, opciones: updatedOptions };
            }
            return product;
        });

        setSelectedProducts(updatedProducts);
    };

    const handleOptionAdd = (productId) => {
        const updatedProducts = selectedProducts.map((product) => {
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
        const adjustedProducts = selectedProducts.map((product) => {
            const adjustedOptions = product.opciones.map((option) => {
                const adjustedPrice = Math.round(option.precio * (1 + percentageAdjustment / 100));
                return { ...option, precio: adjustedPrice };
            });

            return { ...product, opciones: adjustedOptions };
        });

        setSelectedProducts(adjustedProducts);
    };

    const handleClearAdjustment = () => {
        const clearedProducts = selectedProducts.map((product) => {
            const clearedOptions = product.opciones.map((option) => {
                return { ...option, precio: Math.round(option.precio / (1 + percentageAdjustment / 100)) };
            });

            return { ...product, opciones: clearedOptions };
        });

        setSelectedProducts(clearedProducts);
        setPercentageAdjustment(0);
    };

    const handleRestoreDefaults = () => {
        // Restaurar los valores originales almacenados
        if (originalValues) {
            setSelectedProducts(originalValues.map((product) => ({ ...product })));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            for (const updatedProduct of selectedProducts) {
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
                {selectedProducts.map((product, productIndex) => (
                    <div key={product.id} className='div-edit-massive'>
                        <h2>{product.nombre}</h2>
                        {product.opciones.map((option, optionIndex) => (
                            <div key={optionIndex} className='div-mapedit-massive'>
                                <label>Precio para {option.size} <strong>$</strong> </label>
                                <input
                                    type="number"
                                    value={option.precio}
                                    onChange={(e) => handlePriceChange(product.id, optionIndex, e.target.value)}
                                />
                                <IconButton onClick={() => handleOptionDelete(product.id, optionIndex)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                        <IconButton onClick={() => handleOptionAdd(product.id)} disabled>
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
