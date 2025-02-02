import React from 'react';
import { Box, Container, createTheme, ThemeProvider } from '@mui/material';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const theme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100%', // Full width for small screens
          maxWidth: '1900px', // Keeps max-width at 1900px
          margin: '0 auto', // Centers the content
          padding: '0 24px', // Adds padding for spacing
        }
      }
    }
  }
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
        <Container component="main" sx={{ flex: 1, mt: 4, mb: 4 }}>
          {children}
        </Container>
      </ThemeProvider>
      <Footer />
    </Box>
  );
};

export default MainLayout;
