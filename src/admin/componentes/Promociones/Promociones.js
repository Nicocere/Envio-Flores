import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, getDocs, doc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import style from './Promociones.module.css';
import { useRouter } from 'next/navigation';
import localforage from 'localforage';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [descuento, setDescuento] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useRouter();

  useEffect(() => {
    fetchPromociones();
    fetchProductos();
  }, []);

  const fetchPromociones = async () => {
    const querySnapshot = await getDocs(collection(baseDeDatos, 'promociones'));
    const promos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPromociones(promos);
  };

  const fetchProductos = async () => {
    const productos = await localforage.getItem('productos');
    setProductos(productos || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    applyPromotionToProducts();
  };

  const applyPromotionToProducts = async () => {

    for (const productId of selectedProducts) {

      const productRef = doc(baseDeDatos, 'productos', productId);
      await updateDoc(productRef, {
        promocion: {
          status: true,
          descuento: parseFloat(descuento),
        },
      });
    }
    Swal.fire({
      icon: 'success',
      title: 'Promoción aplicada con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
    fetchProductos();
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleStatusToggle = async (productId, currentStatus) => {
    const productRef = doc(baseDeDatos, 'productos', productId);
    await updateDoc(productRef, {
      'promocion.status': !currentStatus,
    });
    fetchProductos();
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosConPromocion = productos.filter(producto => producto.promocion);


  return (
    <div className={style.DivContainer}>
      <div className={style.container}>
        <div className={style.perfilUsuarioBtns}>
          <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
        </div>

        <h1 className={style.h1}>Gestión de Promociones</h1>


        <div className={style.divTextsOrders}>
          <p className={style.pOrders}>En esta sección podrás gestionar las promociones de tus productos de manera eficiente y flexible. Aquí tienes todas las opciones disponibles:<br /><br />

          <strong>1. Aplicación de Descuentos:</strong><br />
            • Selecciona múltiples productos usando las casillas de verificación<br />
            • Ingresa el porcentaje de descuento deseado (entre 1% y 99%)<br />
            • Aplica el descuento a todos los productos seleccionados con un solo clic<br /><br />

            <strong>2. Gestión de Promociones Activas:</strong><br />
            • Visualiza todos los productos que tienen descuentos aplicados<br />
            • Controla el estado de cada promoción (activa/inactiva)<br />
            • Modifica o actualiza descuentos existentes<br /><br />

            <strong>3. Búsqueda y Filtrado:</strong><br />
            • Utiliza el buscador para encontrar productos específicos<br />
            • Filtra y organiza los productos con promociones activas<br /><br />

            <strong>4. Pantallas Promocionales:</strong><br />
            • Accede a la sección de pantallas promocionales para gestionar la visualización de ofertas<br />
            • Personaliza cómo se mostrarán los descuentos en la tienda<br /><br />

          <strong>  Recuerda mantener actualizadas las promociones y verificar periódicamente los descuentos aplicados para asegurar una gestión efectiva de tu inventario.</strong></p>
        </div>
        <br />
      </div>

      <div className={style.divPantallasCreadas}>
        <h1 className={style.h1}>CREAR PANTALLAS DE PROMOCIONES</h1>
        <p className={style.pOrders}>Si deseas crear pantallas de promociones para mostrar ofertas especiales y descuentos a tus clientes, haz clic en el siguiente botón:</p>
        <Button onClick={() => navigate.push('/administrador/pantallas-promocionales')} variant='contained' size='large' sx={{ color: '#2f1a0f', border: '1px solid #d4af37', margin: '20px', borderRadius: '10px', padding: '5px 20px', background: '#d4af37', '&:hover': { background: '#ffffff', color: '#2f1a0f' } }}>
          Ir a las pantallas de promoción
        </Button>
      </div>

      <div className={style.divPromociones}>
        <h1 className={style.h1}>APLICAR DESCUENTOS A PRODUCTOS</h1>
        <form onSubmit={handleSubmit} className={style.form}>
          <input
            type="number"
            placeholder="Descuento (%)"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
            required
          />
          <Button variant='contained' size='large' sx={{ color: '#2f1a0f', border: '1px solid #d4af37', margin: '20px', borderRadius: '10px', padding: '5px 20px', background: '#d4af37', '&:hover': { background: '#ffffff', color: '#2f1a0f' } }} type="submit">Aplicar Promoción</Button>
        </form>

        <div className={style.productosList}>
          <h2>Seleccionar Productos para la Promoción</h2>
          <input
            type="text"
            placeholder="Buscar productos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />

          <div className={style.containerProdsFilter}>
            {filteredProductos.map((producto) => (
              <div key={producto.id} className={style.productoItem}>
                <input
                  type="checkbox"
                  className={style.inputCheckbox}

                  checked={selectedProducts.includes(producto.id)}
                  onChange={() => handleProductSelection(producto.id)}
                />
                <h3>{producto.nombre}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={style.promocionesList}>
        <h2>Productos con Promoción</h2>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descuento</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosConPromocion.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.promocion.descuento}%</td>
                <td>{producto.promocion.status ? 'Activada' : 'Desactivada'}</td>
                <td>
                  <Button variant='contained' size='large' sx={{ color: '#2f1a0f', border: '1px solid #d4af37', margin: '20px', borderRadius: '10px', padding: '5px 20px', background: '#d4af37', '&:hover': { background: '#ffffff', color: '#2f1a0f' } }} onClick={() => handleStatusToggle(producto.id, producto.promocion.status)}>
                    {producto.promocion.status ? 'Desactivar' : 'Activar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Promociones;