import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Modal,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../store/slices/addressSlice";
import AddressForm from "../components/AddressForm"; // Import the form

const Address = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addresses, loading } = useSelector((state) => state.address);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchAddresses(user.id)); // Fetch addresses when user is logged in
    }
  }, [dispatch, user]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={3} sx={{ display: "flex", padding: 4, width: "80%", borderRadius: 3 }}>
        {/* Left Section: Address List */}
        <Box flex={1} sx={{ borderRight: "2px solid #ddd", paddingRight: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            My Addresses
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : addresses.length > 0 ? (
            <List>
              {addresses.map((address) => (
                <ListItem key={address.id} divider>
                  <ListItemText
                    primary={address.name}
                    secondary={`${address.street}, ${address.city}, ${address.state}, ${address.pincode}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No addresses found.</Typography>
          )}
        </Box>

        {/* Right Section: Add Address Button */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff6600",
              "&:hover": { backgroundColor: "#e65c00" },
            }}
            onClick={() => setOpen(true)}
          >
            Add Address
          </Button>
        </Box>
      </Paper>

      {/* Modal for Address Form */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          sx={{ outline: "none" }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: 400, borderRadius: 3 }}>
            <AddressForm closeModal={() => setOpen(false)} />
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default Address;
