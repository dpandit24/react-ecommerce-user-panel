import React from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Badge } from "@mui/material";
import { LocationOn, Search, ShoppingCart, Notifications, AccountCircle } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart); // Get cart items from Redux store

  // Calculate total cart quantity
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "white", color: "black" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Logo and Location */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          {/* Location */}
          <Box style={{ display: "flex", alignItems: "center" }}>
            <LocationOn style={{ color: "#ff6600", fontSize: 18 }} />
            <Typography style={{ fontWeight: "bold" }}>Delivering to&nbsp;</Typography>
            <Typography style={{ fontWeight: "bold", color: "black" }}>Gomtinagar ▼</Typography>
          </Box>
        </Box>

        {/* Middle Section: Search Bar */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 20,
            padding: "2px 10px",
            width: "40%",
          }}
        >
          <Search style={{ color: "#ff6600", marginRight: 5 }} />
          <InputBase placeholder="Search" fullWidth />
        </Box>

        {/* Right Section: Icons */}
        <Box style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Cart Button with Quantity Badge */}
          <IconButton onClick={handleCartClick}>
            <Badge badgeContent={totalQuantity} color="error">
              <ShoppingCart style={{ color: "#ff6600" }} />
            </Badge>
          </IconButton>

          <IconButton>
            <Notifications style={{ color: "#ff6600" }} />
          </IconButton>

          {user ? (
            <Box style={{ display: "flex", alignItems: "center" }}>
              <AccountCircle style={{ color: "#ff6600", marginRight: 5 }} />
              <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>{user.name}</Typography>
            </Box>
          ) : (
            <Typography
              style={{ fontWeight: "bold", fontSize: "14px", cursor: "pointer", color: "#ff6600" }}
              onClick={handleLoginClick}
            >
              Login
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
