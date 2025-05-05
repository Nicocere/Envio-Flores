import React from 'react';
import { Button } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import useLogout from '@/app/login/logout/page';
import { useRouter } from 'next/navigation';


export const SubMenuUsers = ({userData, }) => {

    const logout = useLogout()

    const navigate = useRouter()

    const handleProfileNavigation = () => {
      if (userData.rol === 'administrador') {
        navigate.push('/administrador');
      } else {
        navigate.push('/perfil');
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
