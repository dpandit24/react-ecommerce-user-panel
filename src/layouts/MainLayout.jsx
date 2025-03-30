import React from 'react';
import { Box, Container, createTheme, ThemeProvider } from '@mui/material';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif", // Use modern fonts
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { fontSize: '1rem' },
  },
  palette: {
    primary: {
      main: '#ff6f00', // Use a modern orange theme
    },
    secondary: {
      main: '#333',
    },
  },
});

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <ThemeProvider theme={theme}>
        <Box component="main" sx={{ flex: 1, mt:  2, mb: 2 }}>
          {children}
        </Box>
      </ThemeProvider>
      <Footer />
    </Box>
  );
};

export default MainLayout;
