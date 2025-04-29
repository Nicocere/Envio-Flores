"use client"

import React, { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';
import style from './addProds.module.css';
import Searcher from '../../../componentes/Searcher/Searcher';
import { SearchContext } from '../../../context/SearchContext';
import { Button, Switch, Table, TableBody, MenuItem, TableCell, TableContainer, Select, TableHead, TableRow, Paper, Typography, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import localforage from 'localforage';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeSwitchContext';

function AddProds() {
    const { isDarkMode } = useTheme();

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'opciones',
    });
    const [especialDatesData, setEspecialDatesData] = useState([]);
    const [isDynamicWindowOpen, setDynamicWindowOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const { prodEncontrado } = useContext(SearchContext);
    const [categoryList, setCategoryList] = useState([]);
    const [ocassionList, setOcassionList] = useState([]);
    const [especialDates, setEspecialDates] = useState([]);
    const [showNewProd, setShowNewProd] = useState(false)

    const colorList = [
        { value: 'pink', label: 'Rosa' },
        { value: 'red', label: 'Rojo' },
        { value: 'white', label: 'Blanco' },
        { value: 'yellow', label: 'Amarillo' },
        { value: 'orange', label: 'Naranja' },
        { value: 'rainbown', label: 'Arcoíris' },
        { value: 'black', label: 'Negro' },
        { value: 'gold', label: 'Dorado' },
        { value: 'silver', label: 'Plateado' }
    ];


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
            }
        };

        fetchCategories();
    }, []);


    const handleColorCheckboxChange = (color) => {
        setProductData((prevData) => {
            const updatedColors = prevData.colores && prevData.colores.includes(color)
                ? prevData.colores.filter((c) => c !== color)
                : [...(prevData.colores || []), color];

            return {
                ...prevData,
                colores: updatedColors,
            };
        });
    };

    const handleOpenDynamicWindow = () => {
        setDynamicWindowOpen(true);
    };

    const handleCloseDynamicWindow = () => {
        setDynamicWindowOpen(false);
    };

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
        navigate.push(`/administrador/editProds/${productId}`);
    };

    const fetchProducts = async () => {
        const productsCollection = query(collection(baseDeDatos, 'productos'));
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // setProducts(productList);

        // guardarlo en el localforage y localstorage.
        await localforage.setItem('productos', productList);

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
        setIsLoading(true);
        const fieldsFilled = (
            !errors.nombre &&
            !errors.descr &&
            !errors.stock &&
            !errors.tipo
        );

        if (!fieldsFilled) {
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
                        (snapshot) => {
                            // Manejar el progreso si es necesario
                            setIsLoading(false);
                        },
                        (error) => {
                            // Manejar errores durante la subida de la opción
                            console.error('Error al subir la imagen de la opción:', error);
                            setIsLoading(false);
                        },
                        async () => {
                            // La subida de la opción se completó con éxito, obtener la URL de descarga
                            const optionDownloadURL = await getDownloadURL(optionUploadTask.snapshot.ref);
                            optionImagesURLs.push(optionDownloadURL);

                            if (optionImagesURLs.length === data.opciones.length) {
                                const productDataWithImages = {
                                    ...data,
                                    vendidos: Number(0),
                                    createdAt: new Date(),
                                    ocasiones: Array.isArray(productData.ocasiones) ? productData.ocasiones : [productData.ocasiones] || [],  // Agrega este campo
                                    categoria: Array.isArray(productData.categoria) ? productData.categoria : [productData.categoria],
                                    fechasEspeciales: Array.isArray(productData.fechasEspeciales) ? productData.fechasEspeciales : [productData.fechasEspeciales] || [],
                                    colores: Array.isArray(data.colores) ? data.colores : [],
                                    status: data.status,

                                    opciones: data.opciones.map((o, index) => ({
                                        size: o.size,
                                        precio: Number(o.precio),
                                        img: optionImagesURLs[index],
                                        color: o.color
                                    })),
                                };

                                await addDoc(collection(baseDeDatos, 'productos'), productDataWithImages);
                                setIsLoading(false);

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Producto Agregado',
                                    text: 'Has agregado correctamente un nuevo Producto',
                                });
                                //     await localforage.removeItem('cart');
                                //    await localforage.removeItem('productos');
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
                                    colores: [],
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
                //    await localforage.removeItem('carrito');
                //    await localforage.removeItem('productos');
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

    const handleChangeNewProd = () => {
        setShowNewProd(!showNewProd)
    }

    const handleBulkEdit = async () => {
        // Guardar en el localForage el valor de selectedProducts en su formato original para usarlo en la siguiente página

        await localforage.setItem('massiveProds', selectedProducts);


        // Navegar a la ruta con los productos seleccionados como parámetro de consulta
        navigate.push(`/administrador/massiveEdition`);
    };

    // Función para truncar la descripción
    const truncateDescription = (description) => {
        const maxLength = 50; // Puedes ajustar la longitud máxima según tus necesidades
        return description.length > maxLength
            ? `${description.slice(0, maxLength)}...`
            : description;
    };

    return (
        <div className={`${style.divAddEditProds} ${!isDarkMode ? style.dark : style.light}`}>
            <div className={`${style.divAddProds} ${isDarkMode ? style.dark : style.light}`}>
            
            <div className={style.perfilUsuarioBtns}>
                    <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
                </div>

            <h1>Productos</h1>

                {products.length === 0 &&
                    <div>
                        <button className='btn btn-primary' onClick={addAllProducts}>Añadir todos los Productos</button>
                    </div>

                }

                <Button variant='contained' size='large' sx={{ color: !isDarkMode ? '#670000' : '#fffff', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '0px 30px', background: 'transparent', '&:hover': { background: !isDarkMode ? '#670000' : '#ffffff', color: !isDarkMode ? '#fff' : '#670000' } }} onClick={handleChangeNewProd} >
                    {showNewProd ? 'NO QUIERO AGREGAR PRODUCTO NUEVO' : 'QUIERO AGREGA UN NUEVO PRODUCTO'}
                </Button>
                {showNewProd &&
                    <>
                        <h3 className={style.titleEditProds}>Agregar Nuevo Producto</h3>
                        <form className={style.formAddProd} onSubmit={handleSubmit(onSubmit)}>
                            <label>Nombre del producto</label>
                            <input
                                {...register('nombre', { required: true })}
                                placeholder="Nombre del producto"
                                value={productData.nombre}
                                onChange={e => setProductData({ ...productData, nombre: e.target.value })}

                            />
                            {errors.nombre && <p className='message-error'>El nombre del producto es requerido</p>}
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


                            <label>Descripción del producto</label>
                            <textarea
                                {...register('descr', { required: true })}
                                value={productData.descripcion}
                                name="descr"
                                onChange={e => setProductData({ ...productData, descr: e.target.value })}
                                placeholder="Descripción del producto"
                            />
                            {errors.descr && <p className='message-error'>Agregue una descripción del producto</p>}

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

                            {/* <label>Ocasiones</label>
                    <input
                        {...register('ocasiones', { required: true })}
                        value={productData.ocasiones.join(', ')} // Mostrar el array como una cadena separada por comas
                        name="ocasiones"
                        onChange={(e) => setProductData({ ...productData, ocasiones: e.target.value.split(',').map((ocas) => ocas.trim()) })} // Dividir la cadena en un array
                        placeholder="Categoría del producto"
                    /> */}

                            <div>
                                <Button
                                    variant='contained' size='large' sx={{ color: '#670000', border: '3px solid #670000', margin: '20px', borderRadius: '10px', padding: '10px 30px', background: 'transparent', '&:hover': { background: '#ffffff', color: '#670000' } }} onClick={handleOpenDynamicWindow}

                                >
                                    Agregar Fechas Especiales
                                </Button>
                            </div>

                            <Dialog open={isDynamicWindowOpen} onClose={handleCloseDynamicWindow}>
                                <DialogTitle>Especiales Fechas</DialogTitle>
                                <DialogContent>
                                    {/* Aquí puedes agregar los checkboxes para 'especialDates' */}
                                    <div>
                                        {especialDates
                                            .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
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
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDynamicWindow}>Cerrar</Button>
                                    {/* Puedes agregar más acciones según tus necesidades */}
                                </DialogActions>
                            </Dialog>


                            <label>Colores</label>
                            <div className={style.divColorEdit}>
                                {colorList.map((color) => (
                                    <FormControlLabel
                                        key={color.value}
                                        control={
                                            <Checkbox
                                                {...register('colores')}
                                                color='secondary'
                                                checked={productData.colores ? productData.colores.includes(color.value) : false}
                                                onChange={() => handleColorCheckboxChange(color.value)}
                                                value={color.value}
                                            />
                                        }
                                        label={
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        backgroundColor: color.value,
                                                        marginRight: '8px',
                                                        color: '#fcf5f0'
                                                    }}
                                                ></span>
                                                {color.label}
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
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

                            <div>
                                <label>Status</label>
                                <Switch
                                    {...register('status', { required: true })}
                                    checked={productData.status}
                                    onChange={() => setProductData({ ...productData, status: !productData.status })}
                                />
                                {errors.producto && <p className='message-error'>Verifique el Status del producto</p>}
                            </div>

                            <div className={style.divOpts}>
                                <h3>Agregar Opciones</h3>
                                {fields.map((option, index) => (
                                    <div key={option.id} className={style.divNewOpt}>
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

                                        <label>Color</label>
                                        <Select
                                            {...register(`opciones.${index}.color`)}
                                            defaultValue=""
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Selecciona un color</MenuItem>
                                            {colorList.map((color) => (
                                                <MenuItem key={color.value} value={color.value}>{color.label}</MenuItem>
                                            ))}
                                        </Select>

                                        <label>Imagen de la opción</label>
                                        <input className='upload-prod'
                                            {...register(`opciones[${index}].img`)}
                                            type="file"
                                            onChange={(e) => handleOptionImageChange(e, index)}
                                        />


                                        <Button color='error' size='small' variant='outlined' sx={{ width: '30%', margin: '10px 2px' }} type="button" onClick={() => remove(index)}>
                                            Eliminar Opción
                                        </Button>
                                    </div>
                                ))}
                                <Button variant='contained' size='large' sx={{ color: '#670000', border: '3px solid #670000', margin: '20px', borderRadius: '10px', padding: '10px 30px', background: 'transparent', '&:hover': { background: '#ffffff', color: '#670000' } }} type="button" onClick={() => append({ size: '', precio: '', img: '' })}>
                                    Agregar Opción
                                    <AddIcon />
                                </Button>
                                {errors.opciones && <p className='message-error'>Debe agregar al menos 1 Opcion.</p>}
                            </div>

                            {isLoading ? (
                                <div className="">
                                    Agregando Nuevo Producto, espere...
                                    <PulseLoader color="#670000" />
                                </div>
                            ) : (
                                <Button variant='contained' size='large' sx={{ color: '#670000', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: ' 15px 30px', background: '#670000', '&:hover': { background: '#ffffff', color: '#670000' } }} type="submit">Agregar Producto</Button>
                            )}
                        </form>
                    </>
                }
            </div>


            <div className={style.divProductsTable}>
                <h3 className={style.titleEditProds}>Editar / Eliminar Productos</h3>
                <p className={style.titleEditProds} >Cantidad de productos: {products.length} </p>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'wrap', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center', padding: '10px', margin: '20px 10px' }}>

                    <Searcher items={products} />
                </div>

                <div className={style.divTable}>
                    {selectedProducts.length !== 0 &&
                        (<>
                            <Button size='medium' color='secondary' sx={{ margin: 1.25 }}
                                variant='contained' onClick={handleBulkEdit}>Editar Masivamente</Button>

                            <Typography variant='h4' sx={{ color: 'black' }}>Cantidad de productos que selecciono: {selectedProducts.length} </Typography>
                        </>)
                    }
                    {/* Nuevo checkbox para "Seleccionar Todo" */}
                    <FormControlLabel sx={{
                        placeContent: 'center',
                        width: '-webkit-fill-available',
                        margin: '0 10px',
                        borderRadius: ' 5px 5px 0 0px', color: isDarkMode ? 'white' : '#670000', backgroundColor: isDarkMode ? '#670000' : 'white',
                    }}
                        control={<Checkbox style={{ transform: '(1.4)' }} checked={selectAll} onChange={handleSelectAllChange} />}
                        label="Seleccionar Todo"
                    />

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ background: isDarkMode ? '#670000' : 'linear-gradient(145deg,#fafafa,#f5f5f5)', color: isDarkMode ? 'white' : '#670000', boxShadow: '0 0 12px 3px black' }}>
                                <TableRow>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Seleccionar</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Nombre</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Precio</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Descripción</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Categoría</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Tipo</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Veces Vendidos</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Status</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Imagen</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase',  color: isDarkMode ? 'white' : '#670000',   }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prodEncontrado.length === undefined || prodEncontrado.length === 0 ?
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', textAlign: 'center' }}>
                                                <Checkbox color='secondary' type="checkbox" value={product.id} onChange={(e) => handleCheckboxChange(e, product.id, product)}
                                                    checked={selectAll || selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)}
                                                /></TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', fontWeight: '700' }}>{product.nombre}</TableCell>
                                            <TableCell sx={{ fontWeight: '800', minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>${product.opciones[0].precio}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{truncateDescription(product.descr)}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{Array.isArray(product.categoria) ? product.categoria.join(', ') : product.categoria}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', textTransform: 'uppercase' }}>{product.tipo}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{product.vendidos}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><Switch checked={product.status} onChange={() => setProductData(prevData => ({ ...prevData, status: !prevData.status }))} /></TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><Image src={product.opciones[0].img} alt={product.nombre} width={50} height={50} style={{ objectFit: 'contain' }} /></TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>
                                                <div className='btns-table'>
                                                    <Button className={style.btnTableEdit} onClick={() => handleNavigateToEdit(product.id)}>Editar</Button>
                                                    <Button className={style.btnTableDelete} onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    :
                                    prodEncontrado?.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', textAlign: 'center' }}><input type="checkbox" style={{ transform: 'scale(1.7)' }} value={product.id} onChange={(e) => handleCheckboxChange(e, product.id, product)}
                                                checked={selectAll || selectedProducts.some((selectedProduct) => selectedProduct.id === product.id)}
                                            /></TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', fontWeight: '700' }}>{product.nombre}</TableCell>
                                            <TableCell sx={{ fontWeight: '800', minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>${product.opciones[0].precio}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{truncateDescription(product.descr)}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{Array.isArray(product.categoria) ? product.categoria.join(', ') : product.categoria}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)', textTransform: 'uppercase' }}>{product.tipo}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>{product.stock}</TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><Switch checked={product.status} onChange={() => setProductData(prevData => ({ ...prevData, status: !prevData.status }))} /></TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}><Image src={product.opciones[0].img} alt={product.nombre} width={50} height={50} style={{ objectFit: 'contain' }} /></TableCell>
                                            <TableCell style={{ minWidth: 75, borderBottom: '1px solid rgb(151 151 151)' }}>
                                                <div className='btns-table'>
                                                    <Button className={style.btnTableEdit} onClick={() => handleNavigateToEdit(product.id)}>Editar</Button>
                                                    <Button className={style.btnTableDelete} onClick={() => deleteProduct(product.id)}>Eliminar</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>


                    {selectedProducts.length !== 0 &&
                        (<>
                            <Button size='medium' color='secondary' sx={{ margin: 1.25 }}
                                variant='contained' onClick={handleBulkEdit}>Editar Masivamente</Button>

                            <Typography variant='h4' sx={{ color: 'black' }}>Cantidad de productos que selecciono: {selectedProducts.length} </Typography>
                        </>)
                    }
                    {/* Nuevo checkbox para "Seleccionar Todo" */}
                    <FormControlLabel sx={{
                        placeContent: 'center',
                        width: '-webkit-fill-available',
                        margin: '0 10px',
                        borderRadius: ' 5px 5px 0 0px', color : isDarkMode ? 'white' : '#670000'
                    }}
                        control={<Checkbox style={{ transform: '(1.4)' }} checked={selectAll} onChange={handleSelectAllChange} />}
                        label="Seleccionar Todo"
                    />

                </div>
            </div>
        </div>
    );
}

export default AddProds;
