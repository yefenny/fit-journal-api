const MealsService = {
  getAllMeals(db, userId) {
    return db('meals').where('user_id', userId);
  },
  getFilteredMeals(db, parameter, userId) {
    const query = `select * from meals where user_id = ${userId} and( title ilike '%${parameter}%' or description ilike '%${parameter}%')`;
    return db.raw(query).then((res) => res.rows);
  },
  getMealById(db, id, userId) {
    return db('meals').select('*').where({ user_id: userId, id: id }).first();
  }
};
module.exports = MealsService;
