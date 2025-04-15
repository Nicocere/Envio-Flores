"use client"

import React from 'react';
import Swal from 'sweetalert2';
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth, baseDeDatos } from '../../../admin/FireBaseConfig'
import { doc, setDoc } from 'firebase/firestore';
import style from './registro.module.css'
import { 
    Button, 
    TextField, 
    Container, 
    Typography, 
    Box, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    FormHelperText 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

function RegistroUser() {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            validatePassword: '',
            nombreUser: '',
            apellidoUser: '',
            telUser: '',
            tiposFloresPreferidas: []
        }
    });
    
    const navigate = useRouter();
    let userRole;

    const tiposFlores = [
        'Rosas',
        'Liliums',
        'Gerberas',
        'Claveles',
        'Orquídeas',
        'Girasoles',
        'Margaritas',
        'Tulipanes',
        'Astromelias',
        'Calas',
        'Fresias'
    ];

    const handleSelectChange = (event, fieldName) => {
        setValue(fieldName, event.target.value);
    };

    const onSubmit = async (data) => {
        const requiredFields = [
            'username',
            'email',
            'password',
            'validatePassword',
            'nombreUser',
            'apellidoUser',
        ];

        const missingFields = requiredFields.filter(field => !data[field] || 
            (Array.isArray(data[field]) && data[field].length === 0));

        if (missingFields.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos obligatorios antes de confirmar.',
            });
            return;
        }

        if (data.password !== data.validatePassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error en las contraseñas',
                text: 'Las contraseñas no coinciden',
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            
            userRole = data.email === "nico.aflorar@gmail.com" || data.email === "floreriasargentinas@gmail.com" || data.email === 'envioflores.arg@gmail.com' ?  "administrador"  : "usuario";

            const userDocRef = doc(baseDeDatos, "users", user.uid);
            await setDoc(userDocRef, {
                username: data.username,
                email: data.email,
                nombre: data.nombreUser,
                apellido: data.apellidoUser,
                tel: data.telUser,
                rol: userRole,
                website: 'Envio Flores',
                preferencias: {
                    tiposFlores: data.tiposFloresPreferidas
                },
                createdAt: new Date().toISOString()
            });

            await Swal.fire({
                icon: 'success',
                title: 'Usuario registrado',
                text: `El usuario ha sido registrado con éxito con el email: ${user.email}`,
            });

            navigate.push(userRole === "administrador" ? '/administrador' : '/usuario/mi-perfil');
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: error.message,
            });
        }
    };

    return (
        <div className={style.registro}>
            <Container className={style.loginForm}>
                <Typography variant="h4" className={style.title}>
                    Crea una cuenta
                </Typography>
                
                <form onSubmit={handleSubmit(onSubmit)} className={style.formRegistro}>
                    {/* Campos básicos */}
                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("username", { 
                                required: "El nombre de usuario es requerido",
                                minLength: {
                                    value: 4,
                                    message: "El nombre de usuario debe tener al menos 4 caracteres"
                                }
                            })}
                            label="Nombre de Usuario *"
                            variant="outlined"
                            fullWidth
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
                    </Box>

                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("email", {
                                required: "El email es requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                }
                            })}
                            label="Email *"
                            variant="outlined"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Box>

                

                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("nombreUser", { required: "El nombre es requerido" })}
                            label="Nombre *"
                            variant="outlined"
                            fullWidth
                            error={!!errors.nombreUser}
                            helperText={errors.nombreUser?.message}
                        />
                    </Box>

                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("apellidoUser", { required: "El apellido es requerido" })}
                            label="Apellido *"
                            variant="outlined"
                            fullWidth
                            error={!!errors.apellidoUser}
                            helperText={errors.apellidoUser?.message}
                        />
                    </Box>

                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("telUser", { 
                                // required: "El teléfono es requerido",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Ingrese un número de teléfono válido (10 dígitos)"
                                }
                            })}
                            label="Teléfono (opcional)"
                            variant="outlined"
                            fullWidth
                            error={!!errors.telUser}
                            helperText={errors.telUser?.message}
                        />
                    </Box>

                    <Box className={style.inputGroup}>
                        <FormControl fullWidth error={!!errors.tiposFloresPreferidas}>
                            <InputLabel>Tipos de Flores Preferidas (opcional)</InputLabel>
                            <Select
                                multiple
                                value={watch('tiposFloresPreferidas') || []}
                                onChange={(e) => handleSelectChange(e, 'tiposFloresPreferidas')}
                                label="Tipos de Flores Preferidas (opcional)"
                                {...register("tiposFloresPreferidas")}
                            >
                                {tiposFlores.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.tiposFloresPreferidas?.message}</FormHelperText>
                        </FormControl>
                    </Box>
                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("password", {
                                required: "La contraseña es requerida",
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres"
                                }
                            })}
                            label="Contraseña *"
                            type="password"
                            variant="outlined"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Box>

                    <Box className={style.inputGroup}>
                        <TextField
                            {...register("validatePassword", {
                                required: "Debe confirmar la contraseña",
                                validate: value => value === watch('password') || "Las contraseñas no coinciden"
                            })}
                            label="Confirmar Contraseña *"
                            type="password"
                            variant="outlined"
                            fullWidth
                            error={!!errors.validatePassword}
                            helperText={errors.validatePassword?.message}
                        />
                    </Box>
                    <Button 
                        variant='contained'
                        size='large'
                        className={style.btnRegistro}
                        type="submit"
                        color="primary"
                    >
                        Registrarse
                    </Button>
                </form>
            </Container>
        </div>
    );
}

export default RegistroUser;