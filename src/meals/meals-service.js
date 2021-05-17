const MealsService = {
  getAllMeals(db, userId) {
    return db('meals').where('user_id', userId).orderBy('date_created', 'desc');
  },
  getFilteredMeals(db, parameter, userId) {
    const query = `select * from meals where user_id = ${userId} and( title ilike '%${parameter}%' or description ilike '%${parameter}%')`;
    return db.raw(query).then((res) => res.rows);
  },
  getMealById(db, id, userId) {
    return db('meals').select('*').where({ user_id: userId, id: id }).first();
  },
  createMeal(db, values) {
    return db('meals')
      .insert(values)
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteMeal(db, id, userId) {
    return db('meals').where({ user_id: userId, id: id }).delete();
  },
  updateMeal(db, id, userId, values) {
    return db('meals').where({ user_id: userId, id: id }).update(values);
  }
};
module.exports = MealsService;
