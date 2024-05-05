import { createSlice } from "@reduxjs/toolkit" // this slice dont deal with asynchronous request so we dont need createApi
import { updateCart } from "../utils/cartUtils"

// our cart will be stored in localStorage so when the user leave the site and come back it still there
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] }

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // this is a reducer function so it has 2 params: state and action. state is current state, action is data inside of a payload
    addToCart: (state, action) => {
      // we don't need user, rating, numReviews or reviewsin the cart
      const { user, rating, numReviews, reviews, ...item } = action.payload

      const existItem = state.cartItems.find(x => x._id === item._id)

      console.log("existItem: ")
      console.log(existItem)

      if (existItem) {
        state.cartItems = state.cartItems.map(x =>
          x._id === existItem._id ? item : x
        )
      } else {
        state.cartItems = [...state.cartItems, item]
      }

      return updateCart(state)
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload)

      return updateCart(state)
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
      localStorage.setItem("cart", JSON.stringify(state))
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
      localStorage.setItem("cart", JSON.stringify(state))
    },
    clearCartItems: (state, action) => {
      state.cartItems = []
      localStorage.setItem("cart", JSON.stringify(state))
    },
    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users cart and shipping
    resetCart: state => (state = initialState)
  } // this reducers object will have all the func that have to do with the cart (add, remove,.etc)
})

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart
} = cartSlice.actions

export default cartSlice.reducer
