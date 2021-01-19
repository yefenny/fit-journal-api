const express = require('express');
const MealsService = require('./meals-service');
const mealsRouter = express.Router();

mealsRouter.route('/').get((req, res, next) => {
  const { id } = req.user;

  MealsService.getAllMeals(req.app.get('db'), id)
    .then((meals) => {
      if (meals) {
        res.send(meals);
      }
    })
    .catch(next);
});

mealsRouter.route('/find/:query').get((req, res, next) => {
  const { query } = req.params;
  const { id } = req.user;

  MealsService.getFilteredMeals(req.app.get('db'), query, id)
    .then((meals) => {
      if (meals) {
        res.send(meals);
      }
    })
    .catch(next);
});
module.exports = mealsRouter;
