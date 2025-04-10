import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import useLogout from '../../admin/componentes/Login/LogOut/LogOut';
import { Button } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';


export const SubMenuUsers = ({userData, }) => {

    const logout = useLogout()

    const navigate = useNavigate()

    const handleProfileNavigation = () => {
      if (userData.rol === 'administrador') {
        navigate('/administrador');
      } else {
        navigate('/perfil');
      }
    };
  

    return (

      
        <div className='div-users' style={{flex:'2'}} >
          <Button variant='contained'   size='small' sx={{margin: '10px', padding:'12px 33px', background:'darkred', transition: 'background .55s ease-in-out',
          '&:hover':{background:'none',boxShadow:'0px 3px 1px -2px rgb(0 0 0 / 50%), 0px 2px 2px 0px rgb(0 0 0 / 56%), 0px 1px 5px 0px rgb(35 56 4)'} }} startIcon={<AccountBoxIcon/>}   onClick={handleProfileNavigation}>Ir a mi perfil</Button>
          
          <Button variant='contained'   size='small' sx={{margin: '10px', padding:'12px 33px', background:'darkred', transition: 'background .55s ease-in-out',
          '&:hover':{background:'none',boxShadow:'0px 3px 1px -2px rgb(0 0 0 / 50%), 0px 2px 2px 0px rgb(0 0 0 / 56%), 0px 1px 5px 0px rgb(35 56 4)'} }}  startIcon={<DisabledByDefaultIcon/>}  onClick={logout}>Cerrar Sesión</Button>
        </div>

    );
}
