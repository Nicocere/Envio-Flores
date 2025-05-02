import React, { useState } from 'react';
import styles from './Pagination.module.css';

const PaginationComponent = ({ currentPage, totalItems, setCurrentPage, page_size }) => {
  const totalPages = Math.ceil(totalItems / page_size);
  
  // Genera un array de números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Mostrar primera página
    if (totalPages > 0) pageNumbers.push(1);
    
    // Páginas alrededor de la actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Mostrar última página si hay más de una
    if (totalPages > 1) pageNumbers.push(totalPages);
    
    // Eliminar duplicados y ordenar
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };
  
  // Manejar el cambio de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ bottom: 0, behavior: 'smooth' });
    }
  };
  

  
  // Si no hay items o solo hay una página, no mostrar la paginación
  if (totalItems <= page_size) {
    return null;
  }
  
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        <p className={styles.infoText}>
          <span className={styles.label}>Página:</span> 
          <span className={styles.value}>{currentPage} de {totalPages}</span>
        </p>
        <p className={styles.infoText}>
          <span className={styles.label}>Total:</span> 
          <span className={styles.value}>{totalItems} productos</span>
        </p>
      </div>
      
      <div className={styles.paginationControls}>
        {/* Botón para ir a primera página */}
        <button 
          className={`${styles.pageButton} ${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="Primera página"
        >
          <span className={styles.doubleArrow}>«</span>
        </button>
        
        {/* Botón anterior */}
        <button 
          className={`${styles.pageButton} ${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <span className={styles.arrow}>‹</span>
        </button>
        
        {/* Números de página */}
        <div className={styles.pageNumbers}>
          {getPageNumbers().map((pageNum, idx, arr) => {
            // Verificar si debemos mostrar un separador
            const needsEllipsis = idx > 0 && pageNum - arr[idx - 1] > 1;
            
            return (
              <React.Fragment key={pageNum}>
                {needsEllipsis && (
                  <span className={styles.ellipsis}>...</span>
                )}
                <button 
                  className={`${styles.pageButton} ${pageNum === currentPage ? styles.currentPage : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Botón siguiente */}
        <button 
          className={`${styles.pageButton} ${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <span className={styles.arrow}>›</span>
        </button>
        
        {/* Botón para ir a última página */}
        <button 
          className={`${styles.pageButton} ${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Última página"
        >
          <span className={styles.doubleArrow}>»</span>
        </button>
      </div>
      
  
    </div>
  );
};

export default PaginationComponent;