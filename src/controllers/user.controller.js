const Router = require('express-promise-router');
const Validator = require('validatorjs');

const { NotFoundError, ValidationError } = require('../errors');
const db = require('../database');

/**
 * The router.
 */
const router = Router();

/**
 * Index endpoint.
 *
 * @param {Request}  req - Request
 * @param {Response} res - Response
 * @returns {Promise}
 */
const index = async (req, res) => {
  const rows = await db('users');

  return res.json({ success: true, data: rows });
};

/**
 * Create endpoint.
 *
 * @param {Request}  req - Request
 * @param {Response} res - Response
 * @returns {Promise}
 * @throws {ValidationError}
 */
const store = async (req, res) => {
  // Validate
  const validation = new Validator(req.body, {
    name: 'required|string|max:255',
    email: 'required|string|email|max:255',
  });
  if (validation.fails()) throw new ValidationError(validation);

  // Create
  const { name, email } = req.body;
  const user = await db('users').insert(
    {
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
      name,
      email,
    },
    '*',
  );

  return res.status(201).json({ success: true, data: user[0] });
};

/**
 * Read endpoint.
 *
 * @param {Request}  req - Request
 * @param {Response} res - Response
 * @returns {Promise}
 */
const show = async (req, res) => {
  const { id } = req.params;

  // Fetch
  const user = await db('users').where('id', id).first();
  if (user === undefined) throw new NotFoundError('user', id);

  return res.json({ success: true, data: user });
};

/**
 * Update endpoint.
 *
 * @param {Request}  req - Request
 * @param {Response} res - Response
 * @returns {Promise}
 */
const update = async (req, res) => {
  const { id } = req.params;

  // Check existence
  const user = await db('users').where('id', id).first();
  if (user === undefined) throw new NotFoundError('user', id);

  // Validate
  const validation = new Validator(req.body, {
    name: 'required|string|max:255',
    email: 'required|string|email|max:255',
  });
  if (validation.fails()) throw new ValidationError(validation);

  // Update
  const { name, email } = req.body;
  await db('users').where('id', id).update({
    updated_at: db.fn.now(),
    name,
    email,
  });

  return res.json({
    success: true,
    data: await db('users').where('id', id).first(),
  });
};

/**
 * Delete endpoint.
 *
 * @param {Request}  req - Request
 * @param {Response} res - Response
 * @returns {Promise}
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  // Check existence
  const user = await db('users').where('id', id).first();
  if (user === undefined) throw new NotFoundError('user', id);

  // Delete
  const [deletedRow] = await db('users').where('id', id).del('*');

  return res.json({ success: true, data: deletedRow });
};

// Register routes
router.get('/', index);
router.post('/', store);
router.get('/:id', show);
router.route('/:id').put(update).patch(update);
router.delete('/:id', destroy);

// Export router and methods
module.exports = {
  router,
  index,
  store,
  show,
  update,
  destroy,
};
