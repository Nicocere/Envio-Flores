'use client'
import React, { useState, useEffect, useRef } from 'react';
import { baseDeDatos } from '@/admin/FireBaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { FaStar, FaRegSmile } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Comentarios.module.css';
import { useTheme } from '@/context/ThemeSwitchContext';
import Swal from 'sweetalert2';
import { TbFaceSmile } from "react-icons/tb";
import { FiSend } from "react-icons/fi";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { ImHeart } from "react-icons/im";

import { CgSpinner } from "react-icons/cg";

const Comentarios = ({datosComprador}) => {
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [calificacion, setCalificacion] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { isDarkMode } = useTheme();
    const commentRef = useRef(null);
    const maxLength = 500;

    // Función para contar caracteres restantes
    const getRemainingChars = () => maxLength - nuevoComentario.length;
    
    // Función para verificar si el formulario es válido
    const isFormValid = () => nuevoComentario.trim().length >= 10 && calificacion > 0;

    const enviarComentario = async (e) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, escribe un comentario (mínimo 10 caracteres) y selecciona una calificación.',
                iconColor: 'var(--primary-color)',
                confirmButtonColor: 'var(--primary-color)',
            });
            return;
        }

        setLoading(true);

        try {
            const comentarioDoc = {
                author: `${datosComprador.nombreComprador} ${datosComprador.apellidoComprador || ''}`,
                comment: nuevoComentario.trim(),
                starRating: calificacion,
                date: new Date(),
                approved: false,
                email: datosComprador.email || '',
            };

            const docRef = await addDoc(collection(baseDeDatos, 'comentarios'), comentarioDoc);

            if (docRef.id) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setNuevoComentario('');
                    setCalificacion(0);
                    setHoverRating(0);
                }, 3000);
            }
        } catch (error) {
            console.error('Error al enviar comentario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el comentario. Por favor, intenta nuevamente más tarde.',
                iconColor: 'var(--error-color)',
                confirmButtonColor: 'var(--primary-color)',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={styles.title}>Tu opinión nos importa
            <ImHeart style={{ marginLeft: '8px', verticalAlign: 'middle' }}  />

            </h2>
            
            <p className={styles.text}>
                Hola {datosComprador?.nombreComprador || 'estimado cliente'}, 
                nos encantaría conocer tu experiencia con nosotros
            </p>

            <form onSubmit={enviarComentario} className={styles.form}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <CgSpinner size={40} color="var(--primary-color)" className="animate-spin" />
                    </div>
                )}
                
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div 
                            className={styles.successMessage}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <FaRegSmile className={styles.successIcon} />
                            <p className={styles.successText}>¡Gracias por compartir tu experiencia!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.ratingContainer}>
                    <p className={styles.ratingLabel}>
                        ¿Cómo calificarías nuestra atención? <span className={styles.required}>*</span>
                    </p>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaStar
                                        className={`${styles.star} ${(hoverRating || calificacion) >= ratingValue ? styles.starActive : ''}`}
                                        onMouseEnter={() => setHoverRating(ratingValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setCalificacion(ratingValue)}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="comentario">
                        Cuéntanos tu experiencia <span className={styles.required}>*</span>
                    </label>
                    <textarea
                        id="comentario"
                        ref={commentRef}
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value.slice(0, maxLength))}
                        placeholder="¿Qué te pareció nuestro servicio? ¿Te gustaron las flores? Comparte tu experiencia..."
                        className={styles.textarea}
                        required
                        minLength={10}
                        maxLength={maxLength}
                    />
                    <div className={`${styles.characterCount} ${getRemainingChars() < 50 ? styles.characterCountWarning : ''}`}>
                        {getRemainingChars()} caracteres restantes
                    </div>
                </div>

                <motion.button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={loading || !isFormValid()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Enviando...' : (
                        <>
                            Enviar mi comentario
                            <FiSend style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                        </>
                    )}
                </motion.button>

                {!isFormValid() && (
                    <p className={styles.warningText}>
                        <FaRegFaceSmileBeam  style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Por favor califica nuestro servicio y deja un breve comentario (mínimo 10 caracteres)
                    </p>
                )}
            </form>
        </motion.div>
    );
};

export default Comentarios;