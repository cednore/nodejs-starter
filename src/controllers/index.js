const Router = require('express-promise-router');

const { ErrorHandler } = require('../errors');
const { router: UserController } = require('./user.controller');

/**
 * The router.
 */
const router = Router();

// Register controllers
router.use('/users', UserController);

// Register error handler
router.use(ErrorHandler);

// Export
module.exports = {
  router,
};
