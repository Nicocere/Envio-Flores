import React, { useState, useEffect } from 'react';
import style from './pantallasPromocionales.module.css';
import localforage from 'localforage';
import Swal from 'sweetalert2';
import { FaGift } from 'react-icons/fa';
import { IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const IconoPromocion = () => {
  const [email, setEmail] = useState('');
  const [emailRegistrado, setEmailRegistrado] = useState('');
  const isMobileScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchEmail = async () => {
      const emailForage = await localforage.getItem('emailPromocion');

      if (emailForage) {
        setEmailRegistrado(emailForage);
      } else {
        setEmailRegistrado('');
      }
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const icon = document.querySelector(`.${style.floatingIcon}`);
      if (icon) {
        icon.classList.add(style.animateIcon);
        setTimeout(() => {
          icon.classList.remove(style.animateIcon);
        }, 1000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleIconClick = () => {
    Swal.fire({
      title: 'Promoción habilitada',
      html: `<div>
               <h6>Ya ha ingresado el email. ¿Qué desea hacer?</h6>
               <small>Email actual: <strong>${emailRegistrado}</strong></small>
             </div>`,
      showCancelButton: true,
      confirmButtonText: 'Cambiarlo',
      cancelButtonText: 'Cancelar',
      showDenyButton: true,
      denyButtonText: 'Eliminarlo',
      preConfirm: () => {
        return Swal.fire({
          title: 'Cambiar email',
          input: 'email',
          inputValue: emailRegistrado,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          preConfirm: (newEmail) => {
            if (newEmail) {
              localforage.setItem('emailPromocion', newEmail);
              setEmailRegistrado(newEmail);
              setEmail(newEmail);
              Swal.fire({
                icon: 'success',
                title: 'Email cambiado',
                text: 'El email ha sido cambiado correctamente',
              });
            }
          },
        });
      },
      preDeny: () => {
        localforage.removeItem('emailPromocion');
        setEmailRegistrado('');
        setEmail('');
        Swal.fire({
          icon: 'success',
          title: 'Email eliminado',
          text: 'El email ha sido eliminado correctamente',
        });
      },
    });
  };

  return (
    <div className={style.container}>
      {emailRegistrado && (
        <div className={style.floatingIcon} onClick={handleIconClick}>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 9 }}
          >
            <Tooltip title="Promoción activa" placement='top'>
              <IconButton size="large" sx={{ zIndex: 2000 }}>
                <FaGift size={isMobileScreen ? 20 : 30} color='#670000' />
              </IconButton>
            </Tooltip>
          </motion.div>

          <div className={style.stars}>
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                className={style.star}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, Math.cos((index / 5) * 2 * Math.PI) * 20, 0],
                  y: [0, Math.sin((index / 5) * 2 * Math.PI) * 20, 0],
                }}
                transition={{ duration: 1, delay: index * 0.2, repeat: Infinity, repeatDelay: 9 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconoPromocion;