/**
 * NotFoundError constructor.
 *
 * @param {string} model - Name of the requested resource
 * @param {any}    id    - Identifier of the requested resource
 */
function NotFoundError(model, id) {
  this.name = 'ERROR_NOT_FOUND';
  this.status = 404; // Not Found
  this.message = `Requested ${model || 'resource'}${id ? ` #${id}` : ''} not found!`;
}

// Export
module.exports = NotFoundError;
