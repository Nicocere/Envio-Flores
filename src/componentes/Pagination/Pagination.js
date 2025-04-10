import styled from '@emotion/styled';
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { pink } from '@mui/material/colors';
import React from 'react';

const PaginationComponent = ({ currentPage, totalItems, setCurrentPage, page_size }) => {

  const totalPages = Math.ceil(totalItems / page_size);
  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const ColorButton = styled(Button)(({ theme }) => ({
    color: 'white',
    fontWeight: '500',
    backgroundColor:'darkred',
    fontSize: isSmallScreen ? '13px' : '16px',
    height: 'inherit',
    transition:'background .24s ease-in.out',
    '&:hover': {
      backgroundColor: 'red',
      
    },
  }));


  return (
    <div>
      <div className="div-info-pages">
        <Typography variant="body1" className="info-pages">
          Página actual: {currentPage}
        </Typography>
        <Typography variant="body1" className="info-pages">
          Total de Páginas: {totalPages}
        </Typography>
        <Typography variant="body1" className="info-pages">
          Total de Items: {totalItems}
        </Typography>
      </div>
      <Stack spacing={1} direction="row" justifyContent="center">

        <ColorButton
        size='small'
          className="btn-prev"
          variant="contained"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          sx={{ fontSize: 10, marginTop: 100 }}

        >
          Anterior
        </ColorButton>
        <ColorButton
        size='small'
          className="btn-next"
          variant="contained"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          sx={{ fontSize: 10, marginTop: 100 }}
        >
          Siguiente
        </ColorButton>
      </Stack>
    </div>
  );
};

export default PaginationComponent