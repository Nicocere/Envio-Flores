import React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { IconButton } from '@mui/material';
import { useTheme } from '../../context/ThemeSwitchContext';


const ThemeSwitch = ({mobile, responsive}) => {

    const { isDarkMode, handleThemeChange } = useTheme();

    return (
        <IconButton onClick={handleThemeChange}>
          {isDarkMode ? <Brightness4Icon sx={{color:'white'}}/> : <DarkModeIcon sx={{color:'darkred'}}/>}
        </IconButton>
      );
};

export default ThemeSwitch;