import React, { useState, useContext, useRef, useEffect } from 'react';
import { CartContext, useCart } from '../../context/CartContext';
import AdicionalCount from '../AdicionalCount/AdicionalCount';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import './AdicionalItem.css';

const AdicionalItem = ({ adicional }) => {
    const { addAdicional, priceDolar, dolar } = useCart();
    const [optionsSelected, setOptionsSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const modalRef = useRef(null);
    const portalElement = document.getElementById('modal-root') || document.body;

    // Formatear precio total como variable para evitar errores
    let totalAdic = 0;

    // Manejo del cierre del modal al hacer clic fuera
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            // Bloquear scroll mientras el modal está abierto
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const handleChange = (id) => {
        const selectedOption = adicional.opciones.find(option => option.id === id);
        const exists = optionsSelected.some(option => option.id === id);

        if (exists) {
            setOptionsSelected(prevOptions => prevOptions.filter(option => option.id !== id));
        } else {
            setOptionsSelected(prevOptions => [...prevOptions, selectedOption]);
        }

        // Si es la primera selección, expandir automáticamente
        if (optionsSelected.length === 0 && !exists) {
            setIsExpanded(true);
        }

        // Si quedó vacía la selección, cerrar resumen
        if (optionsSelected.length === 1 && exists) {
            setIsExpanded(false);
        }
    };

    const onAdd = () => {
        optionsSelected.forEach(option => {
            addAdicional(adicional.id, option.size, option.precio);
        });

        // Feedback visual de éxito
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            closeModal();
        }, 1500);
    };

    const totalPrice = () => {
        totalAdic = optionsSelected.reduce((acc, option) => acc + Number(option.precio), 0);
        const totalAdicInUsd = (totalAdic / dolar).toFixed(2);

        if (priceDolar) {
            return totalAdicInUsd;
        } else {
            return totalAdic;
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    // Renderizado de la tarjeta compacta para el adicional
    const renderAdicionalCard = () => (
        <motion.div
            className={`adicional-card-compact ${addedToCart ? 'adicional-success' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openModal}
        >
            <div className="adicional-compact-image-container">
                <img
                    src={adicional.img}
                    alt={adicional.nombre}
                    className="adicional-compact-image"
                />
                <span className="adicional-compact-badge">Adicional</span>

                {optionsSelected.length > 0 && (
                    <div className="adicional-compact-counter">
                        <span>{optionsSelected.length}</span>
                    </div>
                )}
            </div>
            <div className="adicional-compact-content">
                <h4 className="adicional-compact-title">{adicional.nombre}</h4>
                <button className={optionsSelected.length > 0 ? "adicional-compact-fill-button" : "adicional-compact-button"}>
                    {optionsSelected.length > 0 ? 'Editar selección' : 'Ver opciones'}
                </button>
            </div>
        </motion.div>
    );

    // Renderizado del modal con las opciones
    const renderModal = () => createPortal(
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    className="adicional-modal-backdrop"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >

                    <motion.div
                        className="adicional-modal-container"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="adicional-modal" ref={modalRef}>
                            <div className="adicional-modal-header">
                                <h3 className="adicional-modal-title">{adicional.nombre}</h3>
                                <button
                                    className="adicional-modal-close"
                                    onClick={closeModal}
                                    aria-label="Cerrar"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="adicional-modal-body">
                                <div className="adicional-modal-image-section">
                                    <div className="adicional-modal-image-container">
                                        <img
                                            src={adicional.img}
                                            alt={adicional.nombre}
                                            className="adicional-modal-image"
                                        />
                                    </div>
                                    <p className="adicional-modal-description">
                                        Complemento ideal para sorprender y hacer más especial tu regalo
                                    </p>
                                </div>

                                <motion.div
                                    className="adicional-options"
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                >
                                    <h5 className="adicional-section-title">
                                        <span className="adicional-icon-options"></span>
                                        Opciones disponibles
                                    </h5>

                                    <div className="adicional-modal-options-grid">
                                        {adicional.opciones.map(({ size, precio, id }, index) => {
                                            const precioInUsd = (precio / dolar).toFixed(2);
                                            const isSelected = optionsSelected.some(opt => opt.id === id);

                                            return (
                                                <motion.div
                                                    className={`adicional-option-item ${isSelected ? 'selected' : ''}`}
                                                    key={`${id}-${index}`}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleChange(id)}
                                                >
                                                    <div className="adicional-checkbox-container">
                                                        <input
                                                            className="adicional-checkbox visually-hidden"
                                                            type="checkbox"
                                                            id={`modal-checkbox${id}`}
                                                            name={size}
                                                            checked={isSelected}
                                                            onChange={() => { }} // Controlado por el onClick del div padre
                                                        />
                                                        <label className="adicional-checkbox-custom" htmlFor={`modal-checkbox${id}`}>
                                                            <span className="adicional-checkbox-icon"></span>
                                                        </label>
                                                    </div>

                                                    <div className="adicional-option-info">
                                                        <span className="adicional-option-name">{size}</span>
                                                        <span className="adicional-option-price">
                                                            {priceDolar
                                                                ? `USD ${precioInUsd}`
                                                                : `$${precio.toLocaleString('es-AR')}`
                                                            }
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {isExpanded && optionsSelected.length > 0 && (
                                        <motion.div
                                            className="adicional-selection-details"
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <div className="adicional-summary-header">
                                                <h5 className="adicional-section-title">
                                                    <span className="adicional-icon-selected"></span>
                                                    Resumen de selección
                                                </h5>
                                                <button
                                                    className="adicional-toggle-summary"
                                                    onClick={() => setIsExpanded(!isExpanded)}
                                                >
                                                    Ocultar
                                                </button>
                                            </div>

                                            <div className="adicional-selected-options">
                                                {optionsSelected.map(option => {
                                                    const optionPriceUsd = (option.precio / dolar).toFixed(2);
                                                    return (
                                                        <motion.div
                                                            className="adicional-selected-item"
                                                            key={option.id}
                                                            variants={itemVariants}
                                                        >
                                                            <span className="adicional-selected-name">{option.size}</span>
                                                            <span className="adicional-selected-price">
                                                                {priceDolar
                                                                    ? <span>USD <strong>${optionPriceUsd}</strong></span>
                                                                    : <span>$ <strong>{option.precio.toLocaleString('es-AR')}</strong></span>
                                                                }
                                                            </span>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>

                                            {totalPrice() !== 0 && (
                                                <motion.div
                                                    className="adicional-total-section"
                                                    variants={itemVariants}
                                                >
                                                    <div className="adicional-divider"></div>
                                                    <div className="adicional-total-row">
                                                        <span className="adicional-total-label">Total:</span>
                                                        <span className="adicional-total-amount">
                                                            {priceDolar
                                                                ? <span>USD <strong>${totalPrice()}</strong></span>
                                                                : <span>$ <strong>{totalPrice().toLocaleString('es-AR')}</strong></span>
                                                            }
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="adicional-modal-footer">
                                {!isExpanded && optionsSelected.length > 0 && (
                                    <button
                                        className="adicional-summary-button"
                                        onClick={() => setIsExpanded(true)}
                                    >
                                        Ver resumen ({optionsSelected.length})
                                    </button>
                                )}

                                <div className="adicional-modal-actions">
                                    <button
                                        className="adicional-modal-cancel"
                                        onClick={closeModal}
                                    >
                                        Cancelar
                                    </button>

                                    <AnimatePresence>
                                        {optionsSelected.length > 0 && (
                                            <motion.div
                                                className="adicional-action-area"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                            >
                                                <AdicionalCount
                                                    adicId={adicional.id}
                                                    optionsSelected={optionsSelected}
                                                    img={adicional.img}
                                                    adicional={adicional}
                                                    onAdd={onAdd}
                                                    stock={3}
                                                    modalMode={true}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {addedToCart && (
                                    <div className="adicional-success-message">
                                        <span className="adicional-success-icon">✓</span>
                                        Agregado al carrito exitosamente
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </motion.div >
            )}
        </AnimatePresence>,
        portalElement
    );

    return (
        <>
            {renderAdicionalCard()}
            {renderModal()}
        </>
    );
};

export default AdicionalItem;