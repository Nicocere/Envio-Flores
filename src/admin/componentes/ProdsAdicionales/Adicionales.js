import React, { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { baseDeDatos, storage, } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
// import { Adicionales } from '../../ecommerce.adicionals';
import Searcher from '../../../componentes/Searcher/Searcher';
import { SearchContext, useSearch } from '../../../context/SearchContext';
import { Button, Paper, Switch, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';


function AddAdicionales() {
    const { register, watch, handleSubmit, formState: { errors }, control } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'opciones',
    });
    const [productData, setProductData] = useState({
        nombre: '',
        precio: '',
        descr: '',
        tipo: '',
        stock: '',
        status: true,
        categoria: [],
        opciones: []
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [adicionals, setAdicionals] = useState([]);
    const { prodEncontrado } = useSearch();
    const [showNewProd, setShowNewProd] = useState(false)



    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        backgroundColor: theme.palette.common.white,
        color: '#670000',
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:hover': {
            backgroundColor: '#a70000 !important',
        },
        '& .MuiTableCell-root': {
            color: '#670000',
        },
    }));

    const fetchProducts = async () => {
        const adicionalesCollection = query(collection(baseDeDatos, 'adicionales'));
        const adicionalesDocs = await getDocs(adicionalesCollection);
        const listaAdicionales = adicionalesDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAdicionals(listaAdicionales);
    };
    useEffect(() => {
        fetchProducts();
    }, []);


    const handleNavigateToEdit = (productId) => {
        navigate(`/administrador/adicionales/edit/${productId}`);
    };

    const handleChangeNewProd = () => {
        setShowNewProd(!showNewProd)
    }

    const handleOptionImageChange = (e) => {
        const newOptionImage = e.target.files[0];
        setProductData((prevData) => {
            return {
                ...prevData,
                img: newOptionImage,  // Actualiza la imagen principal
            };
        });
    };


    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            let imageURL = data.img; // Utiliza la URL existente si no hay una nueva imagen

            if (productData.img && (productData.img instanceof File || (productData.img instanceof FileList && productData.img.length > 0))) {
                // Sube la nueva imagen solo si hay una nueva imagen

                const imageFile = productData.img;
                const imageRef = ref(storage, `adicionales/${data.nombre}/${imageFile.name}`);

                // Subir la nueva imagen a Firestore Storage
                const imageUploadTask = uploadBytesResumable(imageRef, imageFile);

                // Manejar el progreso, errores y completar la subida
                await new Promise((resolve, reject) => {
                    imageUploadTask.on(
                        'state_changed',
                        (snapshot) => { },
                        (error) => {
                            console.error('Error al subir la nueva imagen:', error);
                            reject(error);
                        },
                        async () => {
                            imageURL = await getDownloadURL(imageUploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }


            if (data.opciones.length === 0) {

                Swal.fire({
                    icon: 'error',
                    title: 'Opción no agregada',
                    text: 'Debe agregar al menos 1 (una) opción',
                });
            } else {

                // Genera un id único para cada opción en el array
                const opcionesConId = data.opciones.map((opcion) => ({
                    ...opcion,
                    id: uuidv4(),
                    precio: Number(opcion.precio)  // Convertir el precio a número
                }));

                // Actualiza solo el campo img con la nueva URL de imagen
                const productDataWithImage = {
                    ...data,
                    img: imageURL,
                    opciones: opcionesConId,

                };

                // Realiza la actualización en la base de datos
                await addDoc(collection(baseDeDatos, 'adicionales'), productDataWithImage);
                setIsLoading(false)

                Swal.fire({
                    icon: 'success',
                    title: 'Producto Actualizado',
                    text: 'Has actualizado correctamente el Producto',
                });

                navigate('/administrador/adicionales');
                setShowNewProd(false)
            }

        } catch (e) {
            console.error('Error al actualizar el adicional: ', e);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
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
                await deleteDoc(doc(baseDeDatos, 'adicionales', productId));
                Swal.fire({
                    icon: 'success',
                    title: 'Producto Eliminado',
                    text: 'Has eliminado un producto',
                });
                fetchProducts();
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

    const addAllProducts = async () => {
        // try {
        //     setIsLoading(true);
        //     // const directionsCollectionRef = collection(baseDeDatos, 'productos');

        //     const allAdicionals = collection(baseDeDatos, 'adicionales');

        //     // // Puedo mapearlo y añadirlo directamente a Firebase Database
        //     // stockProductos.map((adicional) => addDoc(allProds, adicional));

        //     // Ó Recorrer los productos y añádirlos  a Firebase Database
        //     for (const adicional of Adicionales) {
        //         await addDoc(allAdicionals, adicional);
        //     }

        //     setIsLoading(false);
        //     Swal.fire({
        //         icon: 'success',
        //         title: 'Productos Añadidos',
        //         text: 'Todos los productos se han añadido correctamente.',
        //     });
        // } catch (error) {
        //     setIsLoading(false);
        //     console.error('Error al añadir productos: ', error);
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: `Hubo un problema añadiendo productos: ${error.message}`,
        //     });
        // }
    };


    return (
        <div className='div-add-edit-prods'>
                <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom:'80px' }}>
            <div className='div-addProd'>
                <Typography variant='h2' sx={{color:'white'}}>Adicionales</Typography>
                <div className='perfil-usuario-btns'>
                    <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>

                </div>

                {adicionals.length === 0 &&
                    <div>
                        <button onClick={addAllProducts}>Añadir todos los Productos adicionales</button>
                    </div>

                }

                <Button variant={showNewProd ? 'contained' : 'outlined'} size='large' color='success' sx={{margin:'20px'}} onClick={handleChangeNewProd} >
                    {showNewProd ? 'NO QUIERO AGREGAR ADICIONAL NUEVO' : 'QUIERO AGREGA UN NUEVO ADICIONAL'}
                </Button>
                {
                    showNewProd &&


                        <><h3 className='title-edit-prods'>Agregar Nuevo Producto Adicional</h3><form className='form-addProd' onSubmit={handleSubmit(onSubmit)}>
                            <label>Nombre del producto</label>
                            <input
                                {...register('nombre', { required: true })}
                                placeholder="Nombre del producto"
                                value={productData.nombre}
                                onChange={e => setProductData({ ...productData, nombre: e.target.value })} />
                            {errors.nombre && <p className='message-error'>El nombre del producto es requerido</p>}

                            <label>Categoria</label>
                            <input
                                {...register('categoria', { required: true })}
                                value={productData.categoria}
                                name="categoria"
                                onChange={e => setProductData({ ...productData, categoria: e.target.value })}
                                placeholder="Categoria del producto" />
                            {errors.categoria && <p className='message-error'>La categoría del producto es requerida</p>}

                            <label>Descripción del producto</label>
                            <textarea
                                {...register('descr', { required: true })}
                                value={productData.descripcion}
                                name="descr"
                                onChange={e => setProductData({ ...productData, descr: e.target.value })}
                                placeholder="Descripción del producto" />
                            {errors.descr && <p className='message-error'>Agregue una descripción del producto</p>}

                            <label>Stock</label>
                            <input
                                {...register('stock', { required: true })}
                                value={productData.stock}
                                name="stock"
                                type='number'
                                onChange={e => setProductData({ ...productData, stock: e.target.value })}
                                placeholder="Stock del producto" />
                            {errors.stock && <p className='message-error'>Agregue un stock al producto</p>}

                            <label>Tipo</label>
                            <input
                                {...register('tipo', { required: true })}
                                type='text'
                                defaultChecked={true}
                                value={productData.tipo}
                                name="tipo"
                                onChange={e => setProductData({ ...productData, tipo: e.target.value })}
                                placeholder="Tipo del producto" />
                            {errors.tipo && <p className='message-error'>Verifique el tipo del producto</p>}

                            <div>
                                <label>Status</label>
                                <Switch
                                    {...register('status', { required: true })}
                                    checked={productData.status}
                                    onChange={() => setProductData({ ...productData, status: !productData.status })} />
                                {errors.producto && <p className='message-error'>Verifique el Status del producto</p>}
                            </div>

                            <label>Imagen de la opción</label>
                            <input
                                {...register(`img`)}
                                type="file"
                                onChange={(e) => handleOptionImageChange(e)} />
                            <div>
                                <h3>Agregar Opciones</h3>
                                {fields.map((option, index) => (
                                    <div key={option.id} className='div-optAdicionales'>
                                        <h4>Opción {index + 1}</h4>

                                        <label>Tamaño:</label>
                                        <input
                                            {...register(`opciones[${index}].size`, { required: true })}
                                            placeholder="Tamaño del producto" />

                                        <label>Precio:</label>
                                        <input
                                            {...register(`opciones[${index}].precio`, { required: true })}
                                            placeholder="Precio del producto"
                                            type='number' />

                                        <Button color='error' size='small' variant='outlined' type="button" onClick={() => remove(index)}>
                                            Eliminar Opción
                                        </Button>
                                    </div>
                                ))}
                                <Button color='error' size='small' variant='outlined' type="button" onClick={() => append({ size: '', precio: '', img: '' })}>
                                    Agregar Opción
                                </Button>
                                {errors.opciones && <p className='message-error'>Debe agregar al menos 1 Opcion.</p>}
                            </div>

                            {isLoading ? (
                                <div className="">
                                    Agregando Nuevo Producto, espere...
                                    <FadeLoader color="darkred" />
                                </div>
                            ) : (
                                <Button color='success' sx={{ width: '50%', margin: '25px 10px' }} variant='contained' className='add-prod-btn' type="submit">Agregar Producto</Button>
                            )}
                        </form></>

                }
            </div>
                    </Paper>

            <Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px' }}>

                <Searcher items={adicionals} />

                <div className="div-products-table">
                    <h3 className='title-edit-prods'>Editar / Eliminar Adicionales</h3>
                    <p className='title-edit-prods' >Cantidad de productos: {adicionals.length} </p>

                    <div className='div-table'>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="customized table">
                                <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)', boxShadow: '0 0 12px 3px black' }}>
                                    <TableRow>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Nombre</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Precio</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Descripción</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Imagen</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        prodEncontrado.length === undefined || prodEncontrado.length === 0 ?
                                            adicionals.map((product) => (
                                                <StyledTableRow key={product.id}>
                                                    <StyledTableCell>{product.nombre}</StyledTableCell>
                                                    <StyledTableCell>${product.opciones[0].precio}</StyledTableCell>
                                                    <StyledTableCell>{product.descr}</StyledTableCell>
                                                    <StyledTableCell><img src={product.img || product.opciones[0].img} alt={product.nombre} width="50" /></StyledTableCell>
                                                    <StyledTableCell>
                                                        <Button variant="contained" size='small' color="success" sx={{ margin: '0 10px' }} onClick={() => handleNavigateToEdit(product.id)}>Editar</Button>
                                                        <Button variant="contained" size='small' sx={{ background: '#670000', '&:hover': { background: '#a70000' } }} onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                            :
                                            prodEncontrado?.map((product) => (
                                                <StyledTableRow key={product.id}>
                                                    <StyledTableCell>{product.nombre}</StyledTableCell>
                                                    <StyledTableCell>${product.opciones[0].precio}</StyledTableCell>
                                                    <StyledTableCell>{product.descr}</StyledTableCell>
                                                    <StyledTableCell><img src={product.img || product.opciones[0].img} alt={product.nombre} width="50" /></StyledTableCell>
                                                    <StyledTableCell>
                                                        <Button variant="contained" size='small' color="success" sx={{ margin: '0 10px' }} onClick={() => handleNavigateToEdit(product.id)}>Editar</Button>
                                                        <Button variant="contained" size='small' sx={{ background: '#670000', '&:hover': { background: '#a70000' } }} onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* <table className="products-table">
                        <thead className="thead-table">
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Descripción</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>


                            {
                                prodEncontrado.length === undefined || prodEncontrado.length === 0 ?

                                    adicionals.map((product) => (
                                        <tr className="tr-tbody" key={product.id}>
                                            <td className="td-tbody">{product.nombre}</td>
                                            <td className="td-tbody">${product.opciones[0].precio}</td>
                                            <td className="td-tbody">{product.descr}</td>
                                            <td className="td-tbody"><img src={product.img || product.opciones[0].img} alt={product.nombre} width="50" /></td>
                                            <td className="td-tbody">
                                                <div className='btns-table'>
                                                    <button className="btn-table-edit" onClick={() => handleNavigateToEdit(product.id)}>Editar</button>
                                                    <button className="btn-table-delete" onClick={() => deleteProduct(product.id)}>Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    :

                                    prodEncontrado?.map((product) => (
                                        (
                                            <tr className="tr-tbody" key={product.id}>
                                                <td className="td-tbody">{product.nombre}</td>
                                                <td className="td-tbody">{product.opciones[0].precio}</td>
                                                <td className="td-tbody">{product.descr}</td>
                                                <td className="td-tbody"><img src={product.img || product.opciones[0].img} alt={product.nombre} width="50" /></td>
                                                <td className="td-tbody">
                                                    <div className='btns-table'>
                                                        <button className="btn-table-edit" onClick={() => handleNavigateToEdit(product.id)}>Editar</button>
                                                        <button className="btn-table-delete" onClick={() => deleteProduct(product.id)}>Eliminar</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )

                                    ))

                            }
                        </tbody>
                    </table> */}
                    </div>
                </div>
            </Paper>

        </div>
    );
}

export default AddAdicionales;
