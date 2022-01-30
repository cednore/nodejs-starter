/**
 * Seed the users table.
 */
module.exports.seed = (knex) =>
  knex('users')
    .del() // Deletes ALL existing entries
    .then(() =>
      knex('users').insert([
        {
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
          name: 'Someone',
          email: 'someone@example.com',
        },
        {
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
          name: 'Someone else',
          email: 'someone.else@example.com',
        },
      ]),
    );
