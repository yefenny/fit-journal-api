const express = require('express');
const MealsService = require('./meals-service');
const mealsRouter = express.Router();
const validUrl = require('valid-url');

mealsRouter
  .route('/')
  .get((req, res, next) => {
    const { id } = req.user;

    MealsService.getAllMeals(req.app.get('db'), id)
      .then((meals) => {
        if (meals) {
          res.send(meals);
        }
      })
      .catch(next);
  })
  .all(validateMeal)
  .post((req, res, next) => {
    const { title, url, description } = req.body;
    const { id } = req.user;
    const newMeal = {
      title,
      user_id: id
    };
    if (url) newMeal.url = url;
    if (description) newMeal.description = description;

    MealsService.createMeal(req.app.get('db'), newMeal)
      .then((meal) => {
        if (meal) {
          return res.status('201').location('/api/meals').json(meal);
        }
      })
      .catch(next);
  });

mealsRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    MealsService.getMealById(req.app.get('db'), id, userId)
      .then((meal) => {
        if (meal) {
          return res.status(200).json(meal);
        } else
          return res.status(400).json({ error: { message: 'Invalid id' } });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    MealsService.getMealById(req.app.get('db'), id, userId).then((meal) => {
      if (!meal)
        return res
          .status(400)
          .json({ error: { message: 'Meal does not exists' } });
    });

    MealsService.deleteMeal(req.app.get('db'), id, userId)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .all(validateMeal)
  .patch((req, res, next) => {
    const { title, url, description } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    const updateMeal = {
      title
    };
    if (url) updateMeal.url = url;
    if (description) updateMeal.description = description;

    MealsService.getMealById(req.app.get('db'), id, userId).then((meal) => {
      if (!meal)
        return res.status(400).json({ error: { message: 'Invalid id' } });
    });
    MealsService.updateMeal(req.app.get('db'), id, userId, updateMeal)
      .then(() => {
        return res.status('201').end();
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

function validateMeal(req, res, next) {
  const { title, url } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ error: { message: 'The title of the meal is required' } });
  }
  if (url) {
    if (!validUrl.isUri(url)) {
      return res.status(400).json({ error: { message: 'Insert a valid url' } });
    }
  }
  next();
}
module.exports = mealsRouter;
