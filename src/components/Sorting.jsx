import React from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";

const Sorting = ({ sortOption, onSortChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        background: "#f9f9f9",
        borderRadius: "10px",
      }}
    >
      {/* Sorting Label */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
      >
        Sort By
      </Typography>

      {/* Sorting Dropdown */}
      <FormControl
        sx={{
          minWidth: 100,
        }}
      >
        <Select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          displayEmpty
          sx={{
            background: "white",
            borderRadius: "5px",
            fontWeight: "bold",
            "&:focus": {
              borderColor: "orange",
            },
          }}
        >
          <MenuItem value="relevance">Relevance</MenuItem>
          <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
          <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Sorting;
