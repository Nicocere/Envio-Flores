"use client"
import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import style from './direcciones.module.css'
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { Button, Checkbox } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeSwitchContext';

function AddDirections() {
    const navigate = useRouter();
    const { watch, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const [editingDirection, setEditingDirection] = useState(null);
    const [directions, setDirections] = useState([]);
    const [newDirection, setNewDirection] = useState({
        name: '', value: '', cost: ''
    });

    const [selectedDirections, setSelectedDirections] = useState([]);

    const fetchDirections = async () => {
        const directionsRef = collection(baseDeDatos, 'direcciones');
        const orderedQuery = query(directionsRef, orderBy('name'));

        const directionsSnapshot = await getDocs(orderedQuery);
        const directionsData = [];
        directionsSnapshot.forEach((doc) => {
            directionsData.push({ id: doc.id, ...doc.data() });
        });
        setDirections(directionsData);
    };

    const handleCheckboxChange = (direction) => {
        if (isSelected(direction)) {
            setSelectedDirections(selectedDirections.filter(dir => dir.id !== direction.id));
        } else {
            setSelectedDirections([...selectedDirections, direction]);
        }
    };

    const isSelected = (direction) => {
        return selectedDirections.some(dir => dir.id === direction.id);
    };

    const modifySelectedDirections = async () => {
        navigate('/administrador/editMassiveDirections', { state: { selectedDirections } });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        const fieldsFilled = (
            watch('name') &&
            watch('cost')
        );
        if (!fieldsFilled) {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos antes de confirmar.',
            });
            return;
        }

        try {
            const nuevaDireccion = {
                name: data.name,
                value: parseFloat(data.cost),
                cost: parseFloat(data.cost),
            };

            const costosCollectionRef = collection(baseDeDatos, 'direcciones');
            await addDoc(costosCollectionRef, nuevaDireccion);

            setIsLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Costo Agregado',
                text: 'La nueva direccion se ha añadido correctamente.',
            });

            setValue('name', '');
            setValue('cost', '');

            fetchDirections();
        } catch (error) {
            setIsLoading(false);
            console.error('Error al añadir la Direccion: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un problema añadiendo la Direccion: ${error.message}`,
            });
        }
    }

    const editDirection = (direction) => {
        setEditingDirection({ ...direction });
    };

    const saveDirection = async () => {
        if (editingDirection) {
            const directionRef = doc(baseDeDatos, 'direcciones', editingDirection.id);
            await updateDoc(directionRef, {
                value: editingDirection.cost,
                cost: editingDirection.cost,
                name: editingDirection.name,
            });
            Swal.fire({
                icon: 'success',
                title: 'Dirección actualizada',
            });
            setEditingDirection(null);
            fetchDirections();
        }
    };

    const deleteDirection = async (directionId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esta acción.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await deleteDoc(doc(baseDeDatos, 'direcciones', directionId));
                Swal.fire({
                    icon: 'success',
                    title: 'Dirección Eliminada',
                    text: 'Has eliminado una dirección',
                });
                fetchDirections();
            }
        } catch (e) {
            console.error('Error al eliminar la dirección: ', e);
            Swal.fire('Error', `Hubo un problema eliminando la dirección. Error:${e}`, 'error');
        }
    };

    useEffect(() => {
        fetchDirections();
    }, []);

    return (
        <div className={`${style.divDirections} ${isDarkMode ? style.dark : style.light}`}>
            <div className={style.divAddDirection}>

            <div className={style.perfilUsuarioBtns}>
                <Button color='error' variant='contained' size='small' onClick={() => navigate.back()}>Volver atrás</Button>
            </div>

            <h1>Direcciones</h1>
                <h3>Agregar Nuevas Direcciones</h3>
                <p className={style.textInfo}>
                    <strong>¿Qué es una dirección?</strong><br />
                    Una dirección puede referirse a una ubicación específica a la que se envían productos o se prestan servicios. Es importante definir claramente la dirección para asegurar una entrega precisa y eficiente.
                </p>
                <p className={style.textInfo}>
                    <strong>Instrucciones para agregar una nueva dirección:</strong><br />
                    1. <strong>Nombre de la Localidad:</strong> Ingrese un nombre descriptivo para la localidad. Esto ayudará a identificar fácilmente la dirección en la lista.<br />
                    2. <strong>Precio del viaje a la Localidad:</strong> Ingrese el precio asociado con el viaje a la localidad. Asegúrese de que el valor sea numérico y represente el costo de manera precisa.
                </p>
                <form className={style.formAddDirection} onSubmit={handleSubmit(onSubmit)}>
                    <label> Nombre de la Localidad </label>
                    <input
                        {...register('name', { required: true })}
                        placeholder="Nombre de la localidad.."
                        value={newDirection.name}
                        onChange={e => setNewDirection({ ...newDirection, name: e.target.value })}
                    />
                    {errors.name && <p style={{ color: 'red', fontWeight: '800' }}>El nombre de la dirección es requerido</p>}

                    <label>Precio del viaje a la Localidad</label>
                    <input
                        {...register('cost', { required: true })}
                        value={newDirection.cost}
                        name="cost"
                        type='number'
                        onChange={e => setNewDirection({ ...newDirection, cost: e.target.value })}
                        placeholder="Precio del costo"
                    />
                    {errors.cost && <p style={{ color: 'red', fontWeight: '800' }}>El valor del costo es requerido</p>}

                    {isLoading ? (
                        <div className="">
                            Agregando Nueva Dirección, aguarde....
                            <PulseLoader color={isDarkMode ? '#670000' : '#670000'} />
                        </div>
                    ) : <Button sx={{ color: isDarkMode ? 'white' : '#670000', border: '3px solid #670000', margin: '20px', borderRadius: '10px', padding: '10px 30px', background: 'transparent', '&:hover': { background: '#ffffff', color: '#670000' } }} >Agregar Dirección</Button>}
                </form>
            </div>

            <h2>Todas las Direcciones</h2>
            <div>
                {selectedDirections.length > 0 && (
                    <Button color='secondary' sx={{ marginBottom: '25px' }} variant='contained' size='small'
                        onClick={modifySelectedDirections}>Modificar Direcciones</Button>
                )}
            </div>

            <div className={style.selectAllContainer}>
                <Checkbox color='success' style={{ margin: '0 20px', padding: '10px' }}
                    type='checkbox'
                    checked={selectedDirections.length === directions.length && directions.length > 0}
                    onChange={(e) => {
                        if (e.target.checked) {
                            const allIds = directions.map(direction => direction);
                            setSelectedDirections(allIds);
                        } else {
                            setSelectedDirections([]);
                        }
                    }}
                />
                {selectedDirections.length === directions.length && directions.length > 0 ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </div>

            <p>Total de direcciones: {directions.length}</p>
            {selectedDirections.length > 0 && <p>Direcciones seleccionadas: {selectedDirections.length}</p>}

            <table className={style.tableDirect}>
                <thead>
                    <tr>
                        <th>Seleccionar</th>
                        <th>Localidad</th>
                        <th>Value</th>
                        <th>Cost</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {directions.map((direction) => (
                        <tr key={direction.id}>
                            <td>
                                <input
                                    type='checkbox'
                                    checked={selectedDirections.includes(direction)}
                                    onChange={() => handleCheckboxChange(direction)}
                                />
                            </td>
                            <td>
                                {editingDirection && editingDirection.id === direction.id ? (
                                    <input
                                        type='text'
                                        value={editingDirection.name}
                                        onChange={(e) =>
                                            setEditingDirection({ ...editingDirection, name: e.target.value })
                                        }
                                    />
                                ) : (
                                    direction.name
                                )}
                            </td>
                            <td>
                                {editingDirection && editingDirection.id === direction.id ? (
                                    <input
                                        type='number'
                                        value={editingDirection.value}
                                        onChange={(e) =>
                                            setEditingDirection({ ...editingDirection, value: e.target.value, cost: e.target.value })
                                        }
                                    />
                                ) : (
                                    `$ ${direction.value}`
                                )}
                            </td>
                            <td>
                                {editingDirection && editingDirection.id === direction.id ? (
                                    <input
                                        type='number'
                                        value={editingDirection.cost}
                                        onChange={(e) =>
                                            setEditingDirection({ ...editingDirection, value: e.target.value, cost: e.target.value })
                                        }
                                    />
                                ) : (
                                    `$ ${direction.cost}`
                                )}
                            </td>
                            <td className={style.btns}>
                                {editingDirection && editingDirection.id === direction.id ? (
                                    <Button variant='contained' size='small' color='success' sx={{ m: '5px 15px', background: isDarkMode ? '#670000' : '#670000' }} onClick={saveDirection}>Guardar</Button>
                                ) : (
                                    <Button variant='contained' size='small' color='secondary' sx={{ m: '5px 15px' }} onClick={() => editDirection(direction)}>Editar</Button>
                                )}
                                <Button variant='contained' size='small' color='error' onClick={() => deleteDirection(direction.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddDirections;