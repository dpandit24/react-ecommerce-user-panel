import React, { useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/thunks/categoryThunks";

const CategoryGrid = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" minHeight={200}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const displayedCategories = categories.slice(0, 5); // Show only the first 5 categories

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Left Column (2 vertical images) */}
        <Grid item xs={3} sx={{ pr: 2 }}> {/* Added padding-right */}
          {displayedCategories.slice(0, 2).map((category) => (
            <Box key={category.id} mb={2}>
              <CategoryCard category={category} small />
            </Box>
          ))}
        </Grid>

        {/* Center Large Image */}
        <Grid item xs={6} sx={{ px: 2 }}> {/* Added padding-left and padding-right */}
          <CategoryCard category={displayedCategories[2]} large />
        </Grid>

        {/* Right Column (2 vertical images) */}
        <Grid item xs={3} sx={{ pl: 2 }}> {/* Added padding-left */}
          {displayedCategories.slice(3, 5).map((category) => (
            <Box key={category.id} mb={2}>
              <CategoryCard category={category} small />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

const CategoryCard = ({ category, small, large }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        background: "#f5f5f5",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        width: "100%",
        height: large ? "400px" : "200px", // Set height dynamically
        "&:hover img": { transform: "scale(1.1)" }, // Zoom-in effect on hover
      }}
    >
      <img
        src={category?.image}
        alt={category?.name}
        style={{
          width: large ? "100%" : "90%",
          height: "100%",
          borderRadius: "10px",
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out", // Smooth transition
        }}
      />
      <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold", color: "#333" }}>
        {category?.name}
      </Typography>
    </Box>
  );
};

export default CategoryGrid;
