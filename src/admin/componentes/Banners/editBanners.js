import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';
import style from './banners.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeSwitchContext';

function EditBanner({ bannerId }) {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [bannerDetails, setBannerDetails] = useState({});
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchBannerDetails = async () => {
            if (!bannerId) return;

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
                    null,
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
                        navigate.push('/administrador/banners'); // Cambia la ruta según tu estructura de rutas
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
                navigate.push('/administrador/banners'); // Cambia la ruta según tu estructura de rutas
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error al actualizar el banner:', error);
        }
    };

    return (
        <div className={`${style.divAddEditProds} ${isDarkMode ? style.dark : style.light}`}>
            <div className={style.divAddBanner}>
                <div className={style.perfilUsuarioBtns}>
                    <Button color='error' variant='text' size='small' onClick={() => navigate.back()}>Volver atrás</Button>
                </div>

                <h2 className={style.bannerTitle}>Edicion del Banner "{bannerDetails.nombre}" </h2>

                <div className={style.bannerDetails}>
                    <h4>Datos Actuales del Banner</h4>
                    <p>Nombre: <strong style={{ color: '#670000' }}>{bannerDetails.nombre}</strong></p>
                    <p>Ruta a la que redirige:  <strong style={{ color: '#670000' }}>*{bannerDetails.ruta}* </strong></p>
                    {bannerDetails.imagen && (
                        <Image src={bannerDetails.imagen} alt='Banner actual' style={{ objectFit: 'cover', borderRadius: '10px' }} width={800} height={400} />
                    )}
                </div>

                <h3>Editar Banner</h3>

                <form className={style.formAddBanner} onSubmit={handleSubmit(onSubmit)}>
                    <label> Nombre del Banner </label>
                    <input {...register('nombreProd', { required: true })} />

                    <label> Imagen </label>
                    <input {...register('imagenProd')} type='file' onChange={handleFileChange} />

                    <label>Ruta del Banner</label>
                    <input {...register('rutaProd', { required: true })} />

                    {isLoading ? (
                        <div className=''>
                            Actualizando Banner, aguarde....
                            <PulseLoader color={isDarkMode ? '#670000' : '#670000'} />
                        </div>
                    ) : (
                        <button className={style.submitBtn} type='submit'>
                            Actualizar Banner
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default EditBanner;