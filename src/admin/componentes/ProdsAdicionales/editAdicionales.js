import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { PulseLoader } from "react-spinners";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import style from './Adicional.module.css'
import { Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeSwitchContext';

const EditAdicionales = ({ productId }) => {
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useRouter();
const { isDarkMode } = useTheme();
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
    useEffect(() => {
        const fetchProduct = async (e, index) => {
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

                    product.opciones.forEach((opcion, index) => {
                        setValue(`opciones.${index}`, opcion.opciones);
                    });
                    if (product.opciones) {
                        product.opciones.forEach((opcion) => {
                            append(opcion);
                        });
                    }
                    


                    setPreviousOptionImages(product.img);
                } else {
                    console.error("El adicional no existe");
                }
            } catch (error) {
                console.error("Error al obtener el adicional:", error);
            }
        };

        fetchProduct();
    }, [productId, append, setValue
    ]);


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

            navigate.replace('/administrador/adicionales');
        } catch (e) {
            console.error('Error al actualizar el adicional: ', e);
        } finally {
            setIsLoading(false);
        }
    };

return (
    <div className={`${style.divAddEditProds} ${isDarkMode ? style.dark : style.light}`}>
        <div className={`${style.divAddProds} ${isDarkMode ? style.dark : style.light}`}>
            <div className={style.perfilUsuarioBtns}>
                <Button sx={{ margin: 5 }}  variant='text' size='small' onClick={() => navigate.back()}>Volver atrás</Button>
            </div>
            <h1>Editar Adicional</h1>
            <p>En esta sección puedes editar los detalles del adicional. Puedes cambiar el nombre, la categoría, la descripción, el stock y la imagen del adicional.</p>
            <form className={style.formAddProd} onSubmit={handleSubmit(onSubmit)}>
                <div className={style.divAddProd}>
                    <label> Nombre del adicional </label>
                    <input
                        {...register("nombre", { required: true })}
                        placeholder="Nombre del adicional"
                    />
                    <p className={style.infoText}>Este es el nombre que se mostrará para el adicional.</p>
                    {errors.nombre && <p className={style.messageError}> El nombre del adicional es requerido</p>}

                    <label> Categoria </label>
                    <input
                        {...register("categoria", { required: true })}
                        placeholder="Categoría del adicional"
                    />
                    <p className={style.infoText}>Especifica la categoría a la que pertenece el adicional.</p>
                    {errors.categoria && <p className={style.messageError}> La categoría del adicional es requerida</p>}

                    <label> Descripción del adicional </label>
                    <textarea
                        {...register("descr", { required: true })}
                        placeholder="Descripción del adicional"
                    />
                    <p className={style.infoText}>Proporciona una descripción detallada del adicional.</p>
                    {errors.descr && <p className={style.messageError}> Agregue una descripción del adicional</p>}

                    <label> Stock </label>
                    <input
                        {...register("stock", { required: true })}
                        type='number'
                        placeholder="Stock del adicional"
                    />
                    <p className={style.infoText}>Indica la cantidad de stock disponible para el adicional.</p>
                    {errors.stock && <p className={style.messageError}> Agregue un stock al adicional</p>}

                    <div className={style.imgAnterior}>
                        <p>Imagen anterior</p>
                        <Image src={previousOptionImages} alt={`Imagen Previa `} style={{objectFit:'cover'}} width={300} height={300} />
                    </div>

                    <label> Imagen del adicional </label>
                    <input
                        {...register("img")}
                        type="file"
                        onChange={(e) => handleImageChange(e)}
                    />
                    <p className={style.infoText}>Selecciona una nueva imagen para el adicional. Si no seleccionas una nueva imagen, se mantendrá la actual.</p>
                </div>

                {/* OPCIONES */}
                <hr />
                <p> Opciones del adicional </p>
                <p className={style.infoText}>Aquí puedes agregar, editar o eliminar las opciones del adicional. Cada opción puede tener un tamaño y un precio diferente.</p>
                <div className={style.divOptAdic}>
                    {fields.map((option, index) => (
                        <div className={style.divOptEdit} key={option.id}>
                            <h3>Opción: {index + 1}</h3>
                            <label>Tamaño:</label>
                            <input
                                {...register(`opciones.${index}.size`)}
                                placeholder="Tamaño del adicional"
                            />
                            <label>Precio:</label>
                            <input
                                {...register(`opciones.${index}.precio`)}
                                placeholder="Precio del adicional"
                                type='number'
                            />
                            <button type="button" className={style.deleteOpt} onClick={() => remove(index)}>
                                Eliminar Opción
                            </button>
                            <br />
                        </div>
                    ))}
                    <button type="button" className={style.deleteOpt} style={{minHeight:'300px'}} onClick={() => append({ size: '', precio: '', img: '' })}>
                        Agregar Opción
                    </button>
                </div>
                {/* FIN OPCIONES */}

                {isLoading ? (
                    <div className="">
                        Actualizando...
                    <PulseLoader  color={isDarkMode ? '#670000': '#670000'} />
                    </div>
                ) : (
                    <button className={style.addProdBtn} style={{margin:'50px 0 40px'}} type="submit">Editar Producto</button>
                )}
            </form>
        </div>
    </div>
);
};

export default EditAdicionales;
