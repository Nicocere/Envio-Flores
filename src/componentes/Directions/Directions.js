"use client"

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useCart } from '../../context/CartContext';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useTheme } from '@/context/ThemeSwitchContext';
import './directions.css';

const Directions = ({ locationSelect, comoComprar }) => {
  const {
    setLocationValue,
    setLocation,
    setLocationName,
    // setFinalPrice - no se usa
    dolar,
    totalPrecio,
    priceDolar,
  } = useCart();
  const [selectedValue, setSelectedValue] = useState(null);
  const [options, setOptions] = useState([]);
  // total, setTotal - no se usan efectivamente
  const [directions, setDirections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchDirections = async () => {
      setIsLoading(true);
      try {
        const directionsRef = collection(baseDeDatos, 'direcciones');
        const directionsSnapshot = await getDocs(directionsRef);
        const directionsData = [];
        directionsSnapshot.forEach((doc) => {
          const location = doc.data();
          const costInUsd = (location.cost / dolar).toFixed(2);
          const cost = priceDolar ? `${costInUsd}` : `${location.cost}`;
          const transformedLocation = {
            value: Number(cost),
            label:
              location.name +
              ":  " +
              (priceDolar ? "USD$" : "$") +
              cost,
            name: location.name,
          };
          directionsData.push({ id: doc.id, ...transformedLocation });
        });
        setDirections(directionsData);
        setOptions(directionsData);
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirections();
  }, [dolar, priceDolar]);

  useEffect(() => {
    // En lugar de usar total, llamamos a totalPrecio directamente donde sea necesario
    totalPrecio();
  }, [priceDolar, totalPrecio]);

  useEffect(() => {
    // Actualiza locationSelect cuando cambia priceDolar
    if (locationSelect) {
      const updatedLocationSelect = directions.find(
        (dir) => dir.id === locationSelect.id
      );
      if (updatedLocationSelect) {
        setSelectedValue(updatedLocationSelect);
        setLocationName(updatedLocationSelect.name);
        setLocation(updatedLocationSelect);
        setLocationValue(updatedLocationSelect.value);
      }
    }
  }, [priceDolar, locationSelect, directions, setLocationName, setLocation, setLocationValue]);

  const handleSelectChange = selectedOption => {
    setLocationName(selectedOption.name);
    setSelectedValue(selectedOption);
    setLocation(selectedOption);
    setLocationValue(selectedOption.value);
  };

  const handleComoComprarSelectLocation = selectedOption => {
    setLocationName(selectedOption.name);
    setSelectedValue(selectedOption);
    setLocation(selectedOption);
    setLocationValue(selectedOption.value);
  };

  // Estilos personalizados para react-select adaptados al modo oscuro
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: state.isFocused 
        ? 'var(--primary-color)' 
        : isDarkMode ? 'var(--border-color-dark)' : 'var(--border-color)',
      boxShadow: state.isFocused ? '0 0 0 1px var(--primary-color)' : 'none',
      backgroundColor: isDarkMode ? 'var(--background-card-dark)' : 'var(--background-light)',
      color: isDarkMode ? 'var(--text-light)' : 'var(--text-dark)',
      '&:hover': {
        borderColor: 'var(--primary-color)',
      },
      padding: '4px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'var(--primary-color)' 
        : state.isFocused 
          ? isDarkMode ? 'var(--background-dark-gradient)' : 'var(--secondary-color)' 
          : isDarkMode ? 'var(--background-card-dark)' : null,
      color: state.isSelected 
        ? 'var(--text-light)' 
        : isDarkMode ? 'var(--text-light)' : 'var(--text-dark)',
      '&:hover': {
        backgroundColor: state.isSelected 
          ? 'var(--primary-color)' 
          : isDarkMode ? 'var(--primary-dark)' : 'var(--secondary-color)',
      },
      cursor: 'pointer',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? 'var(--text-muted-dark)' : 'var(--text-muted)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? 'var(--text-light)' : 'var(--text-dark)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? 'var(--background-card-dark)' : 'var(--background-light)',
      borderRadius: '8px',
      boxShadow: isDarkMode ? 'var(--shadow-dark-md)' : 'var(--shadow-md)',
    }),
    input: (provided) => ({
      ...provided,
      color: isDarkMode ? 'var(--text-light)' : 'var(--text-dark)',
    }),
  };

  // Mensaje para localidad seleccionada
  let selectedLocationMessage;
  if (locationSelect) {
    selectedLocationMessage = (
      <div className={`location-message ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="location-message-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <p>
          La localidad que seleccionó es:{' '}
          <strong>
            {locationSelect?.name} - Costo: {priceDolar ? 'USD$' : '$'}
            {locationSelect?.value?.toLocaleString('es-AR')}
          </strong>
        </p>
      </div>
    );
  }

  // En caso de que se reciba una localidad ya seleccionada
  if (locationSelect && Object.keys(locationSelect).length !== 0) {
    return (
      <div className={`directions-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="directions-card">
          <div className="directions-header">
            <div className="directions-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h4 className="directions-title">Localidad seleccionada</h4>
          </div>
          
          {isLoading ? (
            <div className="directions-loading">
              <div className="directions-spinner"></div>
              <span>Cargando localidades...</span>
            </div>
          ) : (
            <>
              <Select
                value={locationSelect}
                placeholder="Seleccione o escriba una dirección"
                defaultValue={locationSelect}
                options={options}
                onChange={handleSelectChange}
                styles={customSelectStyles}
                className="directions-select"
                classNamePrefix="select"
              />
              {selectedLocationMessage}
            </>
          )}
        </div>
      </div>
    );
  }

  // Para la vista de "Cómo comprar"
  if (comoComprar) {
    return (
      <div className={`directions-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="directions-card">
          <div className="directions-header">
            <div className="directions-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h4 className="directions-title">Seleccione una localidad</h4>
          </div>
          
          {isLoading ? (
            <div className="directions-loading">
              <div className="directions-spinner"></div>
              <span>Cargando localidades...</span>
            </div>
          ) : (
            <>
              <Select
                value={selectedValue}
                placeholder="Seleccione o escriba una dirección"
                options={options}
                onChange={handleComoComprarSelectLocation}
                styles={customSelectStyles}
                className="directions-select"
                classNamePrefix="select"
              />
              {selectedValue && (
                <div className={`location-message ${isDarkMode ? 'dark-mode' : ''}`}>
                  <div className="location-message-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <p>
                    Localidad seleccionada: <strong>{selectedValue?.name}</strong> - 
                    Costo: <strong>{priceDolar ? 'USD$' : '$'}{selectedValue?.value?.toLocaleString('es-AR')}</strong>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Vista por defecto
  return (
    <div className={`directions-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="directions-card">
        <div className="directions-header">
          <div className="directions-icon truck-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <h4 className="directions-title">Seleccione la localidad del envío</h4>
        </div>
        
        {isLoading ? (
          <div className="directions-loading">
            <div className="directions-spinner"></div>
            <span>Cargando localidades...</span>
          </div>
        ) : (
          <>
            <Select
              value={selectedValue}
              placeholder="Seleccione o escriba una dirección"
              defaultValue={{ label: 'Seleccione una Localidad', value: '' }}
              options={options}
              onChange={handleSelectChange}
              styles={customSelectStyles}
              className="directions-select"
              classNamePrefix="select"
            />
            {selectedValue && (
              <div className={`location-message ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="location-message-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <p>
                  Localidad seleccionada: <strong>{selectedValue?.name}</strong> - 
                  Costo: <strong>{priceDolar ? 'USD$' : '$'}{selectedValue?.value?.toLocaleString('es-AR')}</strong>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Directions;