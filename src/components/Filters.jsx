import React from "react";
import { Box, Typography, Slider, Divider, Button } from "@mui/material";

const Filters = ({ priceRange, onPriceRangeChange }) => {
  const handlePriceRangeChange = (event, newValue) => {
    onPriceRangeChange(newValue);
  };

  return (
    <Box sx={{ padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>
      {/* Filters Heading */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Filter
      </Typography>

      <Divider sx={{ marginBottom: "20px" }} />

      {/* Price Range Filter */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Price Range
        </Typography>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          sx={{
            marginTop: "10px",
            color: "orange",
          }}
        />
      </Box>

      <Divider sx={{ margin: "20px 0" }} />

      {/* Clear All Button */}
      <Button
        variant="outlined"
        sx={{
          width: "100%",
          color: "orange",
          borderColor: "orange",
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: "orange",
            color: "white",
          },
        }}
        onClick={() => {
          onPriceRangeChange([0, 1000]); // Reset price range
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default Filters;
