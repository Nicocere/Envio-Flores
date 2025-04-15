"use client";   
import React, { useEffect, useState } from 'react';
import ItemCount from '../ItemCount/ItemCount';
import styles from './ItemDetail.module.css';
import { useCart } from '../../context/CartContext';
import AdicionalListContainer from '../AdicionalListContainer/AdicionalListContainer';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';

// Material UI
import { Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

import useMediaQuery from '@mui/material/useMediaQuery';
import Categorization from '../Categories/Categorizacion';
import { useTheme } from '../../context/ThemeSwitchContext';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { useRouter } from 'next/navigation';

const ItemDetail = ({ item, prodId }) => {

  console.log("ItemDetail", item, prodId);

  const navigate = useRouter();
  const { cantidadProducto, dolar, priceDolar, rose_unit } = useCart();
  const [tipoProductoSeleccionado, setTipoProductoSeleccionado] = useState("");
  const [optionID, setOptionID] = useState('');
  const [precioTotal, setPrecioTotal] = useState(0);
  const [cantidadRosas, setCantidadRosas] = useState("");
  const prodOptions = item.opciones;
  const [showManualAdd, setShowManualAdd] = useState(true);
  const quantity = cantidadProducto(prodId);
  const [selectedOption, setSelectedOption] = useState(0); // Seleccionar la primera opción por defecto
  const [activeImage, setActiveImage] = useState(false);
  const [colorProducto, setColorProducto] = useState("Rojo");
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showMixedOptions, setShowMixedOptions] = useState(false);
  const [mixedColors, setMixedColors] = useState({
    Rojo: 0,
    Rosa: 0,
    Amarillo: 0,
    Blanco: 0
  });

  const { isDarkMode } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:855px)');
  const isMobileScreen = useMediaQuery('(max-width:480px)');

  const [costos, setCostos] = useState([]);
  const [costosCanasta, setCostosCanasta] = useState(0);
  const [costosFlorero, setCostosFlorero] = useState(0);

  // Variantes para animaciones
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const scaleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  // Precios y configuraciones
  const precioTotalEnUsd = (precioTotal / dolar).toFixed(2);

  useEffect(() => {
    const fetchCosts = async () => {
      const costosRef = collection(baseDeDatos, 'costos');
      const costosSnapShot = await getDocs(costosRef);
      const costosData = [];
      costosSnapShot.forEach((doc) => {
        costosData.push({ id: doc.id, ...doc.data() });
      });
      setCostos(costosData);
    };

    fetchCosts();
  }, []);

  const cambioProducto = costos.filter(cost => cost.categoria?.includes("cambioProducto") || []);

  useEffect(() => {
    cambioProducto.forEach((costo) => {
      if (costo.nombre === "Canasta") {
        setCostosCanasta(costo.precio);
      }
      if (costo.nombre === "Florero") {
        setCostosFlorero(costo.precio);
      }
    });
  }, [costos]);

  // Opciones disponibles por tipo de producto
  const opcionesDisponiblesPorTipo = {
    Florero: ['Canasta'],
    Ramo: ['Florero', 'Canasta'],
    Caja: [],
    Canasta: [],
    Arreglo: [],
    Especiales: []
  };

  const preciosProductos = {
    Arreglo: 1000,
    Ramo: 1000,
    Florero: costosFlorero || 19990,
    Canasta: item.tipo === 'Florero' ? 0 : costosCanasta || 19990,
    Caja: 18990,
  };

  // Manejo de eventos
  const toggleImageSize = () => {
    setActiveImage(!activeImage);
  };

  const handleChangeRosas = (e) => {
    let cantidad = e.target.value;

    // Verificar límites
    if (parseInt(cantidad) > 50) {
      Swal.fire({
        icon: 'error',
        title: 'Máximo 50 rosas',
        text: 'No puedes agregar más de 50 rosas por producto.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDarkMode ? '#333' : '#fff',
        iconColor: '#a30000',
      });
      cantidad = "50";
    }

    setCantidadRosas(cantidad);
    actualizarPrecioTotal(cantidad);
  };

  const handleTipoProducto = (e) => {
    const nombre = e.target.value;
    setTipoProductoSeleccionado(nombre);
    actualizarPrecioTotal(cantidadRosas, nombre);
  };

  const handleChangeColor = (e) => {
    const color = e.target.value;
    setColorProducto(color);

    if (color === "Mixto") {
      setShowMixedOptions(true);
      // Precio adicional para rosas mixtas
      actualizarPrecioTotal(cantidadRosas, tipoProductoSeleccionado, true);
    } else {
      setShowMixedOptions(false);
      actualizarPrecioTotal(cantidadRosas, tipoProductoSeleccionado);
    }
  };

  const handleMixedColorChange = (color, value) => {
    const valorNumerico = parseInt(value) || 0;

    // Validar que la suma no exceda el total de rosas
    const nuevosMixedColors = {
      ...mixedColors,
      [color]: valorNumerico
    };

    const suma = Object.values(nuevosMixedColors).reduce((a, b) => a + b, 0);

    if (suma <= cantidadRosas) {
      setMixedColors(nuevosMixedColors);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad excedida',
        text: `La suma de colores no puede ser mayor a ${cantidadRosas} rosas`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        background: isDarkMode ? '#333' : '#fff',
        iconColor: '#a30000',
      });
    }
  };

  const actualizarPrecioTotal = (cantidad, tipoSeleccionado, mixto = colorProducto === "Mixto") => {
    if (!cantidad) return;

    const cantidadNum = parseInt(cantidad) || 0;
    const tipoActual = tipoSeleccionado || tipoProductoSeleccionado;
    const precioTipoSeleccionado = preciosProductos[tipoActual] || 0;

    let precio = cantidadNum * rose_unit;

    // Añadir costo adicional si se cambia el tipo de producto
    if (tipoActual && tipoActual !== item.tipo) {
      precio += precioTipoSeleccionado;
    }

    // Añadir costo adicional para rosas mixtas
    if (mixto) {
      precio += 1500; // Precio adicional por elegir mixto
    }

    setPrecioTotal(precio);
  };

  const handleChangeRadio = (event) => {
    const index = parseInt(event.target.value);
    setSelectedOption(index);
  };

  // Generación de ID único para opciones
  useEffect(() => {
    function generateUniqueId() {
      const randomNum = Math.floor(Math.random() * 100000);
      const paddedNum = String(randomNum).padStart(5, '0');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomChar1 = chars.charAt(Math.floor(Math.random() * chars.length));
      const randomChar2 = chars.charAt(Math.floor(Math.random() * chars.length));
      return randomChar1 + randomChar2 + paddedNum;
    }

    setOptionID(generateUniqueId());
  }, [cantidadRosas]);

  // Control de visualización de opciones manuales
  useEffect(() => {
    if (item.categoria?.[0]?.includes("Especiales")) {
      setShowManualAdd(false);
    } else if (item.categoria?.[0]?.includes("Rosas")) {
      setShowManualAdd(true);
      setShowColorOptions(true);
    } else {
      setShowManualAdd(false);
      setShowColorOptions(false);
    }
  }, [item.categoria]);

  // Componente para mostrar la opción seleccionada
  const SelectedOptionDisplay = () => {
    const option = prodOptions[selectedOption];
    const dolarPrice = (option.precio / dolar).toFixed(2);

    return (
      <motion.div
        className={`${styles.selectedOptionContainer} ${isDarkMode ? styles.dark : styles.light}`}
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
      >
        <h3 className={styles.optionTitle}>
          Opción {selectedOption + 1}: <span>{option.size}</span>
        </h3>

        <div className={styles.productImageContainer}>
          <motion.img
            src={option.img || item.img}
            alt={item.nombre}
            className={activeImage ? styles.productImageZoomed : styles.productImage}
            onClick={toggleImageSize}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
          <div className={styles.imageOverlay} onClick={toggleImageSize}>
            <span>{activeImage ? 'Reducir' : 'Ampliar'}</span>
          </div>
        </div>

        <div className={styles.productPriceContainer}>
          <span className={styles.priceLabel}>Precio:</span>
          <span className={styles.price}>
            {priceDolar
              ? <span>USD <strong>${dolarPrice}</strong></span>
              : <span>$ <strong>{option.precio.toLocaleString('es-AR')}</strong></span>
            }
          </span>
        </div>

        <div className={styles.addToCartSection}>
          <ItemCount
            idProd={prodId}
            optionSize={option.size}
            optionPrecio={option.precio}
            optionImg={option.img}
            item={item}
            quantity={quantity}
            stock={5}
            detail={true}
            colorOption={colorProducto}
          />
        </div>
      </motion.div>
    );
  };

  return (

      <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}>
        <motion.div
          className={styles.navigationBar}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className={styles.backButton}
            onClick={() => navigate.back(-1)}
          >
            <ArrowBackIcon fontSize="small" /> Volver
          </button>

          <Categorization name={item.nombre} className={styles.categorization} />
        </motion.div>

        <motion.div
          className={styles.productHeader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className={styles.productTitle}>{item.nombre}</h1>

          {item.vendidos > 10 && (
            <div className={styles.popularBadge}>
              <ShoppingCartIcon fontSize="small" />
              <span>Vendido {item.vendidos} veces</span>
            </div>
          )}
        </motion.div>

        <div className={styles.productContent}>
          <div className={styles.productMainContent}>
            {/* Columna izquierda: Imagen y detalles principales */}
            <div className={styles.productImageSection}>
              <SelectedOptionDisplay />
            </div>

            {/* Columna derecha: Opciones y selecciones */}
            <div className={styles.productOptionsSection}>
              <motion.div
                className={styles.optionsContainer}
                initial="hidden"
                animate="visible"
                variants={scaleVariants}
              >
                <h3 className={styles.sectionTitle}>Elige tu presentación</h3>

                <div className={styles.productOptions}>
                  {prodOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      className={`${styles.optionCard} ${selectedOption === index ? styles.optionCardSelected : ''}`}
                      onClick={() => setSelectedOption(index)}
                      whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className={styles.optionImageContainer}>
                        <img
                          src={option.img}
                          alt={`${item.nombre} ${option.size}`}
                          className={styles.optionImage}
                        />
                        {selectedOption === index && (
                          <div className={styles.selectedIndicator}></div>
                        )}
                      </div>
                      <div className={styles.optionInfo}>
                        <span className={styles.optionSize}>{option.size}</span>
                        <span className={styles.optionPrice}>
                          {priceDolar
                            ? `USD $${(option.precio / dolar).toFixed(2)}`
                            : `$ ${option.precio.toLocaleString('es-AR')}`
                          }
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Color options */}
                {showColorOptions && (
                  <motion.div
                    className={styles.colorOptions}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className={styles.sectionTitle}>
                      <ColorLensIcon /> Elige el color
                    </h3>

                    <div className={styles.colorSelectionGrid}>
                      {["Rojo", "Rosa", "Amarillo", "Blanco", "Mixto"].map((color) => (
                        <div
                          key={color}
                          className={`${styles.colorOption} ${colorProducto === color ? styles.colorOptionSelected : ''}`}
                          onClick={() => {
                            setColorProducto(color);
                            setShowMixedOptions(color === "Mixto");
                            actualizarPrecioTotal(cantidadRosas, tipoProductoSeleccionado, color === "Mixto");
                          }}
                        >
                          <div
                            className={styles.colorSwatch}
                            style={{
                              backgroundColor:
                                color === "Rojo" ? "#e91e63" :
                                  color === "Rosa" ? "#f48fb1" :
                                    color === "Amarillo" ? "#ffc107" :
                                      color === "Blanco" ? "#f5f5f5" :
                                        "linear-gradient(45deg, #e91e63, #f48fb1, #ffc107, #f5f5f5)"
                            }}
                          ></div>
                          <span>{color}</span>
                        </div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {showMixedOptions && (
                        <motion.div
                          className={styles.mixedColorsContainer}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4>Elige la cantidad de cada color</h4>
                          <div className={styles.mixedColorInputs}>
                            {Object.keys(mixedColors).map(color => (
                              <div key={color} className={styles.mixedColorInput}>
                                <label>{color}</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={mixedColors[color]}
                                  onChange={(e) => handleMixedColorChange(color, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                          <div className={styles.mixedColorTotal}>
                            <span>Total: {Object.values(mixedColors).reduce((a, b) => a + b, 0)} rosas</span>
                            {cantidadRosas && (
                              <span>
                                De {cantidadRosas} rosas
                                {Object.values(mixedColors).reduce((a, b) => a + b, 0) < parseInt(cantidadRosas) && (
                                  <span className={styles.warning}>
                                    (faltan {parseInt(cantidadRosas) - Object.values(mixedColors).reduce((a, b) => a + b, 0)})
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Manual add roses */}
                {showManualAdd && (
                  <motion.div
                    className={styles.manualAddSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className={styles.sectionTitle}>
                      <LocalFloristIcon /> Personaliza tu arreglo
                    </h3>

                    <div className={styles.manualAddContent}>
                      <div className={styles.rosesInputContainer}>
                        <label htmlFor="rosesQuantity">Cantidad de rosas:</label>
                        <input
                          id="rosesQuantity"
                          type="number"
                          value={cantidadRosas}
                          onChange={handleChangeRosas}
                          min="1"
                          max="50"
                          className={styles.rosesInput}
                        />
                      </div>

                      {cantidadRosas && (
                        <motion.div
                          className={styles.styleOptionsContainer}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4>Selecciona el estilo:</h4>

                          <div className={styles.styleOptions}>
                            {Object.entries(preciosProductos).map(([tipo, precio]) => {
                              // Solo mostrar opciones válidas para este tipo de producto
                              if (opcionesDisponiblesPorTipo[item.tipo]?.includes(tipo) || tipo === item.tipo) {
                                const isOriginalType = tipo === item.tipo;

                                return (
                                  <div
                                    key={tipo}
                                    className={`
                                      ${styles.styleOption}
                                      ${tipoProductoSeleccionado === tipo ? styles.styleOptionSelected : ''}
                                      ${isOriginalType ? styles.originalStyleOption : ''}
                                    `}
                                    onClick={() => {
                                      setTipoProductoSeleccionado(tipo);
                                      actualizarPrecioTotal(cantidadRosas, tipo);
                                    }}
                                  >
                                    <div className={styles.styleOptionRadio}>
                                      <div className={styles.radioCircle}>
                                        {tipoProductoSeleccionado === tipo && (
                                          <div className={styles.radioSelected}></div>
                                        )}
                                      </div>
                                    </div>

                                    <div className={styles.styleOptionInfo}>
                                      <span className={styles.styleOptionName}>
                                        {isOriginalType ? 'Original' : ''} {tipo}
                                      </span>
                                      {!isOriginalType && (
                                        <span className={styles.styleOptionPrice}>
                                          +${precio.toLocaleString('es-AR')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </motion.div>
                      )}

                      {cantidadRosas && tipoProductoSeleccionado && (
                        <motion.div
                          className={styles.customSummary}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.customSummaryHeader}>
                            <h4>Resumen de tu selección</h4>
                          </div>

                          <div className={styles.customSummaryContent}>
                            <div className={styles.summaryItem}>
                              <span>Rosas:</span>
                              <strong>{cantidadRosas}</strong>
                            </div>

                            <div className={styles.summaryItem}>
                              <span>Estilo:</span>
                              <strong>{tipoProductoSeleccionado}</strong>
                            </div>

                            <div className={styles.summaryItem}>
                              <span>Color:</span>
                              <strong>{colorProducto}</strong>
                            </div>

                            <div className={styles.summaryTotal}>
                              <span>Total:</span>
                              <strong>
                                {priceDolar
                                  ? `USD $${precioTotalEnUsd}`
                                  : `$ ${precioTotal.toLocaleString('es-AR')}`
                                }
                              </strong>
                            </div>
                          </div>

                          <div className={styles.customAddToCart}>
                            <ItemCount
                              idProd={prodId}
                              optionSize={`${cantidadRosas} Rosas`}
                              optionPrecio={precioTotal}
                              optionId={optionID}
                              item={item}
                              nameOptionalSize={`${tipoProductoSeleccionado} de ${cantidadRosas} Rosas`}
                              quantity={quantity}
                              colorOption={colorProducto}
                              mixedColors={colorProducto === "Mixto" ? mixedColors : null}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Product details & description */}
          <motion.div
            className={styles.productDetails}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className={styles.descriptionContainer}>
              <h3 className={styles.descriptionTitle}>Descripción</h3>
              <p className={styles.descriptionText}>{item.descr}</p>
            </div>

            <div className={styles.categoriesContainer}>
              <h3 className={styles.categoriesTitle}>Categorías</h3>
              <div className={styles.categoriesList}>
                {item.categoria?.map((category, idx) => (
                  <Chip
                    key={idx}
                    label={category}
                    className={styles.categoryChip}
                    size={isMobileScreen ? "small" : "medium"}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Adicionales section */}
        <motion.div
          className={styles.adicionalesSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className={styles.adicionalesTitle}>
            <AddCircleIcon /> Complementa tu regalo
          </h2>
          <AdicionalListContainer />
        </motion.div>
      </div>

  );
};

export default ItemDetail;