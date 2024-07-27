import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import User from "../models/userModel.js"

// Protect middleware
// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt

  if (token) {
    try {
      // extract the payload of our jwt
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // add that user to the req object
      // this user object will be on the req object in all of our routes. For example, if we're working in the profile route, we'll be able to get the user from this request object and do what we want with it and it will be the user that's logged in
      req.user = await User.findById(decoded.userId).select("-password") // we dont want the password even though it is hashed but we dont need it

      next() // make  sure to call next() to move on to the next piece of middleware
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  } else {
    res.status(401)
    throw new Error("Not authorized, no token") // we were able to do this because of our error handler
  }
})

// Admin middleware
// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as an admin")
  }
}

// we can bring these middleware to our routes
export { protect, admin }
