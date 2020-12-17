const express = require('express');
const userRouter = express.Router();
const UsersService = require('./users-service');

userRouter.route('/signup/').post(express.json(), (req, res, next) => {
  const { user_name, full_name, password } = req.body;

  const requiredFields = { user_name, full_name, password };
  for (let [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).send(`'${key}' is missing`);
    }
  }

  UsersService.insertUser(req.app.get('db'), requiredFields)
    .then(() => {
      res.send(201);
    })
    .catch(next);
});

module.exports = userRouter;
