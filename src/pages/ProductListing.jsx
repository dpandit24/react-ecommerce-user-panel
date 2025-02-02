import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/thunks/productThunks";
import Filters from "../components/Filters";
import Sorting from "../components/Sorting";
import Products from "../components/Products";

const ProductListing = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("relevance"); // Default sort option
  const [priceRange, setPriceRange] = useState([0, 500]); // Default price range

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Apply filters and sorting
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by price range
    updatedProducts = updatedProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    if (sortOption === "priceLowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [products, sortOption, priceRange]);

  if (loading) return <Typography>Loading products...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ display: "flex", padding: 2 }}>
    {/* Filters Sidebar */}
    <Box sx={{ width: "250px", padding: 2 }}>
      <Filters
        priceRange={priceRange}
        onPriceRangeChange={(range) => setPriceRange(range)}
      />
    </Box>
  
    {/* Main Content */}
    <Box sx={{ flex: 1, paddingLeft: 4 }}>
      {/* Sorting */}
      <Sorting
        sortOption={sortOption}
        onSortChange={(option) => setSortOption(option)}
      />
  
      {/* Product Grid */}
      <Products products={filteredProducts} userId={user?.id}/>
    </Box>
  </Box>  
  );
};

export default ProductListing;
