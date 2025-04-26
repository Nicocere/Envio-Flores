import { createTheme } from '@mui/material/styles';

const TextStyleGlobal = createTheme({
    typography: {
        fontFamily: [
          "Nexa",
          'sans-serif',
        ].join(','),
      },
      components: {
        MuiButton: {
            fontFamily: [
                'Nexa',
                'sans-serif',
              ].join(','),
        },
        // Puedes personalizar otros componentes aquí, como MuiTypography, MuiTextField, etc.
      },
    });
export default TextStyleGlobal;
