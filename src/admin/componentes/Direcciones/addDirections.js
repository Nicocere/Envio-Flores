import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import './direcciones.css'
// import { allDirections } from '../../ecommerce.direcciones';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FadeLoader } from 'react-spinners';
import { Button, Checkbox, Input, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

function AddDirections() {

    const navigate = useNavigate();
    const { watch, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const [editingDirection, setEditingDirection] = useState(null);
    const [directions, setDirections] = useState([]);
    const [newDirection, setNewDirection] = useState({
        name: '', value: '', cost: ''
    });

    // Modificación: Nuevo estado para almacenar las direcciones seleccionadas
    const [selectedDirections, setSelectedDirections] = useState([]);

    //Fetch direcciones
    const fetchDirections = async () => {
        const directionsRef = collection(baseDeDatos, 'direcciones');
        const orderedQuery = query(directionsRef, orderBy('name')); // Ordena por el campo 'nombre'

        const directionsSnapshot = await getDocs(orderedQuery);
        const directionsData = [];
        directionsSnapshot.forEach((doc) => {
            directionsData.push({ id: doc.id, ...doc.data() });
        });
        setDirections(directionsData);
    };

    const handleCheckboxChange = (direction) => {
        if (isSelected(direction)) {
            // Si la dirección ya está seleccionada, la quitamos de la lista de seleccionadas
            setSelectedDirections(selectedDirections.filter(dir => dir.id !== direction.id));
        } else {
            // Si la dirección no está seleccionada, la agregamos a la lista de seleccionadas
            setSelectedDirections([...selectedDirections, direction]);
        }
    };

    // Función auxiliar para verificar si una dirección está seleccionada
    const isSelected = (direction) => {
        return selectedDirections.some(dir => dir.id === direction.id);
    };

    const modifySelectedDirections = async () => {


        // Luego de obtener las direcciones seleccionadas, las pasamos como prop a MassiveEditDirections
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
                cost: parseFloat(data.cost), // Asegúrate de convertir el valor a número si es necesario
            };

            // Agregar la nueva direccion a Firebase
            const costosCollectionRef = collection(baseDeDatos, 'direcciones');
            await addDoc(costosCollectionRef, nuevaDireccion);

            setIsLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Costo Agregado',
                text: 'La nueva direccion se ha añadido correctamente.',
            });

            // Limpiar los campos del formulario después de agregar
            setValue('name', '');

            setValue('cost', '');

            // Actualizar la lista de las direcciones
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
        setEditingDirection({ ...direction }); // Copiar la dirección para editarla
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

    const addAllDirections = async () => {
        // try {
        //     const directionsCollectionRef = collection(baseDeDatos, 'direcciones');

        //     // Recorre las direcciones y añádelas a Firebase Database
        //     for (const direccion of allDirections) {
        //         await addDoc(directionsCollectionRef, direccion);
        //     }

        //     Swal.fire({
        //         icon: 'success',
        //         title: 'Direcciones Añadidas',
        //         text: 'Todas las direcciones se han añadido correctamente.',
        //     });
        // } catch (error) {
        //     console.error('Error al añadir direcciones: ', error);
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: `Hubo un problema añadiendo direcciones: ${error.message}`,
        //     });
        // }
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
        <div className='div-directions'>

            <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>
                <Typography variant='h2' sx={{ color: 'white' }}>Direcciones</Typography>


                <div className='perfil-usuario-btns'>
                    <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>

                </div>
                {directions.length === 0 &&
                    <div>
                        <button onClick={addAllDirections}>Añadir todas las direcciones</button>
                    </div>

                }

                <div className='div-addCost' >
                    <Typography variant='h4' sx={{ color: 'white' }}>Agregar Nueva Direccion</Typography>

                    <form className='form-addCost' onSubmit={handleSubmit(onSubmit)}>
                        <label> Nombre de la Localidad </label>
                        <Input
                            color='error'
                            {...register('name', { required: true })}
                            placeholder="Nombre de la localidad.."
                            value={newDirection.name}
                            onChange={e => setNewDirection({ ...newDirection, name: e.target.value })}

                        />
                        {errors.name && <p className='message-error'>El nombre de la direccion es requerida</p>}

                        {/* <label>Categoria</label>
                    <input
                        {...register('value', { required: true })}
                        value={newDirection.value}
                        name="value"
                        onChange={e => setNewDirection({ ...newDirection, value: e.target.value })}
                        placeholder="Valor del viaje.."
                    />
                    {errors.value && <p className='message-error'>La categoría del costo es requerida</p>} */}

                        <label>Precio del viaje a la Localidad</label>


                        <Input
                            color='error'
                            {...register('cost', { required: true })}
                            value={newDirection.cost}
                            name="cost"
                            type='number'
                            onChange={e => setNewDirection({ ...newDirection, cost: e.target.value })}
                            placeholder="Precio del costo"
                        />
                        {errors.cost && <p className='message-error'>El valor del costo es requerida</p>}

                        {
                            isLoading ? (
                                <div className="">
                                    Agregando Nuevo Costo, aguarde....
                                    <FadeLoader color="pink" />
                                </div>
                            ) : <Button variant='outlined' color='success' sx={{ margin: 4 }} type="submit">Agregar Costo</Button>
                        }
                    </form>
                </div>
            </Paper>

            <h2>Todas las Direcciones</h2>
            {/* Agrega un botón para modificar masivamente los costos de envío */}
            <div>
                {selectedDirections.length > 0 && (
                    <Button color='success' sx={{ marginBottom: '25px' }} variant='contained' size='small'
                        onClick={modifySelectedDirections}>Modificar Direcciones</Button>
                )}
            </div>

            <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>

                {/* Botón o checkbox para seleccionar todos */}
                <div style={{
                    background: 'transparent', fontFamily: 'Jost, sans-serif', fontSize: '25px',
                    color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>

                    {/* Muestra el número total de direcciones */}
                    <Typography variant='button' fontSize={'large'}>Total de direcciones: {directions.length}</Typography>


                    <div style={{
                        background: 'linear-gradient(to bottom, #404040, #585858)', fontFamily: 'Jost, sans-serif', fontSize: '25px',
                        color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'
                    }}>

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
                        {selectedDirections.length === directions.length && directions.length > 0 ?
                            'Deseleccionar todos' : 'Seleccionar todos'}
                    </div>


                    {/* Muestra el número de direcciones seleccionadas */}
                    {selectedDirections.length > 0 && <p>Direcciones seleccionadas: {selectedDirections.length}</p>}
                </div>


                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)', boxShadow: '0 0 12px 3px black' }}>
                            <TableRow>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Seleccionar</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Localidad</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Value</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Cost</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {directions.map((direction) => (
                                <TableRow key={direction.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedDirections.includes(direction)}
                                            onChange={() => handleCheckboxChange(direction)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {editingDirection && editingDirection.id === direction.id ? (
                                            <TextField
                                                color='error'
                                                type='text'
                                                value={editingDirection.name}
                                                onChange={(e) =>
                                                    setEditingDirection({ ...editingDirection, name: e.target.value })
                                                }
                                            />
                                        ) : (
                                            direction.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingDirection && editingDirection.id === direction.id ? (
                                            <TextField
                                                color='error'
                                                type='number'
                                                value={editingDirection.value}
                                                onChange={(e) =>
                                                    setEditingDirection({ ...editingDirection, value: e.target.value, cost: e.target.value })
                                                }
                                            />
                                        ) : (
                                            `$ ${direction.value}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingDirection && editingDirection.id === direction.id ? (
                                            <TextField
                                                color='error'
                                                type='number'
                                                value={editingDirection.cost}
                                                onChange={(e) =>
                                                    setEditingDirection({ ...editingDirection, value: e.target.value, cost: e.target.value })
                                                }
                                            />
                                        ) : (
                                            `$ ${direction.cost}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingDirection && editingDirection.id === direction.id ? (
                                            <Button sx={{ margin: '5px' }} variant="contained" color="success" onClick={saveDirection}>Guardar</Button>
                                        ) : (
                                            <Button sx={{ margin: '5px' }} variant="contained" color="success" onClick={() => editDirection(direction)}>Editar</Button>
                                        )}

                                        <Button sx={{ margin: '5px' }} variant="contained" color="error" onClick={() => deleteDirection(direction.id)}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default AddDirections;
