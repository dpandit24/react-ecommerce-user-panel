import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthState } from "./store/slices/authSlice";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductListing from "./pages/ProductListing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Address from "./pages/Address";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthState()); // Load user from localStorage on page load
  }, [dispatch]);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<Address />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
