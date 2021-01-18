const ExercisesServices = {
  getAllExercises(db, userId) {
    return db('exercises').where('user_id', userId);
  },
  getExerciseById(db, userId, exerciseId) {
    const query = `select e.id , e.title, e.title, e.url, e.description, json_agg (json_build_object('id', mg.id,'name', mg.name,'body_part_id',mg.body_part_id)) as exercises_muscle_group from exercises e left join exercises_muscle_group emg on emg.exercise_id = e.id  join muscle_group mg on mg.id = emg.muscle_group_id left join body_part bp on mg.body_part_id = bp.id where e.id = ${exerciseId} and e.user_id = ${userId} group by e.id `;
    return db.raw(query).then((res) => res.rows[0]);
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
  },
  updateExercise(db, id, userId, values) {
    return db('exercises').where({ user_id: userId, id: id }).update(values);
  },
  getExercisesMuscleGroup(db, exerciseId) {
    return db('exercises_muscle_group').where('exercise_id', exerciseId);
  },
  deleteExercisesMuscleGroup(db, exerciseId) {
    return db('exercises_muscle_group')
      .where('exercise_id', exerciseId)
      .delete();
  }
};

module.exports = ExercisesServices;
