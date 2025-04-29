"use client"


import React, { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { baseDeDatos, storage, } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useFieldArray, useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
// import { Adicionales } from '../../ecommerce.adicionals';
import Searcher from '../../../componentes/Searcher/Searcher';
import { SearchContext } from '../../../context/SearchContext';
import { Button, Switch } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import style from './Adicional.module.css'
import { useTheme } from '@/context/ThemeSwitchContext';


function AddAdicionales() {
    const {isDarkMode } = useTheme();
    const { register, handleSubmit, formState: { errors }, control } = useForm();
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

    const navigate = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [adicionals, setAdicionals] = useState([]);
    const { prodEncontrado } = useContext(SearchContext);
    const [showNewProd, setShowNewProd] = useState(false)


    const handleChangeNewProd = () => {
        setShowNewProd(!showNewProd)
    }

    const handleNavigateToEdit = (productId) => {
        navigate.push(`/administrador/editAdicionales/${productId}`);
    };

    const fetchProducts = async () => {
        const adicionalesCollection = query(collection(baseDeDatos, 'adicionales'));
        const adicionalesDocs = await getDocs(adicionalesCollection);
        const listaAdicionales = adicionalesDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAdicionals(listaAdicionales);
    };

    useEffect(() => {
        fetchProducts();
    }, []);


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
            // Genera un id único para cada opción en el array
            const opcionesConId = data.opciones.map((opcion) => ({ ...opcion, id: uuidv4() }));
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
                await deleteDoc(doc(baseDeDatos, 'productos', productId));
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
        <div className={`${style.divAddEditProds} ${isDarkMode ? style.dark : style.light}`}>
            <div className={`${style.divAddProds} ${isDarkMode ? style.dark : style.light}`}>
                <div className={style.perfilUsuarioBtns}>
                    <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
                </div>
        
                <h1>Adicionales </h1>
        
                {adicionals.length === 0 &&
                    <div>
                        <button onClick={addAllProducts}>Añadir todos los Productos adicionales</button>
                    </div>
                }
        
                <Button variant="contained"
                            sx={{ color: !isDarkMode ? '#670000' : '#fffff', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '15px 30px', background: 'transparent', '&:hover': { background: !isDarkMode ? '#670000' : '#ffffff', color: !isDarkMode ? '#fff' : '#670000' } }} onClick={handleChangeNewProd} >
                    {showNewProd ? 'NO QUIERO AGREGAR ADICIONAL NUEVO' : 'QUIERO AGREGA UN NUEVO ADICIONAL'}
                </Button>
                {
                    showNewProd &&
                    <form className={style.formAddProd} onSubmit={handleSubmit(onSubmit)}>
                        <h3 className={style.titleEditProds}>Agregar Nuevo Producto Adicional</h3>
                        <div className={style.divAddProd}>
                            <label>Nombre del producto</label>
                            <input
                                {...register('nombre', { required: true })}
                                placeholder="Nombre del producto"
                                value={productData.nombre}
                                onChange={e => setProductData({ ...productData, nombre: e.target.value })}
                            />
                            {errors.nombre && <p className={style.messageError}>El nombre del producto es requerido</p>}
        
                            <label>Categoria</label>
                            <input
                                {...register('categoria', { required: true })}
                                value={productData.categoria}
                                name="categoria"
                                onChange={e => setProductData({ ...productData, categoria: e.target.value })}
                                placeholder="Categoria del producto"
                            />
                            {errors.categoria && <p className={style.messageError}>La categoría del producto es requerida</p>}
        
                            <label>Descripción del producto</label>
                            <textarea
                                {...register('descr', { required: true })}
                                value={productData.descripcion}
                                name="descr"
                                onChange={e => setProductData({ ...productData, descr: e.target.value })}
                                placeholder="Descripción del producto"
                            />
                            {errors.descr && <p className={style.messageError}>Agregue una descripción del producto</p>}
        
                            <label>Stock</label>
                            <input
                                {...register('stock', { required: true })}
                                value={productData.stock}
                                name="stock"
                                type='number'
                                onChange={e => setProductData({ ...productData, stock: e.target.value })}
                                placeholder="Stock del producto"
                            />
                            {errors.stock && <p className={style.messageError}>Agregue un stock al producto</p>}
        
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
                            {errors.tipo && <p className={style.messageError}>Verifique el tipo del producto</p>}
        
                            <div>
                                <label>Status</label>
                                <Switch
                                    {...register('status', { required: true })}
                                    checked={productData.status}
                                    onChange={() => setProductData({ ...productData, status: !productData.status })}
                                />
                                {errors.producto && <p className={style.messageError}>Verifique el Status del producto</p>}
                            </div>
        
                            <label>Imagen de la opción</label>
                            <input
                                {...register(`img`)}
                                type="file"
                                onChange={(e) => handleOptionImageChange(e)}
                            />
                        </div>
        
                        <h3>Agregar Opciones</h3>
                        <div className={style.divNewProdOpciones}>
                            {fields.length === 0 && <p className={style.messageError}>Tenes que agregar al menos 1 Opcion </p>}
                            {fields.map((option, index) => (
                                <div key={option.id} className={style.divOptAdicionales}>
                                    <h4>Opción {index + 1}</h4>
        
                                    <label>Tamaño:</label>
                                    <input
                                        {...register(`opciones[${index}].size`, { required: true })}
                                        placeholder="Tamaño del producto"
                                    />
        
                                    <label>Precio:</label>
                                    <input
                                        {...register(`opciones[${index}].precio`, { required: true })}
                                        placeholder="Precio del producto"
                                        type='number'
                                    />
        
                                    <Button color='error' size='small' variant='contained' sx={{margin:'20px'}} type="button" onClick={() => remove(index)}>
                                        Eliminar Opción
                                    </Button>
                                </div>
                            ))}
                            <Button variant="contained"
                            sx={{ color: !isDarkMode ? '#670000' : '#fffff', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '30px', background: 'transparent', '&:hover': { background: !isDarkMode ? '#670000' : '#ffffff', color: !isDarkMode ? '#fff' : '#670000' } }} type="button" onClick={() => append({ size: '', precio: '', img: '' })}>
                                Agregar Opción
                            </Button>
                            {errors.opciones && <p className={style.messageError}>Debe agregar al menos 1 Opcion.</p>}
                        </div>
        
                        {isLoading ? (
                            <div className={style.loading}>
                                Agregando Nuevo Producto, espere...
                                <PulseLoader color="#670000" />
                            </div>
                        ) : (
                            <Button  sx={{ width: '50%', margin: '25px 10px' }} variant='text' className={style.addProdBtn} type="submit">Agregar Producto</Button>
                        )}
                    </form>
                }
            </div>
        
            <div className={style.divDivider}></div>

            <div className={style.divProductsTable}>
                <h3 className={style.titleEditProds}>Editar / Eliminar Adicionales</h3>
                <p className={style.titleEditProds} >Cantidad de productos: {adicionals.length} </p>
        
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'wrap', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center', padding: '10px', margin: '20px 10px' }}>
                <Searcher items={adicionals} />
            </div>

                <div className={style.divTable}>
                    <table className={style.productsTable}>
                        <thead className={style.theadTable}>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                prodEncontrado.length === undefined || prodEncontrado.length === 0 ?
                                    adicionals.map((product) => (
                                        <tr className={style.trTbody} key={product.id}>
                                            <td className={style.tdTbody}><Image src={product?.img} alt={product.nombre} width={100} height={100} /></td>
                                            <td className={style.tdTbody}>{product.nombre}</td>
                                            <td className={style.tdTbody} style={{color: '#670000', fontWeight:'700'}}>$ {product.opciones[0].precio}</td>
                                            <td className={style.tdTbody}>{product.descr}</td>
                                            <td className={style.tdTbody}>
                                                <div className={style.btnsTable}>
                                                    <button className={style.btnTableEdit} onClick={() => handleNavigateToEdit(product.id)}>Editar</button>
                                                    <button className={style.btnTableDelete} onClick={() => deleteProduct(product.id)}>Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    prodEncontrado?.map((product) => (
                                        <tr className={style.trTbody} key={product.id}>
                                            <td className={style.tdTbody}><Image src={product.img || product.opciones[0].img} alt={product.nombre} width={100} height={100} /></td>
                                            <td className={style.tdTbody}>{product.nombre}</td>
                                            <td className={style.tdTbody} style={{color: '#670000', fontWeight:'700'}}>$ {product.opciones[0].precio}</td>
                                            <td className={style.tdTbody}>{product.descr}</td>
                                            <td className={style.tdTbody}>
                                                <div className={style.btnsTable}>
                                                    <button className={style.btnTableEdit} onClick={() => handleNavigateToEdit(product.id)}>Editar</button>
                                                    <button className={style.btnTableDelete} onClick={() => deleteProduct(product.id)}>Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AddAdicionales;
