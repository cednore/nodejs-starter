/**
 * ValidationError constructor.
 *
 * @param {Validator} validation
 */
function ValidationError(validation) {
  this.name = 'ERROR_VALIDATION';
  this.status = 422; // Unprocessable Entity
  this.message = 'Validation failed!';
  this.errors = validation?.errors?.errors;
}

// Export
module.exports = ValidationError;
