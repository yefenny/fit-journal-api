require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const NODE_ENV = require('./config');
const userRouter = require('./users/user-router');
const auth = require('./middleware/auth');
const exercisesRouter = require('./exercises/exercises-router');
const bodyPartsRouter = require('./body-parts/body-parts-router');
const muscleGroupsRouter = require('./muscle-groups/muscle-groups-router');
const mealsRouter = require('./meals/meals-router');
const bodyCompositionsRouter = require('./body-composition/body-compositions-router');

const jsonParser = express.json();
const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(helmet());

app.use(jsonParser);

app.use('/api/users', userRouter);
app.use(auth);
app.use('/api/exercises', exercisesRouter);
app.use('/api/body-parts', bodyPartsRouter);
app.use('/api/muscle-groups', muscleGroupsRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/body-compositions', bodyCompositionsRouter);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
