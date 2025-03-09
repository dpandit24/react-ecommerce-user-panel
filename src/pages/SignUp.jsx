import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField, Button, Checkbox, Link, FormControlLabel } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { register } from "../store/slices/authSlice"; // Ensure you have a register function in your slice

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setForm({ ...form, termsAccepted: !form.termsAccepted });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, termsAccepted } = form;

    if (!username || !email || !password || !confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!termsAccepted) {
      Swal.fire({
        title: "Error",
        text: "You must agree to the terms & conditions.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Registration successful. Redirecting to login...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 2000);
      })
      .catch(() => {
        // Handle error (already displayed in UI)
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Sign Up
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Create an account to continue
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
          <TextField
            type="text"
            name="username"
            placeholder="Enter username"
            variant="outlined"
            size="small"
            value={form.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            type="email"
            name="email"
            placeholder="Enter email"
            variant="outlined"
            size="small"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            type="password"
            name="password"
            placeholder="Enter password"
            variant="outlined"
            size="small"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            variant="outlined"
            size="small"
            value={form.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={form.termsAccepted} onChange={handleCheckboxChange} />}
            label={
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                I agree to the{" "}
                <Link href="#" sx={{ color: "#f36a1b", textDecoration: "none" }}>
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" sx={{ color: "#f36a1b", textDecoration: "none" }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ justifyContent: "center", mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#f36a1b",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d55814",
              },
              mb: 2,
            }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Already have an account?{" "}
          <Link href="/login" sx={{ color: "#f36a1b", textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
