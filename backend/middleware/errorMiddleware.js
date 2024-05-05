const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Override the default express-errorHandler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  //   Check for Mongoose Object bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found"
    statusCode = 494
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? "🎂" : err.stack
  })
}

export { notFound, errorHandler }
