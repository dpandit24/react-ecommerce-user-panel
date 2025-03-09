import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField, Button, Checkbox, Link, FormControlLabel } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailError(!email);
    setPasswordError(!password);

    if (!email || !password) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        // Trigger SweetAlert2 on successful login
        Swal.fire({
          title: "Success!",
          text: "Login successful. Redirecting to homepage...",
          icon: "success",
          timer: 2000, // Close the alert after 2 seconds
          showConfirmButton: false,
        });

        // Redirect to homepage after the alert
        setTimeout(() => {
          navigate("/"); // Replace "/home" with your homepage route
        }, 2000);
      })
      .catch(() => {
        // Handle error if needed (already displayed in the component)
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
      }}
    >
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
          Login
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Please login if you're an existing customer
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            type="email"
            placeholder="Enter email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            type="password"
            placeholder="Enter password"
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <FormControlLabel
          control={<Checkbox size="small" />}
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
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Don't have an account?{" "}
          <Link href="/signup" sx={{ color: "#f36a1b", textDecoration: "none" }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
