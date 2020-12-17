const UsersService = {
  insertUser(knex, user) {
    return knex('users').insert(user);
  }
};

module.exports = UsersService;
