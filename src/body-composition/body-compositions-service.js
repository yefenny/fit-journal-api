const BodyCompositionsService = {
  getAllBodyCompositions(db, userId) {
    return db('users_body_composition')
      .select('*')
      .where('user_id', userId)
      .orderBy('date_created', 'desc');
  }
};

module.exports = BodyCompositionsService;
