const express = require('express');
const userRouter = express.Router();
const UsersService = require('./users-service');
const jsonParser = express.json();
userRouter.route('/signup/').post(jsonParser, (req, res, next) => {
  const { user_name, full_name, password } = req.body;
  const db = req.app.get('db');
  const requiredFields = { user_name, full_name, password };
  for (let [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res
        .status(400)
        .json({ error: { message: `'${key}' is missing` } });
    }
  }

  UsersService.getUserByName(db, user_name)
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ error: { message: `user_name already exists` } });
      }
      requiredFields.password = UsersService.bcryptPassword(password);

      UsersService.insertUser(req.app.get('db'), requiredFields)
        .then(() => {
          return res.sendStatus(201);
        })
        .catch(next);
    })
    .catch(next);
});

userRouter.route('/login/').post(jsonParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const db = req.app.get('db');

  const requiredFields = { user_name, password };

  for (let [key, value] of Object.entries(requiredFields)) {
    if (!value)
      return res.status(400).json({ error: { message: `${key} is missing` } });
  }

  UsersService.getUserByName(db, user_name).then((user) => {
    if (!user)
      return res.status(400).json({
        error: { message: ` 'user_name' or 'password' invalid` }
      });
    if (!UsersService.checkPassword(password, user.password)) {
      return res.status(400).json({
        error: { message: ` 'user_name' or 'password' invalid` }
      });
    }
    const token = UsersService.generateJwtToken(user);
    res.send({ authToken: token });
  });
});

module.exports = userRouter;
