const express = require('express');
const bodyParser = require('body-parser');

const { router: ApiV1Controller } = require('./controllers');

/**
 * Express app instance.
 */
const app = express();

// Register middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register controllers
app.use('/api/v1', ApiV1Controller);

// Export
module.exports = app;
