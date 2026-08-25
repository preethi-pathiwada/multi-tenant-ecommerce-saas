import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';


const cartSlice = createSlice({
    name:"cart",
    initialState:{items:[]},
    reducers:{
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find((item) => 
                item.productId === product.productId &&
                item.variantId === product.variantId
            );
            if(existingItem){
                existingItem.quantity+=1;
            }
            else{
                state.items.push({...product, cartId: uuidv4(), quantity:1});
            }
            console.log(state)
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                item => item.cartId !== action.payload
            )
        },
        clearCart:(state) => {
            state.items = [];
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.cartId === action.payload
            );

            if (item) {
                item.quantity += 1;
            }
            },

        decreaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.cartId === action.payload
            );

            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
    }
});


export const {addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity} = cartSlice.actions;
export default cartSlice.reducer;











