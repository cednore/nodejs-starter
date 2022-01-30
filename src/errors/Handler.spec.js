/* eslint-disable no-unused-vars */

const express = require('express');
const request = require('supertest');
const Validator = require('validatorjs');
const bodyParser = require('body-parser');
const { DatabaseError } = require('pg');

const { ErrorHandler, NotFoundError, ValidationError } = require('.');

describe('errors/Handler', () => {
  let app;

  before(() => {
    // Prepare mocked express app
    app = express();

    // Parse json
    app.use(bodyParser.json());

    // Mock NotFoundError
    app.get('/not_found_error', (req, res) => {
      throw new NotFoundError('comment', 13);
    });

    // Mock ValidationError
    app.post('/validation_error', (req, res) => {
      const validation = new Validator(req.body, {
        name: 'required|string',
        email: 'required|string',
      });
      if (validation.fails()) throw new ValidationError(validation);

      res.status(200).json({ success: true });
    });

    // Mock PgError
    app.put('/pg_error', (req, res) => {
      throw new DatabaseError();
    });

    // Mock unknown error
    app.patch('/unknown_error', (req, res) => {
      throw new Error('This is unknown error!');
    });

    // Register ErrorHandler
    app.use(ErrorHandler);

    // Register next handler for testing purpose
    app.use((err, req, res, next) => {
      if (res.headersSent) return next(err);
      return res.status(599).end();
    });
  });

  it('should handle NotFoundError', async () => {
    const { body } = await request(app).get('/not_found_error').expect('Content-Type', /json/).expect(404);

    body.should.eql({
      success: false,
      message: 'Requested comment #13 not found!',
    });
  });

  it('should handle ValidationError', async () => {
    const { body } = await request(app)
      .post('/validation_error')
      .send({ name: 123 })
      .expect('Content-Type', /json/)
      .expect(422);

    body.should.eql({
      success: false,
      message: 'Validation failed!',
      errors: {
        name: ['The name must be a string.'],
        email: ['The email field is required.'],
      },
    });
  });

  it('should handle errors coming from pg driver only when production', async () => {
    const envBackup = process.env.NODE_ENV;

    process.env.NODE_ENV = 'production';

    const { body } = await request(app).put('/pg_error').expect('Content-Type', /json/).expect(500);

    body.should.eql({
      success: false,
      message: 'Internal server error from database!',
    });

    process.env.NODE_ENV = envBackup;
  });

  it('should not handle errors coming from pg driver if not production', (done) => {
    request(app)
      .put('/pg_error')
      .expect(599)
      .then(() => done());
  });

  it('should not handle unknown errors', (done) => {
    request(app)
      .patch('/unknown_error')
      .expect(599)
      .then(() => done());
  });
});
