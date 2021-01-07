const express = require('express');
const exercisesRouter = express.Router();
const ExercisesServices = require('./exercises-service');
exercisesRouter.route('/').get((req, res, next) => {
  const { id } = req.user;

  ExercisesServices.getAllExercises(req.app.get('db'), id)
    .then((exercises) => {
      if (res) {
        res.send(exercises);
      }
    })
    .catch(next);
});
exercisesRouter.route('/:id').get((req, res, next) => {
  const userId = req.user.id;
  const exerciseId = req.params.id;
  ExercisesServices.getExerciseById(req.app.get('db'), userId, exerciseId).then(
    (exercise) => {
      if (!exercise) {
        return res
          .status(404)
          .json({ error: { message: 'Exercise not found' } });
      }
      res.send(exercise);
    }
  );
});

module.exports = exercisesRouter;
