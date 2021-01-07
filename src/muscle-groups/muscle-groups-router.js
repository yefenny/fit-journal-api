const express = require('express');
const muscleGroupRouter = express.Router();
const MuscleGroupsService = require('./muscle-groups-service');

muscleGroupRouter.route('/').get((req, res, next) => {
  MuscleGroupsService.getAllMusclesGroup(req.app.get('db')).then((results) => {
    res.send(results);
  });
});

muscleGroupRouter.route('/body-parts/:id').get((req, res, next) => {
  const { id } = req.params;

  MuscleGroupsService.getMusclesGroupByBodyPart(req.app.get('db'), id).then(
    (results) => {
      res.send(results);
    }
  );
});

module.exports = muscleGroupRouter;
