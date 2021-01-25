const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe.only('Exercises ENDPOINT', () => {
  let db;
  const exercises = helpers.makeExerciseArray();
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
  beforeEach('insert Body parts and muscle group', () =>
    helpers.insertBodyPartsAndMuscles(db)
  );
  describe('GET all exercises', () => {
    beforeEach('insert some exercises', () => {
      return db('exercises').insert(exercises);
    });
    it('send 202 should respond with an array of exercises and 202', () => {
      return supertest(app)
        .get('/api/exercises/')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).is.an('array');
          expect(res.body).to.have.length(exercises.length);
          expect(res.body[0]).to.include.keys(
            'title',
            'url',
            'description',
            'url',
            'date_created',
            'user_id'
          );
        });
    });
  });
  describe('CREATE exercise and muscle', () => {
    it('POST /api/exercises responds with 201', () => {
      const newExercise = exercises[0];
      newExercise.muscle_ids = [{ muscle_group_id: 10 }];
      return supertest(app)
        .post('/api/exercises/')
        .set('Authorization', `Bearer ${token}`)
        .send(newExercise)
        .expect(201);
    });
    it('returns 400 if there is no title', () => {
      const newExercise = {
        description: users[0].description
      };
      newExercise.muscle_ids = [{ muscle_group_id: 10 }];
      return supertest(app)
        .post('/api/exercises/')
        .set('Authorization', `Bearer ${token}`)
        .send(newExercise)
        .expect(400, { error: { message: 'Exercise should have a title' } });
    });
    it('returns 400 if there is no muscle_id', () => {
      let newExercise = {
        title: 'squat'
      };
      return supertest(app)
        .post('/api/exercises/')
        .set('Authorization', `Bearer ${token}`)
        .send(newExercise)
        .expect(400, {
          error: { message: 'Exercise should have at least one muscle group' }
        });
    });
    it('returns 400 if there is no valid url', () => {
      let newExercise = {
        title: 'squat',
        muscle_ids: [
          {
            muscle_group_id: 10
          }
        ],
        url: 'ass'
      };
      return supertest(app)
        .post('/api/exercises/')
        .set('Authorization', `Bearer ${token}`)
        .send(newExercise)
        .expect(400, {
          error: { message: 'Should insert valid URL' }
        });
    });
    it('returns 400 if there is a invalid key on muscle_ids array', () => {
      let newExercise = {
        title: 'squat',
        muscle_ids: [
          {
            muscle: 10
          }
        ],
        url: 'https://www.youtube.com/watch?v=U3HlEF_E9fo'
      };
      return supertest(app)
        .post('/api/exercises/')
        .set('Authorization', `Bearer ${token}`)
        .send(newExercise)
        .expect(400, {
          error: { message: 'Exercise should have the key muscle_group_id' }
        });
    });
  });
  describe('GET exercise by id', () => {
    beforeEach('insert some exercises', () => {
      return db('exercises').insert(helpers.makeExerciseArray());
    });
    beforeEach('insert exercises_muscle_group', () => {
      return db.raw(`INSERT into exercises_muscle_group(exercise_id,muscle_group_id)
      values (1,1),
      (1,2),
      (1,3),
      (1,4)`);
    });

    it('return 200 and object of an exercise', () => {
      return supertest(app)
        .get('/api/exercises/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(
            'title',
            'url',
            'description',
            'exercises_muscle_group'
          );
        });
    });
    it('return 404 if exercises does not exists', () => {
      return supertest(app)
        .get('/api/exercises/10')
        .set('Authorization', `Bearer ${token}`)
        .expect(404, { error: { message: 'Exercise not found' } });
    });
  });
  describe('DELETE exercise by id', () => {
    beforeEach('insert some exercises', () => {
      return db('exercises').insert(helpers.makeExerciseArray());
    });
    beforeEach('insert exercises_muscle_group', () => {
      return db.raw(`INSERT into exercises_muscle_group(exercise_id,muscle_group_id)
        values (1,1),
        (1,2),
        (1,3),
        (1,4)`);
    });

    it('return 200 and object of an exercise', () => {
      return supertest(app)
        .delete('/api/exercises/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
    it('return 404 if exercises does not exists', () => {
      return supertest(app)
        .delete('/api/exercises/10')
        .set('Authorization', `Bearer ${token}`)
        .expect(404, { error: { message: 'Exercise not found' } });
    });
  });
  describe('UPDATE exercise by id', () => {
    beforeEach('insert some exercises', () => {
      return db('exercises').insert(helpers.makeExerciseArray());
    });
    beforeEach('insert exercises_muscle_group', () => {
      return db.raw(`INSERT into exercises_muscle_group(exercise_id,muscle_group_id)
        values (1,1),
        (1,2),
        (1,3),
        (1,4)`);
    });

    it('return 204', () => {
      const toUpdate = {
        title: 'squat 2',
        muscle_ids: [
          {
            muscle_group_id: 10
          }
        ]
      };
      const expected = {
        ...helpers.makeUsersArray[0],
        title: 'squat 2',
        exercises_muscle_group: [
          {
            id: 10,
            name: 'upper chest',
            body_part_id: 1
          }
        ]
      };
      return supertest(app)
        .patch('/api/exercises/1')
        .set('Authorization', `Bearer ${token}`)
        .send(toUpdate)
        .expect(204)
        .then(() => {
          return supertest(app)
            .get('/api/exercises/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('object');
              expect(res.body).to.deep.includes(expected);
            });
        });
    });
  });
  describe('FIND exercise by query', () => {
    beforeEach('insert some exercises', () => {
      return db('exercises').insert(helpers.makeExerciseArray());
    });
    beforeEach('insert exercises_muscle_group', () => {
      return db.raw(`INSERT into exercises_muscle_group(exercise_id,muscle_group_id)
          values (1,1),
          (1,2),
          (1,3),
          (1,4)`);
    });

    it('return 200 and array of exercises', () => {
      return supertest(app)
        .get('/api/exercises/find/squat')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
