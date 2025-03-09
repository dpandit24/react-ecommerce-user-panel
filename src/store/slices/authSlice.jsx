import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; 

// Load user from localStorage if available
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

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

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(customer));

      return customer; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to register a new user
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      const customerData = { username, email };
      await setDoc(doc(db, "customer", user.uid), customerData);

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(customerData));

      return customerData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to check authentication state (load from localStorage)
export const checkAuthState = createAsyncThunk(
  "auth/checkAuthState",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user || null; // Return user if found, otherwise null
    } catch (error) {
      return rejectWithValue("Failed to load user from localStorage");
    }
  }
);

// Create the `auth` slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser, // Set initial user state from localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null; 
      state.error = null;
      localStorage.removeItem("user"); // Remove user from localStorage on logout
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
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
