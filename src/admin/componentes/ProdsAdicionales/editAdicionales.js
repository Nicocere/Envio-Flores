import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { FadeLoader } from "react-spinners";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import './Adicional.css'
import { Button, Paper, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const EditAdicionales = () => {
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { productId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [previousOptionImages, setPreviousOptionImages] = useState([]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "opciones",
    });

    const productDocRef = doc(baseDeDatos, "adicionales", productId);

    const [productData, setProductData] = useState({
        nombre: '',
        precio: '',
        descr: '',
        categoria: [],
        opciones: [],
        stock: '',
        img: previousOptionImages,

    });

    const fetchProduct = async () => {
        try {
            const productDoc = await getDoc(productDocRef);
            if (productDoc.exists()) {
                const product = productDoc.data();
                setProductData(product);

                setValue("nombre", product.nombre);
                setValue("categoria", product.categoria);
                setValue("descr", product.descr);
                setValue("stock", product.stock);
                setValue("img", product.img);

                product.opciones.forEach((opcion) => {
                    append(opcion);
                });


                setPreviousOptionImages(product.img);
            } else {
                console.error("El adicional no existe");
            }
        } catch (error) {
            console.error("Error al obtener el adicional:", error);
        }
    };

    const handleImageChange = (e) => {
        const newImage = e.target.files[0];
        setProductData((prevData) => ({
            ...prevData,
            img: newImage,
        }));
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            let imageURL = previousOptionImages; // Utiliza la URL existente si no hay una nueva imagen

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
            const productDocRef = doc(baseDeDatos, 'adicionales', productId);
            await updateDoc(productDocRef, productDataWithImage);

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

    useEffect(() => {
        fetchProduct();
    }, []);


    return (
        <div className='div-add-edit-prods'>
            <Paper elevation={24} sx={{ background: '#670000', padding: '20px 50px ', marginBottom: '80px' }}>
                <div className='div-addProd'>

                    <div className='perfil-usuario-btns'>
                        <Button sx={{ margin: 5 }} color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>
                    </div>


                    <Typography variant='h4' sx={{color:'white', textTransform:'uppercase'}}>Editar Adicional Seleccionado:</Typography>
                    <form className='form-addProd' onSubmit={handleSubmit(onSubmit)}>
                        <label> Nombre del adicional </label>
                        <input
                            {...register("nombre", { required: true })}
                            placeholder="Nombre del adicional"
                        />
                        {errors.nombre && <p className='message-error'> El nombre del adicional es requerido</p>}

                        <label> Categoria </label>
                        <input
                            {...register("categoria", { required: true })}
                            placeholder="Categoría del adicional"
                        />
                        {errors.categoria && <p className='message-error'> La categoría del adicional es requerida</p>}

                        <label> Descripción del adicional </label>
                        <textarea
                            {...register("descr", { required: true })}
                            placeholder="Descripción del adicional"
                        />
                        {errors.descr && <p className='message-error'> Agregue una descripción del adicional</p>}

                        <label> Stock </label>
                        <input
                            {...register("stock", { required: true })}
                            type='number'
                            placeholder="Stock del adicional"
                        />
                        {errors.stock && <p className='message-error'> Agregue un stock al adicional</p>}

                        <div className='img-anterior'>
                            <p>Imagen anterior</p>
                            <img src={previousOptionImages} alt={`Imagen Previa `} width="100px" />
                        </div>

                        <label> Imagen del adicional </label>
                        <input
                            {...register("img")}
                            type="file"
                            onChange={(e) => handleImageChange(e)}
                        />


                        {/* OPCIONES */}
                        <hr />
                        <p> Opciones del adicional </p>
                        <div className='div-opt-adic'>
                            {fields.map((option, index) => (
                                <div className='div-opt-edit' key={option.id}>
                                    <h3>Opcion:{index === 0 ? '1' : index + 1}</h3>
                                    Tamaño: <input
                                        {...register(`opciones.${index}.size`)}
                                        placeholder="Tamaño del adicional"
                                    />
                                    Precio


                                    <input
                                        {...register(`opciones.${index}.precio`)}
                                        placeholder="Precio del adicional"
                                        type='number'
                                    />


                                    <Button color='error' variant='text'  onClick={() => remove(index)}>
                                        Eliminar Opción
                                    </Button>
                                    <br />
                                </div>
                            ))}
                    


<div className='btn-add-opt'>

                        <Button color='error' variant='contained' sx={{margin:'20px', width:'fit-content' }} onClick={() => append({ size: '', precio: '', img: '' })}>
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
                            <Button color='success' variant='contained' sx={{margin:'20px', width:'50%' }} type="submit">Editar Producto</Button>
                        )}
                    </form>

                </div>
            </Paper>
        </div>
    );
};

export default EditAdicionales;
