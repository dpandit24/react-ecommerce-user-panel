import React, { useEffect } from "react";
import { Box, Button, Typography, Container, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/thunks/productThunks";
import { useNavigate } from "react-router-dom";
import Products from "./Products"; // Import the Products component

const ProductGrid = ({ limit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleExploreAllClick = () => {
    navigate("/products");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, px: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Hottest Selling Items</Typography>
          <Typography variant="body2" color="text.secondary">Search amongst 5000+ items</Typography>
        </Box>
        <Button
          variant="text"
          onClick={handleExploreAllClick}
          sx={{ fontSize: "0.875rem", textTransform: "none", fontWeight: "bold", color: "orange" }}
        >
          Explore all &rarr;
        </Button>
      </Box>

      {/* Loading Spinner */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <CircularProgress size={50} color="primary" />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" align="center">Error: {error}</Typography>
      ) : (
        <Products products={products} limit={limit} userId={user?.id} /> 
      )}
    </Container>
  );
};

export default ProductGrid;
