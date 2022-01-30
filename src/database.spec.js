const database = require('./database');

describe('database', () => {
  it('should export a knex instance on pg driver', () => {
    database.connection().client.config.client.should.equal('pg');
  });
});
