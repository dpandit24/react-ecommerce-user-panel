import React from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Badge, Button } from "@mui/material";
import { LocationOn, Search, ShoppingCart, Notifications } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../ProfileMenu"; // Import ProfileMenu component

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // Calculate total cart quantity only if user is logged in
  const totalQuantity = user ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "white", color: "black" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Location */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <LocationOn style={{ color: "#ff6600", fontSize: 18 }} />
          <Typography style={{ fontWeight: "bold" }}>Delivering to&nbsp;</Typography>
          <Typography style={{ fontWeight: "bold", color: "black" }}>Gomtinagar ▼</Typography>
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
          {/* Show cart badge only if user is logged in */}
          <IconButton onClick={() => navigate("/cart")}>
            {user ? (
              <Badge badgeContent={totalQuantity} color="error">
                <ShoppingCart style={{ color: "#ff6600" }} />
              </Badge>
            ) : (
              <ShoppingCart style={{ color: "#ff6600" }} />
            )}
          </IconButton>

          <IconButton>
            <Notifications style={{ color: "#ff6600" }} />
          </IconButton>

          {/* Show Profile Menu if user is logged in, otherwise show Login button */}
          {user ? (
            <ProfileMenu />
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
