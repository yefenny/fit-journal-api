const ExercisesServices = {
  getAllExercises(db, userId) {
    return db('exercises').where('user_id', userId);
  }
};

module.exports = ExercisesServices;
