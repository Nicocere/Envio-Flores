import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ItemCount from '../ItemCount/ItemCount';
import { CartContext } from '../../context/CartContext';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import './Item.css';

// Creamos un div animado con react-spring
const AnimatedDiv = animated.div;

const Item = ({ items }) => {
  // Contextos y estados
  const { dolar, priceDolar } = useContext(CartContext);
  
  // Media queries para responsive usando window.matchMedia
  const isDesktop = window.matchMedia('(min-width: 960px)').matches;
  const isTablet = window.matchMedia('(min-width: 650px) and (max-width: 959px)').matches;
  const isMobile = window.matchMedia('(max-width: 649px)').matches;
  
  
  // Cálculo de precio en dólares
  const dolarPrice = items.opciones[0].precio / dolar;
  const dolarPriceRounded = dolarPrice.toFixed(2);
  
  // Calcular precio con descuento si aplica
  const hasDiscount = items.descuento && items.descuento > 0;
  const originalPrice = items.opciones[0].precio;
  const discountedPrice = hasDiscount 
    ? Math.round(originalPrice - (originalPrice * (items.descuento / 100)))
    : originalPrice;

  // Animación de aparición con react-intersection-observer
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    config: { mass: 1, tension: 280, friction: 18 }
  });

  // Función que será usada por ItemCount (vacía pero definida para evitar error)
  const handleAddToCart = () => {
    // Esta función se pasa a ItemCount pero se implementa allí
  };

  // Verificar si tiene descuento o es nuevo
  const isNewProduct = items.nuevo;

  return (
    <AnimatedDiv
      ref={ref}
      style={animation}
      className={`item-card ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}
    >
      {/* Imagen del producto */}
      <Link to={`/detail/${items.id}`} className="item-image-container">
        <img 
          src={items.opciones[0].img || items.img} 
          alt={items.nombre}
          className="item-image"
          loading="lazy"
        />
        
        {/* Overlay para hover */}
        <div className="item-image-overlay">
          <span className="view-details-text">Ver detalles</span>
        </div>
        
        {/* Badges para nuevo o descuento */}
        <div className="item-badges">
          {isNewProduct && (
            <span className="item-badge new">Nuevo</span>
          )}
          {hasDiscount && (
            <span className="item-badge discount">-{items.descuento}%</span>
          )}
        </div>
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="item-content">
        {/* Encabezado: título y precio */}
        <div className="item-header">
          <h3 className="item-title">
            <Link to={`/detail/${items.id}`} className="item-title-link">
              {items.nombre}
            </Link>
          </h3>
          
          {/* Mostrar precio con formato apropiado */}
          <div className="item-price-container">
            {hasDiscount && (
              <span className="item-price-original">
                ${originalPrice.toLocaleString('es-AR')}
              </span>
            )}
            
            <span className="item-price">
              {priceDolar 
                ? `USD$ ${dolarPriceRounded}` 
                : `$${(hasDiscount ? discountedPrice : originalPrice).toLocaleString('es-AR')}`
              }
            </span>
          </div>
        </div>

        {/* Detalles del producto */}
        <div className="item-details">
          <div className="detail-row">
            <span className="detail-icon size-icon"></span>
            <span className="detail-text">
              Tamaño: <span className="detail-value">{items.opciones[0].size}</span>
            </span>
          </div>
          
          {items.categoria && items.categoria.length > 0 && (
            <div className="detail-row">
              <span className="detail-icon flower-icon"></span>
              <span className="detail-text">
                <span className="detail-value">{items.categoria[0]}</span>
              </span>
            </div>
          )}
        </div>

        {/* Separador */}
        <hr className="item-divider" />
        
        {/* Acciones */}
        <div className="item-actions">
          {/* Contador de productos */}
          <div className="item-count-container">
            <ItemCount
              idProd={items.id}
              optionSize={items.opciones[0].size}
              optionPrecio={hasDiscount ? discountedPrice : originalPrice}
              optionImg={items.opciones[0].img}
              item={items}
              onAdd={handleAddToCart}
              isMobile={isMobile}
            />
          </div>
          
          {/* Botón Ver más opciones */}
          {items.opciones.length > 1 && (
            <div className="view-more-container">
              <Link to={`/detail/${items.id}`} className="view-more-button">
                {isDesktop ? 'Ver opciones' : 'Ver más'}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Versión móvil: botón de acción rápida */}
      {isMobile && (
        <Link to={`/detail/${items.id}`} className="mobile-action-button">
          <span className="mobile-action-icon"></span>
        </Link>
      )}
    </AnimatedDiv>
  );
};

export default Item;