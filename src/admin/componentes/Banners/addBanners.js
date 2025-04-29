"use client"
import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, deleteDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import { getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import CarouselComponent from '../../../componentes/Carousel/Carousel';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import style from './banners.module.css'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeSwitchContext';


function AddBanners() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [banners, setBanners] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const { isDarkMode } = useTheme();
    const [showNewBanner, setShowNewBanner] = useState(false);

    const fetchBanners = async () => {
        const bannersCollection = collection(baseDeDatos, 'banners');
        const bannerDocs = await getDocs(bannersCollection);
        const bannerList = bannerDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setBanners(bannerList);
    };

    const handleNavigateToEdit = (bannerId) => {
        navigate.push(`/administrador/edit/banners/${bannerId}`);

    }

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleRutaCampo2Change = (e) => {
        const value = e.target.value;
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        setValue('rutaCampo2', capitalizedValue);
    };


    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const rutaProd = `/${data.rutaCampo1}/${data.rutaCampo2}`;

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
                            ruta: rutaProd, // Agrega la ruta
                        };

                        await addDoc(collection(baseDeDatos, 'banners'), bannerDataWithImage);
                        setIsLoading(false);
                        Swal.fire({
                            icon: 'success',
                            title: 'Banner Agregado',
                            text: 'Has agregado correctamente un nuevo Banner',
                        });

                        fetchBanners();
                    }
                );
            } else {
                setIsLoading(false);
                console.error('No se seleccionó ninguna imagen');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error al agregar el banner:', error);
        }
    };

    const deleteBanner = async (bannerId) => {
        try {
            await deleteDoc(doc(baseDeDatos, 'banners', bannerId));
            Swal.fire({
                icon: 'success',
                title: 'Banner Eliminado',
                text: 'Has eliminado correctamente el Banner',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
            });

            fetchBanners();
        } catch (error) {
            console.error('Error al eliminar el banner:', error);
        }
    };



    const handleChangeNewBanner = () => {
        setShowNewBanner(!showNewBanner)
    }

    return (
        <div className={`${style.divAddEditProds} ${isDarkMode ? style.dark : style.light}`}>
            <div className={style.divAddBanner}>

                <div className={style.perfilUsuarioBtns}>
                    <Button variant='text' size='small' color='error' onClick={() => navigate.back()}>Volver atrás</Button>
                </div>

                <h1>Banners</h1>

                <h3>Agregar Nuevos Banners</h3>

                <Button variant='contained' size='large' sx={{ color: !isDarkMode ? '#670000' : '#fffff', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: '0px 30px', background: 'transparent', '&:hover': { background: !isDarkMode ? '#670000' : '#ffffff', color: !isDarkMode ? '#fff' : '#670000' } }} onClick={handleChangeNewBanner} >
                    {showNewBanner ? 'CANCELAR' : 'QUIERO AGREGA UN NUEVO BANNER'}
                </Button>

                {
                    showNewBanner && (


                        <form className={style.formAddBanner} onSubmit={handleSubmit(onSubmit)}>
                            <label> Nombre del Banner </label>
                            <input
                                {...register('nombreProd', { required: true })}
                                placeholder="Nombre del banner"
                            />
                            {errors.nombreProd && <p style={{ color: 'red', fontWeight: '800' }}> El nombre del producto es requerido</p>}

                            <label> Imagen </label>
                            <input
                                {...register('imagenProd', { required: true })}
                                type="file"
                                onChange={handleFileChange}
                            />

                            {
                                imageFile && (
                                    <Image
                                        src={URL.createObjectURL(imageFile)}
                                        alt={imageFile.name}
                                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                                        width={800}
                                        height={400}
                                    />
                                )
                            }
                            {errors.imagenProd && <p style={{ color: 'red', fontWeight: '800' }}> Debe agregar una Imagen</p>}

                            <label>Ruta del Banner</label>
                            <span>Ejemplo: /categoria/rosas o /productos/chocolates</span>
                            <div className={style.routeInputContainer}>
                                <span>/</span>
                                <input
                                    {...register('rutaCampo1', { required: true })}
                                    placeholder="primer-campo"
                                />
                                <span>/</span>
                                <input
                                    {...register('rutaCampo2', { required: true })}
                                    placeholder="segundo-campo"
                                    onChange={handleRutaCampo2Change}
                                />
                            </div>
                            {errors.rutaCampo1 && <p style={{ color: 'red', fontWeight: '800' }}>El primer campo de la ruta es requerido</p>}
                            {errors.rutaCampo2 && <p style={{ color: 'red', fontWeight: '800' }}>El segundo campo de la ruta es requerido</p>}

                            {isLoading ? (
                                <div className="">
                                    Agregando Nuevo Banner, aguarde....
                                    <PulseLoader color={isDarkMode ? '#670000' : '#670000'} />
                                </div>
                            ) : <Button variant='contained' size='large' sx={{ color: '#670000', border: '1px solid #670000', margin: '20px', borderRadius: '10px', padding: ' 15px 30px', background: '#670000', '&:hover': { background: '#ffffff', color: '#670000' } }} type="submit">Agregar Banner</Button>}
                        </form>
                    )
                }
            </div>
            <h2 className={style.bannerTitle}>Banners actuales</h2>
            <div className={style.divBannerActual}>
                <h1>Banner Actual:</h1>
                <CarouselComponent />
            </div>

            <div className={style.divTableBanners}>
                <h3>Editar / Eliminar Banners</h3>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ background: 'linear-gradient(to bottom, #670000, #670000)', boxShadow: '0 0 12px 3px black', textAlign: 'center' }}>
                            <TableRow>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'var(--color)' }}>Imagen</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'var(--color)' }}>Nombre</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'var(--color)' }}>URL</TableCell>
                                <TableCell style={{ minWidth: 75, fontWeight: '700', textTransform: 'uppercase', color: 'var(--color)' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {banners.map((banner, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', borderBottom: '1px solid var(--hover)' }}><Image src={banner.imagen} alt={banner.nombre} style={{ objectFit: 'cover' }} width={300} height={100} /></TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', borderBottom: '1px solid var(--hover)' }}>{banner.nombre}</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', borderBottom: '1px solid var(--hover)' }}>{banner.ruta}</TableCell>
                                    <TableCell style={{ minWidth: 75, fontWeight: '700', borderBottom: '1px solid var(--hover)' }}>
                                        <div className={style.btnsTable}>
                                            <Button className={style.btnTableEdit} onClick={() => handleNavigateToEdit(banner.id)}>Editar</Button>
                                            <Button className={style.btnTableDelete} onClick={() => deleteBanner(banner.id)}>Eliminar</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );

}


export default AddBanners