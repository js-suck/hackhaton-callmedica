import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#FF5722',
        },
        secondary: {
            main: '#00ACC1'
        },
        text: {
            primary: '#333333',
        },
        background: {
            default: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Open Sans, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

