"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartHome.module.css';
import { useTheme } from '@/context/ThemeSwitchContext';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart, FaChevronUp, FaChevronDown, FaTrashAlt } from 'react-icons/fa';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import { RiFlowerFill } from 'react-icons/ri';

export default function CartHome() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const {
    cart,
    eliminarProd,
    totalPrecio,
    cantidadProducto,
    setCart,
    dolar,
    priceDolar
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Calcular el total de productos
    if (!cart) return;
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setTotalItems(count);
  }, [cart]);

  // No mostrar nada si el carrito está vacío
  if (!cart || cart.length === 0) return null;

  const toggleCart = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push('/cart');
  };

  const incrementQuantity = (product) => {
    const updatedCart = cart.map((item) => {
      if (item.id === product.id && item.size === product.size) {
        return {
          ...item,
          quantity: (item.quantity || 1) + 1
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decrementQuantity = (product) => {
    if ((product.quantity || 1) <= 1) {
      handleRemoveProduct(product);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.id === product.id && item.size === product.size) {
        return {
          ...item,
          quantity: (item.quantity || 1) - 1
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleRemoveProduct = (product) => {
    eliminarProd(product.name, product.size, product.precio);
  };

  // Formatear precio según moneda
  const formatPrice = (price) => {
    return priceDolar 
      ? `USD $${parseFloat(price).toFixed(2)}` 
      : `$${parseFloat(price).toFixed(2)}`;
  };

  const calculateItemPrice = (item) => {
    const quantity = item.quantity || 1;
    const basePrice = item.precio;
    
    // Aplicar descuento si existe
    if (item.promocion && item.promocion.status && item.promocion.descuento > 0) {
      const discountRate = item.promocion.descuento / 100;
      return basePrice * quantity * (1 - discountRate);
    }
    
    return basePrice * quantity;
  };

  return (
    <>
      <motion.div 
        className={`${styles.cartBar} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className={styles.cartBarContent}>
          <button 
            className={styles.cartToggleButton}
            onClick={toggleCart}
            aria-label={isOpen ? "Cerrar carrito" : "Abrir carrito"}
          >
            <div className={styles.cartIcon}>
              <FaShoppingCart />
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
            </div>
            <div className={styles.cartSummary}>
              <span>Tu pedido</span>
              <span className={styles.cartTotal}>{formatPrice(totalPrecio())}</span>
            </div>
            <div className={styles.chevronIcon}>
              {isOpen ? <FaChevronDown /> : <FaChevronUp />}
            </div>
          </button>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`${styles.cartPanel} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={styles.cartPanelHeader}>
              <h2>
                <FaShoppingCart className={styles.headerIcon} />
                Tu pedido ({totalItems})
              </h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar carrito"
              >
                <FaChevronDown />
              </button>
            </div>
            
            <div className={styles.cartItems}>
              {cart.map((product, index) => (
                <motion.div 
                  key={`${product.id}-${product.size}-${index}`}
                  className={styles.cartItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.productImage}>
                    {product.img ? (
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        width={60} 
                        height={60} 
                        className={styles.productImg}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <RiFlowerFill />
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    {product.size && <p className={styles.productSize}>Tamaño: {product.size}</p>}
                    {product.promocion?.status && product.promocion?.descuento > 0 && (
                      <p className={styles.productDiscount}>
                        {product.promocion.descuento}% OFF
                      </p>
                    )}
                    <p className={styles.productPrice}>
                      {formatPrice(calculateItemPrice(product))}
                    </p>
                  </div>
                  <div className={styles.productControls}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => decrementQuantity(product)}
                        aria-label="Disminuir cantidad"
                      >
                        <IoMdRemove />
                      </button>
                      <span className={styles.quantityDisplay}>{product.quantity || 1}</span>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => incrementQuantity(product)}
                        aria-label="Aumentar cantidad"
                      >
                        <IoMdAdd />
                      </button>
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveProduct(product)}
                      aria-label="Eliminar producto"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span className={styles.total}>Total</span>
                <span className={styles.totalAmount}>{formatPrice(totalPrecio())}</span>
              </div>
              <button 
                className={styles.viewCartButton}
                onClick={handleViewCart}
              >
                Ver pedido completo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}