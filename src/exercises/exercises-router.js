const express = require('express');
const validUrl = require('valid-url');
const exercisesRouter = express.Router();
const ExercisesServices = require('./exercises-service');
exercisesRouter
  .route('/')
  .get((req, res, next) => {
    const { id } = req.user;

    ExercisesServices.getAllExercises(req.app.get('db'), id)
      .then((exercises) => {
        if (res) {
          res.send(exercises);
        }
      })
      .catch(next);
  })
  .all(validateRequired)
  .post((req, res, next) => {
    const { title, url, description, muscle_ids } = req.body;
    const newExercise = { title };

    const db = req.app.get('db');

    if (url) newExercise.url = url;

    if (description) newExercise.description = description;
    newExercise.user_id = req.user.id;
    ExercisesServices.insertExercise(db, newExercise)
      .then((exercise) => {
        if (exercise) {
          muscle_ids.forEach((muscle) => {
            muscle.exercise_id = exercise.id;
          });
          ExercisesServices.insertExerciseMuscle(db, muscle_ids)
            .then((val) => {
              if (val) res.status(201).location('api/exercises/').end();
            })
            .catch(next);
        }
      })
      .catch(next);
  });

exercisesRouter
  .route('/:id')
  .get((req, res, next) => {
    const userId = req.user.id;
    const exerciseId = req.params.id;
    ExercisesServices.getExerciseById(req.app.get('db'), userId, exerciseId)
      .then((exercise) => {
        if (!exercise) {
          return res
            .status(404)
            .json({ error: { message: 'Exercise not found' } });
        }
        res.send(exercise);
      })
      .catch(next);
  })
  .delete(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.app.get('db');
    await ExercisesServices.getExerciseById(db, userId, id)
      .then((exercise) => {
        if (!exercise) {
          return res
            .status(404)
            .json({ error: { message: 'Exercise not found' } });
        }
      })
      .catch(next);
    ExercisesServices.deleteExercise(db, id, userId)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .all(validateRequired)
  .patch(async (req, res, next) => {
    const { title, url, description, muscle_ids } = req.body;
    const { id } = req.params;
    const db = req.app.get('db');
    const exercise = { title };
    const userId = req.user.id;
    let shouldEdit = false;

    if (url) exercise.url = url;
    if (description) exercise.description = description;

    await ExercisesServices.getExerciseById(db, userId, id)
      .then((exercise) => {
        if (!exercise) {
          return res
            .status(404)
            .json({ error: { message: 'Exercise not found' } });
        }
      })
      .catch(next);
      
    await ExercisesServices.getExercisesMuscleGroup(db, id)
      .then((results) => {
        if (results) {
          muscle_ids.forEach((muscle) => {
            let found = [];
            found = results.find(
              (val) => val.muscle_group_id === muscle.muscle_group_id
            );
            if (!found) shouldEdit = true;
            if (exercise.length !== muscle_ids.length) shouldEdit = true;
          });
        }
      })
      .catch(next);
    if (shouldEdit)
      await ExercisesServices.deleteExercisesMuscleGroup(db, id).catch(next);

    ExercisesServices.updateExercise(db, id, userId, exercise)
      .then((exercise) => {
        if (exercise) {
          muscle_ids.forEach((muscle) => {
            muscle.exercise_id = id;
          });
          if (shouldEdit) {
            ExercisesServices.insertExerciseMuscle(db, muscle_ids)
              .then((val) => {
                if (val) res.status(204).location('api/exercises/').end();
              })
              .catch(next);
          } else res.status(204).location('api/exercises/').end();
        }
      })
      .catch(next);
  });

function validateRequired(req, res, next) {
  const { title, url, description, muscle_ids } = req.body;
  let invalidMuscle = false;
  const validKey = true;
  if (!title) {
    return res
      .status(400)
      .json({ error: { message: 'Exercise should have a title' } });
  }

  if (!muscle_ids || !muscle_ids.length) {
    return res.status(400).json({
      error: { message: 'Exercise should have at least one muscle group' }
    });
  }

  if (url) {
    if (!validUrl.isUri(url)) {
      return res
        .status(400)
        .json({ error: { message: 'Should insert valid URL' } });
    }
  }
  muscle_ids.forEach((muscle) => {
    if (!('muscle_group_id' in muscle)) invalidMuscle = true;
  });
  if (invalidMuscle)
    return res.status(400).json({
      error: { message: 'Exercise should have the key muscle_group_id' }
    });

  next();
}

exercisesRouter.route('/find/:query').get((req, res, next) => {
  const { query } = req.params;
  const { id } = req.user;

  ExercisesServices.filterExercise(req.app.get('db'), query, id)
    .then((exercises) => {
      if (res) {
        res.send(exercises);
      }
    })
    .catch(next);
});

module.exports = exercisesRouter;
