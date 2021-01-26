const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Body part endpoint', () => {
  let db;
  let users = helpers.makeUsersArray();
  let token = helpers.jwtToken(users[0]);
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
  beforeEach('insert some users', () => {
    return db('users').insert(users);
  });
  describe('Get all body parts', () => {
    beforeEach('insert body parts', () =>
      db.raw(`INSERT INTO body_part(name,category) 
    values('chest','upper body'),
    ('back','upper body'),
    ('arms','upper body'),
    ('abdominals','upper body'),
    ('legs','lower body'),
    ('shoulders','upper body');`)
    );
    it('GET /api/body-parts send 200 status and array', () => {
      return supertest(app)
        .get('/api/body-parts')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(6);
        });
    });
  });
});
