import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import style from './pantallasPromocionales.module.css';
import { LocalFlorist, LocalShipping, Payments, Favorite, Event, Cake, FamilyRestroom, SportsSoccer, BeachAccess, School, EmojiNature, GradeRounded } from '@mui/icons-material';
import { FaGifts } from "react-icons/fa";
import { GiFireworkRocket } from "react-icons/gi";
import { Button, Tooltip } from '@mui/material';
import Swal from 'sweetalert2';

export const backgrounds = [
  { label: 'Navidad', value: 'linear-gradient(185deg, rgb(223 0 0), rgb(9 54 0 / 84%))' },
  { label: 'San Valentín', value: 'linear-gradient(350deg,rgba(100, 1, 1, 0.94),rgba(223, 0, 0, 0.97))' },
  { label: 'Año Nuevo', value: 'linear-gradient(339deg,rgba(255, 217, 0, 0.91),rgba(0, 0, 0, 0.97))' },
  { label: 'Día de la Madre', value: 'linear-gradient(350deg,rgba(255, 127, 95, 0.89),rgba(254, 180, 123, 0.96))' },
  { label: 'Día del Padre', value: 'linear-gradient(350deg,rgba(40, 48, 72, 0.93),rgba(133, 147, 152, 0.9))' },
  { label: 'Día del Niño', value: 'linear-gradient(350deg,rgba(255, 204, 0, 0.97),rgba(255, 153, 0, 0.9))' },
  { label: 'Halloween', value: 'linear-gradient(350deg,rgba(76, 0, 130, 0.89),rgba(255, 68, 0, 0.92))' },
  { label: 'Verano', value: 'linear-gradient(350deg,rgba(0, 200, 255, 0.88),rgba(0, 115, 255, 0.9))' },
  { label: 'Regreso a Clases', value: 'linear-gradient(350deg,rgba(247, 149, 30, 0.93),rgba(255, 208, 0, 0.9))' },
  { label: 'Primavera', value: 'linear-gradient(350deg,rgba(0, 200, 255, 0.89),rgba(146, 254, 157, 0.89))' },
];

export const iconos = {
  Gift: <FaGifts />,
  Favorite: <Favorite />,
  Fireworks: <GiFireworkRocket />,
  LocalFlorist: <LocalFlorist />,
  FamilyRestroom: <FamilyRestroom />,
  SportsSoccer: <SportsSoccer />,
  Star: <GradeRounded />,
  LocalShipping: <LocalShipping />,
  Payments: <Payments />,
  Event: <Event />,
  Cake: <Cake />,
  BeachAccess: <BeachAccess />,
  School: <School />,
  EmojiNature: <EmojiNature />,
};

export const efectos = [
  { label: 'Nieve', value: 'snow' },
  { label: 'Corazones', value: 'hearts' },
  { label: 'Telarañas', value: 'spiders' },
];

const PantallasPromocionales = () => {
  const [pantallas, setPantallas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [validoDesde, setValidoDesde] = useState('');
  const [validoHasta, setValidoHasta] = useState('');
  const [background, setBackground] = useState('');
  const [icono, setIcono] = useState('');
  const [efecto, setEfecto] = useState('');
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetchPantallas();
  }, []);

  const fetchPantallas = async () => {
    const querySnapshot = await getDocs(collection(baseDeDatos, 'pantallasPromocionales'));
    const pantallas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPantallas(pantallas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !validoDesde || !validoHasta || !background || !icono) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos requeridos.',
      });
      return;
    }
    e.preventDefault();

    // const data = { nombre, descripcion, validoDesde, validoHasta, background, icono, efecto };
    const status = validoDesde < validoHasta;
    const habilitado = status ? 'Habilitado' : 'Deshabilitado';

    const show = true

    const pantalla = { nombre, descripcion, validoDesde, validoHasta, background, icono, efecto, habilitado, status, show };

    if (editId) {
      const pantallaRef = doc(baseDeDatos, 'pantallasPromocionales', editId);
      await updateDoc(pantallaRef, pantalla);
      Swal.fire({
        icon: 'success',
        title: 'Pantalla actualizada',
        showConfirmButton: false,
        timer: 1500
      });


      setEditId(null);
    } else {
      await addDoc(collection(baseDeDatos, 'pantallasPromocionales'), pantalla);
      Swal.fire({
        icon: 'success',
        title: 'Pantalla creada',
        showConfirmButton: false,
        timer: 1500
      });
    }
    setNombre('');
    setDescripcion('');
    setValidoDesde('');
    setValidoHasta('');
    setBackground('');
    setIcono('');
    setEfecto('');
    fetchPantallas();
  };

  const handleEdit = (pantalla) => {
    setEditId(pantalla.id);
    setNombre(pantalla.nombre);
    setDescripcion(pantalla.descripcion);
    setValidoDesde(pantalla.validoDesde);
    setValidoHasta(pantalla.validoHasta);
    setBackground(pantalla.background);
    setIcono(pantalla.icono);
    setEfecto(pantalla.efecto);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(baseDeDatos, 'pantallasPromocionales', id));
    fetchPantallas();
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const calculateRemainingTime = () => {
    const now = new Date();
    const endDate = new Date(validoHasta);
    const timeDiff = endDate - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  const renderIcon = (iconName) => {
    return iconos[iconName] || null;
  };

  const renderEfecto = () => {
    const particles = Array.from({ length: 50 }).map((_, index) => (
      <div key={index} className={style.particle} style={{
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * 5}s`
      }} />
    ));

    switch (efecto) {
      case 'snow':
        return <div className={style.snow}>{particles}</div>;
      case 'hearts':
        return <div className={style.hearts}>{particles}</div>;
      case 'spiders':
        return <div className={style.spiders}>{particles}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={style.DivContainer} style={{ background: background && background }}>

      <div className={style.container}>
        <h1>Gestión de Pantallas Promocionales</h1>

        <div className={style.divTextsOrders}>
          <p><strong>1. Crear Pantallas Promocionales:</strong><br />
            • Utiliza este formulario para crear nuevas pantallas promocionales.<br />
            • Completa todos los campos requeridos para asegurar que la pantalla se cree correctamente.<br /><br />

            <strong>2. Editar Pantallas Promocionales:</strong><br />
            • Haz clic en el botón "Editar" junto a la pantalla que deseas modificar.<br />
            • Actualiza los campos necesarios y guarda los cambios.<br /><br />

            <strong>3. Eliminar Pantallas Promocionales:</strong><br />
            • Haz clic en el botón "Eliminar" junto a la pantalla que deseas borrar.<br />
            • Confirma la eliminación para remover la pantalla de la lista.<br /><br />

            <strong>4. Previsualizar Pantallas Promocionales:</strong><br />
            • Haz clic en el botón "Previsualizar" para ver cómo se verá la pantalla promocional.<br />
            • Utiliza esta función para asegurarte de que la pantalla se vea como deseas antes de guardarla.<br /><br />

            <strong>5. Campos del Formulario:</strong><br />
            • <strong>Nombre:</strong> Ingresa un nombre descriptivo para la pantalla promocional.<br />
            • <strong>Descripción:</strong> Proporciona una descripción detallada de la promoción.<br />
            • <strong>Válido Desde:</strong> Selecciona la fecha de inicio de la promoción.<br />
            • <strong>Válido Hasta:</strong> Selecciona la fecha de finalización de la promoción.<br />
            • <strong>Background:</strong> Elige un fondo para la pantalla promocional.<br />
            • <strong>Icono:</strong> Selecciona un icono representativo para la promoción.<br />
            • <strong>Efecto:</strong> Elige un efecto visual para la pantalla promocional.<br /><br />

            <strong>Recuerda mantener actualizadas las promociones y verificar periódicamente los descuentos aplicados para asegurar una gestión efectiva de tu inventario.</strong>
          </p>
        </div>
        <br />
        <br />

        <div className={style.divNewPromo}>
          <h2>{editId !== null ? 'Editar la' : 'Crear nueva'} Pantalla Promocional</h2>

          <form onSubmit={handleSubmit} className={style.form}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
            <label htmlFor="validoDesde">Válido Desde:</label>
            <input
              id="validoDesde"
              type="date"
              placeholder="Válido Desde"
              value={validoDesde}
              onChange={(e) => setValidoDesde(e.target.value)}
              required
            />
            <label htmlFor="validoHasta">Válido Hasta:</label>
            <input
              id="validoHasta"
              type="date"
              placeholder="Válido Hasta"
              value={validoHasta}
              onChange={(e) => setValidoHasta(e.target.value)}
              required
            />
            <label htmlFor="background">Background:</label>
            <div className={style.selectContainer}>
              <select
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                required
              >
                <option value="">Seleccionar Background</option>
                {backgrounds.map((bg) => (
                  <option key={bg.value} value={bg.value}>{bg.label}</option>
                ))}
              </select>
              <div className={style.previewBox} style={{ background: background }}></div>
            </div>
            <label htmlFor="icono">Icono:</label>
            <div className={style.selectContainer}>
              <select
                id="icono"
                value={icono}
                onChange={(e) => setIcono(e.target.value)}
                required
              >
                <option value="">Seleccionar Icono</option>
                {Object.keys(iconos).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <div className={style.previewBox}>{renderIcon(icono)}</div>
            </div>
            <label htmlFor="efecto">Efecto:</label>
            <div className={style.selectContainer}>
              <select
                id="efecto"
                value={efecto}
                onChange={(e) => setEfecto(e.target.value)}
                required
              >
                <option value="">Seleccionar Efecto</option>
                {efectos.map((ef) => (
                  <option key={ef.value} value={ef.value}>{ef.label}</option>
                ))}
              </select>
              <div className={style.previewBox}>{renderEfecto()}</div>
            </div>
            <div className={style.perfilUsuarioBtns}>
              <Button variant='text' size='small' color='error' type="button" onClick={handlePreview}>{preview ? 'Ocultar' : 'Previsualizar'}</Button>
            </div>

            <Button variant='contained' size='large' sx={{ color: '#2f1a0f', border: '1px solid #d4af37', margin: '20px', borderRadius: '10px', padding: '5px 20px', background: '#d4af37', '&:hover': { background: '#ffffff', color: '#2f1a0f' } }} type="submit">{editId ? 'Actualizar' : 'Crear'} Pantalla</Button>

            {/* <button className={style.perfilUsuarioBtns} type="button" onClick={handlePreview}>{preview ? 'Ocultar' : 'Previsualizar'}</button> */}
          </form>
          {preview && (
            <div className={style.preview} style={{ background: background }}>
              <Tooltip title="Cerrar " placement="top">
                <button className={style.closeButton} onClick={handlePreview}>x</button>
              </Tooltip>
              <h2>{nombre}</h2>
              <div className={style.iconos}>
                <p>{renderIcon(icono)} {descripcion} {renderIcon(icono)}</p>
              </div>
              <small>Válido Desde: {validoDesde} - Hasta: {validoHasta}</small>

              <div className={style.buttons}>
                <button>Quiero el descuento</button>
                <button>No lo quiero aún</button>
              </div>
              <div className={style.countdown}>
                Tiempo restante: {calculateRemainingTime()}
              </div>
              {renderEfecto()}
            </div>
          )}
        </div>

      </div>
      <div className={style.containerPantallasActivas}>
        <h2>Pantallas Promocionales</h2>
        <p>Cantidad de pantallas creadas: <strong>{pantallas?.length}</strong></p>
        <div className={style.pantallasList}>
          {
            pantallas.length === 0 ? (
              <div className={style.empty}>No hay pantallas promocionales</div>
            ) :
              <div className={style.pantallaItemcontainer}>

                {pantallas.map((pantalla) => (
                  <div key={pantalla.id} className={style.pantallaItem}>
                    <h3>{pantalla.nombre}</h3>
                    <p>{pantalla.descripcion}</p>
                    <p>Válido Desde: {pantalla.validoDesde}</p>
                    <p>Válido Hasta: {pantalla.validoHasta}</p>
                    <button className={style.btnTableEdit} onClick={() => handleEdit(pantalla)}>Editar</button>
                    <button className={style.btnTableDelete} onClick={() => handleDelete(pantalla.id)}>Eliminar</button>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default PantallasPromocionales;