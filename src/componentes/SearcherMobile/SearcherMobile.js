import React, { useContext, useEffect, useRef, useState } from "react";
import { SearchContext, useSearch } from "../../context/SearchContext";
import './searcherMobile.css'
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';


const SearcherMobile = ({ onClick }) => {
  const { changeList, setNavBarSearcher, navBarSearcher, clearInputNavBar,
    setClearInputMain, setClearInputNavBar, clearInputMain } = useSearch();
  const [itemEncontrado, setItemEncontrado] = useState([]);
  const [busqueda, setBusqueda] = useState('');


  //Traerme los productos
  const [products, setProducts] = useState([]); // State para almacenar los productos descifrados

  // Función para descifrar los productos almacenados en localStorage
  const decryptProducts = async () => {
    const storedEncryptedData = localStorage.getItem('p');
    const parsedStoredData = JSON.parse(storedEncryptedData);

 // Comprobar si parsedStoredData es nulo antes de intentar acceder a sus propiedades
 if (!parsedStoredData || !parsedStoredData.nonce || !parsedStoredData.key || !parsedStoredData.data) {
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
    evento.preventDefault()
    setBusqueda(evento.target.value);

    filtrado(evento.target.value);
    if (!navBarSearcher) {
      setNavBarSearcher(true);
    }
  };

  // useEffect(() => {
  //   if (!clearInputMain && navBarSearcher && busqueda) {
  //     setClearInputNavBar(false);
  //     setClearInputMain(true);
  //   } else if (clearInputNavBar && busqueda) {
  //     setBusqueda('');
  //   }
  // }, [clearInputMain, navBarSearcher, busqueda, clearInputNavBar, setClearInputNavBar, setClearInputMain]);


  const filtrado = (prodBuscado) => {

    const resultadoBusqueda = products?.filter((prod) => {
      if (prod.nombre.toString().toLowerCase().includes(prodBuscado.toLowerCase())) {
        return prod;
      }
    });
    setItemEncontrado(resultadoBusqueda);
  };

  const handleSearchClick = (e) => {
    // Evita que el evento de clic se propague al padre
    e.stopPropagation();
    // Desplázate hacia el componente ItemListContainer
    // document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
  };


  // Manejador de eventos para la tecla "Enter"
  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault()
      // Si se presiona "Enter", cierra el Drawer
      onClick(); // Esta función debería cerrar el Drawer
    }
  };


  useEffect(() => {
    changeList(itemEncontrado);
  }, [itemEncontrado]);

  return (
    <form className="form-buscador-mobile" onSubmit={handleSearchClick}>
      <input
        type="text"
        className={busqueda ? 'input-buscador-full-navbar-mobile' : 'input-buscador-empty-navbar-mobile'}
        value={busqueda}
        placeholder="Buscar Producto..."
        onChange={handleChange}
        onClick={(e) => {
          handleSearchClick(e);
        }}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
};

export default SearcherMobile;
