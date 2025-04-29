import React, { useContext, useEffect, useState } from 'react';
import Link from  'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { useMediaQuery } from '@mui/material';
import ItemCount from '../ItemCount/ItemCount';
import { CartContext } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeSwitchContext';
import './topItems.css';
import { RiFlowerFill } from 'react-icons/ri';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function TopItems() {
    const { dolar, priceDolar } = useContext(CartContext);
    const isMobileSmallScreen = useMediaQuery('(max-width: 650px)');
    const isTablet = useMediaQuery('(max-width: 960px)');
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();

    // PRODUCTOS
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsCollection = collection(baseDeDatos, 'productos');
            const productSnapshot = await getDocs(productsCollection);
            const productList = productSnapshot.docs.map((doc) => ({ 
                ...doc.data(), 
                id: doc.id 
            }));
    
            // Filtrar productos que NO contengan ciertas ocasiones o categorías
            const filteredProducts = productList.filter(product => {
                // Verificar el campo de ocasiones
                const ocasiones = product.ocasiones || [];
                const categorias = product.categorias || [];
                
                // Excluir productos con ocasiones o categorías específicas
                const tieneOcasionRestringida = ocasiones.some(ocasion => 
                    ocasion.toLowerCase().includes('condolencias') || 
                    ocasion.toLowerCase().includes('funerales')
                );
                
                const tieneCategoriaRestringida = categorias.some(categoria => 
                    categoria.toLowerCase().includes('coronas') || 
                    categoria.toLowerCase().includes('palmas')
                );
                
                // Devolver true solo si el producto NO tiene ninguna restricción
                return !tieneOcasionRestringida && !tieneCategoriaRestringida;
            });
    
            // Ordenar los productos filtrados por ventas en el lado del cliente
            const sortedProducts = filteredProducts.sort((a, b) => b.vendidos - a.vendidos);
    
            // Tomar solo los primeros 6 productos
            const top6Products = sortedProducts.slice(0, 6);
    
            setTopItems(top6Products);
        } catch (error) {
            console.error("Error al cargar los productos destacados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Configuración de slides para diferentes dispositivos
    const getSlidesPerView = () => {
        if (isMobileSmallScreen) return 1.15;
        if (isTablet) return 2.8;
        return 4.25;
    };

    return (
        <div className={`top-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="top-items-header">
                <h2 className="top-items-title">Productos Destacados</h2>
                <p className="top-items-subtitle">Los favoritos de nuestros clientes</p>
                <div className="top-items-decoration">
                    <span className="decoration-line"></span>
                    <span className="decoration-icon"><RiFlowerFill /></span>
                    <span className="decoration-line"></span>
                </div>
            </div>

            {loading ? (
                <div className="top-items-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando productos destacados...</p>
                </div>
            ) : (
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={isMobileSmallScreen ? 10 : 20}
                    slidesPerView={getSlidesPerView()}
                    pagination={{ clickable: true }}
                    navigation={!isMobileSmallScreen}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    className="top-items-swiper"
                >
                    {topItems.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className={`product-card ${isDarkMode ? 'dark-mode' : ''}`}>
                                <div className="product-badge">
                                    <span>TOP</span>
                                </div>
                                
                                <div className="product-image-container">
                                    <Link href={`/detail/${item.id}`} className="product-image-link">
                                        <img 
                                            src={item?.opciones[0].img} 
                                            alt={item.nombre} 
                                            className="product-image" 
                                            loading="lazy"
                                        />
                                    </Link>
                                    <div className="product-quick-view">
                                        <Link href={`/detail/${item.id}`} className="quick-view-button">
                                            Ver Detalles
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="product-info">
                                    <div className="product-sold">
                                        <span className="sold-icon">🔥</span>
                                        <span className="sold-count">{item.vendidos} vendidos</span>
                                    </div>
                                    
                                    <h3 className="product-title">
                                        <Link href={`/detail/${item.id}`}>{item.nombre}</Link>
                                    </h3>
                                    
                                    <div className="product-details">
                                        <div className="product-size">
                                            <span className="detail-label">Tamaño:</span>
                                            <span className="detail-value">{item.opciones[0].size}</span>
                                        </div>
                                        
                                        <div className="product-price">
                                            <span className="price-label">Precio:</span>
                                            <span className="price-value">
                                                {priceDolar 
                                                    ? `USD$ ${(item.opciones[0].precio / dolar).toFixed(2)}` 
                                                    : `$${item.opciones[0].precio.toLocaleString('es-AR')}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="product-actions">
                                        <ItemCount
                                            optionId={item.opciones[0].id}
                                            optionSize={item.opciones[0].size}
                                            optionPrecio={item.opciones[0].precio}
                                            optionImg={item.opciones[0].img}
                                            item={item}
                                            topProducts={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            
            <div className="view-all-container">
                <Link href="/productos" className="view-all-button">
                    Ver Todos los Productos
                </Link>
            </div>
        </div>
    );
}