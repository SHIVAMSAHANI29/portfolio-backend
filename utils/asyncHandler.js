// utils/asyncHandler.js
// Wraps async route handlers so thrown errors are passed to next()
// and land in the centralized error handler, instead of needing
// a try/catch block in every single controller function.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
