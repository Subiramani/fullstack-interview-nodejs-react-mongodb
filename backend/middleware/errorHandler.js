/**
 * Centralized Error Handling Middleware
 * 
 * This catches all errors from controllers and sends consistent error responses.
 * 
 * Benefits:
 * - Consistent error response format across all endpoints
 * - Prevents leaking sensitive error details in production
 * - Single place to handle different error types
 * 
 * Interview discussion:
 * - How would you add error logging (e.g., to Sentry)?
 * - How would you handle different error types (validation, auth, etc.)?
 * - What's the difference between operational and programmer errors?
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (in production, use proper logging service)
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
