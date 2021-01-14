const express = require('express');
const muscleGroupsRouter = express.Router();
const MuscleGroupsService = require('./muscle-groups-service');

muscleGroupsRouter.route('/').get((req, res, next) => {
  MuscleGroupsService.getAllMusclesGroup(req.app.get('db')).then((results) => {
    res.send(results);
  });
});

muscleGroupsRouter.route('/body-parts/:id').get((req, res, next) => {
  const { id } = req.params;

  MuscleGroupsService.getMusclesGroupByBodyPart(req.app.get('db'), id).then(
    (results) => {
      res.send(results);
    }
  );
});

module.exports = muscleGroupsRouter;
