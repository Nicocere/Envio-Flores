"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { baseDeDatos, auth } from '@/admin/FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, TextField, Grid, Card, CardContent, IconButton, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, Box, Chip, Autocomplete, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { format, parseISO } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Delete, Add } from '@mui/icons-material';
import localforage from 'localforage';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import style from './gestionRegalos.module.css';
import Image from 'next/image';

export default function GestionRegalos() {
    const [tabValue, setTabValue] = useState(0);
    const [recordatorios, setRecordatorios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedDirection, setSelectedDirection] = useState(null);
    const [newDirection, setNewDirection] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        notas: ''
    });
    const [formData, setFormData] = useState({
        nombre: '',
        fecha: null,
        productos: [],
        direccion: '',
        notas: '',
        tipo: ''
    });

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                await cargarDatos(user.uid);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    const cargarDatos = async (uid) => {
        try {
            const userDoc = await getDoc(doc(baseDeDatos, 'users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Filtrar recordatorios vencidos
                const recordatoriosFiltrados = (userData.recordatorios || []).filter(recordatorio => {
                    // Convertir la fecha del recordatorio a Date si es necesario
                    const fechaRecordatorio = recordatorio.fecha?.toDate?.() || new Date(recordatorio.fecha);
                    const hoy = new Date();
                    
                    const diferenciaDias = differenceInDays(fechaRecordatorio, hoy);
                    return diferenciaDias > 0; // Solo mantener los recordatorios futuros
                });
    
                // Si se eliminaron recordatorios, actualizar en Firebase
                if (recordatoriosFiltrados.length < (userData.recordatorios || []).length) {
                    await updateDoc(doc(baseDeDatos, 'users', uid), {
                        ...userData,
                        recordatorios: recordatoriosFiltrados
                    });
                }
    
                setUserData({
                    ...userData,
                    recordatorios: recordatoriosFiltrados
                });
                setRecordatorios(recordatoriosFiltrados);
                setFavoritos(userData.favoritos || []);
                setDirecciones(userData.direcciones || []);
            }
    
            const productosData = await localforage.getItem('productos');
            setProductos(productosData || []);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            mostrarError('No se pudieron cargar los datos');
        }
    };

    const guardarRecordatorio = async () => {
        try {
            if (!formData.nombre || !formData.fecha || selectedProducts.length === 0) {
                mostrarError('Por favor completa todos los campos requeridos');
                return;
            }

            const nuevoRecordatorio = {
                ...formData,
                productos: selectedProducts,
                direccion: selectedDirection,
                userId: currentUser.uid,
                nombreUser: userData.nombre,
                apellidoUser: userData.apellido,
                email: currentUser.email,
                createdAt: new Date(),
                status: 'activo'
            };

            const docRef = await addDoc(collection(baseDeDatos, 'recordatorios'), nuevoRecordatorio);

            await updateDoc(doc(baseDeDatos, 'users', currentUser.uid), {
                recordatorios: [...recordatorios, { id: docRef.id, ...nuevoRecordatorio }]
            });

            setRecordatorios(prev => [...prev, { id: docRef.id, ...nuevoRecordatorio }]);
            limpiarFormulario();

            Swal.fire({
                title: '¡Éxito!',
                text: 'Recordatorio guardado correctamente',
                icon: 'success',
                confirmButtonColor: '#d4af37'
            });

        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error al guardar el recordatorio');
        }
    };

    const eliminarRecordatorio = async (recordatorioId) => {
        try {
            await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d4af37',
                cancelButtonColor: '#2f1a0f',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteDoc(doc(baseDeDatos, 'recordatorios', recordatorioId));
                    const updatedRecordatorios = recordatorios.filter(r => r.id !== recordatorioId);
                    await updateDoc(doc(baseDeDatos, 'users', currentUser.uid), {
                        recordatorios: updatedRecordatorios
                    });
                    setRecordatorios(updatedRecordatorios);
                    mostrarExito('Recordatorio eliminado correctamente');
                }
            });
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error al eliminar el recordatorio');
        }
    };

    const agregarDireccion = async () => {
        try {
            if (!newDirection.nombre || !newDirection.direccion) {
                mostrarError('Por favor completa los campos requeridos');
                return;
            }

            const nuevasDirecciones = [...direcciones, { ...newDirection, id: Date.now() }];
            await updateDoc(doc(baseDeDatos, 'users', currentUser.uid), {
                direcciones: nuevasDirecciones
            });

            setDirecciones(nuevasDirecciones);
            setNewDirection({
                nombre: '',
                direccion: '',
                telefono: '',
                notas: ''
            });
            mostrarExito('Dirección guardada correctamente');
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error al guardar la dirección');
        }
    };

    const mostrarError = (mensaje) => {
        Swal.fire({
            title: 'Error',
            text: mensaje,
            icon: 'error',
            confirmButtonColor: '#d4af37'
        });
    };

    const mostrarExito = (mensaje) => {
        Swal.fire({
            title: '¡Éxito!',
            text: mensaje,
            icon: 'success',
            confirmButtonColor: '#d4af37'
        });
    };

    const limpiarFormulario = () => {
        setFormData({
            nombre: '',
            fecha: null,
            productos: [],
            direccion: '',
            notas: '',
            tipo: 'cumpleaños'
        });
        setSelectedProducts([]);
        setSelectedDirection(null);
        setOpenDialog(false);
    };

    return (
        <div className={style.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={style.secondContainer}
            >
                <h2 className={style.title}>
                    Gestión de Regalos y Recordatorios
                </h2>

                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    className={style.tabs}
                >
                    <Tab label="Recordatorios" />
                    {/* <Tab label="Direcciones" /> */}
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                        className={style.addButton}
                    >
                        Nuevo Recordatorio
                    </Button>

                    <Grid container spacing={3} className={style.recordatoriosGrid}>
                        {recordatorios.map((recordatorio) => (
                            <Grid item xs={12} sm={6} md={4} key={recordatorio.id}>
                                <RecordatorioCard
                                    recordatorio={recordatorio}
                                    onDelete={eliminarRecordatorio}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <DireccionesPanel
                        direcciones={direcciones}
                        newDirection={newDirection}
                        setNewDirection={setNewDirection}
                        onSave={agregarDireccion}
                    />
                </TabPanel>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle className={style.dialogTitle}>
                        Nuevo Recordatorio
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre del evento"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className={style.textField}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#d4af37' },
                                            '&:hover fieldset': { borderColor: '#d4af37' },
                                            '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#d4af37' },
                                        '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <StaticDatePicker
                                        orientation="landscape"
                                        label="Fecha del evento"
                                        value={formData.fecha}
                                        onChange={(newValue) => setFormData({ ...formData, fecha: newValue })}
                                        format="dd/MM/yyyy"
                                        className={style.datePicker}
                                        sx={{
                                            width: '100%',
                                            '& .MuiPickersDay-root': {
                                                color: '#2f1a0f',
                                                '&.Mui-selected': {
                                                    backgroundColor: '#d4af37',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#c4a032',
                                                    },
                                                },
                                            },
                                            '& .MuiPickersDay-today': {
                                                border: '1px solid #d4af37',
                                            },
                                            '& .MuiTypography-root': {
                                                color: '#2f1a0f',
                                            },
                                            '& .MuiPickersCalendarHeader-label': {
                                                color: '#d4af37',
                                                textTransform: 'capitalize',
                                            },
                                            '& .MuiPickersArrowSwitcher-button': {
                                                color: '#d4af37',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    options={Array.from(new Set([...productos].map(p => JSON.stringify(p)))).map(p => JSON.parse(p))}
                                    getOptionLabel={(option) => `${option.nombre} - ${option.id}`}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={selectedProducts}
                                    onChange={(event, newValue) => setSelectedProducts(newValue)}
                                    renderInput={(params) => (
                                        <TextField sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#d4af37' },
                                                '&:hover fieldset': { borderColor: '#d4af37' },
                                                '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#d4af37' },
                                            '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                        }}
                                            {...params}
                                            label="Seleccionar productos"
                                            className={style.textField}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={`${option.id}-${index}`}
                                                label={`${option.nombre}`}
                                                {...getTagProps({ index })}
                                                className={style.chip}
                                            />
                                        ))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props} key={`${option.id}-${option.nombre}`}>
                                            {option.nombre}
                                        </li>
                                    )}
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de ocasión"
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#d4af37' },
                                            '&:hover fieldset': { borderColor: '#d4af37' },
                                            '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#d4af37' },
                                        '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                    }}
                                >
                                    {[
                                        { id: 'AñoNuevo', value: 'Año Nuevo' },
                                        { id: 'AñoNuevoJudio', value: 'Año Nuevo Judío' },
                                        { id: 'DiaDeLaMadre', value: 'Día de la Madre' },
                                        { id: 'DiaDeLaMujer', value: 'Día de la Mujer' },
                                        { id: 'DiaDeLaPrimavera', value: 'Día de la Primavera' },
                                        { id: 'DiaDeLaSecretaria', value: 'Día de la Secretaria' },
                                        { id: 'DiaDeLosEnamorados', value: 'Dia De Los Enamorados' },
                                        { id: 'DiaDelPadre', value: 'Día del Padre' },
                                        { id: 'Navidad', value: 'Navidad' },
                                        { id: 'SanValentin', value: 'San Valentin' },
                                        { id: 'Aniversarios', value: 'Aniversarios' },
                                        { id: 'Casamientos', value: 'Casamientos' },
                                        { id: 'Nacimientos', value: 'Nacimientos' },
                                        { id: 'Cumpleaños', value: 'Cumpleaños' },
                                        { id: 'Condolencias', value: 'Condolencias' },
                                        { id: 'Funerales', value: 'Funerales' },
                                        { id: 'RegalosHombres', value: 'Regalos para Hombres' },
                                        { id: 'Agradecimiento', value: 'Agradecimiento' },
                                        { id: 'Recuperacion', value: 'Recuperación' },
                                        { id: 'Graduacion', value: 'Graduación' },
                                        { id: 'Felicitaciones', value: 'Felicitaciones' },
                                        { id: 'AniversarioDeBodas', value: 'Aniversario de Bodas' },
                                        { id: 'NacimientoDeHijos', value: 'Nacimiento de Hijos' },
                                        { id: 'NacimientoDeNietos', value: 'Nacimiento de Nietos' },
                                        { id: 'Otros', value: 'Otros' },
                                    ].map((option) => (
                                        <MenuItem key={option.id} value={option.value}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>


                            <Grid item xs={12}>
                                <Autocomplete
                                    options={direcciones}
                                    getOptionLabel={(option) => option.nombre}
                                    value={selectedDirection}
                                    onChange={(event, newValue) => setSelectedDirection(newValue)}
                                    renderInput={(params) => (
                                        <TextField sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#d4af37' },
                                                '&:hover fieldset': { borderColor: '#d4af37' },
                                                '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#d4af37' },
                                            '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                        }}
                                            {...params}
                                            label="Seleccionar dirección de envío"
                                            className={style.textField}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Notas adicionales"
                                    value={formData.notas}
                                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                    className={style.textField} sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#d4af37' },
                                            '&:hover fieldset': { borderColor: '#d4af37' },
                                            '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#d4af37' },
                                        '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions className={style.dialogActions}>
                        <Button
                            onClick={limpiarFormulario}
                            className={style.cancelButton}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={guardarRecordatorio}
                            variant="contained"
                            className={style.saveButton}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function RecordatorioCard({ recordatorio, onDelete }) {
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        // Verificar si es Timestamp de Firestore
        if (fecha?.toDate) {
            return format(fecha.toDate(), "d 'de' MMMM 'de' yyyy", { locale: es });
        }
        // Si es objeto Date directo
        return format(new Date(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
    };

    return (
        <Card className={style.recordatorioCard}>
            <CardContent>
                <h5 variant="h6" className={style.cardTitle}>
                    {recordatorio.nombre}
                </h5>
                <h6 variant="body2" className={style.cardDate}>
                    {formatearFecha(recordatorio.fecha)}
                </h6>

                <div className={style.productosGrid}>
                    {recordatorio.productos.map((producto, index) => (
                        <div key={`${producto.id}-${index}`} className={style.productoItem}>
                            <Image 
                                width={200} 
                                height={200}
                                src={producto.opciones[0].img}
                                alt={producto.nombre}
                                className={style.productoImg}
                            />
                            <p variant="caption">
                                {producto.nombre}
                            </p>
                        </div>
                    ))}
                </div>

                {recordatorio.direccion && (
                    <p variant="body2" className={style.direccion}>
                        📍 {recordatorio.direccion.nombre}
                    </p>
                )}

                <div className={style.cardActions}>
                    <IconButton
                        onClick={() => onDelete(recordatorio.id)}
                        className={style.deleteButton}
                    >
                        <Delete />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    );
}

function DireccionesPanel({ direcciones, newDirection, setNewDirection, onSave }) {
    return (
        <div className={style.direccionesPanel}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h6 variant="h6" className={style.subtitle}>
                        Nueva Dirección
                    </h6>
                    <Card className={style.formCard}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        value={newDirection.nombre}
                                        onChange={(e) => setNewDirection({
                                            ...newDirection,
                                            nombre: e.target.value
                                        })}
                                        className={style.textField} sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#d4af37' },
                                                '&:hover fieldset': { borderColor: '#d4af37' },
                                                '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#d4af37' },
                                            '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Teléfono"
                                        value={newDirection.telefono}
                                        onChange={(e) => setNewDirection({
                                            ...newDirection,
                                            telefono: e.target.value
                                        })}
                                        className={style.textField} sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#d4af37' },
                                                '&:hover fieldset': { borderColor: '#d4af37' },
                                                '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#d4af37' },
                                            '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Dirección"
                                        value={newDirection.direccion}
                                        onChange={(e) => setNewDirection({
                                            ...newDirection,
                                            direccion: e.target.value
                                        })}
                                        className={style.textField} sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#d4af37' },
                                                '&:hover fieldset': { borderColor: '#d4af37' },
                                                '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#d4af37' },
                                            '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label="Notas adicionales"
                                        value={newDirection.notas}
                                        onChange={(e) => setNewDirection({
                                            ...newDirection,
                                            notas: e.target.value
                                        })}
                                        className={style.textField} sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#d4af37' },
                                                '&:hover fieldset': { borderColor: '#d4af37' },
                                                '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                                            },
                                            '& .MuiInputLabel-root': { color: '#d4af37' },
                                            '& .MuiOutlinedInput-input': { color: '#d4af37' },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                onClick={onSave}
                                className={style.saveButton}
                                sx={{ mt: 2 }}
                            >
                                Guardar Dirección
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <h6 variant="h6" className={style.subtitle}>
                        Mis Direcciones
                    </h6>
                    <Grid container spacing={3}>
                        {direcciones.map((direccion) => (
                            <Grid item xs={12} sm={6} md={4} key={direccion.id}>
                                <Card className={style.direccionCard}>
                                    <CardContent>
                                        <h6 variant="h6">
                                            {direccion.nombre}
                                        </h6>
                                        <p variant="body2">
                                            📞 {direccion.telefono}
                                        </p>
                                        <p variant="body1">
                                            📍 {direccion.direccion}
                                        </p>
                                        {direccion.notas && (
                                            <p variant="body2" color="textSecondary">
                                                📝 {direccion.notas}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}