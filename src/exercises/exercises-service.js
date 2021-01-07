const ExercisesServices = {
  getAllExercises(db, userId) {
    return db('exercises').where('user_id', userId);
  },
  getExerciseById(db, userId, exerciseId) {
    return db('exercises').where({ user_id: userId, id: exerciseId }).first();
  }
};

module.exports = ExercisesServices;
