import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext';
import { Fab, useMediaQuery } from '@mui/material';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import './CartWidget.css'; // Asegúrate de importar tu archivo de estilos CSS
import { useTheme } from '../../context/ThemeSwitchContext';

const CartWidget = () => {
  const { cart } = useCart();
  const isSmallScreen = useMediaQuery('(max-width:650px)');
  const [animate, setAnimate] = useState(false);

// darkmode
  const {isDarkMode} = useTheme();
  const className = isDarkMode ? 'dark-mode' : '';

  useEffect(() => {
    // Si cart.length cambia, activa la animación
    setAnimate(true);

    // Desactiva la animación después de 400 milisegundos (ajusta según tus preferencias)
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [cart]);

  return (
    <Fab
      size="large"
      className={`boton-abrircarrito ${(animate ? 'expandir' : '')} ${className}`}
      aria-label="add"
      sx={{
        position: isSmallScreen ? 'fixed' : 'relative',
        // color: isSmallScreen ? '#196519' : '#a00303',
        // backgroundColor:isDarkMode ? 'transparent':'white',
      }}
    >
      {cart && cart.length !== 0 ? (
        <ShoppingCartCheckoutIcon />
      ) : (
        <ShoppingCartTwoToneIcon />
      )}
      <p className="contadorCarrito"> {cart ? cart.length : 0} </p>
    </Fab>
  );
};

export default CartWidget;