import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this points to your Firebase configuration

// Thunk for logging in a customer
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "customer"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid email or password");
      }

      let customer = null;
      querySnapshot.forEach((doc) => {
        customer = { id: doc.id, ...doc.data() };
      });
      console.log(customer);
      
      return customer; // Return the logged-in user data
    } catch (error) {
      return rejectWithValue(error.message); // Handle login errors
    }
  }
);

// Create the `auth` slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Logged-in user data
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null; // Clear user data on logout
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
