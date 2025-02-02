import React from 'react';
import { Typography } from '@mui/material';
import BannerSlider from '../components/BannerSlider';
import ProductGrid from '../components/ProductGrid';
import CategorySlider from '../components/CategorySlider';

const HomePage = () => {
  return (
    // <Typography variant="h4" align="center">
    //   Welcome to My eCommerce!
    // </Typography>
    <>
    <BannerSlider />
    <CategorySlider />
    <ProductGrid limit={4}/>
    </>
  );
};

export default HomePage;
