import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper,IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createAddress } from "../store/slices/addressSlice";

const AddressForm = ({ closeModal }) => { // Accept closeModal function
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.address);
    const [formData, setFormData] = useState({ name: "", street: "", city: "", state: "", pincode: "" });
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
          Swal.fire("Error", "Please log in to save your address.", "error");
          return;
        }
      
        try {
          await dispatch(createAddress({ userId: user.id, ...formData })).unwrap();
      
          console.log("✅ Address saved, closing modal...");
          closeModal(); // 🔥 Close first
      
          setTimeout(() => {
            Swal.fire({
              icon: "success",
              title: "Address Added!",
              text: "Your address has been saved successfully.",
              confirmButtonColor: "#ff6600",
            });
          }, 300); // Small delay to avoid UI glitches
      
          setFormData({ name: "", street: "", city: "", state: "", pincode: "" });
      
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error || "Failed to add address.",
          });
        }
      };
        
    return (
      <Box textAlign="center" position="relative" p={2}>
        {/* Close Button */}
        <IconButton
          onClick={closeModal}
          sx={{ position: "absolute", right: 8, top: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">Add Address</Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>Please enter your address details</Typography>
  
        <form onSubmit={handleSubmit}>
          <TextField label="Full Name" name="name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} margin="normal" required />
          <TextField label="Street" name="street" fullWidth value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} margin="normal" required />
          <TextField label="City" name="city" fullWidth value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} margin="normal" required />
          <TextField label="State" name="state" fullWidth value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} margin="normal" required />
          <TextField label="Pincode" name="pincode" fullWidth value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} margin="normal" required />
  
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#ff6600" }} disabled={loading}>
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </form>
      </Box>
    );
  };  

export default AddressForm;
