import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/thunks/categoryThunks'; // Import fetchCategories thunk

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CategorySlider = () => {
  const dispatch = useDispatch();

  // Access categories and loading/error states from Redux store
  const { categories, loading, error } = useSelector((state) => state.categories);

  // Fetch categories only if they are not already in the store
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]); // Trigger fetch only if categories are empty

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 categories at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

 // Handle loading and error
if (loading) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
      }}
    >
      <CircularProgress size={50} color="primary" />
    </Box>
  );
}


  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Slider {...settings}>
        {categories.map((category) => (
          <Box key={category.id} sx={{ textAlign: 'center', padding: 2 }}>
            <img
              src={category.image}  // Ensure you are using the correct image URL from Firebase Storage
              alt={category.name}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                marginBottom: '8px',
              }}
            />
            <Typography variant="h6">{category.name}</Typography>
            <Typography variant="body2">{category.sku}</Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CategorySlider;
