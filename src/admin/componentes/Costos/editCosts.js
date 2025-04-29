"use client"
import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import style from './costos.module.css'
import { PulseLoader } from 'react-spinners';
import { Button } from '@mui/material';
import { useTheme } from '@/context/ThemeSwitchContext';

function EditCosts() {
    const { watch, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useRouter();
    const [costos, setCostos] = useState([]);

    const fetchCosts = async () => {
        const costosRef = collection(baseDeDatos, 'costos');
        const costosSnapShot = await getDocs(costosRef);
        const costosData = [];
        costosSnapShot.forEach((doc) => {
            costosData.push({ id: doc.id, ...doc.data() });
        });
        setCostos(costosData);
    };

    useEffect(() => {
        fetchCosts();
    }, []);

    const [editCosts, setEditCosts] = useState({
        nombre: '', categoria: '', precio: ''
    });

    const editCost = (cost) => {
        setEditCosts({ ...cost }); // Copiar la dirección para editarla
    };

    const saveCost = async () => {
        if (editCosts) {
            const directionRef = doc(baseDeDatos, 'costos', editCosts.id);
            await updateDoc(directionRef, {
                nombre: editCosts.nombre,
                precio: editCosts.precio,
                categoria: editCosts.categoria,
            });
            Swal.fire({
                icon: 'success',
                title: 'Costo actualizado',
            });
            setEditCosts({ nombre: '', categoria: '', precio: '' });
            fetchCosts();
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        const fieldsFilled = (
            watch('nombre') &&
            watch('categoria') &&
            watch('precio')
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
            const nuevoCosto = {
                nombre: data.nombre,
                categoria: data.categoria,
                precio: parseFloat(data.precio), // Asegúrate de convertir el valor a número si es necesario
            };

            // Agregar el nuevo costo a Firebase
            const costosCollectionRef = collection(baseDeDatos, 'costos');
            await addDoc(costosCollectionRef, nuevoCosto);

            setIsLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Costo Agregado',
                text: 'El nuevo costo se ha añadido correctamente.',
            });

            // Limpiar los campos del formulario después de agregar
            setValue('nombre', '');
            setValue('categoria', '');
            setValue('precio', '');

            // Actualizar la lista de costos
            fetchCosts();
        } catch (error) {
            setIsLoading(false);
            console.error('Error al añadir el costo: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un problema añadiendo el costo: ${error.message}`,
            });
        }
    };

    const deleteCost = async (costId) => {
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
                await deleteDoc(doc(baseDeDatos, 'costos', costId));
                Swal.fire({
                    icon: 'success',
                    title: 'Costo Eliminado',
                    text: 'Has eliminado un costo',
                });
                fetchCosts();
            }
        } catch (e) {
            console.error('Error al eliminar el costo: ', e);
            Swal.fire(
                'Error',
                `Hubo un problema eliminando el costo. Error:${e}`,
                'error'
            );
        }
    };


    return (
        <div className={`${style.divEditCost} ${isDarkMode ? style.dark : style.light}`}>
            <div className={style.addCost}>
                <div className={style.perfilUsuarioBtns}>
                    <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
                </div>

                <h1>Costos</h1>
    
                <p className={style.textInfo}>
                    <strong>¿Qué es un costo?</strong><br />
                    Un costo puede referirse a varios tipos de gastos o precios asociados con productos o servicios. Por ejemplo, puede ser el precio por unidad de un producto, el costo de un servicio premium, o incluso el costo del dólar en el mercado. Es importante definir claramente el tipo de costo que estás agregando para mantener una gestión financiera precisa y organizada.
                </p>
                <p className={style.textInfo3}>
                    <strong>Instrucciones para agregar un nuevo costo:</strong><br />
                    1. <strong>Nombre del Costo:</strong> Ingrese un nombre descriptivo para el costo. Esto ayudará a identificar fácilmente el costo en la lista.<br />
                    2. <strong>Categoria:</strong> Seleccione una categoría adecuada para el costo. Las opciones disponibles son: Flores, Rosas, Cambio de Producto, Envíos, Moneda.<br />
                    3. <strong>Precio del Costo:</strong> Ingrese el precio asociado con el costo. Asegúrese de que el valor sea numérico y represente el costo de manera precisa.
                </p>

                <h3>Agregar Nuevos Costos</h3>

                <form className={style.formAddCost} onSubmit={handleSubmit(onSubmit)}>
                    <label> Nombre del Costo </label>
                    <input
                        {...register('nombre', { required: true })}
                        placeholder="Nombre del costo"
                        value={editCosts.nombre}
                        onChange={e => setEditCosts({ ...editCosts, nombre: e.target.value })}
                    />
                    {errors.nombre && <p style={{ color: 'red', fontWeight: '800' }}>El nombre del costo es requerido</p>}

                    <label>Categoria</label>
                    <select
                        {...register('categoria', { required: true })}
                        value={editCosts.categoria}
                        onChange={e => setEditCosts({ ...editCosts, categoria: e.target.value })}
                    >
                        <option value="">Seleccione una categoría</option>
                        <option value="Flores">Flores</option>
                        <option value="Rosas">Rosas</option>
                        <option value="cambioProducto">Cambio de Producto</option>
                        <option value="envios">Envíos</option>
                        <option value="moneda">Moneda</option>
                    </select>
                    {errors.categoria && <p style={{ color: 'red', fontWeight: '800' }}>La categoría del costo es requerida</p>}

                    <label>Precio del Costo</label>
                    <input
                        {...register('precio', { required: true })}
                        value={editCosts.precio}
                        name="precio"
                        type='number'
                        onChange={e => setEditCosts({ ...editCosts, precio: e.target.value })}
                        placeholder="Precio del costo"
                    />
                    {errors.precio && <p style={{ color: 'red', fontWeight: '800' }}>El valor del costo es requerido</p>}

                    {isLoading ? (
                        <div className="">
                            Agregando Nuevo Costo, aguarde....
                            <PulseLoader color={isDarkMode ? '#670000' : '#670000'} />
                        </div>
                    ) : <Button sx={{ color: isDarkMode ? 'white' : '#670000', border: '3px solid #670000', margin: '20px', borderRadius: '10px', padding: '10px 30px', background: 'transparent', '&:hover': { background: '#ffffff', color: '#670000' } }} type="submit">Agregar Costo</Button>}
                </form>
            </div>

            <h2 className={style.titleCost}>Todas los Costos</h2>
            <p className={style.textInfo2}>A continuación se muestra una lista de todos los costos actuales. Puede editar o eliminar cualquier costo utilizando los botones correspondientes en la columna de acciones.</p>
            <table className={style.tableCosts}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Costo</th>
                        <th>Categoria</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {costos.map((cost) => (
                        <tr key={cost.id}>
                            <td>
                                {editCosts && editCosts.id === cost.id ? (
                                    <input
                                        type='text'
                                        value={editCosts.nombre}
                                        onChange={(e) =>
                                            setEditCosts({ ...editCosts, nombre: e.target.value })
                                        }
                                    />
                                ) : (
                                    cost.nombre
                                )}
                            </td>
                            <td>
                                {editCosts && editCosts.id === cost.id ? (
                                    <input
                                        type='number'
                                        value={editCosts.precio}
                                        onChange={(e) =>
                                            setEditCosts({ ...editCosts, precio: e.target.value })
                                        }
                                    />
                                ) : (
                                    `$ ${cost.precio}`
                                )}
                            </td>
                            <td>
                                {editCosts && editCosts.id === cost.id ? (
                                    <select
                                        value={editCosts.categoria}
                                        onChange={(e) =>
                                            setEditCosts({ ...editCosts, categoria: e.target.value })
                                        }
                                    >
                                        <option value="Flores">Flores</option>
                                        <option value="Rosas">Rosas</option>
                                        <option value="Cambio de Producto">Cambio de Producto</option>
                                        <option value="Envíos">Envíos</option>
                                        <option value="Moneda">Moneda</option>
                                    </select>
                                ) : (
                                    `${cost.categoria}`
                                )}
                            </td>
                            <td>
                                {editCosts && editCosts.id === cost.id ? (
                                    <Button className={style.btnTableEdit} onClick={saveCost}>Guardar</Button>
                                ) : (
                                    <Button className={style.btnTableEdit} color='secondary' onClick={() => editCost(cost)}>Editar</Button>
                                )}
                                <Button className={style.btnTableDelete} onClick={() => deleteCost(cost.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EditCosts;