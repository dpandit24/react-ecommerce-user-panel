import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, Button, Divider, IconButton } from "@mui/material";
import { Delete, Add, Remove, Percent } from "@mui/icons-material";
import { fetchCart, removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth.user); // Get logged-in user
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!user) {
      // Show alert and redirect to login page
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

  // Prevent rendering cart if user is not logged in
  if (!user) return null;

  // Calculate totals
  const cartTotal = items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  const itemSavings = 96;
  const handlingFee = 23;
  const deliveryFee = 32;
  const finalTotal = cartTotal - itemSavings + handlingFee;

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ userId: user.id, productId }));
  };

  const handleQuantityChange = (productId, type) => {
    dispatch(updateCartQuantity({ userId: user.id, productId, type }));
  };

  return (
    <Grid container spacing={2} sx={{ padding: 3 }}>
      {/* Left Section - Cart Items */}
      <Grid item xs={12} md={8}>
        <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2, boxShadow: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <Divider sx={{ my: 2 }} />

          {items.length > 0 ? (
            items.map((item) => (
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
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              Your cart is empty.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            Delivery Charges: <span style={{ textDecoration: "line-through" }}>₹{deliveryFee}</span> Free
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Packaging Charges: -₹{itemSavings}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            MRP Total: ₹{cartTotal}
          </Typography>
        </Box>
      </Grid>

      {/* Right Section - Order Summary */}
      <Grid item xs={12} md={4}>
        <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2, boxShadow: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", p: 1, border: "1px dashed orange" }}>
            <Percent sx={{ color: "orange", mr: 1 }} />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Apply Coupon
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Save ₹100 with NEWCOUPON
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Order Summary</Typography>
          <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
            MRP Total: <span>₹{cartTotal}</span>
          </Typography>
          <Typography variant="body2" color="green" sx={{ display: "flex", justifyContent: "space-between" }}>
            Item Savings: <span>-₹{itemSavings}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
            Handling Fee (inc GST): <span>₹{handlingFee}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
            Delivery Partner Fee: <span style={{ textDecoration: "line-through" }}>₹{deliveryFee}</span> Free
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            To Pay: <span>₹{finalTotal}</span>
          </Typography>

          <Button variant="contained" color="warning" fullWidth sx={{ mt: 2, borderRadius: 2 }}>
            Checkout
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Cart;
