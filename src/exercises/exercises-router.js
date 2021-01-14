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
  .post((req, res, next) => {
    const { title, url, description, muscle_ids } = req.body;
    const newExercise = { title };
    const db = req.app.get('db');
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
    muscle_ids.forEach((muscle) => {
      if (!('muscle_group_id' in muscle))
        res.status(400).json({
          error: { message: 'Exercise should have the key muscle_group_id' }
        });
    });

    if (url) {
      if (validUrl.isUri(url)) newExercise.url = url;
      else
        return res
          .status(400)
          .json({ error: { message: 'Shoul insert valid URL' } });
    }
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
  .delete((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.app.get('db');
    ExercisesServices.getExerciseById(db, id).then((exercise) => {
      if (!exercise) {
        return res
          .status(404)
          .json({ error: { message: 'Exercise not found' } });
      }
    });
    ExercisesServices.deleteExercise(db, id, userId).then(() => {
      res.status(204).location('/api/exercises/').end();
    });
  });

module.exports = exercisesRouter;
