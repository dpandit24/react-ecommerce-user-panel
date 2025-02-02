import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box, Typography, Button } from "@mui/material";
import { addToCart } from "../store/slices/cartSlice"; // Import addToCart action

const Products = ({ products, userId, limit }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.cart.loading); // Get loading state per product

  // Apply limit if provided
  const displayedProducts = limit ? products.slice(0, limit) : products;

  const handleAddToCart = (product) => {
    if (!userId) {
      alert("Please log in to add items to the cart!");
      return;
    }

    dispatch(addToCart({ userId, productId: product.id }));
    console.log(product.name);
  };

  return (
    <Grid container spacing={1}>
      {displayedProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: 2,
              textAlign: "center",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "contain" }}
            />
            <Typography variant="subtitle1" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${product.price}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                marginTop: 1,
                color: "orange",
                borderColor: "orange",
                borderRadius: "5px",
                padding: "5px 40px",
                fontSize: "14px",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "orange",
                  color: "white",
                },
              }}
              onClick={() => handleAddToCart(product)}
              disabled={loading[product.id] || false} // Disable only for this product
            >
              {loading[product.id] ? "Adding..." : "Add"}
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Products;
