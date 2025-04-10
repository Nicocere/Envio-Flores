import React, { useContext, useEffect, useState } from "react";
import { SearchContext, useSearch } from "../../context/SearchContext";
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from "@mui/material";
import { red } from "@mui/material/colors";
import { useTheme } from "../../context/ThemeSwitchContext";
import './searcherNavBar.css';

const SearcherNavBar = ({ items, noShow }) => {
  const { changeList, setNavBarSearcher, navBarSearcher, clearInputNavBar,
    setClearInputMain, setClearInputNavBar, clearInputMain } = useSearch();
  const [itemEncontrado, setItemEncontrado] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // darkmode
  const {isDarkMode} = useTheme();
  const className = isDarkMode ? 'dark-mode' : '';

  //Traerme los productos
  const [products, setProducts] = useState([]); // State para almacenar los productos descifrados

  // Función para descifrar los productos almacenados en localStorage
  const decryptProducts = async () => {
    const storedEncryptedData = localStorage.getItem('p');
    const parsedStoredData = JSON.parse(storedEncryptedData);

    if (!parsedStoredData?.nonce || !parsedStoredData.key || !parsedStoredData.data) {
      console.log('Datos almacenados incompletos');
      return;
    }
    const nonce = naclUtil.decodeBase64(parsedStoredData.nonce);
    const key = naclUtil.decodeBase64(parsedStoredData.key);
    const encryptedData = naclUtil.decodeBase64(parsedStoredData.data);

    const decryptedData = nacl.secretbox.open(encryptedData, nonce, key);

    if (decryptedData) {
      const textDecoder = new TextDecoder('utf-8');
      const decryptedDataString = textDecoder.decode(decryptedData);
      const parsedData = JSON.parse(decryptedDataString);
      setProducts(parsedData); // Almacena los productos descifrados en el estado
    } else {
      console.log('Error al descifrar los datos');
    }
  };

  useEffect(() => {
    decryptProducts(); // Llama a la función para descifrar los productos
  }, []);



  const handleChange = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    setBusqueda(evento.target.value);

    filtrado(evento.target.value);
    if (!navBarSearcher) {
      setNavBarSearcher(true);
    }
  };

  useEffect(() => {
    if (!clearInputMain && navBarSearcher && busqueda) {
      setClearInputNavBar(false);
      setClearInputMain(true);
    } else if (clearInputNavBar && busqueda) {
      setBusqueda('');
    }
  }, [clearInputMain, navBarSearcher, busqueda, clearInputNavBar, setClearInputNavBar, setClearInputMain]);


  const handleSearchClick = (e) => {
    // Desplázate hacia el componente ItemListContainer
    const productsView = document.getElementById('productos')
    if (productsView) {
      productsView.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleSubmit = (evento) => {
    evento.preventDefault();
    // Aquí puedes poner el código que se debe ejecutar cuando se envía el formulario
  };

  const filtrado = (prodBuscado) => {
    const resultadoBusqueda = products?.filter((prod) => {
      if (prod.nombre.toString().toLowerCase().includes(prodBuscado.toLowerCase())) {
        return prod;
      }
    });
    setItemEncontrado(resultadoBusqueda);
  };

  useEffect(() => {
    changeList(itemEncontrado);
  }, [itemEncontrado]);

  return (
    <div className={`div-buscador-navBar ${className}`}>
      <div className={`buscador-div ${className}`}>
        <form className={`form-buscador ${className}`} onSubmit={handleSubmit}>
        <TextField 
            type="text"
            variant='filled'
            color='error'
            value={busqueda}
            className={`input-buscador ${className}`}
            placeholder="Buscar Producto..."
            onChange={handleChange}
            onClick={handleSearchClick}
            sx={{borderColor:'white', color: isDarkMode ? 'white' : 'black',
             }}
            InputProps={{
              endAdornment: <SearchIcon style={{cursor: 'pointer'}} />,
              style: {
                color: isDarkMode ? 'white' : 'black', // Cambia el color de la letra basado en isDarkMode
              }
            }}
          />

        </form>
      </div>
    </div>
  );
};

export default SearcherNavBar;
