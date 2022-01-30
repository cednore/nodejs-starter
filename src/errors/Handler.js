const { DatabaseError: PgError } = require('pg');

const { isDevelopment } = require('../utils');

/**
 * The default error handler.
 *
 * @param {any}          err  - Error object
 * @param {Request}      req  - Request
 * @param {Response}     res  - Response
 * @param {NextFunction} next - Next function
 */
function Handler(err, req, res, next) {
  // Skip if headers are already sent
  if (res.headersSent) return next(err);

  // Handle NotFoundError
  if (err.name === 'ERROR_NOT_FOUND') {
    return res
      .status(err.status || 404)
      .json({
        success: false,
        message: err.message || 'Requested resource not found!',
      })
      .end();
  }

  // Handle ValidationError
  if (err.name === 'ERROR_VALIDATION') {
    return res
      .status(err.status || 422)
      .json({
        success: false,
        message: err.message || 'Validation failed!',
        errors: err.errors,
      })
      .end();
  }

  // Handle pg database error
  if (err.constructor === PgError && !isDevelopment()) {
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error from database!',
      })
      .end();
  }

  // Fallback to next
  return next(err);
}

// Export
module.exports = Handler;
