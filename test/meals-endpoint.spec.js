const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Meals endpoint', () => {
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
  describe('Get all meals', () => {
    beforeEach('insert meals', () => helpers.insertMeals(db));
    it('GET /api/meals send 200 status and array', () => {
      return supertest(app)
        .get('/api/meals')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(3);
        });
    });
  });
  describe('Get meal by id', () => {
    beforeEach('insert meals', () => helpers.insertMeals(db));
    it('GET /api/meals send 200 status and object', () => {
      return supertest(app)
        .get('/api/meals/1')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(
            'title',
            'id',
            'description',
            'url',
            'user_id'
          );
        });
    });
    it('Send 400 invalid id', () => {
      return supertest(app)
        .get('/api/meals/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: { message: 'Invalid id' } });
    });
  });
  describe('POST meals', () => {
    it('Sends a 200 status code and an array', () => {
      let newMeal = {
        title: 'Grilled chicken breats',
        url:
          'https://www.onceuponachef.com/recipes/perfectly-grilled-chicken-breasts.html',
        description: 'A grilled chicken recipe'
      };
      return supertest(app)
        .post('/api/meals')
        .set('Authorization', `bearer ${token}`)
        .send(newMeal)
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include(newMeal);
        });
    });
    it('returns status code 400 when invalid url', () => {
      let newMeal = {
        title: 'Grilled chicken breats',
        url: 'sss',
        description: 'A grilled chicken recipe'
      };
      return supertest(app)
        .post('/api/meals')
        .set('Authorization', `bearer ${token}`)
        .send(newMeal)
        .expect(400, {
          error: { message: 'Insert a valid url' }
        });
    });
    it('returns status code 400 when no title', () => {
      let newMeal = {
        url:
          'https://www.onceuponachef.com/recipes/perfectly-grilled-chicken-breasts.html',
        description: 'A grilled chicken recipe'
      };
      return supertest(app)
        .post('/api/meals')
        .set('Authorization', `bearer ${token}`)
        .send(newMeal)
        .expect(400, {
          error: { message: 'The title of the meal is required' }
        });
    });
  });
  describe('DELETE meal', () => {
    beforeEach('insert meals', () => helpers.insertMeals(db));
    it('DELETE /api/meals/:id send 204 status ', () => {
      return supertest(app)
        .delete('/api/meals/1')
        .set('Authorization', `bearer ${token}`)
        .expect(204);
    });
    it('send 400 when invalid id ', () => {
      return supertest(app)
        .delete('/api/meals/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: { message: 'Meal does not exists' } });
    });
  });
  describe('UPDATE meals', () => {
    beforeEach('insert meals', () => helpers.insertMeals(db));
    it('Returns 201 status code', () => {
      let toUpdate = { title: 'protein cookies' };
      let expected = {
        title: 'protein cookies',
        url:
          'https://www.burnthefatblog.com/healthy-pumpkin-spice-protein-cookies/',
        description: 'High protein pumpin cookies'
      };
      return supertest(app)
        .patch('/api/meals/1')
        .set('Authorization', `bearer ${token}`)
        .send(toUpdate)
        .expect(201)
        .then(() => {
          return supertest(app)
            .get('/api/meals/1')
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('object');
              expect(res.body).to.include(expected);
            });
        });
    });
    it('returns 400 if there is no title', () => {
      let toUpdate = {};
      return supertest(app)
        .patch('/api/meals/1')
        .set('Authorization', `bearer ${token}`)
        .send(toUpdate)
        .expect(400, {
          error: { message: 'The title of the meal is required' }
        });
    });
    it('returns 400 if url is invalid', () => {
      let toUpdate = {
        title: 'protein cookies',
        url: '-pumpkin-spice-protein-cookies/'
      };
      return supertest(app)
        .patch('/api/meals/1')
        .set('Authorization', `bearer ${token}`)
        .send(toUpdate)
        .expect(400, {
          error: { message: 'Insert a valid url' }
        });
    });
  });
  describe('FILTER meals by query', () => {
    beforeEach('insert meals', () => helpers.insertMeals(db));
    it('returns 200 and an array of objects', () => {
      return supertest(app)
        .get('/api/meals/find/:pump')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
