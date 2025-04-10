import React, { useState, useEffect, useContext } from 'react';
import { CartContext, useCart } from '../../context/CartContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, useMediaQuery } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { CookieContext, useCookies } from '../../context/CookieContext';

const MySwal = withReactContent(Swal);

const ItemCount = ({ idProd, optionSize, optionPrecio,
  optionImg, item, nameOptionalSize, quantity, stock, initial = 1, detail, topProducts}) => {

  const [count, setCount] = useState(initial);
  const { cart, setCart, priceDolar, dolar } = useCart();

  const { CartID, UserID } = useCookies();

  const isSmallScreen = useMediaQuery('(max-width:850px)');
  const isMobileSmallScreen = useMediaQuery('(max-width:650px)');

  const [animate, setAnimate] = useState(false);
 
  useEffect(() => {
    // Si cart.length cambia, activa la animación
    setAnimate(true);

    // Desactiva la animación después de 400 milisegundos (ajusta según tus preferencias)
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [idProd, optionSize, optionPrecio]);


  const agregarAlCarrito = async () => {
    try {

      // Guardar producto en el estado y localStorage
      const newProduct = {
        id: idProd,
        size: optionSize,
        precio: optionPrecio,
        name: nameOptionalSize || item.nombre,
        img: optionImg || item.img,
        item: item,
        quantity: count,
        CartID: CartID,
        UserID: UserID
      };

      const existingProductIndex = cart?.findIndex((product) => {

        return (
          product?.name.toString() === newProduct?.name.toString() &&
          product?.size === newProduct.size && product?.precio === newProduct.precio
        );
      });


      let updatedCart;

      if (existingProductIndex !== -1) {
        // Si el producto ya existe en el carrito y es del mismo tamaño, incrementa su cantidad
        updatedCart = [...cart];
        updatedCart[existingProductIndex].quantity += newProduct.quantity;
      } else {
        // Si el producto no está en el carrito o es de un tamaño diferente, lo añade al carrito
        updatedCart = [...cart, newProduct];
      }

      // Actualiza el carrito en el estado y en localStorage
      setCart(updatedCart);
      localStorage.setItem('c', JSON.stringify(updatedCart));


      const priceInUsd = (optionPrecio / dolar).toFixed(2)
      const displayPrice = priceDolar ? `USD$${priceInUsd}` : `$${Number(optionPrecio).toLocaleString('es-AR')}`;

      // SweetAlert2
      MySwal.fire({
        toast: true, // Activamos el modo "toast"
        title: `<strong>Producto Agregado</strong>`,
        text: `${nameOptionalSize || item.nombre} (${optionSize}) - ${displayPrice}`, // Aquí agregamos el nombre, tamaño y precio
        icon: 'success',
        showConfirmButton: false,
        timer: 2500, // Duración de 3 segundos
        position: 'bottom-end', // Posición inferior derecha
        background: '#f9fafb', // Un fondo más claro
        iconColor: '#045400', // Color de icono
        confirmButtonColor: '#045400', // Color del botón de confirmación
        customClass: {
          title: 'my-title-class',
          popup: 'my-popup-class',
          content: 'my-content-class',
        },
        // Agrega un botón en el footer
        footer: ` <button id="redirectButton" class="swal2-confirm swal2-styled" style="background-color: #045400; padding: 5px 15px1;">
        VER CARRITO</button>`
      });

      // Escucha el clic en el botón y redirige al carrito
      document.getElementById('redirectButton').addEventListener('click', function () {
        window.location.href = '/cart';
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setCount(initial);
  }, [initial]);

  return (
    <div className='btnAgregarQuitar'>

      <Button sx={{
        margin: (detail&& !isMobileSmallScreen )&& '10px 0 20px',
        color: 'white',
        background:'#670000' ,
        fontFamily:'"Jost", sans-serif !important',
        width: detail ? '50%':'100%',
        fontSize: isSmallScreen ? '11.55px' : '13.24px',
        fontWeight: isSmallScreen && '700',
        // fontSize: isSmallScreen && (detail ? '10px' : '8px'),
        '&:hover': {
          background: green[900],
          color:'white',
        },
      }} onClick={agregarAlCarrito} variant='contained' //className="agregarAlCarrito"       
      className={`agregarAlCarrito ${animate ? 'expandBtnAddCarrito' : ''}`}
      >
        {isMobileSmallScreen ? (detail ? 'Agregar al Carrito' : (topProducts ? 'Agregar Producto' : 'Agregar')) : (topProducts ? 'Agregar Producto' : 'Agregar al Carrito')}


        <AddShoppingCartIcon sx={{ fontSize: isMobileSmallScreen && '25px' }} />
      </Button>


    </div>
  );
}

export default ItemCount;
