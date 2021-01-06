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

module.exports = exercisesRouter;
