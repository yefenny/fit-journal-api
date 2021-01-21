const BodyCompositionsService = {
  getAllBodyCompositions(db, userId) {
    return db('users_body_composition')
      .select('*')
      .where('user_id', userId)
      .orderBy('date_created', 'desc');
  },
  getBodyCompositionById(db, id, userId) {
    return db('users_body_composition')
      .where({ id: id, user_id: userId })
      .first();
  },
  deleteBodyComposition(db, id, userId) {
    return db('users_body_composition')
      .where({ id: id, user_id: userId })
      .delete();
  },
  createBodyComposition(db, values) {
    return db('users_body_composition')
      .insert(values)
      .returning('*')
      .then((rows) => rows[0]);
  },
  updateBodyComposition(db, id, userId, values) {
    return db('users_body_composition')
      .where({ id: id, user_id: userId })
      .update(values);
  }
};

module.exports = BodyCompositionsService;
