import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("This is new: ")
  console.log(enteredPassword)
  console.log(this.password)
  return await bcrypt.compare(enteredPassword, this.password) // Since we added matchPassword to this userSchema, so we can access this method on the user object, so "this" is referring to the specific "user" in the database of "user.matchPassword" in the userController
}

// Encrypt password using bcrypt before saving it to the database
userSchema.pre("save", async function (next) {
  // if we're just saving some user data, but we're not dealing with the password, then it's just going to move on
  if (!this.isModified("password")) {
    next()
  }
  // if we are modifying the password
  const salt = await bcrypt.genSalt(10) // generate a salt
  this.password = await bcrypt.hash(this.password, salt) // set the password field to the hashed password before saving it to the db
})

const User = mongoose.model("User", userSchema)

export default User
