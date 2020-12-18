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
            .expect(400, { error: { message: `'${value}' is missing` } });
        });
      });
    });
    context('given users has data', () => {
      beforeEach('seed users table', () => helpers.seedUserTable(db, users));
      it(`Should 400 'user_name already exists `, () => {
        const user = {
          user_name: users[0].user_name,
          full_name: 'new-user',
          password: 'neeew'
        };

        return supertest(app)
          .post('/api/users/signup')
          .send(user)
          .expect(400, { error: { message: `user_name already exists` } });
      });
    });
  });
  describe('POST /login', () => {
    beforeEach('insert users', () => helpers.seedUserTable(db, users));
    const requiredFields = ['user_name', 'password'];
    requiredFields.forEach((value) => {
      const user = {
        user_name: users[0].user_name,
        password: users[0].password
      };
      it(`returns 400 if '${value}'is missing `, () => {
        delete user[value];
        return supertest(app)
          .post('/api/users/login')
          .send(user)
          .expect(400, { error: { message: `${value} is missing` } });
      });
    });

    it(`returns 400 is user doesn't exists in database`, () => {
      const user = {
        user_name: 'user',
        password: 'pass'
      };
      return supertest(app)
        .post('/api/users/login')
        .send(user)
        .expect(400, {
          error: { message: ` 'user_name' or 'password' invalid` }
        });
    });
    it(`returns 400 is password doesn't match user`, () => {
      const user = {
        user_name: 'test-user-1',
        password: 'pass'
      };
      return supertest(app)
        .post('/api/users/login')
        .send(user)
        .expect(400, {
          error: { message: ` 'user_name' or 'password' invalid` }
        });
    });
    it('returns valid json token if user_name and password are valid', () => {
      const user = {
        user_name: users[0].user_name,
        password: users[0].password
      };
      const token = helpers.jwtToken(users[0]);

      return supertest(app)
        .post('/api/users/login')
        .send(user)
        .expect(200, { authToken: token });
    });
  });
});
