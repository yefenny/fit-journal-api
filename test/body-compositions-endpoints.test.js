const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Body compositions endpoint', () => {
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
  describe('Get all body compositions entries', () => {
    beforeEach('insert body compositions', () =>
      helpers.insertBodyComposition(db)
    );
    it('returns status code 200 and an array', () => {
      return supertest(app)
        .get('/api/body-compositions/')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
        });
    });
    it('returns status code 200 and an array for chart', () => {
      return supertest(app)
        .get('/api/body-compositions/chart/average')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(1);
        });
    });
  });
  describe('Get body compositions by id', () => {
    beforeEach('insert body compositions', () =>
      helpers.insertBodyComposition(db)
    );
    it('returns status code 200 and an array', () => {
      return supertest(app)
        .get('/api/body-compositions/1')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
        });
    });
  });
  describe('DELETE body composition by id', () => {
    beforeEach('insert body compositions', () =>
      helpers.insertBodyComposition(db)
    );
    it('returns status code 204 after deleting', () => {
      return supertest(app)
        .delete('/api/body-compositions/1')
        .set('Authorization', `bearer ${token}`)
        .expect(202);
    });
    it('returns status code 400 if entry does not exists', () => {
      return supertest(app)
        .delete('/api/body-compositions/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: { message: 'Entry does not exists' } });
    });
  });
  describe('Insert body composition', () => {
    it('returns 200 after creating with correct data', () => {
      const newEntry = {
        right_arm: '10',
        chest: '32',
        waist: '25',
        hips: '37.5',
        left_thigh: '20.5',
        right_thigh: '20.5',
        left_calf: '12',
        right_calf: '12',
        weight: '113',
        body_fat: '20.3'
      };
      return supertest(app)
        .post('/api/body-compositions/')
        .set('Authorization', `bearer ${token}`)
        .send(newEntry)
        .expect(200)
        .then((res) => {
          expect(res.body).to.includes(newEntry);
        });
    });
    it('returns 400 when no weight', () => {
      const newEntry = {
        right_arm: '10',
        chest: '32',
        waist: '25',
        hips: '37.5',
        left_thigh: '20.5',
        right_thigh: '20.5',
        left_calf: '12',
        right_calf: '12',
        body_fat: '20.3'
      };
      return supertest(app)
        .post('/api/body-compositions/')
        .set('Authorization', `bearer ${token}`)
        .send(newEntry)
        .expect(400, { error: { message: 'Weight value is required' } });
    });
  });
  describe('Update body composition', () => {
    beforeEach('insert body compositions', () =>
      helpers.insertBodyComposition(db)
    );
    it('returns 200 after updating with correct data', () => {
      let toUpdate = {
        right_arm: '15',
        weight: '113',
        body_fat: '20.3'
      };
      return supertest(app)
        .patch('/api/body-compositions/1')
        .set('Authorization', `bearer ${token}`)
        .send(toUpdate)
        .expect(202);
    });
    it('returns 400 when entry does not exists', () => {
      const newEntry = {
        right_arm: '10',
        chest: '32',
        waist: '25',
        hips: '37.5',
        left_thigh: '20.5',
        right_thigh: '20.5',
        left_calf: '12',
        right_calf: '12',
        body_fat: '20.3'
      };
      return supertest(app)
        .post('/api/body-compositions/100')
        .set('Authorization', `bearer ${token}`)
        .send(newEntry)
        .expect(400, { error: { message: 'Weight value is required' } });
    });
  });
  describe('Filter body compositiond by dates', () => {
    beforeEach('insert body compositions', () =>
      helpers.insertBodyComposition(db)
    );
    it('returns status code 200 and an array', () => {
      return supertest(app)
        .get('/api/body-compositions/find/2020-12-01/2020-12-31')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
