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
  },
  filterBodyComposition(db, fromDate, toDate, userId) {
    const query = `select * from users_body_composition ubc where date_created >= '${fromDate}' and date_created <= '${toDate} 23:59:59' and user_id = ${userId} order by date_created desc`;
    return db.raw(query).then((res) => res.rows);
  },
  getBodyCompositionAverage(db, userId) {
    const query = `select to_char(DATE_CREATED, 'Month yyyy'), avg(weight) as weight ,avg ( body_fat ) as body_fat
    from users_body_composition ubc where ubc.user_id = ${userId}
    group by to_char(DATE_CREATED, 'Month yyyy')
    `;
    return db.raw(query).then((res) => res.rows);
  }
};

module.exports = BodyCompositionsService;
