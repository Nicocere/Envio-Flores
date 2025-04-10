import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CartContext, useCart } from '../../context/CartContext';
import { Button } from '@mui/material';
import { CookieContext, useCookies } from '../../context/CookieContext';
const MySwal = withReactContent(Swal);

const AdicionalCount = ({ adicId, optionsSelected, img, adicional, stock }) => {

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


            // Agregar cada producto adicional al carrito
            for (const item of payload) {
                setCart(prevCart => {
                    const updatedCart = [...prevCart, item];
                    localStorage.setItem('c', JSON.stringify(updatedCart));
                    return updatedCart;
                });
            }

            const detailsText = payload.map((item) => {
                const priceInUsd = (item.precio / dolar).toFixed(2);
                const displayPrice = priceDolar ? `USD$${priceInUsd}` : `$${item.precio.toLocaleString('es-AR')}`;
                return `( ${item.size} ) - ${displayPrice}`;
            }).join(', ');


            // SweetAlert2 Toast
            MySwal.fire({
                toast: true, // Activamos el modo "toast"
                title: `<strong>Adicional Agregado</strong>`,
                text: `${adicional.nombre} ${detailsText}`, // Aquí agregamos el nombre, tamaño y precio
                icon: 'success',
                showConfirmButton: false,
                timer: 2500, // Duración de 3 segundos
                position: 'bottom-end', // Posición inferior derecha
                background: '#f9fafb', // Un fondo más claro
                iconColor: '#34c38f', // Color de icono
                customClass: {
                    title: 'my-title-class',
                    content: 'my-content-class'
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='btnAgregarQuitar'>
            <Button variant='contained' size='small' color='success' onClick={agregarAlCarrito} > Agregar al carrito</Button>
        </div>
    );
}

export default AdicionalCount;
