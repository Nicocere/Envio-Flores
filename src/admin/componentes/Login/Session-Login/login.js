import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth, baseDeDatos } from '../../../FireBaseConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import './login.css'
import { Button, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Importa iconos de Material-UI


function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const navigate = useNavigate();
    
    // Función para alternar entre mostrar y ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false); // Estado para manejar si la contraseña se muestra o no

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const onSubmit = async (data) => {
        const fieldsFilled = (
            watch('email') &&
            watch('password')
        );
        if (fieldsFilled) {

            signInWithEmailAndPassword(auth, data.email, data.password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    // Obtener el rol del usuario desde Firestore
                    const userDoc = await getDoc(doc(baseDeDatos, "users", user.uid));

                    if (userDoc.exists() && userDoc.data().rol === "administrador") {
                        navigate('/administrador'); // Si es administrador, redirigir a la página de administrador
                    } else {
                        navigate('/perfil'); // Si no, redirigir a la página de perfil
                    }

                })
                .catch((error) => {
                    // Manejar errores
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Error al iniciar sesión:", errorMessage,errorCode);

                    // Mostrar mensaje de error al usuario (puedes usar SweetAlert si prefieres)
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuario No encontrado',
                        text: 'Su E-mail o contraseña son incorrectos.',
                    });
                });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Datos Faltantes',
                text: 'Ingrese su E-mail y contraseña.',
            });
        }
    };



    return (
        <div className="login-form">

            <h3 style={{paddingTop:'20px'}}>Inicia Sesion</h3>

            <form className='form-login'  onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        {...register("email", { required: true })}
                        type="text"
                        placeholder="Ingrese su email..."
                        name="email"
                        className='input-email'
                        autoComplete="email"
                    />
                    {errors.email && <p className='message-error' >El E-mail es requerido</p>}
                </div>

                <div className="input-group">
                    <label>Contraseña</label>
                <div className='div-passw'>
                    <input
                        {...register("password", { required: true })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingrese su contraseña..."
                        name="password"
                        className='input-password'
                        autoComplete="current-password"
                    />
                    <div className='toggle-password'>
                    <IconButton onClick={togglePasswordVisibility} edge="end">

                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </div>
                </div>
                    {errors.password && <p className='message-error' >La contraseña es requerida</p>}
                </div>


                <Button size='small' variant='contained'  sx={{fontSize:'10px', margin:'5px', background:'#670000', transition:'background 0.5s ease',  '&:hover':{background:'#8c0000'  } }} 
                
                type="submit">Iniciar Sesión</Button>
            </form>

            <p  className='registrarse'  >No estas registrado?. <a href={'/sigin'} >Regristrate aquí</a></p>
        </div>
    );
}

export default Login;
