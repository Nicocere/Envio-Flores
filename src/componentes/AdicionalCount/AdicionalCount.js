import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCart } from '../../context/CartContext';
import { Button } from '@mui/material';
import { useCookies } from '../../context/CookieContext';
const MySwal = withReactContent(Swal);

const AdicionalCount = ({ optionsSelected, img, adicional }) => {
    const { setCart, priceDolar, dolar } = useCart();
    const { CartID, UserID } = useCookies();

    const agregarAlCarrito = async () => {
        try {
            // Para cada opción seleccionada, crear un objeto de producto
            const payload = optionsSelected.map(option => ({
                id: option.id,
                size: option.size,
                precio: option.precio,
                name: adicional.nombre,
                img: img,
                quantity: 1,
                descr: adicional.descr,
                adicional: true,
                CartID: CartID,
                UserID: UserID
            }));

            // Actualizar carrito validando si el producto ya existe
            setCart(prevCart => {
                const updatedCart = [...prevCart];
                const addedItems = [];
                const incrementedItems = [];

                for (const item of payload) {
                    // Buscar si el producto ya existe en el carrito
                    const existingItemIndex = updatedCart.findIndex(
                        cartItem => 
                            cartItem.id === item.id && 
                            cartItem.size === item.size && 
                            cartItem.adicional === true
                    );
                    
                    if (existingItemIndex !== -1) {
                        // Si existe, incrementar cantidad
                        updatedCart[existingItemIndex].quantity += 1;
                        incrementedItems.push({...item, newQuantity: updatedCart[existingItemIndex].quantity});
                    } else {
                        // Si no existe, agregar como nuevo
                        updatedCart.push(item);
                        addedItems.push(item);
                    }
                }
                
                // Guardar en localStorage
                localStorage.setItem('c', JSON.stringify(updatedCart));
                
                // Preparar mensaje para mostrar
                showNotification(addedItems, incrementedItems);
                
                return updatedCart;
            });
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            MySwal.fire({
                toast: true,
                title: "Error",
                text: "No se pudo agregar al carrito. Inténtelo nuevamente.",
                icon: "error",
                position: "bottom-end",
                timer: 3000,
                showConfirmButton: false
            });
        }
    };

    const showNotification = (addedItems, incrementedItems) => {
        let title = '';
        let text = '';

        if (addedItems.length > 0 && incrementedItems.length === 0) {
            // Solo nuevos productos
            title = '<strong>Adicional Agregado</strong>';
            text = formatProductDetails(addedItems);
        } else if (addedItems.length === 0 && incrementedItems.length > 0) {
            // Solo incrementos de cantidad
            title = '<strong>Cantidad Actualizada</strong>';
            text = formatIncrementDetails(incrementedItems);
        } else {
            // Ambos casos
            title = '<strong>Carrito Actualizado</strong>';
            text = `${formatProductDetails(addedItems)}\n${formatIncrementDetails(incrementedItems)}`;
        }

        MySwal.fire({
            toast: true,
            title: title,
            html: text,
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
            position: 'bottom-end',
            background: '#f9fafb',
            iconColor: '#34c38f',
            customClass: {
                title: 'my-title-class',
                content: 'my-content-class'
            }
        });
    };

    const formatProductDetails = (items) => {
        if (items.length === 0) return '';
        return items.map((item) => {
            const priceInUsd = (item.precio / dolar).toFixed(2);
            const displayPrice = priceDolar ? `USD$${priceInUsd}` : `$${item.precio.toLocaleString('es-AR')}`;
            return `${adicional.nombre} (${item.size}) - ${displayPrice}`;
        }).join('<br>');
    };

    const formatIncrementDetails = (items) => {
        if (items.length === 0) return '';
        return items.map((item) => {
            const priceInUsd = (item.precio / dolar).toFixed(2);
            const displayPrice = priceDolar ? `USD$${priceInUsd}` : `$${item.precio.toLocaleString('es-AR')}`;
            return `${adicional.nombre} (${item.size}) - ${displayPrice} <strong>x${item.newQuantity}</strong>`;
        }).join('<br>');
    };

    return (
        <div className='btnAgregarQuitar'>
            <Button 
                variant='contained' 
                size='small' 
                color='success' 
                onClick={agregarAlCarrito}
                disabled={optionsSelected.length === 0}
            >
                Agregar al carrito
            </Button>
        </div>
    );
}

export default AdicionalCount;