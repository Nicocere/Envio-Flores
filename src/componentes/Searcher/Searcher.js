import React, { useContext, useEffect, useState, useRef } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useTheme } from "../../context/ThemeSwitchContext";
import './searcher.css';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { motion, AnimatePresence } from "framer-motion";

const Searcher = ({ items }) => {
  // Eliminar clearInputNavBar de la desestructuración ya que no se usa
  const { 
    changeList, 
    navBarSearcher, 
    setNavBarSearcher, 
    setClearInputNavBar, 
    clearInputMain, 
    setClearInputMain 
  } = useContext(SearchContext);

  const [itemEncontrado, setItemEncontrado] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const {isDarkMode} = useTheme();
  
  // Manejar cambios en el input
  const handleChange = (evento) => {
    evento.preventDefault();
    setNavBarSearcher(false);
    const valor = evento.target.value;
    setBusqueda(valor);
    filtrado(valor);
  };

  // Limpiar la búsqueda cuando se presiona el botón de limpiar
  const handleClearSearch = () => {
    setBusqueda('');
    setItemEncontrado([]);
    changeList([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Manejar la limpieza de input entre componentes
  useEffect(() => {
    if (clearInputMain && busqueda && !navBarSearcher) {
      setClearInputNavBar(true);
      setClearInputMain(false);
    } else if (clearInputMain && busqueda) {
      setBusqueda('');
      setItemEncontrado([]);
    }
  }, [clearInputMain, busqueda, navBarSearcher, setClearInputNavBar, setClearInputMain]);

  // Filtrado de productos
  const filtrado = (prodBuscado) => {
    if (!navBarSearcher && prodBuscado) {
      const resultadoBusqueda = items.filter((prod) => 
        prod.nombre.toString().toLowerCase().includes(prodBuscado.toLowerCase())
      );
      setItemEncontrado(resultadoBusqueda);
    } else if (!prodBuscado) {
      setItemEncontrado([]);
    }
  };

  // Prevenir envío del formulario
  const handleSubmit = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
  };
  
  // Actualizar la lista de resultados cuando cambia itemEncontrado
  useEffect(() => {
    changeList(itemEncontrado);
  }, [itemEncontrado, changeList]);

  // Texto de resultados de búsqueda
  const getResultText = () => {
    if (!busqueda) return null;
    
    const count = itemEncontrado.length;
    if (count === 0) {
      return "No se encontraron productos";
    } else if (count === 1) {
      return "1 producto encontrado";
    } else {
      return `${count} productos encontrados`;
    }
  };

  return (
    <motion.div 
      className={`searcher-container ${isDarkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="searcher-header">
        <motion.h5 
          className="searcher-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SearchIcon className="searcher-title-icon" />
          Buscar Productos
        </motion.h5>
      </div>
      
      <div className="searcher-body">
        <form className="searcher-form" onSubmit={handleSubmit}>
          <TextField
            inputRef={inputRef}
            type="text"
            value={busqueda}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="¿Qué estás buscando?"
            variant="outlined"
            fullWidth
            className={`searcher-input ${isFocused ? 'focused' : ''}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="searcher-icon" />
                </InputAdornment>
              ),
              endAdornment: busqueda && (
                <InputAdornment position="end">
                  <Tooltip title="Limpiar búsqueda">
                    <IconButton
                      onClick={handleClearSearch}
                      edge="end"
                      className="searcher-clear-button"
                      size="small"
                      aria-label="limpiar búsqueda"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </form>
        
        <AnimatePresence>
          {busqueda && (
            <motion.div 
              className="search-result-info"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="search-result-text">{getResultText()}</span>
              {itemEncontrado.length > 0 && (
                <div className="search-keywords">
                  <span className="search-for">Buscando:</span>
                  <span className="search-term">"{busqueda}"</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Searcher;