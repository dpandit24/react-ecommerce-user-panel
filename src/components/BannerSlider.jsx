import React from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import banner1 from '../assets/portrait-young-asian-woman-isolated-blue-studio-space.jpg'
import banner2 from '../assets/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera (1).jpg'
import banner3 from '../assets/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera.jpg'

const banners = [
  {
    id: 1,
    title: 'Big Sale on Electronics!',
    description: 'Get up to 50% off on top brands.',
    image: banner1,
  },
  {
    id: 2,
    title: 'New Arrivals in Fashion!',
    description: 'Discover the latest trends.',
    image: banner2,
  },
  {
    id: 3,
    title: 'Furniture Festival!',
    description: 'Revamp your home with amazing deals.',
    image: banner3,
  },
];

const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box key={banner.id} sx={{ position: 'relative', textAlign: 'center' }}>
            <img
              src={banner.image}
              alt={banner.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              }}
            >
              <Typography variant="h4">{banner.title}</Typography>
              <Typography variant="subtitle1">{banner.description}</Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerSlider;
