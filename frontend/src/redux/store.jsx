 import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer
  }
});

export default store;


// import { configureStore } from "@reduxjs/toolkit";

// const store = configureStore({
//     reducer:{
//         cart: cartReducer
//     }
// });

// export default store;


