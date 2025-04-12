"use client"

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useCart } from '../../context/CartContext';
import { baseDeDatos } from '../../admin/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';
const Directions = ({ locationSelect, comoComprar }) => {
  const {
    setLocationValue,
    setLocation,
    setLocationName,
    setFinalPrice,
    dolar,
    totalPrecio,
    priceDolar,
  } = useCart();
  const [selectedValue, setSelectedValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    const fetchDirections = async () => {
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
      }
    };

    fetchDirections();
  }, [dolar, priceDolar]);

  useEffect(() => {
    // Actualiza el total cuando cambia priceDolar
    setTotal(totalPrecio());
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

  let selectedLocationMessage
  if ( locationSelect) {

   selectedLocationMessage = (
    <p className='selected-location-info'>
      La localidad que seleccionó es:{' '}
      <strong>
        {locationSelect.name} - Costo: {priceDolar ? 'USD$' : '$'}
        {locationSelect.value}
      </strong>
    </p>
  );
}

  if (locationSelect && Object.keys(locationSelect).length !== 0) {
    return (
      <div className='select-directions'>
        <h4 className='localidad-titulo'>Localidad seleccionada:</h4>
        <Select
          value={locationSelect}
          placeholder='Seleccione o escriba una dirección'
          defaultValue={locationSelect}
          options={options}
          onChange={handleSelectChange}
        />
        {selectedLocationMessage}
      </div>
    );
  }


    if (comoComprar) {
      return (
        <div className='select-directions'>
          <h4 className='localidad-titulo'>Seleccione una localidad:</h4>
          <Select
            value={selectedValue}
            placeholder='Seleccione o escriba una dirección'
            options={options} // Usa el array de objetos
            getOptionLabel={(option) => option.name} // Muestra solo el campo "name"
            onChange={handleComoComprarSelectLocation}

          />
        </div>
      );
    }
    

  return (
    <div className='select-directions'>
      <h4 className='localidad-titulo'>Seleccione la Localidad del envío</h4>
      <Select
        value={selectedValue}
        placeholder='Seleccione o escriba una dirección'
        defaultValue={{ label: 'Seleccione una Localidad', value: '' }}
        options={options}
        onChange={handleSelectChange}
      />
      {
        selectedValue &&
        <p>
        <span className='selected-location-info'>
          Localidad seleccionada: {selectedValue.name} - Costo: ${selectedValue.value.toLocaleString('es-AR')}
        </span>
      </p>
      }
    </div>
  );
}

export default Directions;
