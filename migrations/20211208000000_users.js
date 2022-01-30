/**
 * Run the migrations.
 */
module.exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments();
    table.timestamps();
    table.string('name').notNullable();
    table.string('email').notNullable().unique({
      indexName: 'user_unique_email',
      deferrable: 'immediate',
    });
  });

/**
 * Reverse the migrations.
 */
module.exports.down = (knex) => knex.schema.dropTableIfExists('users');
