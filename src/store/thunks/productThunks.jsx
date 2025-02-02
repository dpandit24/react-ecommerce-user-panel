import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Fetch products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    // Create a query to filter products with is_featured === true
    const featuredProduct = query(collection(db, "products"), where("is_featured", "==", true));
    const querySnapshot = await getDocs(featuredProduct);

    const products = [];
    querySnapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));

    return products;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

