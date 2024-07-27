import { createSlice } from "@reduxjs/toolkit" // this slice dont deal with asynchronous request so we dont need createApi
import { updateCart } from "../utils/cartUtils"

// our cart will be stored in localStorage so when the user leave the site and come back it still there
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" } // because anything stored in localStorage are type of String, so JSON.parse (because we store it in JSON format)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // this reducers will have all the functions relate to the cart
    // this is a reducer function so it has 2 params: state and action. state is current state (the initialState that we set up above), action will include data inside of a payload (we can access the fields such as items-to-add-to-the-cart through our payload)
    addToCart: (state, action) => {
      // we don't need user, rating, numReviews or reviewsin the cart
      const { user, rating, numReviews, reviews, ...item } = action.payload

      const existItem = state.cartItems.find(x => x._id === item._id)

      console.log("existItem: ")
      console.log(existItem)

      if (existItem) {
        // replace the existing item in the cart by the new item
        state.cartItems = state.cartItems.map(x =>
          x._id === existItem._id ? item : x
        )
      } else {
        // we dont use "push" because state is immutable, so we need to copy (spread accorss) whatever already in the cart and then add whatever (push) to it (item)
        state.cartItems = [...state.cartItems, item]
      }
      // Our redux state almost always match up with our local Storage
      return updateCart(state)
    },
    removeFromCart: (state, action) => {
      // the id that we're going to pass to this removeFromCart is in the action.payload
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload)
      // Our redux state almost always match up with our local Storage
      return updateCart(state)
    },
    saveShippingAddress: (state, action) => {
      // Our redux state almost always match up with our local Storage
      state.shippingAddress = action.payload
      localStorage.setItem("cart", JSON.stringify(state))
    },
    savePaymentMethod: (state, action) => {
      // Our redux state almost always match up with our local Storage
      state.paymentMethod = action.payload
      localStorage.setItem("cart", JSON.stringify(state))
    },
    clearCartItems: (state, action) => {
      // Our redux state almost always match up with our local Storage
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
