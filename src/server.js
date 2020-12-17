require('dotenv').config();

const app = require('./app');
const knex = require('knex');
const { PORT } = require('./config');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listeting at http://localhost:${PORT}`);
});
