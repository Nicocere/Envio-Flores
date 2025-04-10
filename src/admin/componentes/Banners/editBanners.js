import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FadeLoader } from 'react-spinners';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';

function EditBanner() {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const { bannerId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [bannerDetails, setBannerDetails] = useState({});

    const fetchBannerDetails = async () => {
        try {
            const bannerDoc = await getDoc(doc(baseDeDatos, 'banners', bannerId));
            if (bannerDoc.exists()) {
                const bannerData = bannerDoc.data();
                setBannerDetails(bannerData);
                // Setea los valores iniciales del formulario con los detalles actuales del banner
                setValue('nombreProd', bannerData.nombre);
                setValue('rutaProd', bannerData.ruta);
            } else {
                console.error('El banner no existe');
            }
        } catch (error) {
            console.error('Error al obtener detalles del banner:', error);
        }
    };

    useEffect(() => {
        fetchBannerDetails();
    }, [bannerId, setValue]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            if (imageFile) {
                const storageRef = ref(storage, `banners/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Progreso del upload
                    },
                    (error) => {
                        console.error('Error en el upload:', error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const bannerDataWithImage = {
                            nombre: data.nombreProd,
                            imagen: downloadURL,
                            ruta: data.rutaProd,
                        };

                        await updateDoc(doc(baseDeDatos, 'banners', bannerId), bannerDataWithImage);

                        setIsLoading(false);
                        Swal.fire({
                            icon: 'success',
                            title: 'Banner Actualizado',
                            text: 'Has actualizado correctamente el Banner',
                        });

                        setImageFile(null); // Restablece imageFile a null para mantener la imagen actual
                        navigate('/administrador/banners'); // Cambia la ruta según tu estructura de rutas
                    }
                );
            } else {
                // Si no se selecciona una nueva imagen, actualiza los otros campos sin cambiar la imagen
                const bannerDataWithoutImage = {
                    nombre: data.nombreProd,
                    ruta: data.rutaProd,
                };

                await updateDoc(doc(baseDeDatos, 'banners', bannerId), bannerDataWithoutImage);

                setIsLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Banner Actualizado',
                    text: 'Has actualizado correctamente el Banner',
                });

                setImageFile(null); // Restablece imageFile a null para mantener la imagen actual
                navigate('/administrador/banners'); // Cambia la ruta según tu estructura de rutas
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error al actualizar el banner:', error);
        }
    };

    return (
        <div className='div-add-edit-prods'>
            <h2 className='banner-title'>Editar Banner</h2>
            <div className='perfil-usuario-btns'>
                    <Button color='error' variant='contained' size='small' onClick={() => navigate(-1)}>Volver atrás</Button>

                </div>


                <div>
                    <h4>Datos Actuales del Banner</h4>
                    <p>Nombre: {bannerDetails.nombre}</p>
                    <p>Ruta: {bannerDetails.ruta}</p>
                    <img src={bannerDetails.imagen} alt='Banner actual' style={{ maxWidth: '300px' }} />
                </div>

            <div className='div-addProd'>
                <h3>Editar Banner</h3>

                <form className='form-addProd' onSubmit={handleSubmit(onSubmit)}>
                    <label> Nombre del Banner </label>
                    <input {...register('nombreProd', { required: true })} />

                    <label> Imagen </label>
                    <input {...register('imagenProd')} type='file' onChange={handleFileChange} />

                    <label>Ruta del Banner</label>
                    <input {...register('rutaProd', { required: true })} />

                    {isLoading ? (
                        <div className=''>
                            Actualizando Banner, aguarde....
                            <FadeLoader color='pink' />
                        </div>
                    ) : (
                        <button className='add-prod-btn black-btn' type='submit'>
                            Actualizar Banner
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default EditBanner;
