import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { baseDeDatos } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './categories.css'

function Categories() {
    const { formState: { errors } } = useForm();

    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);


    const fetchCategory = async () => {
        const categoriasRef = collection(baseDeDatos, 'categorias');
        const categoriaSnapShot = await getDocs(categoriasRef);
        const categoryData = [];
        categoriaSnapShot.forEach((doc) => {
            categoryData.push({ id: doc.id, ...doc.data() });
        });
        setCategorias(categoryData);
    };

    const allCategories = {
        categoryList: [
            { name: 'Rosas', id: 'Rosas', value: 'Rosas' },
            { name: 'Floreros', id: 'Floreros', value: 'Floreros' },
            { name: 'Todos', id: 'Todos', value: 'Todos' },
            { name: 'Flores', id: 'Flores', value: 'Flores' },
            { name: 'FerreroRocher', id: 'FerreroRocher', value: 'Ferrero Rocher' },
            { name: 'Canastas', id: 'Canastas', value: 'Canastas' },
            { name: 'Desayunos', id: 'Desayunos', value: 'Desayunos' },
            { name: 'Plantas', id: 'Plantas', value: 'Plantas' },
            { name: 'Cajas', id: 'Cajas', value: 'Cajas' },
            { name: 'Coronas', id: 'Coronas', value: 'Coronas' },
            { name: 'Palmas', id: 'Palmas', value: 'Palmas' },
            { name: 'Comestibles', id: 'Comestibles', value: 'Comestibles' },
            { name: 'Ramos', id: 'Ramos', value: 'Ramos' },
            { name: 'Girasoles', id: 'Girasoles', value: 'Girasoles' },
            { name: 'Gerberas', id: 'Gerberas', value: 'Gerberas' },
            { name: 'Liliums', id: 'Liliums', value: 'Liliums' },
            { name: 'Arreglos', id: 'Arreglos', value: 'Arreglos' },
            { name: 'Especiales', id: 'Especiales', value: 'Especiales' },
            { name: 'Combos', id: 'Combos', value: 'Combos' },
            { name: 'Peluches', id: 'Peluches', value: 'Peluches' },
            { name: 'Bonsai', id: 'Bonsai', value: 'Bonsai' },
        ],
        ocassionList: [
            { name: 'Aniversarios', id: 'Aniversarios', value: 'Aniversarios' },
            { name: 'Casamientos', id: 'Casamientos', value: 'Casamientos' },
            { name: 'Nacimientos', id: 'Nacimientos', value: 'Nacimientos' },
            { name: 'Cumpleaños', id: 'Cumpleaños', value: 'Cumpleaños' },
            { name: 'Todos', id: 'Todos', value: 'Todos' },
            { name: 'Condolencias', id: 'Condolencias', value: 'Condolencias' },
            { name: 'Funerales', id: 'Funerales', value: 'Funerales' },
            { name: 'RegalosHombres', id: 'RegalosHombres', value: 'Regalos para Hombres' },
            { name: 'Agradecimiento', id: 'Agradecimiento', value: 'Agradecimiento' },
            { name: 'Recuperacion', id: 'Recuperacion', value: 'Recuperación' },
        ],

        especialDates: [
            { name: 'Navidad', id: 'Navidad', value: 'Navidad' },
            { name: 'DiaDeLaMadre', id: 'DiaDeLaMadre', value: 'Día de la Madre' },
            { name: 'DiaDelPadre', id: 'DiaDelPadre', value: 'Día del Padre' },
            { name: 'AñoNuevo', id: 'AñoNuevo', value: 'Año Nuevo' },
            { name: 'SanValentin', id: 'SanValentin', value: 'San Valentín' },
            { name: 'DiaDeLaPrimavera', id: 'DiaDeLaPrimavera', value: 'Día de la Primavera' },
            { name: 'AñoNuevoJudio', id: 'AñoNuevoJudio', value: 'Año Nuevo Judío' },
            { name: 'DiaDeLaSecretaria', id: 'DiaDeLaSecretaria', value: 'Día de la Secretaria' },
        ],

    };


    useEffect(() => {
        fetchCategory();
    }, []);


    //Agregar nueva Categoria !!
    const [newItem, setNewItem] = useState({
        name: '',
        id: '',
        value: '',
        listType: 'categoryList', // Valor por defecto para la lista de categorías
    });
    //Editar una categoria / ocasion / fecha Especial
    const [editedItem, setEditedItem] = useState({
        name: '',
        id: '',
        value: '',
        listType: '',
    });
    const [originalName, setOriginalName] = useState('');



    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddNewItem = async () => {
        try {
            // Verificar que los campos no estén vacíos
            if (!newItem.name.trim() || !newItem.value.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos vacíos',
                    text: 'Por favor, completa todos los campos antes de confirmar.',
                });
                return;
            }

            // Obtener la lista seleccionada
            const selectedList = categorias[0][newItem.listType];

            // Verificar si el nuevo elemento ya existe en la lista
            const exists = selectedList.some((item) => item.name.toLowerCase() === newItem.name.toLowerCase());

            if (exists) {
                Swal.fire({
                    icon: 'error',
                    title: 'Elemento Duplicado',
                    text: 'El elemento ya existe en la lista seleccionada.',
                });
                return;
            }

            // Agregar el nuevo elemento a la lista con id y value generados automáticamente
            const updatedList = [
                ...selectedList,
                {
                    name: newItem.name,
                    id: newItem.name,
                    value: newItem.name
                        .split(/(?=[A-Z])/)
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                },
            ];

            // Actualizar la lista en el estado
            await updateCategoryList(newItem.listType, updatedList);

            Swal.fire({
                icon: 'success',
                title: 'Elemento Agregado',
                text: 'El nuevo elemento se ha agregado correctamente.',
            });

            // Limpiar el formulario
            setNewItem({ name: '', listType: 'categoryList' });
        } catch (error) {
            console.error('Error al agregar el elemento: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un problema agregando el elemento: ${error.message}`,
            });
        }
    };

    const updateCategoryList = async (listType, updatedList) => {
        try {
            // Obtener la referencia al documento 'categorias'
            const categoriasRef = doc(baseDeDatos, 'categorias', categorias[0].id);

            // Actualizar la lista correspondiente en el documento 'categorias'
            await updateDoc(categoriasRef, { [listType]: updatedList });

            // Volver a cargar las categorías desde Firebase
            fetchCategory();
        } catch (error) {
            console.error('Error al actualizar la lista de categorías: ', error);
            throw error;
        }
    };


    const updateCategory = async (categoryToEdit, updatedItem, listType) => {
        try {


            // Verificar si el nombre ha cambiado
            const nameChanged = originalName !== updatedItem.name;

            // Obtener la referencia al documento 'categorias'
            const categoriasRef = doc(baseDeDatos, 'categorias', categorias[0].id);

            // Encontrar el índice de la categoría a editar en la lista
            const indexToUpdate = categoryToEdit.findIndex((category) => category.id === originalName.id);

            if (indexToUpdate === -1) {
                // Manejar el caso donde la categoría no se encontró
                console.error('La categoría a editar no se encontró en la lista.');
                return;
            }

            // Crear una copia de la lista para realizar modificaciones
            const updatedList = [...categoryToEdit];

            // Actualizar la categoría con los nuevos valores
            updatedList[indexToUpdate] = {
                name: updatedItem.name,
                id: updatedItem.id,
                value: updatedItem.value,
            };

            // Actualizar la lista correspondiente en el documento 'categorias'
            await updateDoc(categoriasRef, { [listType]: updatedList });

            // Volver a cargar las categorías desde Firebase
            fetchCategory();

            // Cerrar el diálogo
            closeDialog();

            // Mostrar un mensaje adicional si el nombre ha cambiado
            if (nameChanged) {
                Swal.fire({
                    icon: 'success',
                    title: 'Nombre Cambiado',
                    text: 'El nombre de la categoría se ha cambiado correctamente.',
                });
            }
        } catch (error) {
            console.error('Error al actualizar la lista de categorías: ', error);
            throw error;
        }
    };

    const addAllCategories = async () => {
        try {
            
            const categoryCollection = collection(baseDeDatos, 'categorias');

            await addDoc(categoryCollection, allCategories);

            
            Swal.fire({
                icon: 'success',
                title: 'Categorías Añadidas',
                text: 'Todas las categorías se han añadido correctamente.',
            });
        } catch (error) {
            
            console.error('Error al añadir categorías: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un problema añadiendo categorías: ${error.message}`,
            });
        }
    };



    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const openDialog = (category) => {
        setDialogOpen(true);
        if (category) {
            setEditedItem({
                name: category.name,
                id: category.id,
                value: category.value,
            });
            setOriginalName(category.name); // Guardar el valor original
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditedItem({ name: '', id: '', value: '' });
        setOriginalName(''); // Limpiar el valor original al cerrar el diálogo

    };

    const deleteCategory = async (categoryId) => {
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
                await deleteDoc(doc(baseDeDatos, 'categorias', categoryId));
                Swal.fire({
                    icon: 'success',
                    title: 'Categoría Eliminada',
                    text: 'Has eliminado una categoría',
                });
                fetchCategory();
            }
        } catch (e) {
            console.error('Error al eliminar la categoría: ', e);
            Swal.fire(
                'Error',
                `Hubo un problema eliminando la categoría. Error:${e}`,
                'error'
            );
        }

    };

    function getLabel(listType) {
        switch (listType) {
            case 'categoryList':
                return 'Categoria';
            case 'ocassionList':
                return 'Ocasión';
            case 'especialDates':
                return 'Fecha especial';
            default:
                return '';
        }
    }


    useEffect(() => {
        if (dialogOpen) {
            setNewItem({ name: '', listType: '' });
        }
    }, [dialogOpen]);


    return (
        <div className='div-editCategory'>
            <Typography variant='h2' sx={{ color: 'white' }}>Categorias</Typography>

            <div className='perfil-usuario-btns'>
                <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>
                    Volver atrás
                </Button>
            </div>
            <Typography variant='h4' sx={{ color: 'white', margin: '20px' }}>Lista de las Categorias</Typography>
            {categorias.length === 0 && (
                <div>
                    <Button variant='contained' color='success' size='small' sx={{ margin: '40px' }} onClick={addAllCategories}>
                        Añadir todas los categorias
                    </Button>
                </div>
            )}


            <div className='div-addCost'>

                <div className='div-new-category'>

                    <Typography variant='subtitle1'>Agregar Nuevas Categorías</Typography>
                    <FormControl color='error' sx={{ width: '50%', margin: '20px', color: 'white', textDecorationColor: 'white' }}>
                        <InputLabel sx={{ color: 'white', }} htmlFor="listType">SELECCIONE UNA LISTA</InputLabel>
                        <Select
                            variant='filled'
                            id="listType"
                            name="listType"
                            value={newItem.listType}
                            onChange={handleNewItemChange}
                            label="Seleccionar Lista"
                        >
                            <MenuItem value="categoryList">Lista de Categorías</MenuItem>
                            <MenuItem value="ocassionList">Lista de Ocasiones</MenuItem>
                            <MenuItem value="especialDates">Fechas Especiales</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant='caption' sx={{ marginTop: '20px' }}>No debe agregar espacios y las palabras deben ir diferenciadas por su primera letra en Mayusculas
                        Ejemplo: RegalosHombres / DiaDeLosEnamorados / SanValentin
                    </Typography>
                    <TextField
                        label={`Clave de la ${getLabel(newItem.listType)}`}
                        variant='standard'
                        sx={{ width: '50%' }}
                        color='error'
                        margin="normal"
                        name="name"
                        value={newItem.name}
                        onChange={handleNewItemChange}
                    />
                    {errors.name && <p className='message-error'>La clave es requerida</p>}


                    <Typography variant='caption' sx={{ marginTop: '20px' }}>Aqui debe agregar el nombre correctamente, Ejemplo: Si colocó "SanValentin" o "DiaDeLosEnamorados"
                        debe ahora escribirlo como "San Valentin" o "Dia de los Enamorados"
                    </Typography>
                    <TextField
                        label={`Nombre de la ${getLabel(newItem.listType)}`}
                        variant='standard'
                        color='error'
                        sx={{ width: '50%', marginTop: '10px' }}
                        margin="normal"
                        name="value"
                        value={newItem.value}
                        onChange={handleNewItemChange}
                    />
                    {errors.value && <p className='message-error'>El nombre es requerido</p>}

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ margin: '25px' }}
                        onClick={handleAddNewItem}
                    >

                        {`Agregar ${getLabel(newItem.listType)}`}


                    </Button>

                </div>


                <Accordion expanded={expanded === 'categoryList'} onChange={handleAccordionChange('categoryList')}
                    sx={{ width: '80%', textTransform: 'uppercase', margin: '40px 0', }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                            <Typography>Lista de Categorias </Typography>
                            <Stack direction="row" alignItems="center">
                                <Typography>{expanded === 'categoryList' ? 'Cerrar lista' : 'Ver lista'}</Typography>
                            </Stack>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Como se muestra</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categorias.length > 0 &&
                                        categorias[0].categoryList.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                                            <TableRow key={category.name}>
                                                <TableCell>{category.name}</TableCell>
                                                <TableCell>{category.value}</TableCell>
                                                <TableCell>
                                                    <IconButton color='success' onClick={() => openDialog(category)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    {/* Diálogo de edición */}
                                                    <Dialog open={dialogOpen} onClose={closeDialog}>
                                                        <DialogTitle>Editar Categoría</DialogTitle>
                                                        <DialogContent>
                                                            <TextField
                                                                label="name"
                                                                variant="outlined"
                                                                margin="normal"
                                                                fullWidth
                                                                value={editedItem.name}
                                                                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                                                            />
                                                            {/* ... (otros campos de edición) */}
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={closeDialog} color="primary">
                                                                Cancelar
                                                            </Button>
                                                            <Button variant="contained" color="primary" onClick={() => updateCategory(categorias[0].categoryList, newItem)}>
                                                                Guardar Cambios
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>

                                                    {/* Eliminar Categoria */}
                                                    <IconButton color='error' onClick={() => deleteCategory(category.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'ocassionList'} onChange={handleAccordionChange('ocassionList')}
                    sx={{ width: '80%', textTransform: 'uppercase', margin: '40px 0' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                            <Typography>Lista de Ocasiones </Typography>
                            <Stack direction="row" alignItems="center">
                                <Typography>{expanded === 'ocassionList' ? 'Cerrar lista' : 'Ver lista'} </Typography>
                            </Stack>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Como se muestra</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categorias.length > 0 &&
                                        categorias[0].ocassionList.sort((a, b) => a.name.localeCompare(b.name)).map((ocasion) => (
                                            <TableRow key={ocasion.name}>
                                                <TableCell>{ocasion.value}</TableCell>
                                                <TableCell>{ocasion.name}</TableCell>
                                                <TableCell>
                                                    <IconButton color='success' onClick={() => openDialog(ocasion)}>
                                                        <EditIcon />
                                                    </IconButton>

                                                    {/* Diálogo de edición */}
                                                    <Dialog open={dialogOpen} onClose={closeDialog}>
                                                        <DialogTitle>Editar Ocasión</DialogTitle>
                                                        <DialogContent>
                                                            <TextField
                                                                label="name"
                                                                variant="outlined"
                                                                margin="normal"
                                                                fullWidth
                                                                value={newItem.name}
                                                                onChange={(e) => setEditedItem({ ...newItem, name: e.target.value })}
                                                            />
                                                            {/* ... (otros campos de edición) */}
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={closeDialog} color="primary">
                                                                Cancelar
                                                            </Button>
                                                            <Button variant="contained" color="primary" onClick={() => updateCategory(categorias[0].ocassionList, newItem)}>
                                                                Guardar Cambios
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>

                                                    <IconButton color='error' onClick={() => deleteCategory(ocasion.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'especialDates'} onChange={handleAccordionChange('especialDates')}
                    sx={{ width: '80%', textTransform: 'uppercase', margin: '40px 0' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                            <Typography>Fechas Especiales </Typography>
                            <Stack direction="row" alignItems="center">
                                <Typography>{expanded === 'especialDates' ? 'Cerrar lista' : 'Ver lista'}</Typography>

                            </Stack>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>Categoria</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Como se muestra</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categorias.length > 0 &&
                                        categorias[0].especialDates.sort((a, b) => a.name.localeCompare(b.name)).map((fechas) => (
                                            <TableRow key={fechas.id}>
                                                <TableCell>{fechas.name}</TableCell>
                                                <TableCell>{fechas.value}</TableCell>

                                                <TableCell>
                                                    <IconButton color='success' onClick={() => openDialog(fechas)}>
                                                        <EditIcon />
                                                    </IconButton>

                                                    {/* Diálogo de edición */}
                                                    <Dialog open={dialogOpen} onClose={closeDialog}>
                                                        <DialogTitle>Editar Fecha Especial</DialogTitle>
                                                        <DialogContent>
                                                            <TextField
                                                                label="name"
                                                                variant="outlined"
                                                                margin="normal"
                                                                fullWidth
                                                                value={editedItem.name}
                                                                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value, id: e.target.value })}
                                                            />
                                                            <TextField
                                                                label="value"
                                                                variant="outlined"
                                                                margin="normal"
                                                                fullWidth
                                                                value={editedItem.value}
                                                                onChange={(e) => setEditedItem({ ...editedItem, value: e.target.value })}
                                                            />
                                                            {/* ... (otros campos de edición) */}
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={closeDialog} color="primary">
                                                                Cancelar
                                                            </Button>
                                                            <Button variant="contained" color="primary" onClick={() => updateCategory(categorias[0].especialDates, editedItem, 'especialDates')}>
                                                                Guardar Cambios
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>

                                                    <IconButton color='error' onClick={() => deleteCategory(fechas.name)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}

export default Categories;