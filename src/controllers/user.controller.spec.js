const request = require('supertest');

const app = require('../server');
const { router } = require('./user.controller');
const db = require('../database');

describe('controllers/user.controller#router', () => {
  it('should register routes for CRUD endpoints', () => {
    router.stack.length.should.equal(5);

    // index
    router.stack[0].route.path.should.equal('/');
    router.stack[0].route.methods.should.eql({ get: true });

    // store
    router.stack[1].route.path.should.equal('/');
    router.stack[1].route.methods.should.eql({ post: true });

    // show
    router.stack[2].route.path.should.equal('/:id');
    router.stack[2].route.methods.should.eql({ get: true });

    // update
    router.stack[3].route.path.should.equal('/:id');
    router.stack[3].route.methods.should.eql({ put: true, patch: true });

    // destroy
    router.stack[4].route.path.should.equal('/:id');
    router.stack[4].route.methods.should.eql({ delete: true });
  });
});

describe('controllers/user.controller#index', () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
  });

  it('should return all resources on table', async () => {
    const { body } = await request(app).get('/api/v1/users').expect('Content-Type', /json/).expect(200);

    body.success.should.be.true();
    body.data.should.be.Array();
    body.data.length.should.equal(2);
    body.data[0].should.containEql({
      id: 1,
      name: 'Someone',
      email: 'someone@example.com',
    });
    body.data[1].should.containEql({
      id: 2,
      name: 'Someone else',
      email: 'someone.else@example.com',
    });
  });
});

describe('controllers/user.controller#store', () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
  });

  it('should save requested user on database and return', async () => {
    const { body } = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({ name: 'John Doe', email: 'john.doe@example.com' })
      .expect('Content-Type', /json/)
      .expect(201);

    body.success.should.be.true();
    body.data.should.containEql({
      id: 3,
      name: 'John Doe',
      email: 'john.doe@example.com',
    });
    body.data.created_at.should.be.String().and.should.not.be.Null();
    body.data.updated_at.should.be.String().and.should.not.be.Null();

    (await db('users').where('id', 3).first()).should.eql({
      id: 3,
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_at: new Date(body.data.created_at),
      updated_at: new Date(body.data.updated_at),
    });
  });

  it('should return validation-error if requested data is bad', async () => {
    const { body } = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({ name: 123, email: 'bad_email' })
      .expect('Content-Type', /json/)
      .expect(422);

    body.success.should.be.false();
    body.message.should.be.equal('Validation failed!');
    body.errors.should.eql({
      name: ['The name must be a string.'],
      email: ['The email format is invalid.'],
    });

    (await db('users').count())[0].count.should.equal('2');
    // https://knexjs.org/#:~:text=Note%20that%20in%20Postgres%2C%20count%20returns%20a%20bigint%20type%20which%20will%20be%20a%20String%20and%20not%20a%20Number%20(more%20info).
  });
});

describe('controllers/user.controller#show', () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
  });

  it('should return requested user on database', async () => {
    const { body } = await request(app).get('/api/v1/users/2').expect('Content-Type', /json/).expect(200);

    body.success.should.be.true();
    body.data.should.containEql({
      id: 2,
      name: 'Someone else',
      email: 'someone.else@example.com',
    });
  });

  it('should return not-found-error if non-existing id requested', async () => {
    const { body } = await request(app).get('/api/v1/users/9999').expect('Content-Type', /json/).expect(404);

    body.success.should.be.false();
    body.message.should.be.equal('Requested user #9999 not found!');
  });
});

describe('controllers/user.controller#update', () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
  });

  it('should update requested user onto database and return', async () => {
    const { body } = await request(app)
      .put('/api/v1/users/2')
      .set('Content-Type', 'application/json')
      .send({ name: 'A new guy', email: 'a.new.guy@example.com' })
      .expect('Content-Type', /json/)
      .expect(200);

    body.success.should.be.true();
    body.data.should.containEql({
      id: 2,
      name: 'A new guy',
      email: 'a.new.guy@example.com',
    });
    body.data.updated_at.should.be.greaterThan(body.data.created_at);

    (await db('users').where('id', 2).first()).should.eql({
      id: 2,
      name: 'A new guy',
      email: 'a.new.guy@example.com',
      created_at: new Date(body.data.created_at),
      updated_at: new Date(body.data.updated_at),
    });
  });

  it('should return not-found-error if non-existing id requested', async () => {
    const { body } = await request(app)
      .put('/api/v1/users/9999')
      .set('Content-Type', 'application/json')
      .send({ name: 'A new guy', email: 'a.new.guy@example.com' })
      .expect('Content-Type', /json/)
      .expect(404);

    body.success.should.be.false();
    body.message.should.be.equal('Requested user #9999 not found!');

    (await db('users').where('id', 2).first()).should.containEql({
      id: 2,
      name: 'Someone else',
      email: 'someone.else@example.com',
    });
  });

  it('should return validation-error if requested data is bad', async () => {
    const { body } = await request(app)
      .put('/api/v1/users/2')
      .set('Content-Type', 'application/json')
      .send({ name: 123, email: 'bad_email' })
      .expect('Content-Type', /json/)
      .expect(422);

    body.success.should.be.false();
    body.message.should.be.equal('Validation failed!');
    body.errors.should.eql({
      name: ['The name must be a string.'],
      email: ['The email format is invalid.'],
    });

    (await db('users').where('id', 2).first()).should.containEql({
      id: 2,
      name: 'Someone else',
      email: 'someone.else@example.com',
    });
  });
});

describe('controllers/user.controller#destroy', () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
  });

  it('should delete requested user from database and return', async () => {
    const { body } = await request(app).delete('/api/v1/users/2').expect('Content-Type', /json/).expect(200);

    body.success.should.be.true();
    body.data.should.containEql({
      id: 2,
      name: 'Someone else',
      email: 'someone.else@example.com',
    });

    ((await db('users').where('id', 2).first()) === undefined).should.be.true();
  });

  it('should return not-found-error if non-existing id requested', async () => {
    const { body } = await request(app).delete('/api/v1/users/9999').expect('Content-Type', /json/).expect(404);

    body.success.should.be.false();
    body.message.should.be.equal('Requested user #9999 not found!');
  });
});
