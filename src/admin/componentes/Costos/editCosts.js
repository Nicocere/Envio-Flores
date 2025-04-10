import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// import { dataCosts } from '../../ecommerce.costos';
import './costos.css'
import { FadeLoader } from 'react-spinners';
import { Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

function EditCosts() {
    const { watch, register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
                title: 'Costo actualizada',
            });
            setEditCosts({ nombre: '', categoria: '', precio: '' });
            fetchCosts();
        }
    };

    const addAllCosts = async () => {
        // try {
        //     setIsLoading(true);
        //     const costosCollectionRef = collection(baseDeDatos, 'costos');

        //     // Recorre las direcciones y añádelas a Firebase Database
        //     for (const cost of dataCosts) {
        //         await addDoc(costosCollectionRef, cost);
        //     }

        //     setIsLoading(false);
        //     Swal.fire({
        //         icon: 'success',
        //         title: 'Costos Añadidas',
        //         text: 'Todas los costos se han añadido correctamente.',
        //     });
        // } catch (error) {
        //     setIsLoading(false);
        //     console.error('Error al añadir costos: ', error);
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: `Hubo un problema añadiendo costos: ${error.message}`,
        //     });
        // }
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
                await deleteDoc(doc(baseDeDatos, 'cost', costId));
                Swal.fire({
                    icon: 'success',
                    title: 'Producto Eliminado',
                    text: 'Has eliminado un producto',
                });
                fetchCosts();
            }
        } catch (e) {
            console.error('Error al eliminar el producto: ', e);
            Swal.fire(
                'Error',
                `Hubo un problema eliminando el producto. Error:${e}`,
                'error'
            );
        }
    };

    return (
        <div className='div-editCosts'>
            <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>
                <Typography variant='h2' sx={{ color: 'white' }}>Costos</Typography>
            
                <div className='perfil-usuario-btns'>
                    <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>

                </div>
                {costos.length === 0 &&
                    <div>
                        <button onClick={addAllCosts}>Añadir todas los costos adicionales</button>
                    </div>

                }
                <div className='div-addCost' >
                    <Typography variant='h4' sx={{ color: 'white' }}>Agregar Nuevos Costos</Typography>

                    <form className='form-addCost' onSubmit={handleSubmit(onSubmit)}>
                        <label> Nombre del Costo </label>
                        <input
                            {...register('nombre', { required: true })}
                            placeholder="Nombre del costo"
                            value={editCosts.nombre}
                            onChange={e => setEditCosts({ ...editCosts, nombre: e.target.value })}

                        />
                        {errors.nombre && <p className='message-error'>El nombre del costo es requerido</p>}

                        <label>Categoria</label>
                        <input
                            {...register('categoria', { required: true })}
                            value={editCosts.categoria}
                            name="categoria"
                            onChange={e => setEditCosts({ ...editCosts, categoria: e.target.value })}
                            placeholder="Categoria del costo"
                        />
                        {errors.categoria && <p className='message-error'>La categoría del costo es requerida</p>}

                        <label>Precio del Costo</label>


                        <input
                            {...register('precio', { required: true })}
                            value={editCosts.precio}
                            name="precio"
                            onChange={e => setEditCosts({ ...editCosts, precio: e.target.value })}
                            placeholder="Precio del costo"
                        />
                        {errors.rutaProd && <p className='message-error'>El valor del costo es requerida</p>}

                        {
                            isLoading ? (
                                <div className="">
                                    Agregando Nuevo Costo, aguarde....
                                    <FadeLoader color="pink" />
                                </div>
                            ) : <Button color='success' variant='outlined' sx={{ margin: 2, width: 'fit-content', alignSelf: 'center' }} type="submit">Agregar Costo</Button>
                        }
                    </form>
                </div>

            </Paper>

            <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>

                <Typography variant='h4' sx={{ color: 'white', textTransform: 'uppercase' }}>Todos los costos</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)', boxShadow: '0 0 12px 3px black' }}>
                            <TableRow>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Nombre</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Costo</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Categoria</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Acciones</TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {costos.map((cost) => (
                                <TableRow key={cost.id}>
                                    <TableCell>
                                        {editCosts && editCosts.id === cost.id ? (
                                            <TextField
                                                type='text'
                                                value={editCosts.nombre}
                                                onChange={(e) =>
                                                    setEditCosts({ ...editCosts, nombre: e.target.value })
                                                }
                                            />
                                        ) : (
                                            cost.nombre
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editCosts && editCosts.id === cost.id ? (
                                            <TextField
                                                type='number'
                                                value={editCosts.precio}
                                                onChange={(e) =>
                                                    setEditCosts({ ...editCosts, precio: e.target.value })
                                                }
                                            />
                                        ) : (
                                            `$ ${cost.precio}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editCosts && editCosts.id === cost.id ? (
                                            <TextField
                                                type='text'
                                                value={editCosts.categoria}
                                                onChange={(e) =>
                                                    setEditCosts({ ...editCosts, categoria: e.target.value })
                                                }
                                            />
                                        ) : (
                                            `${cost.categoria}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editCosts && editCosts.id === cost.id ? (
                                            <Button sx={{margin:'5px'}} variant="contained" color="success" onClick={saveCost}>Guardar</Button>
                                        ) : (
                                            <Button sx={{margin:'5px'}} variant="contained" color="success" onClick={() => editCost(cost)}>Editar</Button>
                                        )}

                                        <Button sx={{margin:'5px'}} variant="contained" color="error" onClick={() => deleteCost(cost.id)}>Eliminar</Button>
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

export default EditCosts;
