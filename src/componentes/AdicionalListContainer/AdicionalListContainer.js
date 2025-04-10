import React, { useEffect, useState } from "react";
import AdicionalList from "../AdicionalList/AdicionalList";
import { FadeLoader } from "react-spinners";
import { collection, getDocs } from "firebase/firestore";
import { baseDeDatos } from "../../admin/FireBaseConfig";
import "./AdicionalListContainer.css";

const AdicionalListContainer = () => {
    const [adicionales, setAdicionales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchAdicionales = async () => {
            try {
                setIsLoading(true);
                const querySnapshot = await getDocs(collection(baseDeDatos, 'adicionales'));
                
                if (querySnapshot.empty) {
                    setAdicionales([]);
                } else {
                    const adicionalesData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setAdicionales(adicionalesData);
                }
                setError(null);
            } catch (error) {
                console.error("Error al obtener adicionales:", error);
                setError("No pudimos cargar los complementos. Por favor, inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAdicionales();
    }, []);

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        // Re-intentar carga de datos
        const fetchAdicionales = async () => {
            try {
                const querySnapshot = await getDocs(collection(baseDeDatos, 'adicionales'));
                const adicionalesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAdicionales(adicionalesData);
                setError(null);
            } catch (error) {
                console.error("Error al reintentar obtener adicionales:", error);
                setError("No pudimos cargar los complementos. Por favor, inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAdicionales();
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