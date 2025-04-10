import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth, baseDeDatos } from '../../../FireBaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import './registro.css'
import { Helmet } from 'react-helmet';
import { Button } from '@mui/material';


function RegistroUser() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const navigate = useNavigate();
    let userRole;


    const onSubmit = (data) => {

        const fieldsFilled = (
            watch('nombreUser') &&
            watch('apellidoUser') &&
            watch('telUser') &&
            watch('email') &&
            watch('password') &&
            watch('validatePassword')
        );
        if (!fieldsFilled) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos y selecciona una localidad antes de confirmar.',
            });
            return;  // Salir de la función
        }

        // Si todo está bien, procede con la lógica de registro
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // Usuario registrado con éxito
                const user = userCredential.user;
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario registrado',
                    text: `El usuario ha sido registrado con éxito con el email: ${user.email}`,
                });


                // Determinar el rol basado en el email momentaneamente...
                if (data.email === "nico.aflorar@gmail.com" || data.email === 'envioflores.arg@gmail.com') {
                    userRole = "administrador";
                } else {
                    userRole = "usuario";
                }

                // Guardar el resto de la información en Firestore
                const userDocRef = doc(baseDeDatos, "users", user.uid);
                setDoc(userDocRef, {
                    username: data.username,
                    email: data.email,
                    nombre: data.nombreUser,
                    apellido: data.apellidoUser,
                    tel: data.telUser,
                    rol: userRole
                });

            }).then(() => {

                if (userRole === "administrador") {
                    navigate('/administrador'); // Redirigete al Administrador
                } else {
                    navigate('/perfil'); // Redirige al usuario después de cerrar el SweetAlert
                }
            })
            .catch((error) => {
                // Manejar errores
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error al registrar usuario:", errorMessage, errorCode);

                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: errorMessage,
                });
            });
    };


    return (
        <div className="login-form">
            <Helmet>
                <title>Registrarse en de Envio Flores</title>
            </Helmet>

            <h3>Crea una cuenta</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='form-registro' >

                <div className="input-group">
                    <label>Nombre de Usuario</label>
                    <input
                        {...register("username", { required: true })}
                        type="text"
                        placeholder="Username..."
                        name="username"
                        className='input-username'
                    />
                    {errors.nombreUser && <p className='message-error' > Su nombre de usuario es requerido</p>}
                </div>
                <div className="input-group">
                    <label>Nombre</label>
                    <input
                        {...register("nombreUser", { required: true })}
                        type="text"
                        placeholder="Nombre..."
                        name="nombreUser"
                        className='input-nombreUser'
                    />
                    {errors.nombreUser && <p className='message-error' > Su nombre es requerido</p>}
                </div>
                <div className="input-group">
                    <label>Apellido</label>
                    <input
                        {...register("apellidoUser", { required: true })}
                        type="text"
                        placeholder="Apellido..."
                        name="apellidoUser"
                        className='input-apellidoUser'
                    />
                    {errors.apellidoUser && <p className='message-error' >Su apellido es requerido</p>}
                </div>

                <div className="input-group">
                    <label>Telefono "(opcional)"</label>
                    <input
                        {...register("telUser")}
                        type="text"
                        placeholder="Telefono..."
                        name="telUser"
                        className='input-telUser'
                    />

                </div>


                <div className="input-group">
                    <label>Email</label>
                    <input
                        {...register("email", { required: true })}
                        type="text"
                        placeholder="Email..."
                        name="email"
                        className='input-email'
                    />
                    {errors.email && <p className='message-error' >El email es requerido</p>}
                </div>

                <div className="input-group">
                    <label>Contraseña </label>
                    <span className='span-passw'>Debe tener minimo 6 digitos</span>
                    <input
                        {...register("password", { required: true })}
                        type="password"
                        placeholder="Contraseña..."
                        className='input-password'
                        name="password"
                    />
                    {errors.password && <p className='message-error' >La contraseña es requerida</p>}
                </div>


                <div className="input-group">
                    <label>Repetir Contraseña</label>

                    <input
                        {...register("validatePassword", { required: true })}
                        type="password"
                        placeholder="Repita su contraseña..."
                        name="validatePassword"
                        className='input-password'
                    />
                    {watch('validatePassword') !== watch('password') && <p className='message-error' >Las contraseñas no coinciden</p>}


                </div>

                <Button variant='contained' color='secondary' size='small' sx={{margin: '4px', fontSize:'14px'}} 
                className='btn-registro' type="submit">Registrarse</Button>
            </form>

        </div>
    );
}

export default RegistroUser;
