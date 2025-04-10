import { createTheme } from '@mui/material/styles';

const TextStyleGlobal = createTheme({
    typography: {
        fontFamily: [
          'Jost',
          'sans-serif',
        ].join(','),
      },
      components: {
        MuiButton: {
            fontFamily: [
                'Jost',
                'sans-serif',
              ].join(','),
        },
        // Puedes personalizar otros componentes aquí, como MuiTypography, MuiTextField, etc.
      },
    });
export default TextStyleGlobal;
