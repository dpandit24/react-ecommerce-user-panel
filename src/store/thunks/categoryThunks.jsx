import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase";

// Fetch categories
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = [];
    querySnapshot.forEach((doc) => categories.push({ id: doc.id, ...doc.data() }));
    return categories;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

