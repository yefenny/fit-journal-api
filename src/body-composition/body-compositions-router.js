const express = require('express');
const BodyCompositionsService = require('./body-compositions-service');
const bodyCompositionsRouter = express.Router();

bodyCompositionsRouter.route('/').get((req, res, next) => {
  const { id } = req.user;

  BodyCompositionsService.getAllBodyCompositions(req.app.get('db'), id)
    .then((values) => {
      if (values) res.send(values);
    })
    .catch(next);
});
module.exports = bodyCompositionsRouter;
