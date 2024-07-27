// in this slice, we're not dealing with any endpoints/any API stuff (that's gonna go to userApiSlice). This is simply to set the user credentials to local storage and remove them
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // once we hit our Back-End through the userApiSlice, we get our user info, we're going to send it here as the payload in the action, so then we set the userInfo state to that payload and then we just want to store that in local Storage
      // Our redux state almost always match up with our local Storage
      state.userInfo = action.payload
      localStorage.setItem("userInfo", JSON.stringify(action.payload))
    },
    logout: (state, action) => {
      state.userInfo = null // set redux state to null
      // NOTE: here we need to also remove the cart from storage so the next logged in user doesn't inherit the previous users cart and shipping
      localStorage.clear()
    }
  }
})

export const { setCredentials, logout } = authSlice.actions
// we have to bring this to our store.js
export default authSlice.reducer
