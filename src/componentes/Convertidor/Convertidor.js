import { CartContext, useCart } from '../../context/CartContext';
import React, { useState, useContext } from 'react';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import './convertidor.css'; // Asegúrate de tener un archivo CSS para las animaciones
import { Checkbox, useMediaQuery } from '@mui/material';
import { useTheme } from '../../context/ThemeSwitchContext';

const Convertidor = ({ mobile }) => {
    const { setPriceDolar, priceDolar } = useCart();
    const isMobileScreen = useMediaQuery('(min-width:800px)');
    const { isDarkMode } = useTheme();

    const [checked, setChecked] = useState(priceDolar); // Estado para mantener el estado actual del input
    
    const className = isDarkMode ? 'dark-mode' : '';


    const handleChangeDolar = (event) => {
        setPriceDolar(event.target.checked);
        setChecked(event.target.checked); // Actualiza el estado del input
    };


    return (
        <>
            {
                mobile ? (
                    <div className={`change-to-dolar-mobile ${className}`}>
                        {/* Aplica la clase de rotación según el estado del input */}
                        <ChangeCircleIcon sx={{ color: isDarkMode ? 'white':'#a00303' }} className={`change-icon ${checked ? 'rotate-anti-clockwise' : 'rotate-clockwise'}`} />

                        {checked ? <label className={`lbl-usd-mobile ${className}`}>ARS $: </label> : <label className={`lbl-usd-mobile ${className}`}> USD $: </label>}
                        <Checkbox
                            color='success'
                            sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5rem', color: isDarkMode ? 'white':'#a00303'}}}
                            // id='dolarCheck'
                            // name='checkbox'
                            checked={checked}
                            onChange={handleChangeDolar} // Aquí cambiamos de onClick a onChange
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                ) : (
                    <div className={`change-to-dolar ${className}`}>
                        {/* Aplica la clase de rotación según el estado del input */}
                        {
                            isMobileScreen &&
                            <ChangeCircleIcon sx={{
                                color:isDarkMode? 'white': '#a00303', transition: 'transform .44s ease-in-out',
                            }} className={`change-icon ${priceDolar ? 'rotate-anti-clockwise' : 'rotate-clockwise'}`} />
                        }

                        {checked ? <label className={`lbl-usd ${className}`}>ARS $: </label> : <label className={`lbl-usd ${className}`}> USD $: </label>}
                        <Checkbox
                            color='success'
                            // type='checkbox'
                            // id='dolarCheck'
                            // name='checkbox'
                            checked={checked}
                            onChange={handleChangeDolar} // Aquí cambiamos de onClick a onChange
                        />
                    </div>
                )
            }
        </>
    );
};

export default Convertidor;