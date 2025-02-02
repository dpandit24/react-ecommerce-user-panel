import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    auth: authReducer,
    cart: cartReducer
  },
});

export default store;
