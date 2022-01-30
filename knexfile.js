const pgconfig = {
  client: 'pg',
  connection: process.env.PG_CONNECTION,
  migrations: { directory: './migrations' },
  seeds: { directory: './seeds' },
};

module.exports.development = pgconfig;
module.exports.testing = pgconfig;
module.exports.staging = pgconfig;
module.exports.production = pgconfig;
