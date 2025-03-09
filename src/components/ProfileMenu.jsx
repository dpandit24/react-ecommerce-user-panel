import React, { useState } from "react";
import { Menu, MenuItem, Box, Typography, IconButton, Avatar, Divider } from "@mui/material";
import { AccountCircle, LocationOn, Logout } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice"; // Import logout action
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    handleMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <AccountCircle sx={{ color: "#ff6600" }} />
        <Typography sx={{ marginLeft: 1, fontSize: "14px", fontWeight: "bold" }}>
          {user?.username}
        </Typography>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={{ sx: { width: 250, padding: 1 } }}>
        <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
          <Avatar sx={{ bgcolor: "#ff6600", marginRight: 2 }}>{user?.username?.[0]}</Avatar>
          <Box>
            <Typography fontWeight="bold">{user?.username}</Typography>
          </Box>
        </Box>

        <Divider />

        {/* Address Option */}
        <MenuItem onClick={() => navigate("/address")}>
          <LocationOn sx={{ color: "#ff6600", marginRight: 1 }} />
          <Typography fontWeight="bold">Addresses</Typography>
        </MenuItem>

        <Divider />

        {/* Logout Option */}
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ color: "#ff6600", marginRight: 1 }} />
          <Typography fontWeight="bold">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
