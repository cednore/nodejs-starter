// Load environment variables
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Mocha configuration
module.exports = {
  diff: true,
  spec: 'src/**/*.spec.js',
  package: './package.json',
  reporter: 'spec',
  timeout: 20000,
  ui: 'bdd',
  recursive: true,
  exit: true,
  require: ['should'],
};
