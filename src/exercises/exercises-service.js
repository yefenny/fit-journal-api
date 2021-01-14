const ExercisesServices = {
  getAllExercises(db, userId) {
    return db('exercises').where('user_id', userId);
  },
  getExerciseById(db, userId, exerciseId) {
    return db('exercises').where({ user_id: userId, id: exerciseId }).first();
  },
  insertExercise(db, exercise) {
    return db('exercises')
      .insert(exercise)
      .returning('*')
      .then((rows) => rows[0]);
  },
  insertExerciseMuscle(db, values) {
    return db('exercises_muscle_group')
      .insert(values)
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteExercise(db, id, userId) {
    return db('exercises').where({ user_id: userId, id: id }).delete();
  }
};

module.exports = ExercisesServices;
