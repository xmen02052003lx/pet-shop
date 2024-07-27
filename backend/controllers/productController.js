import asyncHandler from "../middleware/asyncHandler.js"
import Product from "../models/productModel.js"

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT // number of products per page
  const page = Number(req.query.pageNumber) || 1 // current page

  const keyword = req.query.keyword
    ? {
        name: {
          // the reason why we use regular expression but not directly match because let say we want to search for "Iphone 10", but we only input the keyword "phone", so we dont want it to match entirely but just part of it
          $regex: req.query.keyword,
          $options: "i" // make it case-insensitive
        }
      }
    : {} // else we dont want to do anything here because there is no keyword

  // total number of products
  const count = await Product.countDocuments({ ...keyword }) // limit the count based on keyword
  // find products with that keyword (if there is a keyword)
  const products = await Product.find({ ...keyword })
    .limit(pageSize) // limit the products we fetched from the database
    .skip(pageSize * (page - 1)) // if we're on the 2nd page, skip the products in the 1st page, if we're on the 3rd page, skip the products in the 2nd and 1st page

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch a product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  // checking for valid ObjectId to prevent CastError moved to separate middleware

  const product = await Product.findById(req.params.id)

  if (product) {
    return res.json(product)
  }

  res.status(404)
  throw new Error("Resource not found")
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description"
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.json({ message: "Product removed" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    // we dont want the same person review twice
    // "reviews" is the sub-collection
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product already reviewed")
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: "Review added" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(3) // sort by rating and only get 3 product

  res.status(200).json(products)
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
}
