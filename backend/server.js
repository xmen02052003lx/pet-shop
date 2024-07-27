import path from "path" // putting the built-in node modules at the top is a good convention
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import colors from "colors"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"

dotenv.config()

const port = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

const app = express()

// Body parser middleware (this is just for raw JSON, we also want to be able to do the URL encoded)
// these 2 lines of middleware should allow us to get that body data ("Body" in Postman or req.body in controllers)
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // urlencoded
// Cookie parser middleware (allow ú to access req.cookies)
app.use(cookieParser())

// Mount routes
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
// PayPal's API
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
)

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve() // set __dirname to current directory
  // app.use("/uploads", express.static("/var/data/uploads"))
  app.use("/uploads", express.static("/uploads"))
  app.use(express.static(path.join(__dirname, "/frontend/build"))) // set the React build folder (which is in our /frontend/build, because if we're building a React app and we do npm run build, it creates a build folder with all of our static assets) to be a static folder

  // any route that is not api will be redirected to index.html
  app.get(
    "*",
    (req, res) =>
      res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")) // load the index.html file that's in the frontend/builder folder which we just made static
  )
} else {
  //   when you call path.resolve() with no arguments, it returns the absolute path of the current working directory, not necessarily the directory where the script is located. The current working directory is typically the location from where you initiated the Node.js process (i.e., where you ran the node command).

  // So in the root of the project if we run node backend/server.js then calling path.resolve() in server.js will give use the project root directory i.e. where we ran the command to start the Node process.
  const __dirname = path.resolve() // set __dirname to current directory
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")))
  app.get("/", (req, res) => {
    res.send("API is running....") // because if we're not in production then we're using the React dev server
  })
}

// Error middleware need to be under all the routes
app.use(notFound)
app.use(errorHandler)

app.listen(port, () =>
  console.log(`Server running on port ${port}`.green.inverse)
)
