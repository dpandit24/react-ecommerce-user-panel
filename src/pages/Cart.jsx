import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, Button, Divider, IconButton } from "@mui/material";
import { Delete, Add, Remove, Percent } from "@mui/icons-material";
import { fetchCart, removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const userId = "XE8HCBLq3mXF2RNaxwvY"; // Replace with actual user ID

  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCart(userId));
  }, [dispatch, userId]);

  // Calculate dynamic cart totals
  const cartTotal = items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  const itemSavings = 96; // Hardcoded for now, can be made dynamic if discounts are available
  const handlingFee = 23;
  const deliveryFee = 32; // Can be made free for promotions
  const finalTotal = cartTotal - itemSavings + handlingFee; // Apply savings & add handling fee

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ userId, productId }));
  };

  const handleQuantityChange = (productId, type) => {
    dispatch(updateCartQuantity({ userId, productId, type }));
  };

  return (
    <Grid container spacing={2} sx={{ padding: 3 }}>
      {/* Left Section - Cart Items */}
      <Grid item xs={12} md={8}>
        <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2, boxShadow: 2 }}>
          <Typography variant="h6">Your Cart</Typography>

          <Divider sx={{ my: 2 }} />

          {/* Cart Items List */}
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
                {/* Quantity Controls */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleQuantityChange(item.productId, "decrease")}>
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(item.productId, "increase")}>
                    <Add />
                  </IconButton>
                </Box>
                <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                  ₹{(item.product?.price || 0) * item.quantity}
                </Typography>
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
          {/* Coupon Section */}
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

          {/* Order Summary */}
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

          {/* Total Price */}
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
