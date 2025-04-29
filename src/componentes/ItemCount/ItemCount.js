import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Button, useMediaQuery } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { green } from '@mui/material/colors';
import { useCookies } from '../../context/CookieContext';
import { useTheme } from '@/context/ThemeSwitchContext';
import Swal from 'sweetalert2';


const ItemCount = ({ idProd, optionSize, optionPrecio,
  optionImg, item, nameOptionalSize, quantity, stock, initial = 1, detail, topProducts}) => {

  const [count, setCount] = useState(initial);
  const { cart, setCart, priceDolar, dolar } = useCart();

  const { CartID, UserID } = useCookies();

  const {isDarkMode} = useTheme();
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
Swal.fire({
  toast: true,
  title: `<strong>Producto Agregado</strong>`,
  text: `${nameOptionalSize || item.nombre} (${optionSize}) - ${displayPrice}`,
  icon: 'success',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  position: 'bottom-end',
  background: isDarkMode ? 'var(--background-dark)' : 'var(--background-light)',
  iconColor: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)',
  confirmButtonColor: isDarkMode ? 'var(--primary-light)' : 'var(--primary-color)',
  color: isDarkMode ? 'var(--text-light)' : 'var(--text-dark)',
  showClass: {
    popup: 'animate__animated animate__fadeInUp animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutDown animate__faster'
  },
  customClass: {
    title: 'swal-title',
    popup: `swal-popup ${isDarkMode ? 'swal-dark-mode' : ''}`,
    content: 'swal-content',
    container: 'swal-container'
  },
  footer: `<button id="redirectButton" class="swal-cart-button ${isDarkMode ? 'swal-cart-button-dark' : ''}">VER CARRITO</button>`
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
        fontFamily:'"Nexa", sans-serif !important',
        width: detail ? '50%':'100%',
        fontSize: isSmallScreen ? '11.55px' : '13.24px',
        fontWeight: isSmallScreen && '700',
        transition: 'all 0.4s ease-in-out !important',
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
