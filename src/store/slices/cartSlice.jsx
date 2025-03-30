import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where,writeBatch } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this points to your Firebase configuration

// Thunk to add a product to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const cartRef = doc(collection(db, "cart"), `${userId}_${productId}`);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        // If the product already exists, update its quantity
        const currentQuantity = cartSnap.data().quantity;
        await updateDoc(cartRef, { quantity: currentQuantity + 1 });
      } else {
        // If product is not in the cart, add a new entry
        await setDoc(cartRef, {
          cartId: `${userId}_${productId}`,
          userId,
          productId,
          quantity: 1,
        });
      }

      return { userId, productId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, type }, { rejectWithValue }) => {
    try {
      const cartRef = doc(db, "cart", `${userId}_${productId}`);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        return rejectWithValue("Product not found in cart");
      }

      let currentQuantity = cartSnap.data().quantity;

      if (type === "increase") {
        await updateDoc(cartRef, { quantity: currentQuantity + 1 });
        return { userId, productId, newQuantity: currentQuantity + 1 };
      } else if (type === "decrease") {
        if (currentQuantity > 1) {
          await updateDoc(cartRef, { quantity: currentQuantity - 1 });
          return { userId, productId, newQuantity: currentQuantity - 1 };
        } else {
          // If quantity is 1 and user decreases, remove the product from the cart
          await deleteDoc(cartRef);
          return { userId, productId, remove: true };
        }
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const cartQuery = query(collection(db, "cart"), where("userId", "==", userId));
      const cartSnapshot = await getDocs(cartQuery);

      const cartItems = [];
      const productFetchPromises = [];

      cartSnapshot.forEach((cartDoc) => {
        const cartData = cartDoc.data();
        cartItems.push(cartData);

        // Fetch product data using productId
        const productRef = doc(db, "products", cartData.productId);
        productFetchPromises.push(getDoc(productRef));
      });

      // Fetch all product details
      const productSnapshots = await Promise.all(productFetchPromises);
      const productDataMap = {};
      productSnapshots.forEach((snap) => {
        if (snap.exists()) {
          productDataMap[snap.id] = snap.data();
        }
      });

      // Merge cart items with product details
      const mergedCart = cartItems.map((cartItem) => ({
        ...cartItem,
        product: productDataMap[cartItem.productId] || null, // Attach product details
      }));
      console.log(mergedCart);
      
      return mergedCart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Thunk to remove a product from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const cartId = `${userId}_${productId}`;
      await deleteDoc(doc(db, "cart", cartId));
      return cartId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartByUserId = createAsyncThunk(
  "cart/clearCartByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      // Assuming you have a Firestore collection named "cart"
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: {}, // Track loading per product
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { productId } = action.payload;
        state.loading[productId] = false;
        const existingItem = state.items.find((item) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const productId = action.payload.split("_")[1];
        state.loading[productId] = false;
        state.items = state.items.filter((item) => item.cartId !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = false;
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { productId, newQuantity, remove } = action.payload;
        state.loading[productId] = false;
        if (remove) {
          state.items = state.items.filter((item) => item.productId !== productId);
        } else {
          const existingItem = state.items.find((item) => item.productId === productId);
          if (existingItem) {
            existingItem.quantity = newQuantity;
          }
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = false;
        state.error = action.payload;
      })
      .addCase(clearCartByUserId.fulfilled, (state, action) => {
        state.items = []; // Clear cart items in Redux
      });
    
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
