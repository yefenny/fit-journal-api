const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Muscle group endpoints', () => {
  let db;
  let users = helpers.makeUsersArray();
  let token = helpers.jwtToken(users[0]);
  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());
  beforeEach('clean table', () => helpers.cleanTables(db));
  afterEach('clean table', () => helpers.cleanTables(db));
  beforeEach('insert some users', () => {
    return db('users').insert(users);
  });
  beforeEach('insert Body parts and muscle group', () =>
    helpers.insertBodyPartsAndMuscles(db)
  );
  describe('Get muscle groups', () => {
    it('GET /api/muscle-groups send 200 status and an array', () => {
      return supertest(app)
        .get('/api/muscle-groups')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(13);
        });
    });
    it('GET /api/muscle-groups/body-parts/:id send 200 status and an array', () => {
      return supertest(app)
        .get('/api/muscle-groups/body-parts/1')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
