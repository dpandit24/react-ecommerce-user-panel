import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAddresses } from "../store/slices/addressSlice";
import { fetchCart, clearCartByUserId } from "../store/slices/cartSlice";
import Swal from "sweetalert2";
import {
  CircularProgress,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user details from auth state
  const authUser = useSelector((state) => state.auth.user);
  const userId = authUser?.id;
  const userName = authUser?.username || "Guest";

  // Fetch addresses and cart items
  const addresses = useSelector((state) => state.address.addresses) || [];
  const addressLoading = useSelector((state) => state.address.loading);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const cartLoading = useSelector((state) => Object.values(state.cart.loading).some((loading) => loading));

  // State for selected address
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchAddresses(userId));
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [userId, cartItems, navigate]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handlePlaceOrder = async () => {
    try {
      await dispatch(clearCartByUserId(userId)).unwrap();

      Swal.fire({
        icon: "success",
        title: "Order Placed Successfully!",
        text: "Thank you for your order.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to place order",
      });
    }
  };

  // Calculate Order Summary
  const totalMRP = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const savings = 96; // Example static savings value
  const totalPayable = totalMRP - savings;

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {/* Left Section - Cart & Address */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Cart
              </Typography>
              {cartLoading ? (
                <CircularProgress />
              ) : (
                cartItems.map((item) => (
                  <Card key={item.productId} style={{ marginBottom: "10px", padding: "15px", display: "flex", alignItems: "center" }}>
                    <img
                      src={item.product?.image || "https://via.placeholder.com/80"}
                      alt={item.product?.name}
                      style={{ width: "80px", height: "80px", marginRight: "10px", borderRadius: "5px" }}
                    />
                    <div>
                      <Typography variant="h6">{item.product?.name || "Unknown Product"}</Typography>
                      <Typography>Quantity: {item.quantity}</Typography>
                      <Typography>Price: ₹{item.product?.price || "N/A"}</Typography>
                    </div>
                  </Card>
                ))
              )}
              <Typography variant="h6">MRP Total: ₹{totalMRP}</Typography>
            </CardContent>
          </Card>

          {/* Address Selection */}
          <Card style={{ marginTop: "20px" }}>
            <CardContent>
              <Typography variant="h6">Select Shipping Address</Typography>
              {addressLoading ? (
                <CircularProgress />
              ) : addresses.length === 0 ? (
                <Typography>No saved addresses. Please add one.</Typography>
              ) : (
                <FormControl fullWidth>
                  <Select
                    value={selectedAddress}
                    onChange={handleAddressChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Select Address" }}
                  >
                    <MenuItem value="" disabled>
                      Select Address
                    </MenuItem>
                    {addresses.map((address) => (
                      <MenuItem key={address.id} value={address.id}>
                        {`${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Section - Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>
              <Typography>MRP Total: ₹{totalMRP}</Typography>
              <Typography style={{ color: "green" }}>Item Savings: -₹{savings}</Typography>
              <hr />
              <Typography variant="h6">
                <strong>To Pay: ₹{totalPayable}</strong>
              </Typography>
            </CardContent>
          </Card>

          {/* Checkout Button */}
          <Button
            variant="contained"
            fullWidth
            style={{ marginTop: "20px", backgroundColor: "#ff6600", color: "#fff" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff4500")}
            disabled={!selectedAddress || cartItems.length === 0}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Checkout;
