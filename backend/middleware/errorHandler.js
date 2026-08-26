const { ApiError } = require('../utils/helpers');

function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found'));
}

module.exports = { errorHandler, asyncHandler, notFound };
