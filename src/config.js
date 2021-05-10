const pg = require('pg');
pg.defaults.ssl =
  process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false;

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://USERNAME@localhost/DATABASE_NAME',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
};
