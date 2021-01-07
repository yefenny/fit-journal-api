const express = require('express');
const BodyPartsService = require('./body-parts-service');
const bodyPartsRouter = express.Router();

bodyPartsRouter.route('/').get((req, res, next) => {
  BodyPartsService.getAllBodyParts(req.app.get('db'))
    .then((results) => {
      if (results) res.send(results);
    })
    .catch(next);
});

module.exports = bodyPartsRouter;
