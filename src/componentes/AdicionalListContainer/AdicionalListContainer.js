import React, { useEffect, useState, useCallback } from "react";
import AdicionalList from "../AdicionalList/AdicionalList";
import { FadeLoader } from "react-spinners";
import { collection, getDocs } from "firebase/firestore";
import { baseDeDatos } from "../../admin/FireBaseConfig";
import localforage from "localforage";
import "./AdicionalListContainer.css";

const AdicionalListContainer = () => {
    const [adicionales, setAdicionales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingCache, setUsingCache] = useState(false);
    
    const CACHE_KEY = 'adicionales_data';
    const CACHE_DURATION_MS = 45 * 60 * 1000; // 45 minutos en milisegundos
    
    // Verifica si los datos en cache son válidos (menos de 45 minutos de antigüedad)
    const isCacheValid = (cachedData) => {
        if (!cachedData || !cachedData.timestamp) return false;
        const now = new Date().getTime();
        return (now - cachedData.timestamp) < CACHE_DURATION_MS;
    };
    
    // Función para obtener datos de Firebase
    const getDataFromFirebase = useCallback(async () => {
        try {
            setIsLoading(true);
            setUsingCache(false);
            
            const querySnapshot = await getDocs(collection(baseDeDatos, 'adicionales'));
            
            let adicionalesData = [];
            if (!querySnapshot.empty) {
                adicionalesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }
            
            // Guardar en localforage con timestamp
            const dataToCache = {
                items: adicionalesData,
                timestamp: new Date().getTime()
            };
            
            await localforage.setItem(CACHE_KEY, dataToCache);
            
            setAdicionales(adicionalesData);
            setError(null);
        } catch (error) {
            console.error("Error al obtener adicionales:", error);
            setError("No pudimos cargar los complementos. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const fetchAdicionales = async () => {
            try {
                setIsLoading(true);
                
                // Intentar obtener datos desde localforage primero
                const cachedData = await localforage.getItem(CACHE_KEY);
                
                // Si hay datos en cache y son válidos (menos de 45 minutos)
                if (cachedData && isCacheValid(cachedData)) {
                    console.log("Usando datos en caché de adicionales");
                    setAdicionales(cachedData.items);
                    setUsingCache(true);
                    setError(null);
                    setIsLoading(false);
                } else {
                    // Si no hay datos en cache o ya expiraron, obtener de Firebase
                    if (cachedData && !isCacheValid(cachedData)) {
                        console.log("Datos en caché expirados, obteniendo nuevos datos");
                        // Limpiar cache expirado
                        await localforage.removeItem(CACHE_KEY);
                    }
                    await getDataFromFirebase();
                }
            } catch (error) {
                console.error("Error al procesar adicionales:", error);
                setError("No pudimos cargar los complementos. Por favor, inténtalo de nuevo.");
                setIsLoading(false);
            }
        };
        
        fetchAdicionales();
    }, [getDataFromFirebase]);

    const handleRetry = async () => {
        await getDataFromFirebase();
    };

    const handleRefresh = async () => {
        await localforage.removeItem(CACHE_KEY);
        await getDataFromFirebase();
    };

    if (isLoading) {
        return (
            <div className="adicionales-loading">
                <h2 className="adicionales-loading-title">Cargando detalles especiales para tu regalo...</h2>
                <div className="adicionales-loader-container">
                    <FadeLoader color="#a70000" />
                </div>
                <p className="adicionales-loading-subtitle">Estamos preparando opciones para hacer tu regalo aún más especial</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="adicionales-error">
                <div className="adicionales-error-icon">!</div>
                <h2 className="adicionales-error-title">¡Ups! Algo salió mal</h2>
                <p className="adicionales-error-message">{error}</p>
                <button className="adicionales-retry-button" onClick={handleRetry}>
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="adicionales-container">
            <div className="adicionales-header">
                <h2 className="adicionales-title">Personaliza tu regalo</h2>
                <p className="adicionales-subtitle">
                    Dale un toque especial a tu envío con estos detalles exclusivos
                </p>
                {usingCache && (
                    <button 
                        className="adicionales-refresh-button" 
                        onClick={handleRefresh}
                        title="Actualizar complementos"
                    >
                        <span>↻</span> Actualizar
                    </button>
                )}
            </div>
            
            {adicionales.length === 0 ? (
                <div className="adicionales-empty">
                    <div className="adicionales-empty-icon">🎁</div>
                    <h3 className="adicionales-empty-title">Sin complementos disponibles</h3>
                    <p className="adicionales-empty-message">
                        En este momento no hay opciones adicionales disponibles para este producto.
                        Por favor, continúa con tu compra o consulta más tarde.
                    </p>
                </div>
            ) : (
                <>
                    <div className="adicionales-benefits">
                        <div className="adicionales-benefit-item">
                            <span className="adicionales-benefit-icon">✨</span>
                            <span className="adicionales-benefit-text">Sorprende con detalles únicos</span>
                        </div>
                        <div className="adicionales-benefit-item">
                            <span className="adicionales-benefit-icon">🚚</span>
                            <span className="adicionales-benefit-text">Envío en el mismo pedido</span>
                        </div>
                        <div className="adicionales-benefit-item">
                            <span className="adicionales-benefit-icon">❤️</span>
                            <span className="adicionales-benefit-text">Haz tu regalo inolvidable</span>
                        </div>
                    </div>
                    
                    <div className="adicionales-list-wrapper">
                        <AdicionalList adicional={adicionales} />
                    </div>
                    
                    <div className="adicionales-footer">
                        <p className="adicionales-tip">
                            <span className="adicionales-tip-icon">💡</span> 
                            <strong>Consejo:</strong> Los complementos perfectos hacen que tu regalo sea recordado por más tiempo.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdicionalListContainer;