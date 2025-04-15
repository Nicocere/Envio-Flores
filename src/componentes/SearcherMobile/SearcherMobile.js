import React, { useState, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import './searcherMobile.css';
import { 
  IconButton, 
  Paper, 
  Typography, 
  InputBase, 
  Box, 
  Card,
  CardMedia,
  CardContent,
  Chip
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeSwitchContext';
import Link from 'next/link';
import { useProductsContext } from "@/context/ProductsContext";

const SearcherMobile = ({ onClick }) => {
  const { changeList, setNavBarSearcher, navBarSearcher } = useSearch();
  const { isDarkMode } = useTheme();
  
  const { products } = useProductsContext();

  const [itemEncontrado, setItemEncontrado] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (evento) => {
    const value = evento.target.value;
    setBusqueda(value);
    setShowResults(value.length > 0);
    filtrado(value);
    
    if (!navBarSearcher) {
      setNavBarSearcher(true);
    }
  };

  const filtrado = (prodBuscado) => {
    if (!prodBuscado || prodBuscado.trim() === '') {
      setItemEncontrado([]);
      return;
    }

    const resultadoBusqueda = products?.filter((prod) => {
      if (prod.nombre.toString().toLowerCase().includes(prodBuscado.toLowerCase())) {
        return prod;
      }
      return false;
    }).slice(0, 8); // Limitamos a 8 resultados para mejor rendimiento en móvil
    
    setItemEncontrado(resultadoBusqueda);
  };

  const handleSearchIconClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 300);
    } else {
      setBusqueda('');
      setShowResults(false);
    }
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      if (busqueda.trim() !== '') {
        onClick && onClick(); // Cerrar drawer si existe onClick
      }
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setBusqueda('');
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    setBusqueda('');
    setItemEncontrado([]);
    setShowResults(false);
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.focus();
  };

  const handleProductClick = () => {
    setIsExpanded(false);
    setBusqueda('');
    setShowResults(false);
    onClick && onClick(); // Cerrar drawer si existe onClick
  };

  useEffect(() => {
    changeList(itemEncontrado);
  }, [itemEncontrado, changeList]);

  // Variantes para animaciones
  const searchWrapperVariants = {
    closed: { 
      width: "40px", 
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    open: { 
      width: "100%",
      maxWidth: "180px",
      transition: { type: "spring", stiffness: 400, damping: 30 }
    }
  };

  const resultsVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const iconVariants = {
    rotate: {
      rotate: [0, -10, 0, 10, 0],
      transition: { duration: 0.5 }
    }
  };

  const productCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.05, duration: 0.2 }
    }),
    hover: { 
      scale: 1.03, 
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 } 
    },
    tap: { scale: 0.97 }
  };

  return (
    <div className="navbar-searcher-container">
      <motion.div
        className="navbar-search-wrapper"
        initial="closed"
        animate={isExpanded ? "open" : "closed"}
        variants={searchWrapperVariants}
        onClick={handleSearchClick}
      >
        <motion.div
          className={`navbar-search-icon-container ${isDarkMode ? 'dark-mode' : ''}`}
          onClick={handleSearchIconClick}
          whileHover="rotate"
          variants={iconVariants}
        >
          <IconButton 
            color={isDarkMode ? "default" : "primary"}
            aria-label="buscar productos"
            className="navbar-search-icon-button"
            size="small"
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </motion.div>

        {isExpanded && (
          <motion.div 
            className="navbar-search-input-container"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <InputBase
              id="search-input"
              placeholder="Buscar..."
              value={busqueda}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`navbar-search-input ${isDarkMode ? 'dark-mode' : ''}`}
              fullWidth
              autoFocus
            />
            {busqueda && (
              <IconButton 
                size="small" 
                aria-label="limpiar búsqueda" 
                onClick={handleClearSearch}
                className="navbar-clear-button"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showResults && itemEncontrado.length > 0 && (
          <motion.div 
            className={`navbar-search-results-container ${isDarkMode ? 'dark-mode' : ''}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={resultsVariants}
          >
            <Paper 
              elevation={4}
              className={`navbar-search-results-paper ${isDarkMode ? 'dark-mode' : ''}`}
            >
              <Typography 
                variant="subtitle2" 
                className={`navbar-results-title ${isDarkMode ? 'dark-mode' : ''}`}
              >
                Encontramos {itemEncontrado.length} productos
              </Typography>
              
              <Box className="navbar-search-results-grid">
                {itemEncontrado.map((product, index) => (
                  <motion.div
                    key={product.id}
                    custom={index}
                    variants={productCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link 
                      href={`/detail/${product.id}`} 
                      onClick={handleProductClick}
                      className="navbar-product-search-link"
                    >
                      <Card className={`navbar-product-card ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardMedia
                          component="img"
                          height="60"
                          image={product.opciones[0].img}
                          alt={product.nombre}
                          className="navbar-product-image"
                        />
                        <CardContent className="navbar-product-card-content">
                          <Typography variant="body2" className="navbar-product-name">
                            {product.nombre.length > 16 
                              ? product.nombre.substring(0, 16) + "..."
                              : product.nombre}
                          </Typography>
                          <Chip 
                            label={'Ver producto'} 
                            color="primary"
                            size="small"
                            className={`navbar-price-chip ${isDarkMode ? 'dark-mode' : ''}`}
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </Box>
              
              {itemEncontrado.length > 0 && (
                <Link 
                  href="/productos"
                  onClick={handleProductClick}
                  className={`navbar-view-all-link ${isDarkMode ? 'dark-mode' : ''}`}
                >
                  <Typography variant="body2">
                    Ver todos los productos
                  </Typography>
                </Link>
              )}
            </Paper>
          </motion.div>
        )}

        {showResults && busqueda && itemEncontrado.length === 0 && (
          <motion.div
            className={`navbar-search-results-container ${isDarkMode ? 'dark-mode' : ''}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={resultsVariants}
          >
            <Paper
              elevation={4}
              className={`navbar-search-results-paper no-results ${isDarkMode ? 'dark-mode' : ''}`}
            >
              <Typography variant="subtitle1" className="navbar-no-results-text">
                No encontramos productos que coincidan
              </Typography>
              <Typography variant="body2" className="navbar-suggestion-text">
                Intenta con otro término
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearcherMobile;