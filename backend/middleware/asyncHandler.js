// There is a npm package express-async-handler but it's only actually a few lines of code anyway, so its just as simple to do much the same rather than pull in a dependency. All the the function really does is catch any Promise rejections and pass them to the error handler middleware.
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
