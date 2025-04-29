"use client"

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { PulseLoader } from "react-spinners";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, MenuItem, Select } from '@mui/material';
import Image from 'next/image';
import { baseDeDatos, storage } from '@/admin/FireBaseConfig';
import { useRouter } from 'next/navigation';
import styles from './editProds.module.css'
import localforage from 'localforage';
import {  useTheme } from '@/context/ThemeSwitchContext'; // Importar el contexto del tema

const EditProds = ({ productId }) => {
    const { isDarkMode } = useTheme(); // Obtener el modo oscuro del contexto

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [previousOptionImages, setPreviousOptionImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isDynamicWindowOpen, setDynamicWindowOpen] = useState(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "opciones",
    });

    const categoryList = ['Rosas', 'Floreros', 'Todos', 'Flores', 'FerreroRocher',
        'Canastas', 'Desayunos', 'Plantas', 'Cajas', 'Coronas', 'Palmas', 'Comestibles',
        'Ramos', 'Girasoles', 'Gerberas', 'Liliums', 'Arreglos', 'Especiales', 'Combos', 'Peluches',
        'Bonsai']

    const ocassionList = ['Aniversarios', 'Casamientos', 'Nacimientos', 'Cumpleaños', 'Todos',
        'Condolencias', 'Funerales', 'RegalosHombres', 'Agradecimiento', 'Recuperacion']

    const especialDates = ['Navidad', 'DiaDeLaMadre', 'DiaDelPadre', 'AñoNuevo',
        'San Valentin', 'DiaDeLaPrimavera', 'AñoNuevoJudio', 'DiaDeLaSecretaria']

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
        precio: '',
        descr: '',
        vendidos: '',
        categoria: [],
        opciones: [],
        stock: '',
        status: true,
        ocasiones: [],
        fechasEspeciales: [],
        colores: [],
        camposDinamicos: {},
    });

    const handleStatusChange = () => {
        setProductData((prevData) => ({ ...prevData, status: !prevData.status }));
    };

    const handleOpenDynamicWindow = () => {
        setDynamicWindowOpen(true);
    };

    const handleCloseDynamicWindow = () => {
        setDynamicWindowOpen(false);
    };

    const handleEspecialDateCheckboxChange = (date) => {
        setProductData((prevData) => {
            const updatedEspecialDates = prevData.fechasEspeciales && prevData.fechasEspeciales.includes(date)
                ? prevData.fechasEspeciales.filter((d) => d !== date)
                : [...(prevData.fechasEspeciales || []), date];

            return {
                ...prevData,
                fechasEspeciales: updatedEspecialDates,
            };
        });
    };

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

    const [newfields, setNewFields] = useState({});
    const addCampoDinamico = () => {
        const nuevoCampo = `campo${Object.keys(newfields).length + 1}`;
        setNewFields((prevFields) => ({ ...prevFields, [nuevoCampo]: '' }));
    };

    const handleOptionImageChange = (e, index) => {
        const newOptionImage = e.target.files[0];
        const previewURL = URL.createObjectURL(newOptionImage);
        setPreviewImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[index] = previewURL;
            return updatedImages;
        });
        setProductData((prevData) => {
            const updatedOptions = [...prevData.opciones];
            if (!updatedOptions[index]) {
                updatedOptions[index] = {};
            }
            updatedOptions[index].img = newOptionImage;

            return {
                ...prevData,
                opciones: updatedOptions,
            };
        });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const optionImagesURLs = [];

            for (let i = 0; i < data.opciones.length; i++) {
                const option = data.opciones[i];

                if (option.img && (option.img instanceof File || (option.img instanceof FileList && option.img.length > 0))) {
                    const optionImageFile = option.img;
                    const optionImageRef = ref(
                        storage,
                        `productos/${data.nombre}/opciones/${option.size}/${optionImageFile[0].name}`
                    );

                    const optionUploadTask = uploadBytesResumable(optionImageRef, optionImageFile[0]);

                    await new Promise((resolve, reject) => {
                        optionUploadTask.on(
                            'state_changed',
                            () => { },
                            (error) => {
                                console.error('Error al subir la imagen de la opción:', error);
                                reject(error);
                            },
                            async () => {
                                const optionDownloadURL = await getDownloadURL(optionUploadTask.snapshot.ref);
                                optionImagesURLs.push(optionDownloadURL);
                                resolve();
                            }
                        );
                    });
                } else {
                    optionImagesURLs.push(previousOptionImages[i]);
                }
            }

            if (!data.fechasEspeciales || data.fechasEspeciales[0]?.length === 0 || data.fechasEspeciales?.length === 0) {
                data.fechasEspeciales = [];
            }

            const productDataWithImages = {
                ...data,
                opciones: data.opciones.map((o, index) => ({
                    size: o.size,
                    precio: Number(o.precio),
                    img: optionImagesURLs[index],
                    color: o.color
                })),
                categoria: Array.isArray(data.categoria) ? data.categoria : [data.categoria],
                ocasiones: Array.isArray(data.ocasiones) ? data.ocasiones : [],
                fechasEspeciales: Array.isArray(data.fechasEspeciales) ? data.fechasEspeciales : [],
                colores: Array.isArray(data.colores) ? data.colores : [],
                status: data.status,
                vendidos: Number(data.vendidos),
                camposDinamicos: data.camposDinamicos || {},
            };

            const productDocRef = doc(baseDeDatos, 'productos', productId);
            await updateDoc(productDocRef, productDataWithImages);

            await localforage.removeItem('productos');


            Swal.fire({
                icon: 'success',
                title: 'Producto Actualizado',
                text: 'Has actualizado correctamente el Producto',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });

            navigate.push('/administrador/add-prods');
        } catch (e) {
            console.error('Error al actualizar el producto: ', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productDocRef = doc(baseDeDatos, "productos", productId);
                const productDoc = await getDoc(productDocRef);
                if (productDoc.exists()) {
                    const product = productDoc.data();
                    setProductData(product);
                    setValue("nombre", product.nombre);
                    setValue("descr", product.descr);
                    setValue("stock", product.stock);
                    setValue("status", product.status);
                    setValue("categoria", Array.isArray(product.categoria) ? product.categoria : [product.categoria]);
                    setValue("ocasiones", Array.isArray(product.ocasiones) ? product.ocasiones : [product.ocasiones] || []);
                    setValue("fechasEspeciales", Array.isArray(product.fechasEspeciales) ? product.fechasEspeciales : [product.fechasEspeciales || []]);
                    setValue("vendidos", Number(product.vendidos));
                    setValue("colores", Array.isArray(product.colores) ? product.colores : []);
                    setValue("camposDinamicos", product.camposDinamicos || {});

                    product.opciones.forEach((opcion, index) => {
                        setValue(`opciones.${index}`, opcion.opciones);
                    });
                    if (product.opciones) {
                        product.opciones.forEach((opcion) => {
                            append(opcion);
                        });

                        const optionImages = product.opciones.map(opcion => opcion.img);
                        setPreviousOptionImages(optionImages);
                    }
                } else {
                    console.error("El producto no existe");
                }
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };
        fetchProduct();
    }, []);

    return (
        <div className={`${styles.divAddEditProds} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.divAddProds} ${isDarkMode ? styles.dark : styles.light}`}>

                <div className={styles.perfilUsuarioBtns}>
                    <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
                </div>

                <h3>Editar Producto</h3>
                <div className={styles.divDivider}></div>

                <form className={styles.formAddProd} onSubmit={handleSubmit(onSubmit)}>

                    <label> Nombre del producto </label>
                    <input
                        {...register("nombre", { required: true })}
                        placeholder="Nombre del producto"
                    />
                    {errors.nombre && <p className={styles.messageError}> El nombre del producto es requerido</p>}
                    <div className={styles.divDivider}></div>

                    <label>Categorías</label>
                    <div>
                        {categoryList.map((category) => (
                            <FormControlLabel
                                key={category}
                                control={
                                    <Checkbox
                                        {...register('categoria', { required: true })}
                                        color='secondary'
                                        checked={productData.categoria.includes(category)}
                                        onChange={(e) => {
                                            const updatedCategories = e.target.checked
                                                ? [...productData.categoria, category]
                                                : productData.categoria.filter((c) => c !== category);

                                            setProductData((prevData) => ({
                                                ...prevData,
                                                categoria: updatedCategories.map((cat) => (cat === 'on' ? category : cat)),
                                            }));
                                        }}
                                        value={category}
                                    />
                                }
                                label={category}
                            />
                        ))}
                        {errors.categoria && <p className={styles.messageError}>Selecciona al menos una categoría</p>}
                    </div>
                    <div className={styles.divDivider}></div>

                    <label> Descripción del producto </label>
                    <textarea
                        {...register("descr", { required: true })}
                        placeholder="Descripción del producto"
                    />
                    {errors.descr && <p className={styles.messageError}> Agregue una descripción del producto</p>}

                    <div className={styles.divDivider}></div>
                    <label>Ocasiones</label>
                    <div>
                        {ocassionList.map((ocassion) => (
                            <FormControlLabel
                                key={ocassion}
                                control={
                                    <Checkbox
                                        {...register('ocasiones')}
                                        color='secondary'
                                        checked={productData.ocasiones ? productData.ocasiones.includes(ocassion) : false}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setProductData((prevData) => {
                                                const updatedOcassion = isChecked
                                                    ? [...(prevData.ocasiones || []), ocassion]
                                                    : (prevData.ocasiones || []).filter((c) => c !== ocassion);

                                                return { ...prevData, ocasiones: updatedOcassion };
                                            });
                                        }}
                                        value={ocassion}
                                    />
                                }
                                label={ocassion}
                            />
                        ))}
                    </div>
                        <div className={styles.divDivider}></div>
                    <label>Fechas ESPECIALES</label>
                    <div>
                        <Button
                            variant="contained"
                            sx={{ color: !isDarkMode ? '#670000' : '#fffff', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '30px', background: 'transparent', '&:hover': { background: !isDarkMode ? '#670000' : '#ffffff', color: !isDarkMode ? '#fff' : '#670000' } }}
                            onClick={handleOpenDynamicWindow}
                        >
                            Agregar Fechas Especiales
                        </Button>
                    </div>

                    <Dialog open={isDynamicWindowOpen} onClose={handleCloseDynamicWindow}>
                        <DialogTitle>Fechas Especiales: </DialogTitle>
                        <DialogContent>
                            <div>
                                {especialDates.map((date, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                {...register('fechasEspeciales')}
                                                color='secondary'
                                                checked={productData.fechasEspeciales ? productData.fechasEspeciales.includes(date) : false}
                                                onChange={() => handleEspecialDateCheckboxChange(date)}
                                                value={date}
                                            />
                                        }
                                        label={date}
                                    />
                                ))}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDynamicWindow}>Cerrar</Button>
                        </DialogActions>
                    </Dialog>

                    <div className={styles.divDivider}></div>

                    <label>Colores</label>
                    <div className={styles.divColorEdit}>
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

                    <div className={styles.divDivider}></div>

                    <label> Stock </label>
                    <input
                        {...register("stock",)}
                        type='number'
                        placeholder="Stock del producto"
                    />
                    {errors.stock && <p className={styles.messageError}> Agregue un stock al producto</p>}


                    <div className={styles.divDivider}></div>

                    <label>Status</label>
                    <Switch
                        {...register("status")}
                        checked={productData.status}
                        onChange={handleStatusChange}
                    />

                    {errors.status && <p className={styles.messageError}>Verifique el Status del producto</p>}

                    <div className={styles.divDivider}></div>

                    <label> Cantidad de veces Vendido: </label>
                    <input
                        {...register("vendidos")}
                        type='number'
                        placeholder="Cantidad de veces vendido el producto"
                    />
                    {errors.vendidos && <p className={styles.messageError}>Verifique la cantidad de veces que se vendio el producto</p>}

                    <div className={styles.divDivider}></div>

                    <label> Opciones del producto </label>
                    <div className={styles.divOpt}>
                        {fields.map((option, index) => (
                            <div className={styles.divOptEdit} key={option.id}>
                                <h3>Opcion:{index === 0 ? '1' : index + 1}</h3>
                                Tamaño: <input
                                    {...register(`opciones.${index}.size`)}
                                    placeholder="Tamaño del producto"
                                />
                                Precio
                                <input
                                    {...register(`opciones.${index}.precio`)}
                                    placeholder="Precio del producto"
                                    type='number'
                                />
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
                                <p>Imagen Actual</p>
                                <Image src={previousOptionImages[index]} alt={`Imagen de la opción ${index + 1}`} width={300} height={300}  style={{objectFit:'contain'}}  />

                                <div className={styles.divNewImgOpt}>
                                    <p>Agregue una nueva imagen</p>
                                    <input
                                        {...register(`opciones[${index}].img`)}
                                        type="file"
                                        onChange={(e) => handleOptionImageChange(e, index)}
                                    />
                                    {previewImages[index] && (
                                        <div className={styles.newImgDiv}>
                                            <p>Imagen nueva:</p>
                                            <Image src={previewImages[index]} alt={`Previsualización de la opción ${index + 1}`} width={200} height={200}  style={{objectFit:'contain'}} />
                                        </div>
                                    )}
                                </div>

                                <Button variant='contained' size='small' color='error' sx={{ margin: 3, fontSize: 10 }} type="button" onClick={() => remove(index)}>
                                    Eliminar Opción
                                </Button>
                                <br />
                            </div>
                        ))}
                        <Button variant='contained' size='small'  sx={{ color: !isDarkMode ? '#670000' : '#fffff', border: '1px solid #670000', margin: '20px', borderRadius: '10px', minHeight:'500px', padding: '0px 30px', background: 'transparent', '&:hover': { background: !isDarkMode ? '#670000' : '#ffffff', color: !isDarkMode ? '#fff' : '#670000' } }}  type="button" onClick={() => append({ size: '', precio: '', img: '', color: '' })}>
                            Agregar Opción
                        </Button>
                    </div>

                    <div className={styles.divDivider}></div>


                    {isLoading ? (
                        <div className={styles.containerActualizacion}>

                            <section className={styles.actualizandoProd}>
                                <h3 className={styles.titleActualizando}>
                                    Actualizando...
                                </h3>
                                <PulseLoader color="#670000" />
                            </section>
                        </div>
                    ) : (
                        <button className={styles.btnSubmit} type="submit">Editar Producto</button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditProds;