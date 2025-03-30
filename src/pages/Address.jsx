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
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses,deleteAddress } from "../store/slices/addressSlice";
import AddressForm from "../components/AddressForm"; // Import the form
import Swal from "sweetalert2";

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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAddress(id));
        Swal.fire("Deleted!", "Your address has been deleted.", "success");
      }
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
  <Paper elevation={3} sx={{ width: "80%", padding: 4, borderRadius: 3 }}>
    
    {/* Top Section: Title & Add Button */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight="bold">
        My Addresses
      </Typography>
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

    {/* Address List */}
    {loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    ) : addresses.length > 0 ? (
      <List>
        {addresses.map((address) => (
          <ListItem key={address.id} divider>
            <ListItemText
              primary={address.name}
              secondary={`${address.street}, ${address.city}, ${address.state}, ${address.pincode}`}
            />
            <IconButton onClick={() => handleDelete(address.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>No addresses found.</Typography>
    )}
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
