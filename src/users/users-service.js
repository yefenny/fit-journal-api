const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const UsersService = {
  insertUser(knex, user) {
    return knex('users').insert(user);
  },
  bcryptPassword(password) {
    return bcrypt.hashSync(password, 7);
  },
  getUserByEmail(knex, email) {
    return knex('users').select('*').where('email', email).first();
  },
  checkPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  },
  generateJwtToken(user) {
    return jwt.sign({ user_id: user.id }, config.JWT_SECRET, {
      subject: user.email,
      algorithm: 'HS256'
    });
  }
};

module.exports = UsersService;
