import React, { useState } from 'react';
import styles from './Pagination.module.css';
import { useTheme } from '@/context/ThemeSwitchContext';
import Searcher from '../Searcher/Searcher';
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
import { motion, AnimatePresence } from "framer-motion";



const PaginationComponent = ({ currentPage, totalItems, setCurrentPage, page_size, items, activeFilters, sortOrder, setSortOrder, allProds }) => {
  const totalPages = Math.ceil(totalItems / page_size);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const { isDarkMode } = useTheme();
  const [expandedFilters, setExpandedFilters] = useState(false);  // Añadir este estado

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

  // Variantes de animación para el contenido desplegable
  const accordionVariants = {
    hidden: {

      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Variantes para el icono de expandir
  const iconVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  };

  // Manejar el cambio de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ bottom: 0, behavior: 'smooth' });
    }
  };

  // Manejo de filtros
  const handleFilterChange = (filterType) => {
    // Si ya está seleccionado, lo desactivamos
    if (sortOrder === filterType) {
      setSortOrder('');
    } else {
      setSortOrder(filterType);
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSortOrder('');
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
    <div className="filter-container-desktop">
      <div
        className="filter-header-wrapper-desktop"
        onClick={() => setExpandedFilters(!expandedFilters)}
      >
        <div className="filter-header-desktop">
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
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                startIcon={<RestartAltIcon />}
                size="small"
              >
                Limpiar
              </Button>
            </Tooltip>
          )}

          <motion.div
            variants={iconVariants}
            initial="collapsed"
            animate={expandedFilters ? "expanded" : "collapsed"}
            transition={{ duration: 0.3 }}
          >
            <ExpandMoreIcon className="expand-icon-desktop" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expandedFilters && (
          <motion.div
            variants={accordionVariants}
            initial="hidden"
            animate="visible"
            className="filter-content-desktop"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Si no hay items o solo hay una página, no mostrar la paginación
  if (totalItems <= page_size) {
    return null;
  }

  return (
    <div className={`${styles.paginationContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <Box className="filter-section">
        {isSmallScreen ? <MobileFilters /> : <DesktopFilters />}
      </Box>
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

      {
        !allProds && (


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
        )
      }

    </div>
  );
};

export default PaginationComponent;