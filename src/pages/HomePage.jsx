import React from 'react';
import { Box } from '@mui/material';
import BannerSlider from '../components/BannerSlider';
import ProductGrid from '../components/ProductGrid';
import CategoryGrid from '../components/CategoryGrid';

const HomePage = () => {
  return (
    // <Typography variant="h4" align="center">
    //   Welcome to My eCommerce!
    // </Typography>
    <Box sx={{ width: "100%" }}>
      <BannerSlider />
      <CategoryGrid />
      <ProductGrid limit={4}/>
    </Box>
  
  );
};

export default HomePage;
