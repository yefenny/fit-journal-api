const jwt = require('jsonwebtoken');
const config = require('../config');
const AuthService = {
  jwtVerify(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }
};

module.exports = AuthService;
