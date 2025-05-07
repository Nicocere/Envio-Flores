import React, { useContext, useEffect, useRef, useState } from "react";
import ItemList from "../itemList/ItemList";
import { FadeLoader } from "react-spinners";
import './itemListContainer.css';
import { SearchContext } from "../../context/SearchContext";
import PaginationComponent from "../Pagination/Pagination";
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    Button,
    Container,
    Typography,
    useMediaQuery
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import InventoryIcon from '@mui/icons-material/Inventory';
import { collection, getDocs, query } from "firebase/firestore";
import { baseDeDatos } from "../../admin/FireBaseConfig";
import { useTheme } from "../../context/ThemeSwitchContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ItemListContainer = ({ categoryName, ocasionName }) => {
    const isSmallScreen = useMediaQuery('(max-width:650px)');
    const isMediumScreen = useMediaQuery('(max-width:960px)');
    const { isDarkMode } = useTheme();

    const pathname = usePathname();

    console.log("Current route path:", pathname);
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
                        items={items}
                        activeFilters={activeFilters}
                        sortOrder={sortOrder}
                        allProds={false}
                    />

                </motion.div>
            );
        } else if (pathname !== '/' || (!categoryName || !ocasionName) && totalCount > 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="pagination-wrapper"
                >
                    <PaginationComponent
                        currentPage={currentPage}
                        totalItems={items.length}
                        setCurrentPage={setCurrentPage}
                        page_size={PAGE_SIZE}
                        items={items}
                        activeFilters={activeFilters}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    allProds={true}
                    />

                </motion.div>
            );
        }else if (pathname === '/' && !categoryName && !ocasionName) {
            return null

        }

        return null;
    };

    return (
        <Container maxWidth="xl" className={themeClasses.container} id="productos">

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



                        {(categoryName || ocasionName) ? (
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
                                    <p className="product-count">
                                        {categoryName
                                            ? `${totalItems} productos encontrados`
                                            : `${totalProcessedItems} productos encontrados`}
                                    </p>
                                </motion.div>
                            </Box>
                        ) : pathname !== '/' ? (
                            <Box className="product-header-section">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="category-header"
                                >
                                    <Typography variant="h2" className="category-title">
                                        Todos los productos
                                    </Typography>
                                    <p className="product-count">
                                    {items.length} productos encontrados
                                    </p>
                                </motion.div>
                            </Box>
                        ) : null
                        }
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