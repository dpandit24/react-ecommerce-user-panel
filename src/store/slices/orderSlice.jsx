import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase"; // Firebase config
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Async thunk to create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, paymentMethod, addressId, discount }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User is not logged in!");

      // Step 1: Fetch cart items for the user
      const cartRef = collection(db, "cart");
      const cartQuery = query(cartRef, where("userId", "==", userId));
      const cartSnapshot = await getDocs(cartQuery);

      if (cartSnapshot.empty) throw new Error("Cart is empty!");

      let products = [];
      let total = 0;

      cartSnapshot.forEach((cartDoc) => {
        const cartData = cartDoc.data();
        products.push(cartData.productId);
        total += cartData.price * cartData.quantity;
      });

      // Step 2: Calculate the final total after discount
      const finalTotal = total - discount;

      // Step 3: Create the order document in Firestore
      const orderRef = await addDoc(collection(db, "orders"), {
        date: new Date(),
        userId,
        paymentMethod,
        products,
        addressId,
        total: finalTotal,
        discount,
      });

      // Step 4: Clear the cart after placing the order
      for (let cartDoc of cartSnapshot.docs) {
        await deleteDoc(doc(db, "cart", cartDoc.id));
      }

      // Return order data
      return {
        orderId: orderRef.id,
        date: new Date(),
        userId,
        paymentMethod,
        products,
        addressId,
        total: finalTotal,
        discount,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    order: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
