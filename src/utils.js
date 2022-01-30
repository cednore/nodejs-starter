/**
 * If current environment is development-purpose.
 *
 * @returns {boolean}
 */
module.exports.isDevelopment = () => process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';
