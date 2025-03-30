import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, Button, Divider, IconButton } from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import { fetchCart, removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import emptyCartImage from "../assets/empty_cart_image.png"; // Ensure this image exists in your assets folder

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth.user); // Get logged-in user
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "Please Login",
        text: "You need to log in to access your cart.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#ff6600",
      }).then(() => {
        navigate("/login"); // Redirect to login page
      });
    } else {
      dispatch(fetchCart(user.id)); // Fetch cart from Firestore if logged in
    }
  }, [dispatch, user, navigate]);

  if (!user) return null;

  const cartTotal = items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  const itemSavings = 96;
  const finalTotal = cartTotal - itemSavings;

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ userId: user.id, productId }));
  };

  const handleQuantityChange = (productId, type) => {
    dispatch(updateCartQuantity({ userId: user.id, productId, type }));
  };

  return (
    <Grid container spacing={2} sx={{ padding: 3 }}>
      {items.length > 0 ? (
        <>
          {/* Left Section - Cart Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2, boxShadow: 2 }}>
              <Typography variant="h6">Your Cart</Typography>
              <Divider sx={{ my: 2 }} />
  
              {items.map((item) => (
                <Box key={item.productId} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    width={80}
                    height={80}
                    style={{ borderRadius: 5 }}
                  />
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography>{item.product?.name || "Unknown Product"}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => handleQuantityChange(item.productId, "decrease")}>
                      <Remove />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleQuantityChange(item.productId, "increase")}>
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography sx={{ mx: 2, fontWeight: "bold" }}>₹{(item.product?.price || 0) * item.quantity}</Typography>
                  <IconButton color="error" onClick={() => handleRemoveItem(item.productId)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
  
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                MRP Total: ₹{cartTotal}
              </Typography>
            </Box>
          </Grid>
  
          {/* Right Section - Order Summary */}
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2, boxShadow: 2 }}>
              <Typography variant="h6">Order Summary</Typography>
              <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                MRP Total: <span>₹{cartTotal}</span>
              </Typography>
              <Typography variant="body2" color="green" sx={{ display: "flex", justifyContent: "space-between" }}>
                Item Savings: <span>-₹{itemSavings}</span>
              </Typography>
  
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                To Pay: <span>₹{finalTotal}</span>
              </Typography>
  
              <Button variant="contained" color="warning" fullWidth sx={{ mt: 2, borderRadius: 2 }} onClick={() => navigate("/checkout")}>
                Checkout
              </Button>
            </Box>
          </Grid>
        </>
      ) : (
        // Show only the empty cart image when cart is empty
        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh" }}>
          <img src={emptyCartImage} alt="Empty Cart" style={{ width: "300px", maxWidth: "100%", opacity: 0.8 }} />
          <Button variant="contained" color="warning" sx={{ mt: 2 }} onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </Grid>
      )}
    </Grid>
  );
  
};

export default Cart;
