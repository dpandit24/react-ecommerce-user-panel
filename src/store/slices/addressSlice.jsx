import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase"; // Your Firebase config file
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

// Async thunk to create a new address
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async ({ userId, name, street, city, state, pincode }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required to create an address!");

      const docRef = await addDoc(collection(db, "address"), {
        userId,
        name,
        street,
        city,
        state,
        pincode,
      });

      return {
        id: docRef.id,
        userId,
        name,
        street,
        city,
        state,
        pincode,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch addresses for a user
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User ID is required to fetch addresses!");

      const addressQuery = query(collection(db, "address"), where("userId", "==", userId));
      const querySnapshot = await getDocs(addressQuery);

      const addresses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return addresses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete an address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      if (!addressId) throw new Error("Address ID is required to delete!");

      await deleteDoc(doc(db, "address", addressId));
      return addressId; // Return deleted ID to update state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter((addr) => addr.id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
