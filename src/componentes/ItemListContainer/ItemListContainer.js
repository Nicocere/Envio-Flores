import React, { useContext, useEffect, useRef, useState } from "react";
import ItemList from "../itemList/ItemList";
import { FadeLoader } from "react-spinners";
import './itemListContainer.css';
import { SearchContext } from "../../context/SearchContext";
import Searcher from "../Searcher/Searcher";
import PaginationComponent from "../Pagination/Pagination";
import { Helmet } from 'react-helmet';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accordion, 
  AccordionDetails, 
  AccordionSummary, 
  Box,
  Button,
  Checkbox, 
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper, 
  Typography, 
  useMediaQuery,
  Tooltip,
  Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import InventoryIcon from '@mui/icons-material/Inventory';
import { collection, getDocs, query } from "firebase/firestore";
import { baseDeDatos } from "../../admin/FireBaseConfig";
import { useTheme } from "../../context/ThemeSwitchContext";
import Link from "next/link";

const ItemListContainer = ({categoryName , ocasionName }) => {
    const isSmallScreen = useMediaQuery('(max-width:650px)');
    const isMediumScreen = useMediaQuery('(max-width:960px)');
    const { isDarkMode } = useTheme();
    
    // Clases dinámicas basadas en el tema
    const themeClasses = {
      container: `products-container ${isDarkMode ? 'dark' : 'light'}`,
      header: `product-header ${isDarkMode ? 'dark' : 'light'}`,
      paper: `filter-paper ${isDarkMode ? 'dark' : 'light'}`,
      loading: `loading-container ${isDarkMode ? 'dark' : 'light'}`
    };

    const { prodEncontrado } = useContext(SearchContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState(''); 
    const [totalProcessedItems, setTotalProcessedItems] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const PAGE_SIZE = 9; // Cambiado a 9 para una mejor distribución visual
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState(0);
    const [expandedFilters, setExpandedFilters] = useState(false);

    // Refs para manejar los cambios de categoría/ocasión
    const lastCategoryName = useRef(categoryName);
    const lastOcasionName = useRef(ocasionName);

    // Referencia para scroll automático
    const productListRef = useRef(null);

    const clearLocalStorage = () => {
        return new Promise((resolve) => {
            localStorage.removeItem('p');
            resolve();
        });
    };

    // Manejo de filtros
    const handleFilterChange = (filterType) => {
        // Si ya está seleccionado, lo desactivamos
        if (sortOrder === filterType) {
            setSortOrder('');
            return;
        }
    
        setSortOrder(filterType);
    };
    
    // Limpiar todos los filtros
    const clearAllFilters = () => {
        setSortOrder('');
    };

    // Definir títulos de categorías para SEO
    const getCategoryTitle = () => {
        if (!categoryName && !ocasionName) return null;
        
        const title = categoryName || ocasionName;
        
        return (
            <Helmet>
                <title>{title} | Envio Flores - Entrega a domicilio en CABA y GBA</title>
                <meta name="robots" content="index, follow" />
                <meta name="description" content={`Envío de ${title} a domicilio en Buenos Aires. Flores frescas, arreglos florales y regalos con entrega en el día. Pagos con tarjeta y efectivo.`} />
                <meta property="og:title" content={`${title} | Envio Flores`} />
                <meta property="og:description" content={`Flores, ramos y arreglos florales de ${title} con entrega a domicilio en Buenos Aires.`} />
            </Helmet>
        );
    };

    useEffect(() => {
        async function fetchDataIfNeeded() {
            setError(null);
            
            if (!localStorage.getItem('p')) {
                try {
                    const productsCollection = query(collection(baseDeDatos, 'productos'));
                    const productSnapshot = await getDocs(productsCollection);
                    const productList = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    
                    // Encriptación
                    const key = nacl.randomBytes(nacl.secretbox.keyLength);
                    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
                    const encryptedData = nacl.secretbox(
                        naclUtil.decodeUTF8(JSON.stringify(productList)),
                        nonce,
                        key
                    );

                    localStorage.setItem('p', JSON.stringify({
                        nonce: naclUtil.encodeBase64(nonce),
                        key: naclUtil.encodeBase64(key),
                        data: naclUtil.encodeBase64(encryptedData),
                    }));

                    return productList;
                } catch (error) {
                    console.error("No se pudo obtener la base de datos:", error.response || error);
                    setError("Hubo un problema al cargar los productos. Por favor intente nuevamente.");
                    await clearLocalStorage();
                    return [];
                }
            } else {
                try {
                    // Actualizar datos en localStorage desde Firebase
                    const productsCollection = query(collection(baseDeDatos, 'productos'));
                    const productSnapshot = await getDocs(productsCollection);
                    const productList = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

                    const keyFirebase = nacl.randomBytes(nacl.secretbox.keyLength);
                    const nonceFirebase = nacl.randomBytes(nacl.secretbox.nonceLength);
                    const encryptedDataFirebase = nacl.secretbox(
                        naclUtil.decodeUTF8(JSON.stringify(productList)),
                        nonceFirebase,
                        keyFirebase
                    );

                    localStorage.setItem('p', JSON.stringify({
                        nonce: naclUtil.encodeBase64(nonceFirebase),
                        key: naclUtil.encodeBase64(keyFirebase),
                        data: naclUtil.encodeBase64(encryptedDataFirebase),
                    }));

                    // Leer los datos almacenados
                    const storedEncryptedData = localStorage.getItem('p');
                    const parsedStoredData = JSON.parse(storedEncryptedData);

                    if (!parsedStoredData.nonce || !parsedStoredData.key || !parsedStoredData.data) {
                        console.log('Datos almacenados incompletos');
                        await clearLocalStorage();
                        fetchDataIfNeeded();
                        return [];
                    }

                    const nonce = naclUtil.decodeBase64(parsedStoredData.nonce);
                    const key = naclUtil.decodeBase64(parsedStoredData.key);
                    const encryptedData = naclUtil.decodeBase64(parsedStoredData.data);

                    const decryptedData = nacl.secretbox.open(
                        encryptedData,
                        nonce,
                        key
                    );

                    if (decryptedData) {
                        const textDecoder = new TextDecoder('utf-8');
                        const decryptedDataString = textDecoder.decode(decryptedData);
                        return JSON.parse(decryptedDataString);
                    } else {
                        console.error('Error al desencriptar los datos.');
                        setError("No se pudieron cargar los datos correctamente. Por favor intente nuevamente.");
                        await clearLocalStorage();
                        return [];
                    }
                } catch (error) {
                    console.error("Error al parsear datos almacenados:", error);
                    setError("Error al procesar los datos. Por favor recargue la página.");
                    await clearLocalStorage();
                    return [];
                }
            }
        }

        // Procesar y filtrar datos obtenidos
        fetchDataIfNeeded().then(data => {
            let processedItems = data || [];
            setActiveFilters(0);

            // Filtrado por categoría
            if (categoryName) {
                processedItems = processedItems.filter((prod) => 
                    prod.categoria && prod.categoria.some((category) => 
                        category.toLowerCase().includes(categoryName.toLowerCase())
                    )
                );
                setActiveFilters(prev => prev + 1);
            }

            // Filtrado por ocasión
            if (ocasionName) {

                console.log(ocasionName)
                const productosConOcasion = processedItems.filter(prod => 
                    prod.ocasiones && prod.ocasiones.length > 0
                );
                
                if (productosConOcasion.length > 0) {
                    processedItems = productosConOcasion.filter((prod) => 
                        prod.ocasiones.some((ocasion) => 
                            ocasion.toLowerCase().includes(ocasionName.toLowerCase())
                        )
                    );
                } else {
                    processedItems = [];
                }
                setActiveFilters(prev => prev + 1);
            }

            // Ordenamiento según criterio seleccionado
            switch (sortOrder) {
                case 'recientes':
                    processedItems.sort((a, b) => {
                        if (a.createdAt && b.createdAt) {
                            return b.createdAt - a.createdAt;
                        }
                        if (!a.createdAt) return 1;
                        if (!b.createdAt) return -1;
                        return 0;
                    });
                    setActiveFilters(prev => prev + 1);
                    break;
                case 'barato':
                    processedItems.sort((a, b) => {
                        const precioA = a.opciones && a.opciones.length > 0 ? a.opciones[0].precio : Infinity;
                        const precioB = b.opciones && b.opciones.length > 0 ? b.opciones[0].precio : Infinity;
                        return precioA - precioB;
                    });
                    setActiveFilters(prev => prev + 1);
                    break;
                case 'caro':
                    processedItems.sort((a, b) => {
                        const precioA = a.opciones && a.opciones.length > 0 ? a.opciones[0].precio : -Infinity;
                        const precioB = b.opciones && b.opciones.length > 0 ? b.opciones[0].precio : -Infinity;
                        return precioB - precioA;
                    });
                    setActiveFilters(prev => prev + 1);
                    break;
                case 'vendidos':
                    processedItems.sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0));
                    setActiveFilters(prev => prev + 1);
                    break;
                case 'alfabeto1':
                    processedItems.sort((a, b) => a.nombre.localeCompare(b.nombre));
                    setActiveFilters(prev => prev + 1);
                    break;
                case 'alfabeto2':
                    processedItems.sort((a, b) => b.nombre.localeCompare(a.nombre));
                    setActiveFilters(prev => prev + 1);
                    break;
                default:
                    break;
            }

            // Manejar cambios de página y categoría
            if (categoryName) {
                if (categoryName !== lastCategoryName.current) {
                    setCurrentPage(1);
                    lastCategoryName.current = categoryName;
                }

                // Pagination para categoría
                setTotalItems(processedItems.length);
                const startIdx = (currentPage - 1) * PAGE_SIZE;
                const endIdx = currentPage * PAGE_SIZE;
                processedItems = processedItems.slice(startIdx, endIdx);

            } else if (ocasionName) {
                if (ocasionName !== lastOcasionName.current) {
                    setCurrentPage(1);
                    lastOcasionName.current = ocasionName;
                }

                // Pagination para ocasión
                setTotalProcessedItems(processedItems.length);
                const startIdx = (currentPage - 1) * PAGE_SIZE;
                const endIdx = currentPage * PAGE_SIZE;
                processedItems = processedItems.slice(startIdx, endIdx);

            } else {
                setTotalItems(0);
                setTotalProcessedItems(0);
            }

            setItems(processedItems);
            setIsLoading(false);
        }).catch(err => {
            console.error("Error al procesar datos:", err);
            setError("Ocurrió un error inesperado. Por favor intente más tarde.");
            setIsLoading(false);
        });

    }, [categoryName, currentPage, ocasionName, sortOrder]);

    // Limpiar datos antiguos
    useEffect(() => {
        if (localStorage.getItem('productos')) {
            localStorage.removeItem('productos');
        }
    }, []);

    // Obtener el título de la página para mostrar al usuario
    const getDisplayTitle = () => {
        if (categoryName) {
            return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        }
        if (ocasionName) {
            return ocasionName.charAt(0).toUpperCase() + ocasionName.slice(1);
        }
        return "Todos los productos";
    };

    // Determinar ruta de regreso apropiada
    const getBackLink = () => {
        if (categoryName) {
            return "/categorias";
        }
        if (ocasionName) {
            return "/ocasiones";
        }
        return "/";
    };

    // Componente de filtros para pantalla pequeña
    const MobileFilters = () => (
        <Accordion 
            className="filter-accordion"
            elevation={3}
            expanded={expandedFilters}
            onChange={() => setExpandedFilters(!expandedFilters)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon className="expand-icon" />}
                aria-controls="filter-panel-content"
                id="filter-panel-header"
                className="filter-header"
            >
                <Badge 
                    badgeContent={activeFilters} 
                    color="success" 
                    className="filter-badge"
                    invisible={activeFilters === 0}
                >
                    <FilterListIcon className="filter-icon" />
                </Badge>
                <Typography className="filter-title">
                    Ordenar Productos
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="filter-details">
                <FormGroup className="filter-options">
                    <FormControl component="fieldset" className="filter-group">
                        <Typography variant="subtitle2" className="filter-group-title">
                            <NewReleasesIcon fontSize="small" /> Novedades
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    color="success"
                                    checked={sortOrder === "recientes"}
                                    onChange={() => handleFilterChange("recientes")}
                                />
                            }
                            label="Recién añadidos"
                            className="filter-option"
                        />
                    </FormControl>

                    <Divider flexItem className="filter-divider" />

                    <FormControl component="fieldset" className="filter-group">
                        <Typography variant="subtitle2" className="filter-group-title">
                            <LocalOfferIcon fontSize="small" /> Precio
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    color="success"
                                    checked={sortOrder === "barato"}
                                    onChange={() => handleFilterChange("barato")}
                                />
                            }
                            label="Menor precio"
                            className="filter-option"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    color="success"
                                    checked={sortOrder === "caro"}
                                    onChange={() => handleFilterChange("caro")}
                                />
                            }
                            label="Mayor precio"
                            className="filter-option"
                        />
                    </FormControl>

                    <Divider flexItem className="filter-divider" />

                    <FormControl component="fieldset" className="filter-group">
                        <Typography variant="subtitle2" className="filter-group-title">
                            <TrendingUpIcon fontSize="small" /> Popularidad
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    color="success"
                                    checked={sortOrder === "vendidos"}
                                    onChange={() => handleFilterChange("vendidos")}
                                />
                            }
                            label="Más vendidos"
                            className="filter-option"
                        />
                    </FormControl>

                    <Divider flexItem className="filter-divider" />

                    <FormControl component="fieldset" className="filter-group">
                        <Typography variant="subtitle2" className="filter-group-title">
                            <SortByAlphaIcon fontSize="small" /> Alfabético
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    color="success"
                                    checked={sortOrder === "alfabeto1"}
                                    onChange={() => handleFilterChange("alfabeto1")}
                                />
                            }
                            label="A → Z"
                            className="filter-option"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    color="success"
                                    checked={sortOrder === "alfabeto2"}
                                    onChange={() => handleFilterChange("alfabeto2")}
                                />
                            }
                            label="Z → A"
                            className="filter-option"
                        />
                    </FormControl>
                </FormGroup>
                
                {activeFilters > 0 && (
                    <Button
                        variant="outlined"
                        startIcon={<RestartAltIcon />}
                        onClick={clearAllFilters}
                        className="clear-filters-button"
                        size="small"
                        color="success"
                        fullWidth
                    >
                        Limpiar filtros
                    </Button>
                )}
            </AccordionDetails>
        </Accordion>
    );

    // Componente de filtros para pantalla grande
    const DesktopFilters = () => (
        <Paper elevation={3} className="filter-paper-desktop">
            <Box className="filter-header-desktop">
                <Badge 
                    badgeContent={activeFilters} 
                    color="success" 
                    className="filter-badge-desktop"
                    invisible={activeFilters === 0}
                >
                    <SortIcon className="filter-icon-desktop" />
                </Badge>
                <Typography variant="h6" className="filter-title-desktop">
                    Ordenar por
                </Typography>
                
                {activeFilters > 0 && (
                    <Tooltip title="Limpiar filtros">
                        <Button
                            variant="text"
                            className="clear-filters-button-desktop"
                            onClick={clearAllFilters}
                            startIcon={<RestartAltIcon />}
                            size="small"
                        >
                            Limpiar
                        </Button>
                    </Tooltip>
                )}
            </Box>
            
            <Box className="filter-options-desktop">
                <Box className="filter-section">
                    <FormControl component="fieldset" className="filter-group-desktop">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="success"
                                    checked={sortOrder === "recientes"}
                                    onChange={() => handleFilterChange("recientes")}
                                />
                            }
                            label={
                                <Box className="filter-label">
                                    <NewReleasesIcon fontSize="small" className="filter-icon-small" />
                                    <span>Recién añadidos</span>
                                </Box>
                            }
                            className="filter-option-desktop"
                        />
                    </FormControl>
                </Box>

                <Divider orientation="vertical" flexItem className="filter-divider-desktop" />

                <Box className="filter-section">
                    <FormControl component="fieldset" className="filter-group-desktop">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="success"
                                    checked={sortOrder === "barato"}
                                    onChange={() => handleFilterChange("barato")}
                                />
                            }
                            label={
                                <Box className="filter-label">
                                    <LocalOfferIcon fontSize="small" className="filter-icon-small" />
                                    <span>Menor precio</span>
                                </Box>
                            }
                            className="filter-option-desktop"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="success"
                                    checked={sortOrder === "caro"}
                                    onChange={() => handleFilterChange("caro")}
                                />
                            }
                            label={
                                <Box className="filter-label">
                                    <LocalOfferIcon fontSize="small" className="filter-icon-small" />
                                    <span>Mayor precio</span>
                                </Box>
                            }
                            className="filter-option-desktop"
                        />
                    </FormControl>
                </Box>

                <Divider orientation="vertical" flexItem className="filter-divider-desktop" />

                <Box className="filter-section">
                    <FormControl component="fieldset" className="filter-group-desktop">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="success"
                                    checked={sortOrder === "vendidos"}
                                    onChange={() => handleFilterChange("vendidos")}
                                />
                            }
                            label={
                                <Box className="filter-label">
                                    <TrendingUpIcon fontSize="small" className="filter-icon-small" />
                                    <span>Más vendidos</span>
                                </Box>
                            }
                            className="filter-option-desktop"
                        />
                    </FormControl>
                </Box>

                <Divider orientation="vertical" flexItem className="filter-divider-desktop" />

                <Box className="filter-section">
                    <FormControl component="fieldset" className="filter-group-desktop">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="success"
                                    checked={sortOrder === "alfabeto1"}
                                    onChange={() => handleFilterChange("alfabeto1")}
                                />
                            }
                            label={
                                <Box className="filter-label">
                                    <SortByAlphaIcon fontSize="small" className="filter-icon-small" />
                                    <span>A → Z</span>
                                </Box>
                            }
                            className="filter-option-desktop"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="success"
                                    checked={sortOrder === "alfabeto2"}
                                    onChange={() => handleFilterChange("alfabeto2")}
                                />
                            }
                            label={
                                <Box className="filter-label">
                                    <SortByAlphaIcon fontSize="small" className="filter-icon-small rotate-icon" />
                                    <span>Z → A</span>
                                </Box>
                            }
                            className="filter-option-desktop"
                        />
                    </FormControl>
                </Box>
            </Box>
        </Paper>
    );
    
    // Determinar qué componente de paginación mostrar
    const renderPaginationComponent = () => {
        const totalCount = categoryName ? totalItems : totalProcessedItems;
        
        if ((categoryName || ocasionName) && totalCount > 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="pagination-wrapper"
                >
                    <PaginationComponent
                        currentPage={currentPage}
                        totalItems={totalCount}
                        setCurrentPage={setCurrentPage}
                        page_size={PAGE_SIZE}
                    />
                </motion.div>
            );
        }
        
        return null;
    };

    return (
        <Container maxWidth="xl" className={themeClasses.container} id="productos">
            {getCategoryTitle()}
            
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={themeClasses.loading}
                    >
                        <LocalFloristIcon className="loading-icon" />
                        <Typography variant="h5" className="loading-title">
                            Cargando Productos
                        </Typography>
                        <FadeLoader className="fade-loader" color={isDarkMode ? "#ff9999" : "#a70000"} />
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="error-container"
                    >
                        <div className="error-content">
                            <div className="error-icon-container">
                                <InventoryIcon className="error-icon" />
                            </div>
                            <Typography variant="h5" className="error-title">
                                Lo sentimos
                            </Typography>
                            <Typography variant="body1" className="error-message">
                                {error}
                            </Typography>
                            <Button 
                                variant="contained"
                                color="success"
                                className="error-button"
                                onClick={() => window.location.reload()}
                            >
                                Reintentar
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                            {(categoryName || ocasionName) && (
                        <Box className="product-header-section">
                        
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="category-header"
                                >
                                    <Typography variant="h2" className="category-title">
                                        {getDisplayTitle()}
                                    </Typography>
                                    <Typography variant="body2" className="product-count">
                                        {categoryName 
                                            ? `${totalItems} productos encontrados` 
                                            : `${totalProcessedItems} productos encontrados`}
                                    </Typography>
                                </motion.div>
                        </Box>
                            )}
                        
                        <Box className="search-filter-container">
                            <Box className="search-section">
                                <Searcher items={items} />
                            </Box>
                            
                            <Box className="filter-section">
                                {isSmallScreen ? <MobileFilters /> : <DesktopFilters />}
                            </Box>
                        </Box>
                        
                        {renderPaginationComponent()}
                        
                        <Box className="product-list-wrapper" ref={productListRef}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${currentPage}-${sortOrder}-${categoryName || ocasionName || 'all'}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <ItemList items={items} prodEncontrado={prodEncontrado} />
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Mensaje cuando no hay productos */}
                            {items.length === 0 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="no-products-message"
                                >
                                    <InventoryIcon className="no-products-icon" />
                                    <Typography variant="h5" className="no-products-title">
                                        No hay productos disponibles
                                    </Typography>
                                    <Typography variant="body1" className="no-products-description">
                                        No encontramos productos que coincidan con los criterios seleccionados.
                                    </Typography>
                                    <Link href="/productos" className="browse-all-link">
                                        Ver todos los productos
                                    </Link>
                                </motion.div>
                            )}
                        </Box>
                        
                        {renderPaginationComponent()}
                    </motion.div>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default ItemListContainer;