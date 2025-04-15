import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import './editAddProds.css';
// import { stockProductos } from '../../ecommerce.productos';
import Searcher from '../../../componentes/Searcher/Searcher';
import { useSearch } from '../../../context/SearchContext';
import { Button, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import Filtros from '../../../componentes/Filtros/Filtros';



function AddProds() {
    const { register, handleSubmit, formState: { errors }, control, reset} = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'opciones',
    });

    const [especialDatesData, setEspecialDatesData] = useState([]);
    const [showNewProd, setShowNewProd] = useState(false)
    const [categoryList, setCategoryList] = useState([]);
    const [ocassionList, setOcassionList] = useState([]);
    const [especialDates, setEspecialDates] = useState([]);
    const [errorMessages, setErrorMessages] = useState(['']);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriasCollection = collection(baseDeDatos, 'categorias');
                const categoriasSnapshot = await getDocs(categoriasCollection);

                if (!categoriasSnapshot.empty) {
                    const categoriasData = categoriasSnapshot.docs[0].data();
                    setCategoryList(categoriasData.categoryList || []);
                    setOcassionList(categoriasData.ocassionList || []);
                    setEspecialDates(categoriasData.especialDates || []);
                }
            } catch (error) {
                console.error('Error al obtener las categorías: ', error);
                setErrorMessages("Error al obtener las categorías", error)
            }
        };

        fetchCategories();
    }, []);


    const [productData, setProductData] = useState({
        nombre: '',
        precio: 0,
        descr: '',
        tipo: '',
        stock: '',
        categoria: [],
        opciones: [],
        ocasiones: [],
        fechasEspeciales: [],
        status: true,
        vendidos: 0
    });


    const [selectAll, setSelectAll] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const { prodEncontrado } = useSearch();



    const handleEspecialDateCheckboxChange = (date) => {
        if (especialDatesData.includes(date)) {
            // Si ya existe, quitarlo
            setEspecialDatesData((prevData) => prevData.filter((d) => d !== date));
        } else {
            // Si no existe, agregarlo
            setEspecialDatesData((prevData) => [...prevData, date]);
        }
    };

    const handleNavigateToEdit = (productId) => {
        navigate(`/administrador/editProds/${productId}`);
    };

    const fetchProducts = async () => {
        const productsCollection = query(collection(baseDeDatos, 'productos'));
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // setProducts(productList);

        // Ordenar productos alfabéticamente por nombre
        const sortedProducts = productList.sort((a, b) => a.nombre.localeCompare(b.nombre));

        setProducts(sortedProducts);
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    const handleOptionImageChange = (e, optionIndex) => {
        const newOptionImage = e.target.files[0];
        setProductData((prevData) => {
            const updatedOptions = [...prevData.opciones];
            if (!updatedOptions[optionIndex]) {
                updatedOptions[optionIndex] = {}; // Inicializa la opción si es nula
            }
            updatedOptions[optionIndex].img = newOptionImage;
            return {
                ...prevData,
                opciones: updatedOptions,
            };
        });
    };


    const onSubmit = async (data) => {
        
        setIsLoading(true)
        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos antes de confirmar.',
            });
            setIsLoading(false);
            return;
        }
        try {
            // Subir las imágenes de las opciones a Firebase Storage
            const optionImagesURLs = [];

            for (let i = 0; i < data.opciones.length; i++) {
                if (data.opciones[i].img) {
                    const optionImageFile = data.opciones[i].img;

                    const optionImageRef = ref(
                        storage,
                        `productos/${data.nombre}/opciones/${data.opciones[i].size}}/${optionImageFile[0].name}`
                    );

                    data.opciones[i].precio = Number(data.opciones[i].precio);
                    data.stock = Number(data.stock);


                    const optionUploadTask = uploadBytesResumable(optionImageRef, optionImageFile[0]);

                    optionUploadTask.on(
                        'state_changed',
                        () => {
                            // Manejar el progreso si es necesario
                            setIsLoading(false);
                        },
                        (error) => {
                            // Manejar errores durante la subida de la opción
                            console.error('Error al subir la imagen de la opción:', error);
                            setErrorMessages("Error al subir la imagen de la opción", error)
                            setIsLoading(false);
                        },
                        async () => {
                            // La subida de la opción se completó con éxito, obtener la URL de descarga
                            const optionDownloadURL = await getDownloadURL(optionUploadTask.snapshot.ref);
                            optionImagesURLs.push(optionDownloadURL);

                            // Verificar si no se seleccionaron fechas especiales
                            if (!data.fechasEspeciales || data.fechasEspeciales[0].length === 0) {
                                console.log("No hay fechas especiales", data.fechasEspeciales);
                                setErrorMessages("No hay fechas especiales", data.fechasEspeciales)
                                data.fechasEspeciales = [];
                            }

                            if (optionImagesURLs.length === data.opciones.length) {
                                const productDataWithImages = {
                                    ...data,
                                    vendidos: Number(0),
                                    createdAt: new Date(),
                                    ocasiones: Array.isArray(productData.ocasiones) ? productData.ocasiones : [productData.ocasiones] || [],  // Agrega este campo
                                    categoria: Array.isArray(productData.categoria) ? productData.categoria : [productData.categoria],
                                    fechasEspeciales: Array.isArray(productData.fechasEspeciales) ? productData.fechasEspeciales : [productData.fechasEspeciales] || [],

                                    opciones: data.opciones.map((opcion, index) => {
                                        if (optionImagesURLs[index]) {
                                            opcion.img = optionImagesURLs[index];
                                        }
                                        return opcion;
                                    }),
                                };

                                await addDoc(collection(baseDeDatos, 'productos'), productDataWithImages);
                                setIsLoading(false);

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Producto Agregado',
                                    text: 'Has agregado correctamente un nuevo Producto',
                                });
                                localStorage.removeItem();
                                localStorage.removeItem('productos');
                                fetchProducts();
                                reset()
                                setProductData({
                                    nombre: '',
                                    precio: Number,
                                    descr: '',
                                    tipo: '',
                                    stock: '',
                                    categoria: [],
                                    opciones: [],
                                    ocasiones: [],
                                    fechasEspeciales: [],
                                    status: true,
                                });
                            }
                        }
                    );
                }
            }
        } catch (error) {
            // Manejar errores generales
            setIsLoading(false);
            console.error('Error al añadir el producto: ', error);
            setErrorMessages("Error al añadir el producto", error)
        }
    }

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
                await deleteDoc(doc(baseDeDatos, 'productos', productId));
                Swal.fire({
                    icon: 'success',
                    title: 'Producto Eliminado',
                    text: 'Has eliminado un producto',
                });
                localStorage.removeItem('carrito');
                localStorage.removeItem('productos');
                fetchProducts();
            }
        } catch (e) {
            console.error('Error al eliminar el producto: ', e);
            setErrorMessages("Error al eliminar el producto", e)
            Swal.fire(
                'Error',
                `Hubo un problema eliminando el producto. Error:${e}`,
                'error'
            );
        }
    };

    // Función para añadir todos los productos a Firebase Database
    const addAllProducts = async () => {
        // try {
        //     setIsLoading(true);
        //     // const directionsCollectionRef = collection(baseDeDatos, 'productos');

        //     const allProds = collection(baseDeDatos, 'productos');

        //     // // Puedo mapearlo y añadirlo directamente a Firebase Database
        //     // stockProductos.map((producto) => addDoc(allProds, producto));

        //     // Ó Recorrer los productos y añádirlos  a Firebase Database
        //     for (const product of stockProductos) {
        //         await addDoc(allProds, product);
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

    // Función para manejar los checkboxes de las categorías, ocasiones y fechas especiales
    const handleCheckboxNewProduct = (e, field, value) => {
        const isChecked = e.target.checked;

        setProductData((prevData) => {
            let updatedField = [...prevData[field]];

            if (isChecked) {
                updatedField.push(value);
            } else {
                updatedField = updatedField.filter((val) => val !== value);
            }
            return {
                ...prevData,
                [field]: updatedField,
            };
        });
    };

    // Función para manejar los checkboxes de los productos seleccionados
    const handleCheckboxChange = (e, productId, product) => {
        const isChecked = e.target.checked;

        if (selectAll) {
            // Si "Seleccionar Todo" está activo, desactivar "Seleccionar Todo"
            setSelectAll(false);

            // Actualizar la lista de productos seleccionados según el estado del checkbox actual
            setSelectedProducts((prevSelected) => {
                if (isChecked) {
                    // Si isChecked es true, agregar el producto a la lista de seleccionados
                    return [...prevSelected, { id: productId, product }];
                } else {
                    // Si isChecked es false, quitar el producto de la lista de seleccionados
                    return prevSelected.filter((selectedProduct) => selectedProduct.id !== productId);
                }
            });
        } else {
            if (isChecked) {
                setSelectedProducts((prevSelected) => [...prevSelected, product]);
            } else {
                setSelectedProducts((prevSelected) =>
                    prevSelected.filter((selectedProduct) => selectedProduct.id !== productId.toString())
                );
            }
        }
    };


    // Función para manejar el checkbox "Seleccionar Todo"
    const handleSelectAllChange = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        if (isChecked) {
            // Si "Seleccionar Todo" está activo, seleccionar todos los productos
            setSelectedProducts(products);
        } else {
            // Si "Seleccionar Todo" está desactivado, deseleccionar todos los productos
            setSelectedProducts([]);
        }
    };

    // Función para manejar el checkbox "Seleccionar Todo"
    const handleChangeNewProd = () => {
        setShowNewProd(!showNewProd)
    }

    const handleBulkEdit = () => {
        // Implementa la lógica para aplicar la modificación masiva
        navigate('/administrador/massiveEdition', { state: { selectedProducts } });
        // Puedes agregar la lógica para modificar masivamente los productos seleccionados
    };

    // Función para truncar la descripción
    const truncateDescription = (description) => {
        const maxLength = 50; // Puedes ajustar la longitud máxima según tus necesidades
        return description.length > maxLength
            ? `${description.slice(0, maxLength)}...`
            : description;
    };

    return (
        <div className='div-add-edit-prods'>
            <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>
                <Typography variant='h2' sx={{ color: 'white' }}>Productos</Typography>

                <div className='div-addProd'>
                    <div className='perfil-usuario-btns'>
                        <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>

                    </div>

                    {products.length === 0 &&
                        <div>
                            <Button variant='contained' onClick={addAllProducts}>Añadir todos los Productos</Button>
                        </div>

                    }


                    <Button variant={showNewProd ? 'contained' : 'outlined'} size='large' color='success' sx={{ margin: '20px 0', borderColor: !showNewProd && 'white', color: !showNewProd && 'white' }} onClick={handleChangeNewProd} >
                        {showNewProd ? 'NO QUIERO AGREGAR PRODUCTO NUEVO' : 'QUIERO AGREGA UN NUEVO PRODUCTO'}
                    </Button>
                    {showNewProd &&
                        <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>
                            <h3 className='title-edit-prods'>Agregar Nuevo Producto</h3>

                            <form className='form-addProd' onSubmit={handleSubmit(onSubmit)}>
                                <label>Nombre del producto</label>
                                <input
                                    {...register('nombre', { required: true })}
                                    placeholder="Nombre del producto"
                                    value={productData.nombre}
                                    onChange={e => setProductData({ ...productData, nombre: e.target.value })}

                                />
                                {errors.nombre && <p className='message-error'>El nombre del producto es requerido</p>}

                                <label>Descripción del producto</label>
                                <textarea
                                    {...register('descr', { required: true })}
                                    value={productData.descripcion}
                                    name="descr"
                                    onChange={e => setProductData({ ...productData, descr: e.target.value })}
                                    placeholder="Descripción del producto"
                                />
                                {errors.descr && <p className='message-error'>Agregue una descripción del producto</p>}
                        <br />
                        <h3>Recuerda que debes agregar al menos 1 de todos los campos siguientes...</h3>
                        <h5>Si no deseas agregar uno en especifico. Selecciona "Todos".</h5>

                                <label>Categorías</label>
                                <div>
                                    {categoryList.sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
                                        .map((category, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        {...register(`categoria[${index}]`)}
                                                        checked={productData.categoria.includes(category.name)}
                                                        onChange={(e) => handleCheckboxNewProduct(e, 'categoria', category.name)}

                                                        value={category.name}
                                                    />
                                                }
                                                label={category.name}
                                            />
                                        ))}
                                    {errors.categoria && <p className='message-error'>Selecciona al menos una categoría</p>}
                                </div>

                                <label>Ocasiones</label>
                                <div>
                                    {ocassionList
                                        .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
                                        .map((ocassion, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        {...register(`ocasiones[${index}]`)}
                                                        checked={productData.ocasiones.includes(ocassion.name)}
                                                        onChange={(e) => handleCheckboxNewProduct(e, 'ocasiones', ocassion.name)}

                                                        value={ocassion.name}
                                                    />
                                                }
                                                label={ocassion.name}
                                            />
                                        ))}
                                    {errors.ocasiones && <p className='message-error'>La ocasión del producto es requerida</p>}
                                </div>


                                <label>Fechas Especiales</label>
                                <div>
                                    {especialDates
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((date, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        {...register(`fechasEspeciales[${index}]`)}
                                                        checked={especialDatesData.includes(date.name)}
                                                        onChange={() => handleEspecialDateCheckboxChange(date.name)}
                                                        value={date.name}
                                                    />
                                                }
                                                label={date.name}
                                            />
                                        ))}
                                    {errors.fechasEspeciales && <p className='message-error'>Debes agregar al menos una fecha especial en el producto.</p>}
                                </div>
                                {/* </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDynamicWindow}>Cerrar</Button>
                                    {/* Puedes agregar más acciones según tus necesidades */}
                                {/* </DialogActions>
                            </Dialog> */}

                                <label>Stock</label>
                                <input
                                    {...register('stock', { required: true })}
                                    value={productData.stock}
                                    name="stock"
                                    type='number'
                                    onChange={e => setProductData({ ...productData, stock: e.target.value })}
                                    placeholder="Stock del producto"
                                />
                                {errors.stock && <p className='message-error'>Agregue un stock al producto</p>}

                                <label>Tipo</label>
                                <input
                                    {...register('tipo', { required: true })}
                                    type='text'
                                    defaultChecked={true}
                                    value={productData.tipo}
                                    name="tipo"
                                    onChange={e => setProductData({ ...productData, tipo: e.target.value })}
                                    placeholder="Tipo del producto"
                                />
                                {errors.tipo && <p className='message-error'>Verifique el tipo del producto</p>}

                                    <label>Status</label>
                                <div>
                                    <Switch
                                        {...register('status', { required: true })}
                                        checked={productData.status}
                                        onChange={() => setProductData({ ...productData, status: !productData.status })}
                                    />
                                    {errors.producto && <p className='message-error'>Verifique el Status del producto</p>}
                                </div>

                                <div>
                                    <h3>Agregar Opciones</h3>
                                    {fields.map((option, index) => (
                                        <div key={option.id} className='div-newOpt'>
                                            <h3>Opción {index + 1}</h3>

                                            <label>Tamaño:</label>
                                            <input
                                                {...register(`opciones[${index}].size`, { required: true })}
                                                placeholder="Tamaño del producto"
                                            />
                                            <label>Precio:</label>
                                            <div>
                                                <p>$</p>

                                                <input
                                                    {...register(`opciones[${index}].precio`, { required: true })}
                                                    placeholder="Precio del producto"
                                                    type='number'
                                                />
                                            </div>
                                            <label>Imagen de la opción</label>
                                            <input className='upload-prod'
                                                {...register(`opciones[${index}].img`, { required: true })}
                                                type="file"
                                                onChange={(e) => handleOptionImageChange(e, index)}
                                            />


                                            <Button color='error' size='small' variant='outlined' sx={{ width: '30%', margin: '10px 2px' }} type="button" onClick={() => remove(index)}>
                                                Eliminar Opción
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant='outlined' color='error' sx={{
                                        margin: 4, '&:hover': {
                                            fontWeight: 500
                                        },
                                    }} type="button" onClick={() => append({ size: '', precio: '', img: '' })}>
                                        Agregar Opción
                                        <AddIcon />
                                    </Button>
                                    {errors.opciones && <p className='message-error'>Debe agregar al menos 1 Opcion.</p>}
                                </div>

                                {isLoading ? (
                                    <div className="">
                                        Agregando Nuevo Producto, espere...
                                        <FadeLoader color="darkred" />
                                    </div>
                                ) : (
                                    <Button color='success' variant='contained' sx={{ margin: 4, width: '50%' }} type="submit">Agregar Producto</Button>
                                )}
                            </form>
                        </Paper>
                    }
                </div>

                {<Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px' }}>
                    <h2 style={{ color: 'darkred', fontWeight: '700' }}>{errorMessages}</h2>
                </Paper>
                }

            </Paper>
            <Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px' }}>


                <Searcher items={products} />

                {/* <Filtros products={products}  /> */}

                <div className="div-products-table">
                    <h3 className='title-edit-prods'>Editar / Eliminar Productos</h3>
                    <p className='title-edit-prods' >Cantidad de productos: {products.length} </p>

                    <div className='div-table'>

                        {selectedProducts.length !== 0 &&
                            (<>
                                <Button size='medium' color='success' sx={{ margin: 1.25 }}
                                    variant='contained' onClick={handleBulkEdit}>Editar Masivamente</Button>
                                <Typography variant='h6' sx={{ color: 'black' }}>Cantidad de productos que selecciono: {selectedProducts.length} </Typography>
                            </>)
                        }
                        {/* Nuevo checkbox para "Seleccionar Todo" */}
                        <FormControlLabel sx={{
                            background: '#555555',
                            width: '-webkit-fill-available',
                            margin: '0 10px',
                            borderRadius: ' 5px 5px 0 0px',
                            color: 'white'
                        }}
                            control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
                            label="Seleccionar Todo"
                        />

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ background: 'linear-gradient(to bottom, #161616, #363636)', boxShadow: '0 0 12px 3px black' }}>
                                    <TableRow>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Seleccionar</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Nombre</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Precio</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Descripción</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Categoría</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Tipo</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Vendidos</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Status</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Imagen</TableCell>
                                        <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'white' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prodEncontrado.length === undefined || prodEncontrado.length === 0 ?
                                        products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><input type="checkbox" value={product.id} onChange={(e) => handleCheckboxChange(e, product.id, product)}
                                                    checked={selectAll || selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)}
                                                /></TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{product.nombre}</TableCell>
                                                <TableCell sx={{ fontWeight: '800', minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>${product.opciones[0].precio}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{truncateDescription(product.descr)}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{Array.isArray(product.categoria) ? product.categoria.join(', ') : product.categoria}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', textTransform: 'uppercase' }}>{product.tipo}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{product.vendidos}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><Switch checked={product.status} onChange={() => setProductData(prevData => ({ ...prevData, status: !prevData.status }))} /></TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><img src={product.opciones[0].img} alt={product.nombre} width="50" /></TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>
                                                    <div className='btns-table'>
                                                        <Button size='medium' color='success' sx={{ fontSize: 12, margin: 1.25 }} variant='contained' onClick={() => handleNavigateToEdit(product.id)}>Editar</Button>
                                                        <Button size='small' sx={{ fontSize: 11, margin: 1.25, marginBottom: 2.25 }} color='error' variant='contained' onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        prodEncontrado?.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><input type="checkbox" value={product.id} onChange={(e) => handleCheckboxChange(e, product.id, product)}
                                                    checked={selectAll || selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)}
                                                /></TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{product.nombre}</TableCell>
                                                <TableCell sx={{ fontWeight: '800', minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>${product.opciones[0].precio}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{truncateDescription(product.descr)}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{Array.isArray(product.categoria) ? product.categoria.join(', ') : product.categoria}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', textTransform: 'uppercase' }}>{product.tipo}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{product.vendidos}</TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><Switch checked={product.status} onChange={() => setProductData(prevData => ({ ...prevData, status: !prevData.status }))} /></TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><img src={product.img || product.opciones[0].img} alt={product.nombre} width="50" /></TableCell>
                                                <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>
                                                    <div className='btns-table'>
                                                        <Button size='medium' color='success' sx={{ fontSize: 12, margin: 1.25 }} variant='contained' onClick={() => handleNavigateToEdit(product.id)}>Editar</Button>
                                                        <Button size='small' sx={{ fontSize: 11, margin: 1.25, marginBottom: 2.25 }} color='error' variant='contained' onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {selectedProducts &&
                            <Button size='small' color='success' sx={{ fontSize: 10, margin: 1.25 }} variant='contained' onClick={handleBulkEdit}>Editar Masivamente</Button>
                        }

                    </div>
                </div>
            </Paper>
        </div>
    );
}

export default AddProds;
