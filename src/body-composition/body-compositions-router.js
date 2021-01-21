const express = require('express');
const BodyCompositionsService = require('./body-compositions-service');
const bodyCompositionsRouter = express.Router();

bodyCompositionsRouter
  .route('/')
  .get((req, res, next) => {
    const { id } = req.user;

    BodyCompositionsService.getAllBodyCompositions(req.app.get('db'), id)
      .then((values) => {
        if (values) res.send(values);
      })
      .catch(next);
  })
  .all(validateBodyComposition)
  .post((req, res, next) => {
    const {
      left_arm,
      right_arm,
      chest,
      waist,
      hips,
      left_thigh,
      right_thigh,
      left_calf,
      right_calf,
      weight,
      body_fat
    } = req.body;
    const checkValues = {
      left_arm,
      right_arm,
      chest,
      waist,
      hips,
      left_thigh,
      right_thigh,
      left_calf,
      right_calf,
      body_fat
    };
    const userId = req.user.id;
    const newEntry = { weight, user_id: userId };
    const db = req.app.get('db');

    for (let [key, value] of Object.entries(checkValues)) {
      if (value) newEntry[key] = value;
    }

    BodyCompositionsService.createBodyComposition(db, newEntry)
      .then((val) => {
        if (val) return res.json(val);
      })
      .catch(next);
  });

bodyCompositionsRouter.route('/:id').get((req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const db = req.app.get('db');

  BodyCompositionsService.getBodyCompositionById(db, id, userId)
    .then((val) => {
      if (val) return res.status(200).json(val);
    })
    .catch(next);
});

function validateBodyComposition(req, res, next) {
  const {
    left_arm,
    right_arm,
    chest,
    waist,
    hips,
    left_thigh,
    right_thigh,
    left_calf,
    right_calf,
    weight,
    body_fat
  } = req.body;

  const shouldBeNumber = {
    left_arm,
    right_arm,
    chest,
    waist,
    hips,
    left_thigh,
    right_thigh,
    left_calf,
    right_calf,
    weight,
    body_fat
  };

  if (!weight) {
    return res
      .status(400)
      .json({ error: { message: 'Weight value is required' } });
  }

  for (let [key, value] of Object.entries(shouldBeNumber)) {
    if (value) {
      if (isNaN(value))
        return res
          .status(400)
          .json({ error: { message: `${key} value should be a number` } });
    }
  }
  next();
}
module.exports = bodyCompositionsRouter;
