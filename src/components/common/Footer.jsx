import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#FFF5EB', // Light beige/cream color
        color: 'text.secondary', // Muted text color
        p: 2,
        textAlign: 'center',
        mt: 'auto',
        borderTop: '1px solid #E0E0E0', // Light gray separator line
      }}
    >
      <Typography variant="body2">
        Copyright and all rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
