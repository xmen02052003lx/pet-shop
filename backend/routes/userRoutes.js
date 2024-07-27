import express from "express"
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser
} from "../controllers/userController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// "/" is short for "/api/users"
// all of these are connected via /api/users
router.route("/").get(protect, admin, getUsers).post(registerUser)
router.post("/logout", logoutUser) // because we only have a POST method to logout, so instead using router.route we'll using router.post
router.post("/login", authUser) // this is /api/users/login
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route("/:id") // this is /api/users/:id
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser)

export default router
