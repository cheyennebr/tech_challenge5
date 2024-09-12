import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Background color for the application
      paper: '#111111',   // Background color for Paper components
    },
    primary: {
      main: '#bb86fc',  // Primary color for the dark theme
    },
    secondary: {
      main: '#03dac6',  // Secondary color for the dark theme
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333', // Custom background color for Paper components
        },
      },
    },
  },
});

export default theme;