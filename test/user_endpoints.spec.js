const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect, expectCt } = require('helmet');

describe('User endpoints', () => {
  let db;
  let users = helpers.makeUsersArray();

  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());
  beforeEach('clean table', () => helpers.cleanTables(db));
  afterEach('clean table', () => helpers.cleanTables(db));

  describe('POST /signup ', () => {
    context('given users has no data', () => {
      it(`send 201 after creating `, () => {
        const user = users[0];
        return supertest(app).post('/api/users/signup').send(user).expect(201);
      });

      const requiredFields = ['user_name', 'full_name', 'password'];
      requiredFields.forEach((value) => {
        let newUser = {
          user_name: users[0].user_name,
          full_name: users[0].full_name,
          password: users[0].password
        };
        it(`returns 400 '${value}' is missing`, () => {
          delete newUser[value];
          return supertest(app)
            .post('/api/users/signup')
            .send(newUser)
            .expect(400, `'${value}' is missing`);
        });
      });
    });
  });
});
