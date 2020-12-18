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
  getUserByName(knex, user_name) {
    return knex('users').select('*').where('user_name', user_name).first();
  },
  checkPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  },
  generateJwtToken(user) {
    return jwt.sign({ user_id: user.id }, config.JWT_SECRET, {
      subject: user.user_name,
      algorithm: 'HS256'
    });
  }
};

module.exports = UsersService;
