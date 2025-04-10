import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, deleteDoc } from 'firebase/firestore';
import { baseDeDatos, storage } from '../../FireBaseConfig';
import { getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import CarouselComponent from '../../../componentes/Carousel/Carousel';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function AddBanners() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [banners, setBanners] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const fetchBanners = async () => {
        const bannersCollection = collection(baseDeDatos, 'banners');
        const bannerDocs = await getDocs(bannersCollection);
        const bannerList = bannerDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setBanners(bannerList);
    };

    const handleNavigateToEdit = (bannerId) => {
        navigate(`/administrador/edit/banners/${bannerId}`);

    }

    useEffect(() => {
        fetchBanners();
    }, []);

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
                            ruta: data.rutaProd, // Agrega la ruta
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
            fetchBanners();
        } catch (error) {
            console.error('Error al eliminar el banner:', error);
        }
    };

    return (
        < div className='div-add-edit-prods'>
            <Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px' }}>

            <Typography variant='h2' sx={{color:'white'}}>Banners</Typography>
            <div className='perfil-usuario-btns'>
                    <Button color='error' variant='contained' size='small'sx={{margin: 5, }} onClick={() => navigate(-1)}>Volver atrás</Button>

                </div>

            <div className='div-addProd' >
                <Typography variant='h4' sx={{color:'white'}}>Agregar Nuevos Banners</Typography>

                <form className='form-addProd' style={{margin:'0px'}} onSubmit={handleSubmit(onSubmit)}>
                    <label> Nombre del Banner </label>
                    <input
                        {...register('nombreProd', { required: true })}
                        placeholder="Nombre del banner"
                    />
                    {errors.nombreProd && <p className='message-error' > El nombre del producto es requerido</p>}


                    <label> Imagen </label>
                    <input
                        {...register('imagenProd', { required: true })}
                        type="file"
                        onChange={handleFileChange}
                    />
                    {errors.imagenProd && <p className='message-error' > Debe agregar una Imagen</p>}

                    <label>Ruta del Banner</label><span>Ejemplo: /categoria/.....</span>
                    <input
                        {...register('rutaProd', { required: true })}
                        placeholder="Ruta a la que debe redirigir el banner"
                    />
                    {errors.rutaProd && <p className='message-error'>La ruta del banner es requerida</p>}

                    {
                        isLoading ? (
                            <div className="">
                                Agregando Nuevo Banner, aguarde....
                                <FadeLoader color="pink" />
                            </div>
                        ) : <Button color='success' variant='contained' sx={{marginTop: 5, }} type="submit">Agregar Banner</Button>
                    }
                </form>
            </div>
</Paper>
            <div style={{color:'white', margin:'40px'}}>
                <h1>Banner Actual:</h1>
                <CarouselComponent />

            </div>

            <Paper elevation={24} sx={{ background: 'linear-gradient(to top, #a70000, #670000)', padding: '20px' }}>

            <div>
            <Typography variant='h4' sx={{color:'white'}}>Editar / Eliminar Banners</Typography>


                <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{background:'linear-gradient(to bottom, #161616, #363636)', boxShadow:'0 0 12px 3px black'}}>
                        <TableRow>
                            <TableCell style={{ fontSize:'larger',minWidth: 75, fontWeight:'700', textTransform:'uppercase', color:'white' }}>Nombre</TableCell>
                            <TableCell style={{ fontSize:'larger',minWidth: 75, fontWeight:'700', textTransform:'uppercase', color:'white' }}>URL </TableCell>

                            <TableCell style={{ fontSize:'larger',minWidth: 75, fontWeight:'700', textTransform:'uppercase', color:'white' }}>Imagen</TableCell>
                            <TableCell style={{ fontSize:'larger',minWidth: 75, fontWeight:'700', textTransform:'uppercase', color:'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {banners.map((banner, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ fontSize:'larger',minWidth: 75, borderBottom:'1px solid rgb(151 151 151)' }}>{banner.nombre}</TableCell>
                                <TableCell style={{ fontSize:'larger',minWidth: 75, borderBottom:'1px solid rgb(151 151 151)' }}>{banner.ruta}</TableCell>

                                <TableCell style={{ fontSize:'larger',minWidth: 75, borderBottom:'1px solid rgb(151 151 151)' }}><img src={banner.imagen} alt={banner.nombre} width="80" /></TableCell>
                                <TableCell style={{ fontSize:'larger',minWidth: 75, borderBottom:'1px solid rgb(151 151 151)' }}>
                                    <div className='btns-table'>
                                        <Button size='small'  color='info' sx={{ fontSize: 10,  margin: 1.25 }} variant='contained'  className="btn-table-edit" onClick={() => handleNavigateToEdit(banner.id)}>Editar</Button>

                                        <Button size='small' color='error' sx={{ fontSize: 10,  margin: 1.25 }} variant='contained'  className="btn-table-delete" onClick={() => deleteBanner(banner.id)}>Eliminar</Button>
                                    </div>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            </div>
</Paper>
        </ div>
    )

}


export default AddBanners