import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { FadeLoader } from "react-spinners";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Paper, Switch, Typography } from '@mui/material';

const EditProds = () => {
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { productId } = useParams();
    const productDocRef = doc(baseDeDatos, "productos", productId);
    const [isLoading, setIsLoading] = useState(false);
    const [previousOptionImages, setPreviousOptionImages] = useState([]);



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

    const [productData, setProductData] = useState({
        nombre: '',
        precio: '',
        descr: '',
        vendidos: '',
        categoria: [],
        opciones: [],
        stock: '',
        status: true,
        ocasiones: [],  // Agrega este campo
        fechasEspeciales: [],
        camposDinamicos: {}, // Objeto para campos adicionales

    });

    const handleStatusChange = () => {
        setProductData((prevData) => ({ ...prevData, status: !prevData.status }));
    };

    const [isDynamicWindowOpen, setDynamicWindowOpen] = useState(false);

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
    
    const fetchProduct = async (e, index) => {
        try {
            const productDoc = await getDoc(productDocRef);
            if (productDoc.exists()) {
                const product = productDoc.data();
                setProductData(product);
                // Llena los campos del formulario con los datos del producto
                setValue("nombre", product.nombre);
                setValue("descr", product.descr);
                setValue("stock", product.stock);
                setValue("status", product.status);
                setValue(`opciones.${index}`, product.opciones);
                setValue("categoria", Array.isArray(product.categoria) ? product.categoria : [product.categoria]);
                setValue("ocasiones", Array.isArray(product.ocasiones) ? product.ocasiones : [product.ocasiones] || []);
                setValue("fechasEspeciales", Array.isArray(product.fechasEspeciales) ? product.fechasEspeciales : [product.fechasEspeciales || []]);
                setValue("vendidos", Number(product.vendidos));
                setValue("camposDinamicos", product.camposDinamicos || {});

                if (product.opciones) {
                    product.opciones.forEach((opcion) => {
                        append(opcion);
                    });

                    const optionImages = product.opciones.map((opcion, idx) => opcion.img);
                    setPreviousOptionImages(optionImages);
                }
            } else {
                console.error("El producto no existe");
                
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
        }
    };


    const [newfields, setNewFields] = useState({});
    const addCampoDinamico = () => {
        // Puedes ajustar la lógica según tus necesidades.
        // En este ejemplo, simplemente se agrega un nuevo campo con un nombre único.
        const nuevoCampo = `campo${Object.keys(newfields).length + 1}`;
        setNewFields((prevFields) => ({ ...prevFields, [nuevoCampo]: '' }));
    };

    const handleOptionImageChange = (e, index) => {
        const newOptionImage = e.target.files[0]; // Obtén el primer archivo seleccionado
        setProductData((prevData) => {
            const updatedOptions = [...prevData.opciones];
            if (!updatedOptions[index]) {
                updatedOptions[index] = {}; // Inicializa la opción si es nula
            }
            updatedOptions[index].img = newOptionImage;

            // Actualiza el estado de las opciones
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
                    // Sube la nueva imagen solo si hay una nueva imagen
                    const optionImageFile = option.img;
                    const optionImageRef = ref(
                        storage,
                        `productos/${data.nombre}/opciones/${option.size}/${optionImageFile[0].name}`
                    );

                    // Subir la nueva imagen a Firestore Storage
                    const optionUploadTask = uploadBytesResumable(optionImageRef, optionImageFile[0]);

                    // Manejar el progreso, errores y completar la subida
                    await new Promise((resolve, reject) => {
                        optionUploadTask.on(
                            'state_changed',
                            (snapshot) => { },
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
                    // Si no hay una nueva imagen, utiliza la URL existente
                    optionImagesURLs.push(previousOptionImages[i]);
                }
            }
        // Verificar si no se seleccionaron fechas especiales
        if (!data.fechasEspeciales || data.fechasEspeciales[0]?.length === 0 || data.fechasEspeciales?.length === 0) {
            console.log("No hay fechas especiales", data.fechasEspeciales);
            // Asignar un array vacío a fechasEspeciales en data
            data.fechasEspeciales = [];
        }
            // Actualiza solo la opción actual con la nueva URL de imagen si es necesario
            const productDataWithImages = {
                ...data,
                opciones: data.opciones.map((o, index) => ({
                    size: o.size,
                    precio: Number(o.precio),
                    img: optionImagesURLs[index],
                })),
                categoria: Array.isArray(data.categoria) ? data.categoria : [data.categoria],
                ocasiones: Array.isArray(data.ocasiones) ? data.ocasiones : [],  // Agrega este campo
                fechasEspeciales: Array.isArray(data.fechasEspeciales) ? data.fechasEspeciales : [],
                status: data.status,
                vendidos: Number(data.vendidos),

                camposDinamicos: data.camposDinamicos || {},  // Incluye campos dinámicos
            };

            // Realiza la actualización en la base de datos
            const productDocRef = doc(baseDeDatos, 'productos', productId);
            await updateDoc(productDocRef, productDataWithImages);

            Swal.fire({
                icon: 'success',
                title: 'Producto Actualizado',
                text: 'Has actualizado correctamente el Producto',
                toast: true,             // Esto hace que la alerta se muestre como un toast
                position: 'bottom-right',     // Posición en la esquina superior derecha
                showConfirmButton: false, // No mostrar botón de confirmación
                timer: 1500,             // Duración de la alerta (en milisegundos)
                timerProgressBar: true,   // 
            });

            navigate('/administrador/addProds');
        } catch (e) {
            console.error('Error al actualizar el producto: ', e);

        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <div className='div-add-edit-prods'>

<Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px' }}>

            <div className='div-addProd'>
                <div className='perfil-usuario-btns'>
                    <Button sx={{ margin: 5 }}  variant='contained' size='small' color='error' onClick={() => navigate(-1)}>Volver atrás</Button>

                </div>

                <Typography variant='h4' sx={{color:'white', textTransform:'uppercase'}}>Editar Producto Seleccionado:</Typography>
                <form className='form-addProd' onSubmit={handleSubmit(onSubmit)}>



                    <label> Nombre del producto </label>
                    <input
                        {...register("nombre", { required: true })}
                        placeholder="Nombre del producto"
                    />
                    {errors.nombre && <p className='message-error'> El nombre del producto es requerido</p>}

                    <label>Categorías</label>
                    <div>
                        {categoryList.map((category) => (
                            <FormControlLabel
                                key={category}
                                control={
                                    <Checkbox
                                    color='success'
                                        {...register('categoria', { required: true })}
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
                                        value={category} // Agrega el atributo value
                                    />
                                }
                                label={category}
                            />
                        ))}
                        {errors.categoria && <p className='message-error'>Selecciona al menos una categoría</p>}
                    </div>

                    <label> Descripción del producto </label>
                    <textarea
                        {...register("descr", { required: true })}
                        placeholder="Descripción del producto"
                    />
                    {errors.descr && <p className='message-error'> Agregue una descripción del producto</p>}

                    <label>Ocasiones</label>
                    <div>
                        {ocassionList.map((ocassion) => (
                            <FormControlLabel
                                key={ocassion}
                                control={
                                    <Checkbox
                                    color='success'
                                        {...register('ocasiones')}
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

                    <div>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleOpenDynamicWindow}
                            sx={{ margin: 4 }}
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
                                            color='success'
                                                {...register('fechasEspeciales')}
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
                            {/* Puedes agregar más acciones según tus necesidades */}
                        </DialogActions>
                    </Dialog>


                    <label> Stock </label>
                    <input
                        {...register("stock",)}
                        type='number'
                        placeholder="Stock del producto"
                    />
                    {errors.stock && <p className='message-error'> Agregue un stock al producto</p>}

                    <label>Status</label>
                    <Switch
                        {...register("status")}
                        checked={productData.status}
                        onChange={handleStatusChange}
                    />

                    {errors.status && <p className='message-error'>Verifique el Status del producto</p>}


                    <label> Cantidad de veces Vendido: </label>
                    <input
                        {...register("vendidos")}
                        type='number'
                        placeholder="Cantidad de veces vendido el producto"
                    />
                    {errors.vendidos && <p className='message-error'>Verifique la cantidad de veces que se vendio el producto</p>}


                    {/* <label> Campos Dinámicos </label>
                    {Object.keys(newfields).map((field, index) => (
                        <div key={index}>
                            <input
                                {...register(`camposDinamicos.${field}`)}
                                placeholder={`Valor para ${field}`}
                            />
                        </div>
                    ))}
                    <Button color='primary' size='small' variant='contained' sx={{width:'25%', marginBottom:'35px'}} type="button" onClick={() => addCampoDinamico()}>Agregar Campo</Button>
                    {errors.camposDinamicos && <p className='message-error'> Agregue los valores de los campos dinámicos</p>} */}


                    {/* OPCIONES */}
                    <label> Opciones del producto </label>
                    <div className='div-opt'>
                        {fields.map((option, index) => (
                            <div className='div-opt-edit' key={option.id}>
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
                                <p>Imagen anterior</p>
                                <img src={previousOptionImages[index]} alt={`Imagen de la opción ${index + 1}`} width="100px" />

                                <div className='div-new-img-opt'>
                                    <p>Agregue una nueva imagen</p>
                                    <input
                                        {...register(`opciones[${index}].img`)}
                                        type="file"
                                        onChange={(e) => handleOptionImageChange(e, index)}
                                    />
                                </div>


                                <Button variant='text' size='large' color='error' sx={{ margin: 3 }} type="button" onClick={() => remove(index)}>
                                    Eliminar Opción
                                </Button>
                                <br />
                            </div>
                        ))}


                        <div>
                            
                    <Button variant='contained' size='large' color='error' sx={{ margin: 3, width: 'fit-content' }} type="button" onClick={() => append({ size: '', precio: '', img: '' })}>
                        Agregar Opción
                    </Button>
                        </div>
                    {/* FIN OPCIONES */}

                    </div>

                    {isLoading ? (
                        <div className="">
                            Actualizando...
                            <FadeLoader color="pink" />
                        </div>
                    ) : (
                        <Button variant='contained' size='large' color='success' sx={{ margin: 3, width:'75%' }} type="submit">Editar Producto</Button>
                    )}
                </form>
            </div>
            </Paper>
        </div>
    );
};

export default EditProds;
