const express = require('express');
const auth = require('../middleware/auth');
const userRouter = express.Router();
const UsersService = require('./users-service');
var cors = require('cors');
userRouter
  .route('/signup/')
  .post(
    cors({ origin: 'https://fit-journal-client-yefenny.vercel.app' }),
    (req, res, next) => {
      const { email, full_name, password } = req.body;
      const db = req.app.get('db');
      const requiredFields = { email, full_name, password };
      for (let [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          return res
            .status(400)
            .json({ error: { message: `'${key}' is missing` } });
        }
      }

      UsersService.getUserByEmail(db, email)
        .then((user) => {
          if (user) {
            return res
              .status(400)
              .json({ error: { message: `email already exists` } });
          }
          requiredFields.password = UsersService.bcryptPassword(password);

          UsersService.insertUser(req.app.get('db'), requiredFields)
            .then(() => {
              UsersService.getUserByEmail(db, email).then((user) => {
                if (user) {
                  const token = UsersService.generateJwtToken(user);
                  return res.status(201).send({ authToken: token });
                }
              });
            })
            .catch(next);
        })
        .catch(next);
    }
  );

userRouter.route('/login/').post((req, res, next) => {
  const { email, password } = req.body;
  const db = req.app.get('db');

  const requiredFields = { email, password };

  for (let [key, value] of Object.entries(requiredFields)) {
    if (!value)
      return res.status(400).json({ error: { message: `${key} is missing` } });
  }

  UsersService.getUserByEmail(db, email).then((user) => {
    if (!user)
      return res.status(400).json({
        error: { message: ` 'email' or 'password' invalid` }
      });
    if (!UsersService.checkPassword(password, user.password)) {
      return res.status(400).json({
        error: { message: ` 'email' or 'password' invalid` }
      });
    }
    const token = UsersService.generateJwtToken(user);
    res.send({ authToken: token });
  });
});

userRouter
  .route('/')
  .all(auth)
  .get((req, res, next) => {
    const { email } = req.user;
    UsersService.getUserByEmail(req.app.get('db'), email)
      .then((user) => {
        if (user) {
          const { full_name } = user;
          return res.json({ full_name });
        }
      })
      .catch(next);
  });

module.exports = userRouter;
