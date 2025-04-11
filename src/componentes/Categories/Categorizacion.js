
import * as React from 'react';
import { Breadcrumbs, Typography, useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { styled } from '@mui/material/styles';
import { green, red } from '@mui/material/colors';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {  useParams } from 'react-router-dom';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeSwitchContext';

export default function Categorization({ name }) {


  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const {isDarkMode} = useTheme();
  const { categoryName, searchParam, ocasionName } = useParams()
  const [categoryRoute, setCategoryRoute] = useState();

  React.useEffect(() => {
    if (categoryName) {
      setCategoryRoute(categoryName)
    } else if (searchParam) {
      setCategoryRoute(searchParam)
    } else if (ocasionName) {
      setCategoryRoute(ocasionName)
    } else {
      setCategoryRoute("Productos")
    }
  }, [categoryName, ocasionName, searchParam]);

  const isSmallScreen = useMediaQuery('(max-width:850px)');
  const CustomBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    color: 'success',
    fontWeight: 700,
    backgroundColor: 'transparent',
    fontSize: isSmallScreen ? '8px' : '12px',
    height: 'inherit',
    '&:hover': {
      backgroundColor: 'transparent',
      color: green[800],

    },
  }));


  return (
    <div role="presentation" onClick={handleClick} style={{flex:1, margin:' 0 10px'}}>
      <CustomBreadcrumbs separator={<NavigateNextIcon sx={{
        mr: 0, color: green[300], '&:hover': {
          color: green[900],
        },
      }} fontSize="small" />}>

        <Link className="categories-navigation" href="/" >
          <Typography underline='none'
            sx={{
              display: 'flex', alignItems: 'center', color: isDarkMode ? 'white' : green[900], '&:hover': {
                color: green[900],
              },
            }}

          >
            <HomeIcon sx={{ mr: 0 }} fontSize="15px" />

            Inicio
          </Typography>
        </Link>
        <Typography
          sx={{
            display: 'flex', alignItems: 'center', color: isDarkMode ? 'white' : '#a00303', '&:hover': {
              color:  red[900],

            },
          }}

        >
          {name ? name :
            <>
              <LocalFloristIcon sx={{ mr: 0 }} fontSize="inherit" /> {categoryRoute}
            </>
          }
        </Typography>

      </CustomBreadcrumbs>
    </div>
  );
}



